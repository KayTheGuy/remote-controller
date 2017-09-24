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
    process.exit();
}

const musicDir = process.argv[2];
console.log(musicDir);

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
        var playerProcess = spawn('afplay', ['song/2.mp3']);
        
        setTimeout(function() {
            var playerProcess = spawn('killall', ['afplay']);
        }, 8000);
        
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('yo2');
    } else if (request.url === '/list') {
        console.log(request.url);
    } else {
        console.log(request.url);
    }

}).listen('8000');


// TODO: create array of json songs and send it to client
// TODO: create list on client side
