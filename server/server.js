/**
 * Windows Configs
 * ...
*/


/**
 * Mac Configs
 * ...
*/

const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))
app.use(express.static(__dirname))

// change this line if you want to serve on something besides port 8000
app.listen(8000)

const spawn = require('child_process').spawn;
var player_process = spawn('afplay', ['song/2.mp3']);

setTimeout(function() {
    var player_process = spawn('killall', ['afplay']);
    // process.exit();
}, 4000);