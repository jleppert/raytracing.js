var Scene = require('./scene');

module.exports = function (self) {
  self.addEventListener('message', function (e) {
    var options = e.data;
    var buffer = new ArrayBuffer(options.width * options.height * 4);
    var data = new Uint32Array(buffer); 
    var scene = new Scene(e.data, data);
   
    scene.trace(function(currentPixel) {
      self.postMessage({ progress: currentPixel / (options.width * options.height) });
    });

    self.postMessage({ options: options, data: data });
  });
};
