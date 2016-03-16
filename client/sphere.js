var Hit = require('./hitable.js').Hit;

function Sphere(center, r) {
  this.center = center;
  this.radius = r;
}

Sphere.prototype.hit = function(r, t_min, t_max) {
  var oc = r.origin().subtract(this.center);
  var a =  r.direction().dot(r.direction());
  var b = oc.dot(r.direction());
  var c = oc.dot(oc) - (this.radius * this.radius);

  var hitRecord = new Hit(); 

  var discriminant = b*b - a*c;
  if(discriminant > 0) {
    var temp = (-b - Math.sqrt(b*b-a*c))/a;
    if(temp < t_max && temp > t_min) {
      hitRecord.t = temp;
      hitRecord.p = r.pointAtParameter(hitRecord.t);
      hitRecord.normal = (hitRecord.p.subtract(this.center)).divide(this.radius);
      
      return hitRecord;
    }
    temp = (-b + Math.sqrt(b*b-a*c))/a;
    if(temp < t_max && temp > t_min) {
      hitRecord.t = temp;
      hitRecord.p = r.pointAtParameter(hitRecord.t);
      hitRecord.normal = (hitRecord.p.subtract(this.center)).divide(this.radius);
    
      return hitRecord;
    }
  }
  return false;
}

module.exports = Sphere;
