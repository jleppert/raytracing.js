window.LiveReloadOptions = { host: 'localhost' };
require('livereload-js');

var scene = {
  height: 100,
  width: 200
};

var canvasEl = document.createElement('canvas');
canvasEl.width = scene.width;
canvasEl.height = scene.height;
var ctx = canvasEl.getContext('2d');
var imageData = ctx.getImageData(0, 0, scene.width, scene.height);

var buf = new ArrayBuffer(imageData.data.length);
var buf8 = new Uint8ClampedArray(buf);
var data = new Uint32Array(buf);

document.body.appendChild(canvasEl);

for(var y = scene.height - 1; y >= 0; y--) {
  for(var x = 0; x < scene.width; x++) {
    var r = x / scene.width;
    var g = y / scene.height;
    var b = 0.2;

    var max = 255.99;
    var ir = (max*r) | 0;
    var ig = (max*g) | 0;
    var ib = (max*b) | 0;
    var value = x * y & 0xff;

    data[y * scene.width + x] =
      (255 << 24) |  // alpha
      (ib << 16)  |  // blue
      (ig << 8)   |  // green
      ir;            // red
  }
}

imageData.data.set(buf8);
ctx.putImageData(imageData, 0, 0);
