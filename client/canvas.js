function CanvasRenderer(options, el) {
  var canvasEl = document.createElement('canvas');
  canvasEl.width = options.width;
  canvasEl.height = options.height;
  var ctx = canvasEl.getContext('2d');
  canvasEl.style.transform = 'scale(1, -1)';
  el.appendChild(canvasEl);

  this.canvasEl = canvasEl;
  this.ctx = ctx;
  this.options = options;
}

CanvasRenderer.prototype.paint = function(data) {
  var buf8 = new Uint8ClampedArray(data.buffer);
  var imageData = this.ctx.getImageData(0, 0, this.options.width, this.options.height);
  imageData.data.set(buf8);
  this.ctx.putImageData(imageData, 0, 0);
}

CanvasRenderer.prototype.resize = function(options) {
  this.options = options;

  this.canvasEl.height = options.height;
  this.canvasEl.width = options.width;
}

module.exports = CanvasRenderer;
