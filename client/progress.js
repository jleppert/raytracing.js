function Progress(containerEl, options) {
  this.el = document.createElement('div');
  this.progress = document.createElement('span');
  this.el.appendChild(this.progress);

  this.el.className = 'progress';
  this.el.style.width = (options.width / 2) + 'px';
  containerEl.appendChild(this.el);
}

Progress.prototype.update = function(value) {
  this.progress.style.width = (value * 100) + '%';
  if(value == 1) {
    this.progress.style.display = 'none'; 
  }
}

Progress.prototype.reset = function(options) {
  this.el.width = (options.width / 2) + 'px';
  this.progress.style.width = '0%';
  this.progress.style.display = '';
}

module.exports = Progress;
