var dat = require('dat-gui');
var objectPath = require('object-path');
var immutable = require('immutable');

function ui(root) {
  this.state = immutable.fromJS(root);

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

      var self = this;
      for(var key in obj) {
        if(typeof(obj[key]) === "object") {
          var l = gui.addFolder(key);
          recurse(obj[key], l, path.concat(key), new propGroup(key, path.concat(key), obj, gui));
        } else {
          if(!pg) pg = new propGroup(key, [], obj, gui);
          pg.public(key);
          var controller = gui.add(pg, key);
          (function(obj, gui, path, key, pg) {
            controller.onFinishChange(function(value) {
              var updatedState;
              if(path.length) {
                updatedState = self.state.updateIn(path.join(key), value);
              } else {
                updatedState = self.state.set(key, value);
              }
              notifyObservers.call(self, updatedState);
            });
          }(obj, gui, path, key, pg));
        }
      }
   }
   
   recurse.call(this, root, gui);
  }.bind(this);
}

function notifyObservers(updatedState) {
  var jsObj = updatedState.toJS();
 
  if(!this._observers) return;
  for(var i = 0; i < this._observers.length; i++) {
    this._observers[i](jsObj);
  }
}

ui.prototype.observe = function(cb) {
  this._observers = this._observers || [];
  this._observers.push(cb);
}

module.exports = ui;
