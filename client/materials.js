var vec = require('./vector').vec,
    ray = require('./ray').ray;

function randomInUnitSphere() {
  var p = vec();
  
  do {
    p = vec(Math.random(), Math.random(), Math.random()).multiply(2.0).subtract(vec(1, 1, 1));
  } while(p.length() >= 1.0);

  return p;
}

// v - 2*dot(v,n)*n;
function reflect(v, normal) {
  return v.subtract(normal.multiply(2 * v.dot(normal) * 2));
}

function Lambertian(a) {
  this.albedo = a;
}

Lambertian.prototype.scatter = function(incomingRay, hitRecord) {
  var target = hitRecord.p.add(hitRecord.normal).add(randomInUnitSphere());

  return {
    ray: ray(hitRecord.p, target.subtract(hitRecord.p)),
    attenuation: this.albedo,
    result: true
  };
}

function Metal(a) {
  Lambertian.apply(this, arguments);
}
Metal.prototype = Object.create(Lambertian.prototype);
Metal.prototype.constructor = Metal;

Metal.prototype.scatter = function(incomingRay, hitRecord) {
  var reflected = reflect(incomingRay.direction().unit(), hitRecord.normal);
 
  var r = ray(hitRecord.p, reflected);
 
  return {
    ray: r,
    attenuation: this.albedo,
    result: (r.direction().dot(hitRecord.normal) > 0)
  };
}

module.exports = {
  Lambertian: Lambertian,
  Metal: Metal
};
