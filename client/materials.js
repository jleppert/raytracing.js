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

function refract(v, normal, ni_over_nt) {
  var uv = v.unit();
  var dt = uv.dot(normal);

  var discriminant = 1.0 - ni_over_nt * ni_over_nt * (1-dt*dt);
  if(discriminant > 0) {
    refracted = v.subtract(normal.multiply(dt)).multiply(ni_over_nt).subtract(normal.multiply(Math.sqrt(discriminant)));

    return refracted;
  }

  return false;
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

function Metal(a, f) {
  Lambertian.apply(this, arguments);
  this.fuzz = f < 1 ? f : 0;
}
Metal.prototype = Object.create(Lambertian.prototype);
Metal.prototype.constructor = Metal;

Metal.prototype.scatter = function(incomingRay, hitRecord) {
  var reflected = reflect(incomingRay.direction().unit(), hitRecord.normal);
  var scattered = ray(hitRecord.p, randomInUnitSphere().multiply(this.fuzz).add(reflected));

  return {
    ray: scattered,
    attenuation: this.albedo,
    result: (scattered.direction().dot(hitRecord.normal) > 0)
  };
}

function Dielectric(ri) {
  this.ref_idx = ri;
}

Dielectric.prototype.scatter = function(incomingRay, hitRecord) {
  var reflected = reflect(incomingRay.direction(), hitRecord.normal);

  var ni_over_nt, outwardNormal;
  if(incomingRay.direction().dot(hitRecord.normal) > 0) {
    outwardNormal = hitRecord.normal.negative();
    ni_over_nt = this.ref_idx;
  } else {
    outwardNormal = hitRecord.normal;
    ni_over_nt = 1.0 / this.ref_idx;
  }

  var refracted = refract(incomingRay.direction(), outwardNormal, ni_over_nt);
  var scattered;
  var result = false;
  if(refracted) {
    scattered = ray(hitRecord.p, refracted);
  } else {
    scattered = ray(hitRecord.p, reflected);
    result = true;
  }

  return {
    ray: scattered,
    attenuation: vec(1.0, 1.0, 1.0),
    result: result
  };
}

module.exports = {
  Lambertian: Lambertian,
  Metal: Metal,
  Dielectric: Dielectric
};
