var express = require('express');
var browserify = require('browserify-middleware');
var livereload = require('livereload');

var app = express();

app.use('/', express.static(__dirname + '/static'));
app.use('/client', browserify(__dirname + '/client'));

app.listen(9000, function () {
    console.log('Started listening on port 9000!');
});

var liveReloadServer = livereload.createServer();
liveReloadServer.watch(__dirname + '/client');
liveReloadServer.watch(__dirname + '/static');
