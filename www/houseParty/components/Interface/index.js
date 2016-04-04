var inherit = require('util').inherits;
var WuiDom = require('WuiDom');
var util = require('util');
var wuiButtonBehavior = require('wuiButtonBehavior');

var inherits = util.inherits;

var StatusBar = require('StatusBar');

function Interface(currPlayer, player1, player2) {
	WuiDom.call(this, 'div', { className: 'playerInterface' });

	this.playerMenu(currPlayer);
	this.partyStatus(player1, player2);
	
}

inherits(Interface, WuiDom);
module.exports = Interface;

Interface.prototype.playerMenu = function (currPlayer){

	this.playerMenu = this.createChild('div', { className: 'playerMenu'});

	this.player = this.playerMenu.createChild('div');

	this.playerActions();

	this.itemSelect = this.playerActions.createChild('li');
	this.itemSelectText = this.itemSelect.createChild('div').setText('Item');

	this.itemMenu(currPlayer.canAct);

}

Interface.prototype.playerActions = function(){
	this.playerActions = this.player.createChild('ul', { className: 'playerActions' });

	this.actionButton('attackButton', 'Attack');
	this.actionButton('specialButton', 'Special');

}

Interface.prototype.actionButton = function(button, text){
	this.button = this.playerActions.createChild('li')
	this.button.setText(text);
	wuiButtonBehavior(this.button);
	this.button.on('tap', function () {
	    console.log(button + 'tappa tappa tappa');
	});
}

Interface.prototype.itemMenu = function(canAct){
	var itemSpriteSrc = 'http://placehold.it/50x50';

	this.itemMenu = this.itemSelect.createChild('ul', {className: 'itemMenu'});

	//TODO item inventory
	for(var i = 0; i < 6; i++){
		this.item = this.itemMenu.createChild('li');
		this.itemSprite = this.item.createChild('img');
		this.itemSprite.rootElement.src = itemSpriteSrc;

		wuiButtonBehavior(this.item);

		this.setItems(canAct);
	}
}

Interface.prototype.setItems = function(canAct){

	if(!canAct){
		this.item.disable();
	} else {
		this.item.on('tap', function () {
			console.log('item tappa tappa tappa');
		});
	}
}

Interface.prototype.partyStatus = function (player1, player2){

	this.partyMenu = this.createChild('div', { className: 'partyStatus'});

	this.partyMember(player1);
	this.partyMember(player2);

}

Interface.prototype.partyMember = function (player){
	this.partyMemberMenu = this.partyMenu.createChild('div', { className: ['menuRow', 'partyMember', player.character]});
	this.partyMemberName = this.partyMemberMenu.createChild('div', { className: 'menuRow' }).setText(player.character);

	this.playerHp(player.hp);

	this.playerWait(player);
	
}

Interface.prototype.playerHp = function(playerHp){
	this.partyMemberHp = this.partyMemberMenu.createChild('div', { className: ['statusBar', 'menuRow'] });
	this.partyMemberHpText = this.partyMemberHp.createChild('div').setText('HP');

	this.hpProgressBar = this.partyMemberHp.createChild('div',{ className: 'progressbar' });

	this.hpBar = new StatusBar("hpBar", playerHp);
	this.hpProgressBar.appendChild(this.hpBar);

	this.hpBar.setHp(playerHp, this.hpBar);
}

Interface.prototype.playerWait = function(player){
	this.partyMemberWait = this.partyMemberMenu.createChild('div', { className: ['statusBar', 'menuRow'] });
	this.partyMemberWaitText = this.partyMemberWait.createChild('div').setText('Wait');
	this.waitProgressBar = this.partyMemberWait.createChild('div',{ className: 'progressbar' });

	this.waitBar = new StatusBar("waitBar", player.waitTime);
	this.waitProgressBar.appendChild(this.waitBar);
	
	if(!player.canAct){
		player.setPlayerWaitTime(player.waitTime, this.waitBar, player);
	}
}