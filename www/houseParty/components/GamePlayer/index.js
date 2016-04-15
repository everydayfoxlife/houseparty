var inherit = require('util').inherits;
var WuiDom = require('WuiDom');
var util = require('util');

var inherits = util.inherits;

function Player() {
	this.character = "";
	this.sibling = "";

	this.playerSpriteSrc = '';

	this.playerList = WuiDom.call(this, 'ul');

	this.sibling = null;
	this.status();
	this.player = this.createChild('li');
	this.playerSprite = this.player.createChild('img');
	this.canAct = false;

}

inherits(Player, WuiDom);
module.exports = Player;

Player.prototype.set = function (paramCharacter, paramPlayerNumber){

	this.character = paramCharacter;

	if (paramPlayerNumber === 1){
		this.playerSpriteSrc = 'http://placehold.it/150x150&text=';
		this.hp = 50;
		this.waitTime = 10;
	} else if (paramPlayerNumber === 2){
		this.playerSpriteSrc = 'http://placehold.it/150x150&text=';
		this.hp = 100;
		this.waitTime = 5;
	}

	this.player.addClassNames(paramCharacter);
	
	this.playerSprite.rootElement.src = this.playerSpriteSrc + paramCharacter;

}

Player.prototype.status = function (){
	var statusSpriteSrc = 'http://placehold.it/25x25';

	this.miniStatus = this.createChild('li', { className: 'playerMiniStatus' });

	this.statusSprite = this.miniStatus.createChild('img');
	this.statusSprite.rootElement.src = statusSpriteSrc;
}

Player.prototype.setIsWaiting = function (isWaiting, bar, player){
	if (isWaiting) {
		bar.startProgress(player);
	} else {
		bar.stopProgress();
	}
}

Player.prototype.setPlayerWaitTime = function (waitTime, bar, player) {
	for (var i = 0; i < waitTime; i++) {
		this.setIsWaiting(true, bar, player);
	}
};