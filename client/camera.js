var ray = require('./ray').ray,
    vec = require('./vector').vec;

function Camera() {
  this.lowerLeftCorner = vec(-2.0, -1.0, -1.0);
  this.vertical = vec(0.0, 2.0, 0.0);
  this.horizontal = vec(4.0, 0.0, 0.0);
  this.origin = vec(0.0, 0.0, 0.0);
}

Camera.prototype.getRay = function(u, v) {
  return ray(this.origin, this.lowerLeftCorner.add(this.horizontal.multiply(u).add(this.vertical.multiply(v))).subtract(this.origin));
}

module.exports = Camera;
