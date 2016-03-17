function Hit(t, p, normal, material) {
  this.t = t;
  this.p = p;
  this.normal = normal;
  this.material = material;
}

function HitList(list) {
  this.list = list || [];
}

HitList.prototype = {
  hit: function(r, t_min, t_max) {
    var hitAnything = false;
    
    var closestSoFar = t_max;
    
    var hitRec = undefined;
    for(var i = 0; i < this.list.length; i++) {
      var hit = this.list[i].hit(r, t_min, closestSoFar);
      if(hit) {
        hitAnything = true;
        closestSoFar = hit.t;
        hitRec = hit;
      }
    }

    return hitAnything ? hitRec : false;
  },
  add: function(t, p, normal) {
    var h = new Hit(t, p, normal);
    this.list.push(h);
    return h;
  }
};

module.exports = {
  Hit: Hit,
  HitList: HitList
};
