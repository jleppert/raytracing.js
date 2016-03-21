var ray = require('./ray').ray,
    vec = require('./vector').vec;

function randomInUnitDisk() {
  var p = vec();
  do {
    p = vec(Math.random(), Math.random(), 0).multiply(2);
    p = p.subtract(vec(1, 1, 0));
  } while(p.dot(p) >= 1.0);

  return p;
}

function Camera(options) {
  console.log(JSON.stringify(options));
  this.lensRadius = options.apeture / 2;
  var theta = options.fov*Math.PI/180;
  var halfHeight = Math.tan(theta/2);
  var halfWidth = options.aspectRatio * halfHeight;
  
  this.origin = options.lookFrom;
  var w = options.lookFrom.subtract(options.lookAt).unit();
  var u = options.up.cross(w).unit();
  var v = w.cross(u);
  
  this.w = w;
  this.u = u;
  this.v = v;

  var focusDist = options.distToFocus;

  this.lowerLeftCorner = this.origin.subtract(u.multiply(halfWidth * focusDist))
    .subtract(v.multiply(halfHeight * focusDist))
    .subtract(w.multiply(focusDist));
  
  this.horizontal = u.multiply(halfWidth * focusDist * 2);
  this.vertical = v.multiply(halfHeight * focusDist * 2);
}

Camera.prototype.getRay = function(s, t) {
  var rd = randomInUnitDisk().multiply(this.lensRadius);
  var offset = this.u.multiply(rd.x).multiply(rd.y).add(this.v);
  return ray(this.origin.add(offset), this.lowerLeftCorner.add(this.horizontal.multiply(s).add(this.vertical.multiply(t))).subtract(this.origin.add(offset)));
}

module.exports = Camera;
