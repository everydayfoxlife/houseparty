var inherit = require('util').inherits;
var WuiDom = require('WuiDom');
var util = require('util');

var inherits = util.inherits;

function Enemy(){
	this.create();
}

inherits(Enemy, WuiDom);
module.exports = Enemy;

Enemy.prototype.create = function(){
	var spriteSrc = 'http://placehold.it/250x450';

	WuiDom.call(this, 'div', { className: 'enemy' });

	this.sprite = this.createChild('img');
	this.sprite.rootElement.src = spriteSrc;

}

