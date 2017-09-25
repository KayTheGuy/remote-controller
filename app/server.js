/* jshint esnext: true */
const fs = require('fs');
const path = require('path');
const http = require('http');
const spawn = require('child_process').spawn;



/**
 * Windows Configs
 * ...
*/


/**
 * Mac Configs
 * ...
*/

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
var songsList;
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
    } else if (request.url === '/play') {
        var playerProcess = spawn('afplay', ['-q', '1','song/1.mp3']);
        
        setTimeout(function() {
            var playerProcess = spawn('killall', ['afplay']);
        }, 8000);
        
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('yo2');
    } else if (request.url === '/list') {
        response.writeHead(200, {'Content-Type': 'text/js'});
        response.end(JSON.stringify(songsListClient));
    } else {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end('Error 404: Not Found');
    }
    
}).listen('8000');


// TODO: create array of json songs and send it to client
// TODO: create list on client side
