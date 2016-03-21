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

var rand = Math.random;
function randomScene() {
  var n = 500;
  
  var objects = [];
  //objects.push(new Sphere(vec(0, -100, -1), 100, new materials.Lambertian(vec(0.5, 0.5, 0.5))));
  //objects.push(new Sphere(vec(0, -100.5, -1), 100, new materials.Lambertian(vec(0.8, 0.8, 0.0))));
  objects.push(new Sphere(vec(0, -1000, 0), 1000, new materials.Lambertian(vec(0.5, 0.5, 0.5))));

  var i = 1;
  for(var a = -11; a < 11; a++) {
    for(var b = -11; b < 11; b++) {
      var chooseMat = rand();
      var center = vec(a+0.9*rand(), 0.2, b+0.9*rand());
      if((center.subtract(vec(4, 0.2, 0)).length() > 0.9)) {
        if(chooseMat < 0.8) { //diffuse
          objects.push(new Sphere(center, 0.2, new materials.Lambertian(vec(rand()*rand(), rand()*rand(), rand()*rand()))));
        } else if(chooseMat < 0.95) { //metal
          objects.push(new Sphere(center, 0.2, new materials.Metal(vec(0.5*(1+rand()), 0.5*(1+rand()), 0.5*(1+rand())))));
        } else { // glass
          objects.push(new Sphere(center, 0.2, new materials.Dielectric(1.5)));
        }
      }
    }
  }

  objects.push(new Sphere(vec(0, 1, 0), 1.0, new materials.Dielectric(1.5)));
  objects.push(new Sphere(vec(-4, 1, 0), 1.0, new materials.Lambertian(vec(0.4, 0.2, 0.1))));
  objects.push(new Sphere(vec(4, 1, 0), 1.0, new materials.Metal(vec(0.7, 0.6, 0.5), 0.0)));
  
  return objects;
}

function fromScene(data) {
  var objects = [];
  data.forEach(function(object) {
    var material;
    if(object[2] === 'Dielectric') {
      material = new materials.Dielectric(object[3]);
    } else {
      material = new materials[object[2]](vec.apply(vec, object[3]));
    }
    objects.push(new Sphere(vec.apply(vec, object[0]), object[1], material))
  });

  return objects;
}


function Scene(config, data) {
  this.config = config;
  this.data = data;

  /*this.world = new HitList([
    //new Sphere(vec(0, 0, -1), 0.5, new materials.Lambertian(vec(0.1, 0.2, 0.5))),
    new Sphere(vec(0, -100.5, -1), 100, new materials.Lambertian(vec(0.8, 0.8, 0.0))),
    //new Sphere(vec(1, 0, -1), 0.5, new materials.Metal(vec(0.8, 0.6, 0.2))),
    //new Sphere(vec(-1, 0, -1), 0.5, new materials.Dielectric(1.5)),
    //new Sphere(vec(-1, 0, -1), -0.45, new materials.Dielectric(1.5)),
    //new Sphere(vec(-1, 0, -1), 0.5, new materials.Metal(vec(0.8, 0.8, 0.8), 1.0))
  ]);*/
  //console.log(randomScene);
  if(config.scene) {
    //debugger;
    this.world = new HitList(fromScene(JSON.parse(config.scene)));
  } else {
    this.world = new HitList(randomScene());
  }
  /*var r = Math.cos(Math.PI/4);
  this.world = new HitList([
    new Sphere(vec(-r, 0, -1), r, new materials.Lambertian(vec(0, 0, 1))),
    new Sphere(vec(r, 0, -1), r, new materials.Lambertian(vec(1, 0, 0)))
  ]);*/

  //var s = randomScene();
  //console.log('scene!!', s);
  //this.world = s;




  var cameraOptions = {
    lookFrom: vec(13, 1, 4),
    lookAt: vec(-4, 1, 0),
    up: vec(0, 1, 0),
    apeture: 0,
    fov: 20,
    aspectRatio: config.width / config.height
  };
  /*var cameraOptions = {
    lookFrom: vec(-2, 2, 1),
    lookAt: vec(0, 0, -1),
    up: vec(0, 1, 0),
    fov: 90,
    aspectRatio: config.width / config.height
  };*/
  cameraOptions.distToFocus = cameraOptions.lookFrom.subtract(cameraOptions.lookAt).length();
//this.camera = new Camera(vec(-2, 2, 1), vec(0, 0, -1), vec(0, 1, 0), 90, config.width / config.height);
//function Camera(lookFrom, lookAt, up, fov, aspect) {
  this.camera = new Camera(cameraOptions);
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
