function CanvasRenderer(options, el) {
  var canvasEl = document.createElement('canvas');
  canvasEl.width = options.width;
  canvasEl.height = options.height;
  var ctx = canvasEl.getContext('2d');
  var imageData = ctx.getImageData(0, 0, options.width, options.height);

  var buf = new ArrayBuffer(imageData.data.length);
  var buf8 = new Uint8ClampedArray(buf);
  var data = new Uint32Array(buf);
  canvasEl.style.transform = 'scale(1, -1)';
  el.appendChild(canvasEl);

  this.data = data;
  this.imageData = imageData;
  this.buf8 = buf8;
  this.ctx = ctx;
}

CanvasRenderer.prototype.paint = function() {
  this.imageData.data.set(this.buf8);
  this.ctx.putImageData(this.imageData, 0, 0);
}

module.exports = CanvasRenderer;
