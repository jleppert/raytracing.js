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
  return v.subtract(normal.multiply(v.dot(normal)*2));
}

// 
function refract(v, normal, ni_over_nt, refracted) {
  var uv = v.unit(v);
  var dt = normal.dot(uv);

  var discriminant = 1.0 - (ni_over_nt * ni_over_nt * (1-(dt*dt)));
  var refracted, result;
  if(discriminant > 0) {
    refracted = uv.subtract(normal.multiply(dt)).multiply(ni_over_nt).subtract(normal.multiply(Math.sqrt(discriminant)));
    result = true;
  } else {
    result = false;
  }

  return {
    result: result,
    vec: refracted
  };
}

function schlick(cosine, ref_idx) {
  var r0 = (1 - ref_idx) / (1 + ref_idx);
  r0 *= r0;
  return r0 + (1 - r0)*Math.pow((1-cosine), 5);
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
  var ni_over_nt, outwardNormal, cosine;
  var reflected = reflect(incomingRay.direction(), hitRecord.normal);
  var refracted = vec();

  if(incomingRay.direction().dot(hitRecord.normal) > 0) {
    outwardNormal = hitRecord.normal.negative();
    ni_over_nt = this.ref_idx;
    cosine = (this.ref_idx * incomingRay.direction().dot(hitRecord.normal)) / incomingRay.direction().length();
  } else {
    outwardNormal = hitRecord.normal;
    ni_over_nt = 1.0 / this.ref_idx;
    cosine = -incomingRay.direction().dot(hitRecord.normal) / incomingRay.direction().length();
  }

  var refracted = refract(incomingRay.direction(), outwardNormal, ni_over_nt, refracted);
  var reflect_prob, scattered;

  if(refracted.result) {
    reflect_prob = schlick(cosine, this.ref_idx);
    //scattered = ray(hitRecord.p, refracted.vec);
    //result = true;
  } else {
    reflect_prob = 1.0;
    scattered = ray(hitRecord.p, reflected);
    //result = false;
  }

  if(Math.random() < reflect_prob) {
    scattered = ray(hitRecord.p, reflected);
  } else {
    scattered = ray(hitRecord.p, refracted.vec);
  }

  return {
    ray: scattered,
    attenuation: vec(1.0, 1.0, 1.0),
    result: true
  };
}

module.exports = {
  Lambertian: Lambertian,
  Metal: Metal,
  Dielectric: Dielectric
};
