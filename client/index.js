window.LiveReloadOptions = { host: 'localhost' };
require('livereload-js');

var CanvasRenderer = require('./canvas');
var UI = require('./ui');
var work = require('webworkify');
var scene = work(require('./worker.js'));
var Progress = require('./progress');

var options = {
  width: 200 * 5,
  height: 100 * 5,
  sampleCount: 10,
  something: {
    cool: 5,
    one: {
      hello: "yesss"
    }
  }
};

var ui = new UI(options);
var renderer = new CanvasRenderer(options, document.body);
var progress = new Progress(document.body, options);

ui.observe('render', function(options) {
  progress.reset(options);
  scene.postMessage(options);
  renderer.resize(options);
});

scene.addEventListener('message', function (ev) {
  if(ev.data.progress) {
    progress.update(ev.data.progress);
  } else {
    renderer.resize(ev.data.options);
    renderer.paint(ev.data.data);
  }
});

scene.postMessage(options);
