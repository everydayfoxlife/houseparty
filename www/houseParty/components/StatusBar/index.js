var inherit = require('util').inherits;
var WuiDom = require('WuiDom');
var util = require('util');

var inherits = util.inherits;

function StatusBar (type, currAmt) {
	this._ariaValuemax = 100;
	this._ariaValuenow = currAmt;
	this.barFull = false;

	this._progressId = WuiDom.call(this, 'div', {
		className: type,
		attr: {
			'role': 'progressbar',
			'aria-valuenow': '0',
			'aria-valuemin': '0',
			'aria-valuemax': this._ariaValuemax,
			'style': 'width: 0%'
			}
	});

	this.stopProgress();
}

inherits(StatusBar, WuiDom);
module.exports = StatusBar;

StatusBar.prototype.setHp = function (hp, bar) {
	var percentage = Math.floor((hp / bar._ariaValuemax) * 100);
	console.log(bar._ariaValuemax);

	bar.rootElement.setAttribute('aria-valuenow', hp);
	bar.rootElement.setAttribute('style', 'width: ' + percentage + '%');

	bar._ariaValuenow = hp;
};

StatusBar.prototype.isFull = function (barStatus, player){
	if (barStatus){
		this.addClassNames('barFull');
		player.canAct = true;
	}
}

StatusBar.prototype.setProgress = function (seconds) {
	var percentage = Math.floor((seconds / this._ariaValuemax) * 100);

	this.rootElement.setAttribute('aria-valuenow', seconds);
	this.rootElement.setAttribute('style', 'width: ' + percentage + '%');

	this._ariaValuenow = seconds;
};

StatusBar.prototype.incrementProgress = function (player) {
	var self = this;
	
	if (this._ariaValuenow < this._ariaValuemax) {
		self._ariaValuenow++;
		self._progressId = setTimeout(function () {
			self.setProgress(self._ariaValuenow);
			self.barFull = false;
			self.incrementProgress(player);
		}, 500);
	} else {
		self.barFull = true;
		self.isFull(self.barFull, player);
		self.stopProgress();
	}
};

StatusBar.prototype.startProgress = function (player) {
	this.setProgress(0);
	this.incrementProgress(player);
};

StatusBar.prototype.stopProgress = function () {
	clearTimeout(this._progressId);
	this._progressId = null;
};