function CanvasRenderer(options, el) {
  var canvasEl = document.createElement('canvas');
  var ctx = canvasEl.getContext('2d');
  canvasEl.style.transform = 'scale(1, -1)';
  el.appendChild(canvasEl);

  this.canvasEl = canvasEl;
  this.ctx = ctx;
  this.options = options;
  this.buffer = document.createElement('canvas');

  this.resize(options);
  this.images = [];
}

CanvasRenderer.prototype.paint = function(data, options) {
  this.images.push({ data: data, options: options});

  if(this.images.length === options.threads) {
    this.images.forEach(function(image) {
      var buf8 = new Uint8ClampedArray(image.data.buffer);
      var imageData = new ImageData(buf8, image.options.bounds.x, image.options.bounds.y);
      this.ctx.putImageData(imageData, image.options.bounds.xMin, 0);
    }.bind(this));
  }
}

CanvasRenderer.prototype.resize = function(options) {
  this.options = options;

  this.canvasEl.height = options.height;
  this.canvasEl.width = options.width;

  this.buffer.height = options.height;
  this.buffer.width = options.width;

  this.images = [];
}

module.exports = CanvasRenderer;
