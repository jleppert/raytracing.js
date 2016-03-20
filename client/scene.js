var Vector = require('./vector').Vector,
    vec    = require('./vector').vec;

var Ray = require('./ray').Ray,
    ray = require('./ray').ray;

var Hit = require('./hitable').Hit,
    HitList = require('./hitable').HitList;

var Sphere = require('./sphere');

var Camera = require('./camera.js');
var materials = require('./materials.js');

var max = 255.99;
var lowerLeftCorner = vec(-2.0, -1.0, -1.0);
var vertical = vec(0.0, 2.0, 0.0);
var horizontal = vec(4.0, 0.0, 0.0);
var origin = vec(0.0, 0.0, 0.0);

function Scene(config, data) {
  this.config = config;
  this.data = data;

  this.world = new HitList([
    new Sphere(vec(0, 0, -1), 0.5, new materials.Lambertian(vec(0.1, 0.2, 0.5))),
    new Sphere(vec(0, -100.5, -1), 100, new materials.Lambertian(vec(0.8, 0.8, 0.0))),
    new Sphere(vec(1, 0, -1), 0.5, new materials.Metal(vec(0.8, 0.6, 0.2))),
    new Sphere(vec(-1, 0, -1), 0.5, new materials.Dielectric(1.5))
    //new Sphere(vec(-1, 0, -1), 0.5, new materials.Metal(vec(0.8, 0.8, 0.8), 1.0))
  ]);
  this.camera = new Camera();
}

Scene.prototype.trace = function(update, bounds) {
  var data = this.data;
  var scene = this.config;
  console.dir(bounds);
  var current = 0, total = bounds.x * bounds.y;
  var inc = total / 100;
  for(var y = bounds.yMin; y < bounds.yMax; y++) {
    for(var x = bounds.xMin; x < bounds.xMax; x++) {
      current++;
      
      if(current % inc === 0) update(current);
      var col = vec(0, 0, 0);

      for(var sample = 0; sample < scene.sampleCount; sample++) {
        var u = (x + Math.random()) / scene.width;
        var v = (y + Math.random()) / scene.height;
        var r = this.camera.getRay(u, v);
        Vector.addAssign(col, color(r, this.world, 0));
      }

      Vector.divideAssign(col, scene.sampleCount);
      col = vec(Math.sqrt(col.x), Math.sqrt(col.y), Math.sqrt(col.z));

      var ir = (max*col.x) | 0;
      var ig = (max*col.y) | 0;
      var ib = (max*col.z) | 0;

      data[y * bounds.x + x] =
        (255 << 24) |  // alpha
        (ib << 16)  |  // blue
        (ig << 8)   |  // green
        ir;            // red
    }
  }
}

function color(r, world, depth) {
  var hit = world.hit(r, 0.001, Number.MAX_VALUE);
  if(hit) {
    var scattered = hit.material.scatter(r, hit);
    if(depth < 50 && scattered.result) {
        return scattered.attenuation.multiply(color(scattered.ray, world, depth + 1));
      } else {
        return vec(0, 0, 0);
      }
  } else {
    var unitDirection = Vector.unit(r.direction(), vec());
    var t = 0.5*(unitDirection.y + 1.0);
    return vec(1.0, 1.0, 1.0).multiply(1.0-t).add(vec(0.5, 0.7, 1.0).multiply(t));
  }
}

module.exports = Scene;
