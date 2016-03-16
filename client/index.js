window.LiveReloadOptions = { host: 'localhost' };
require('livereload-js');

var Vector = require('./vector').Vector,
    vec    = require('./vector').vec;

var Ray = require('./ray').Ray,
    ray = require('./ray').ray;

var Hit = require('./hitable').Hit,
    HitList = require('./hitable').HitList;

var Sphere = require('./sphere');

var scene = {
  height: 100 * 5,
  width: 200 * 5
};

var canvasEl = document.createElement('canvas');
canvasEl.width = scene.width;
canvasEl.height = scene.height;
var ctx = canvasEl.getContext('2d');
var imageData = ctx.getImageData(0, 0, scene.width, scene.height);

var buf = new ArrayBuffer(imageData.data.length);
var buf8 = new Uint8ClampedArray(buf);
var data = new Uint32Array(buf);

document.body.appendChild(canvasEl);

var max = 255.99;
var lowerLeftCorner = vec(-2.0, -1.0, -1.0);
var vertical = vec(0.0, 2.0, 0.0);
var horizontal = vec(4.0, 0.0, 0.0);
var origin = vec(0.0, 0.0, 0.0);

/*function hitSphere(center, radius, ray) {
  var oc = r.origin().subtract(center);
  var a = r.direction().dot(r.direction());
  var b = 2.0 * oc.dot(r.direction());
  var c = oc.dot(oc) - radius * radius;
  var discriminant = b*b - 4*a*c;

  if(discriminant < 0) {
    return -1.0;
  } else {
    return (-b - Math.sqrt(discriminant)) / (2.0*a);
  }

  return (discriminant > 0);
}*/

function color(r, world) {
  var hit = world.hit(r, 0.0, Number.MAX_VALUE);
  if(hit) {
    return vec(hit.normal.x+1, hit.normal.y+1, hit.normal.z+1).multiply(0.5);
  } else {
    var unitDirection = Vector.unit(r.direction(), vec());
    var t = 0.5*(unitDirection.y + 1.0);
    //var t = (unitDirection.y + 1.0) * 0.5;
    return vec(1.0, 1.0, 1.0).multiply(1.0-t).add(vec(0.5, 0.7, 1.0).multiply(t));
  }
}

/*  var t = hitSphere(vec(0, 0, -1), 0.5, r);
  if(t > 0.0) {
    var n = Vector.unit(r.pointAtParameter(t).subtract(vec(0, 0, -1)), vec());
    return vec(n.x + 1, n.y + 1, n.z + 1).multiply(0.5);
  }
  var unitDirection = Vector.unit(r.direction(), vec());
  var t = 0.5*(unitDirection.y + 1.0);
  return vec(1.0, 1.0, 1.0).multiply(1.0-t).add(vec(0.5, 0.7, 1.0).multiply(t));
}*/

var world = new HitList([new Sphere(vec(0, 0, -1), 0.5), new Sphere(vec(0, -100.5, -1), 100)]);

for(var y = scene.height - 1; y >= 0; y--) {
  for(var x = 0; x < scene.width; x++) {
    var u = x / scene.width;
    var v = y / scene.height;

    var r = ray(origin, lowerLeftCorner.add(horizontal.multiply(u)).add(vertical.multiply(v)));
    var p = r.pointAtParameter(2.0);
    var col = color(r, world);

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
