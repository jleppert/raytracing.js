window.LiveReloadOptions = { host: 'localhost' };
require('livereload-js');

var CanvasRenderer = require('./canvas');
var UI = require('./ui');
var work = require('webworkify');
//var scene = work(require('./worker.js'));
var Progress = require('./progress');

var options = {
  width: 200 * 5,
  height: 100 * 5,
  sampleCount: 10,
  threads: 8,
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
  //scene.postMessage(options);
  renderer.resize(options);
  createWorkers(options);
});

/*scene.addEventListener('message', function (ev) {
  if(ev.data.progress) {
    progress.update(ev.data.progress);
  } else {
    renderer.resize(ev.data.options);
    renderer.paint(ev.data.data);
  }
});*/

function bounds(options, current) {
  current++;
  var xInc = options.width / options.threads;

  var last = current - 1;
  var xMax = xInc * current;
  
  var xMin = last * xInc;
  var yMin = 0;
  var yMax = options.height;
  
  return {
    width: options.width,
    height: options.height,
    xMin: xMin,
    xMax: xMax, 
    yMin: yMin,
    yMax: yMax,
    x: xMax - xMin, 
    y: yMax - yMin
  };
}

function createWorkers(options) {
  for(var thread = 0; thread < options.threads; thread++) {
    (function(thread) {
      var scene = work(require('./worker.js'));
      options.bounds = bounds(options, thread);
      scene.postMessage(options);
      scene.addEventListener('message', function(ev) {
        if(ev.data.progress) {
          progress.update(thread, ev.data.progress);
        } else {
          //renderer.resize(ev.data.options);
          console.log('paint called!');
          renderer.paint(ev.data.data, ev.data.options);
        }
      });
    }(thread));
  }
}

createWorkers(options);
//scene.postMessage(options);
