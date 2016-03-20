var Scene = require('./scene');

module.exports = function (self) {
  self.addEventListener('message', function (e) {
    var options = e.data;
    var buffer = new ArrayBuffer(options.bounds.x * options.bounds.y * 4);
    var data = new Uint32Array(buffer); 
    var scene = new Scene(e.data, data);
   
    scene.trace(function(currentPixel) {
      self.postMessage({ progress: currentPixel / (options.bounds.x * options.bounds.y) });
    }, options.bounds);

    self.postMessage({ options: options, data: data });
  });
};
