/* jshint esnext: true */
const fs = require('fs');
const path = require('path');
const http = require('http');
const ostype = require('os').type();
const child_process = require('child_process');

var playProcess = 0;
var isPaused = false;
/**
 * Windows Music Player Configs
 * ...
 */
var playerWindows = function(songId, command) {

}; 

/**
 * Mac Music Player Configs
 * ...
 */
var playerMac = function(songId, command) {
    if(command === 'PLAY') {
        // if aother music is plsying kill process start a new one
        if(!!playProcess) {
            stopProcess = child_process.execSync('kill -9 ' + playProcess.pid);
            playProcess.kill(); // kill old process
        }
        if(!!songsList[songId].path) { // check if path to song exists
            playProcess = child_process.spawn('afplay', ['-q', '1',songsList[songId].path]);
        }
    } else if (command === 'STOP') {
        if(!!playProcess) {
            playProcess = child_process.execSync('killall afplay');
            playProcess = 0;
        }
    } else if (command === 'PAUSE') {
        if(!!playProcess) {
            if(!isPaused) { // pause the music
                puaseProcess = child_process.execSync('kill -17 ' + playProcess.pid);
                isPaused = true;
            } else {
                resumeProcess = child_process.execSync('kill -19 ' + playProcess.pid);
                isPaused = false;
            }
        }
    }
};

// music player OS type pair
const osPlayerPair = {'Darwin': playerMac, 'Windows_NT': playerWindows};

// chech for music folder directory
if(process.argv.length < 3) {
    console.log('Error: not enough argument. Provide absolute path to the music directory');
    process.exit();
}

// absolute path to music directory
const musicDir = process.argv[2];

/**
 *  create array of songs (json)  (synchronized)
 *  currently supports: .mp3, .aif, .wav
 */
var songsList = [];
var i = 0;
var walkSongsSync = function(dir, songsList) {
    let fileNames = fs.readdirSync(dir);
    songsList = songsList || [];
    fileNames.forEach(function(fileName) {
        let stats = fs.lstatSync(dir + '/' + fileName);
        if(stats.isDirectory()) {
            songsList = walkSongsSync(dir + '/' + fileName, songsList);
        } else if(stats.isFile()) {
            if(fileName.match(/(.mp3|.aif|.wav)$/)) {
                songsList.push({'id': i++,'name': fileName, 'path': dir + '/' + fileName});
            }
        }
    });
    return songsList;
}

if(fs.existsSync(musicDir)) {
    songsList = walkSongsSync(musicDir);
} else {
    console.log('Error: music folder does not exist');
    process.exit();
}

var songsListClient = []; // doesn't include the path
songsList.forEach(function(element) {
    songsListClient.push({'id': element.id,'name': element.name});
});

var server = http.createServer(function(request, response) {
    if(request.method === 'GET') {
        if(request.url === '/') {
            fs.readFile('./public/index.html', function(err, html) {
                if(!err) {
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.end(html);
                } else {
                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    response.end('500 Internal Server Error: Unable to read the files.');
                }
            });
        } else if (request.url.match(/.css$/)) {
            response.writeHead(200, {'Content-Type': 'text/css'});
            var cssPath = path.join(__dirname, 'public', request.url);
            fs.createReadStream(cssPath, 'UTF-8').pipe(response);
        } else if (request.url.match(/.js$/)) {
            response.writeHead(200, {'Content-Type': 'text/js'});
            var jsPath = path.join(__dirname, 'public', request.url);
            fs.createReadStream(jsPath).pipe(response);
        } else if (request.url.match(/.jpeg$/)) {
            response.writeHead(200, {'Content-Type': 'img/jpeg'});
            var imgPath = path.join(__dirname, 'public', request.url);
            fs.createReadStream(imgPath).pipe(response);
        } else if (request.url.match(/^\/play\/(\d)+$/g)) {
            let player = osPlayerPair[ostype];
            let songId = request.url.slice(6);
            player(songId, 'PLAY');
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end();
        } else if (request.url === '/stop') {
            let player = osPlayerPair[ostype];
            player(null, 'STOP');
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end();
        } else if (request.url === '/pause') {
            let player = osPlayerPair[ostype];
            console.log(player);
            player(null, 'PAUSE');
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end();
        } else if (request.url === '/list') {
            response.writeHead(200, {'Content-Type': 'text/js'});
            response.end(JSON.stringify(songsListClient));
        }
    } else {
        console.log(request.url);
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end('Error 404: Not Found');
    }
    
}).listen('8000');
