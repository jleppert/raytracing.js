window.LiveReloadOptions = { host: 'localhost' };
require('livereload-js');

var Vector = require('./vector').Vector,
    vec    = require('./vector').vec;

var Ray = require('./ray').Ray,
    ray = require('./ray').ray;

var Hit = require('./hitable').Hit,
    HitList = require('./hitable').HitList;

var Sphere = require('./sphere');

var Camera = require('./camera.js');

var scene = {
  height: 100 * 5,
  width: 200 * 5,
  sampleCount: 10
};

var canvasEl = document.createElement('canvas');
canvasEl.width = scene.width;
canvasEl.height = scene.height;
var ctx = canvasEl.getContext('2d');
var imageData = ctx.getImageData(0, 0, scene.width, scene.height);

var buf = new ArrayBuffer(imageData.data.length);
var buf8 = new Uint8ClampedArray(buf);
var data = new Uint32Array(buf);
canvasEl.style.transform = 'scale(1, -1)';
document.body.appendChild(canvasEl);

var max = 255.99;
var lowerLeftCorner = vec(-2.0, -1.0, -1.0);
var vertical = vec(0.0, 2.0, 0.0);
var horizontal = vec(4.0, 0.0, 0.0);
var origin = vec(0.0, 0.0, 0.0);

function randomInUnitSphere() {
  var p = vec();
  
  do {
    p = vec(Math.random(), Math.random(), Math.random()).multiply(2.0).subtract(vec(1, 1, 1));
  } while(p.length() >= 1.0);

  return p;
}

function color(r, world) {
  var hit = world.hit(r, 0.0, Number.MAX_VALUE);
  if(hit) {
    var target = hit.p.add(hit.normal).add(randomInUnitSphere());
    return color(ray(hit.p, target.subtract(hit.p)), world).multiply(0.5);
  } else {
    var unitDirection = Vector.unit(r.direction(), vec());
    var t = 0.5*(unitDirection.y + 1.0);
    return vec(1.0, 1.0, 1.0).multiply(1.0-t).add(vec(0.5, 0.7, 1.0).multiply(t));
  }
}

var world = new HitList([new Sphere(vec(0, 0, -1), 0.5), new Sphere(vec(0, -100.5, -1), 100)]);
var camera = new Camera();
for(var y = 0; y < scene.height; y++) {
  for(var x = 0; x < scene.width; x++) {

    var col = vec(0, 0, 0);

    for(var sample = 0; sample < scene.sampleCount; sample++) {
      var u = (x + Math.random()) / scene.width;
      var v = (y + Math.random()) / scene.height;
      var r = camera.getRay(u, v);
      var p = r.pointAtParameter(2.0);
      Vector.addAssign(col, color(r, world));
    }

    Vector.divideAssign(col, scene.sampleCount);
    col = vec(Math.sqrt(col.x), Math.sqrt(col.y), Math.sqrt(col.z));

    var ir = (max*col.x) | 0;
    var ig = (max*col.y) | 0;
    var ib = (max*col.z) | 0;

    data[y * scene.width + x] =
      (255 << 24) |  // alpha
      (ib << 16)  |  // blue
      (ig << 8)   |  // green
      ir;            // red
  }
}

imageData.data.set(buf8);
ctx.putImageData(imageData, 0, 0);
