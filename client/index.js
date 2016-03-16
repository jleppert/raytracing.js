window.LiveReloadOptions = { host: 'localhost' };
require('livereload-js');

var CanvasRenderer = require('./canvas');
var UI = require('./ui');
var work = require('webworkify');
var scene = work(require('./worker.js'));

var options = {
  width: 200 * 5,
  height: 100 * 5,
  sampleCount: 10,
  something: {
    cool: 5,
    one: {
      hello: "yes"
    }
  }
};

var ui = new UI(options);
var renderer = new CanvasRenderer(options, document.body);

ui.observe('render', function(options) {
  scene.postMessage(options);
  renderer.resize(options);
});

scene.addEventListener('message', function (ev) {
  renderer.resize(ev.data.options);
  renderer.paint(ev.data.data);
});

scene.postMessage(options);
