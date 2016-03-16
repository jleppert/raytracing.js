window.LiveReloadOptions = { host: 'localhost' };
require('livereload-js');

var Scene = require('./scene');
var CanvasRenderer = require('./canvas');
var UI = require('./ui');

var options = {
  height: 100 * 5,
  width: 200 * 5,
  sampleCount: 10
};

var ui = new UI(options);
var renderer = new CanvasRenderer(options, document.body);
var scene = new Scene(options, renderer.data);

scene.trace();
renderer.paint();
