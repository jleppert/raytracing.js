var dat = require('dat-gui');
var objectPath = require('object-path');

function ui(root) {
  function getMinMax(prop) {
    return false;
  }

  window.onload = function() {
    var gui = this.dat = new dat.GUI();

      function propGroup(key, path, obj, gui) {
        this.path = path;
      }

      propGroup.prototype.public = function(key) {
        this[key] = objectPath.get(root, this.path.concat(key).join('.'));
      };

   function recurse(obj, gui, path, pg) {
     var path = Array.isArray(path) ? path : [];

      for(var key in obj) {
        if(typeof(obj[key]) === "object") {
          var l = gui.addFolder(key);
          recurse(obj[key], l, path.concat(key), new propGroup(key, path.concat(key), obj, gui));
        } else {
          pg.public(key);
          gui.add(pg, key);
        }
      }
   }

   recurse(root, gui);
  }.bind(this);
}

module.exports = ui;
