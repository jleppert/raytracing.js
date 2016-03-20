var ray = require('./ray').ray,
    vec = require('./vector').vec;

function Camera(lookFrom, lookAt, up, fov, aspect) {
  var theta = fov*Math.PI/180;
  var halfHeight = Math.tan(theta/2);
  var halfWidth = aspect * halfHeight;
  
  this.origin = lookFrom;
  var w = lookFrom.subtract(lookAt).unit();
  var u = up.cross(w).unit();
  var v = w.cross(u); 
  var lowerLeftCorner = vec(-halfWidth, -halfHeight, -1.0);
  // origin - half_width*u -half_height*v - w
  this.lowerLeftCorner = this.origin.subtract(u.multiply(halfWidth).subtract(v.multiply(halfHeight).subtract(w)));
  this.horizontal = u.multiply(halfWidth * 2);
  this.vertical = v.multiply(halfHeight * 2);
}

Camera.prototype.getRay = function(u, v) {
  return ray(this.origin, this.lowerLeftCorner.add(this.horizontal.multiply(u).add(this.vertical.multiply(v))).subtract(this.origin));
}

module.exports = Camera;
