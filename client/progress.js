function Progress(containerEl, options) {
  this.el = document.createElement('div');

  this.el.className = 'progress';
  this.el.style.width = (options.width / 2) + 'px';
  containerEl.appendChild(this.el);

  this.reset(options);
}

Progress.prototype.update = function(count, value) {
  this.progress[count].style.width = (value * 100) + '%';
  if(value == 1) {
    this.progress[count].style.display = 'none';
  }
}

Progress.prototype.reset = function(options) {
  this.el.width = (options.width / 2) + 'px';
  if(this.parts) this.el.removeChild(this.parts);
  delete this.parts;
  this.progress = [];
  this.parts = document.createElement('div');
  this.el.appendChild(this.parts);

  addParts.call(this, options.threads);
}

function addParts(count) {
  var total = count;
  while(count--) {
    var part = document.createElement('div');
    part.className = count;
    part.style.width = 100 / total + "%";
    var progress = document.createElement('span');
    progress.style.width = '0%';
    part.appendChild(progress);
    this.progress.push(progress);
    this.parts.appendChild(part);
  }
}

module.exports = Progress;
