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
  threads: 4,
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
  var sceneData = JSON.stringify(randomScene());
  for(var thread = 0; thread < options.threads; thread++) {
    (function(thread) {
      var scene = work(require('./worker.js'));
      options.bounds = bounds(options, thread);
      options.scene = sceneData;
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

var rand = Math.random;
var vec = require('./Vector').vec;
function randomScene() {
  var n = 500;
  
  var objects = [];
  //objects.push(new Sphere(vec(0, -100, -1), 100, new materials.Lambertian(vec(0.5, 0.5, 0.5))));
  //objects.push(new Sphere(vec(0, -100.5, -1), 100, new materials.Lambertian(vec(0.8, 0.8, 0.0))));
  objects.push([[0, -1000, 0], 1000, 'Lambertian', [0.5, 0.5, 0.5]]);
  //new Sphere(vec(0, -1000, 0), 1000, new materials.Lambertian(vec(0.5, 0.5, 0.5))));

  var i = 1;
  for(var a = -11; a < 11; a++) {
    for(var b = -11; b < 11; b++) {
      var chooseMat = rand();
      var center = vec(a+0.9*rand(), 0.2, b+0.9*rand());
      if((center.subtract(vec(4, 0.2, 0)).length() > 0.9)) {
        if(chooseMat < 0.8) { //diffuse
          //objects.push(new Sphere(center, 0.2, new materials.Lambertian(vec(rand()*rand(), rand()*rand(), rand()*rand()))));
          objects.push([[center.x, center.y, center.z], 0.2, 'Lambertian', [rand()*rand(), rand()*rand(), rand()*rand()]]);
        } else if(chooseMat < 0.95) { //metal
          //objects.push(new Sphere(center, 0.2, new materials.Metal(vec(0.5*(1+rand()), 0.5*(1+rand()), 0.5*(1+rand())))));
          objects.push([[center.x, center.y, center.z], 0.2, 'Metal', [0.5*(1+rand()), 0.5*(1+rand()), 0.5*(1+rand())]]);
        } else { // glass
          //objects.push(new Sphere(center, 0.2, new materials.Dielectric(1.5)));
          objects.push([[center.x, center.y, center.z], 0.2, 'Dielectric', 1.5]);
        }
      }
    }
  }

  objects.push([[0, 1, 0], 1.0, 'Dielectric', 1.5]);
  //objects.push(new Sphere(vec(0, 1, 0), 1.0, new materials.Dielectric(1.5)));
  //objects.push(new Sphere(vec(-4, 1, 0), 1.0, new materials.Lambertian(vec(0.4, 0.2, 0.1))));
  objects.push([[-4, 1, 0], 1.0, 'Lambertian', [0.4, 0.2, 0.1]]);
  //objects.push(new Sphere(vec(4, 1, 0), 1.0, new materials.Metal(vec(0.7, 0.6, 0.5), 0.0)));
  objects.push([[4, 1, 0], 1.0, 'Metal', [0.7, 0.6, 0.5], 0.0]);
  
  return objects;
}



createWorkers(options);
//scene.postMessage(options);
