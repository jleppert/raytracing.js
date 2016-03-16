function Ray(vectorA, vectorB) {
  this.a = vectorA;
  this.b = vectorB;
}

Ray.prototype = {
  origin: function() {
    return this.a;
  },
  direction: function() {
    return this.b;
  },
  pointAtParameter: function(t) {
    return this.a.add(this.b.multiply(t));
  }
};

module.exports = {
  ray: function(a, b) {
    return new Ray(a, b);
  },
  Ray: Ray
};
