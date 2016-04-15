var mage = require('mage');
var mageLoader = require('mage-loader.js');
var util = require('util');
var WuiDom = require('WuiDom');
var WuiView = require('WuiView');
var wuiButtonBehavior = require('wuiButtonBehavior');

var inherits = util.inherits;

function Stage(player1, player2){
	WuiDom.call(this, 'div', { className: ['stage', 'select'] });
	this.players = this.createChild('div', { className: 'players' });
	this.players.createChild('h2').setText('House Party');

	this.players.appendChild(player1);
	this.players.appendChild(player2);
}
inherits(Stage, WuiDom);

function Player(playerNumber) {
	this.character = "";
	this.partner = "";
	this.sibling = "";
	this.playerNumber = playerNumber;

	if (playerNumber === 1){
		this.character = "Hansel";
		this.partner = "Gretel";
		
	} else if (playerNumber === 2){
		this.character = "Gretel";
		this.partner = "Hansel";

	}

	this.create(playerNumber);

	this.itemMenu();

	this.fightTotal = 0;

	this.playerStatus = this.createChild('li');

	wuiButtonBehavior(this);

	this.selectable();

}
inherits(Player, WuiDom);

Player.prototype.create = function (playerNumber){
	var playerSpriteSrc = 'http://placehold.it/250x350&text=';

	WuiDom.call(this, 'ul', { className: 'player' + playerNumber });

	this.sibling = null;
	this.ready = this.createChild('li', { className: 'ready'});
	this.ready.setText('Ready?');
	this.ready.hide();

	this.playerName = this.createChild('li');
	this.playerName.setText(this.character);
	this.player = this.createChild('li');
	this.playerSprite = this.player.createChild('img');
	this.playerSprite.rootElement.src = playerSpriteSrc + this.character;
	this.playerItems = this.createChild('li');

}

Player.prototype.itemMenu = function(){
	var itemSpriteSrc = 'http://placehold.it/50x50';

	this.itemMenu = this.playerItems.createChild('ul', {className: 'itemMenu'});

	//TODO item inventory
	for(var i = 0; i < 6; i++){
		this.item = this.itemMenu.createChild('li');
		this.itemSprite = this.item.createChild('img');
		this.itemSprite.rootElement.src = itemSpriteSrc;
	}
}

Player.prototype.updateFightTotal = function (fightTotal, partner){
	var sibling = null;

	if(partner === "Hansel"){
		sibling = "sister";
	} else if(partner === "Gretel") {
		sibling = "brother";
	}

	this.playerStatus.setText(fightTotal + " " + partner + "s are waiting for their " + sibling);
}

Player.prototype.joinFight = function(){
	var self = this;
	var credentials = { username: "anonymous" };
	
	mage.ident.login('anonymous', credentials, function (error, data) {
	    if (error) {
	        return window.alert(error);
	    }

	    console.log(data); // data -> player.

		mage.fight.joinFight(self.character, function (error, result) {
			if (error) {
				return console.error(error);
			}

			mage.archivist.get('fight', { fight: result.fight.fight }, null, function (error, tFight) {
				if (error) return console.error(error);

				self.openView(tFight);
				
				tFight.state.on("readable", function(){

					self.tFight = tFight;

					self.openView(self.tFight);
					
				});
			});
		});
	});
}

Player.prototype.openView = function(tFight){
	if(tFight.state.valueOf() == 'engaged'){
		window.navTree.open('gameView', {
			character: this.character,
			sibling: this.partner,
			playerNumber: this.playerNumber,
			tFight: tFight
		});
	}
}

Player.prototype.selectable = function (){
	this.on('tap', function () {
		if(!this.hasClassName('selected')){
			this.addClassNames('selected');
			this.ready.show();

		} else if (this.hasClassName('selected')){
			this.addClassNames('confirm');
			this.sibling.hide();
			this.playerItems.hide();
			this.ready.hide();
			this.playerStatus.setText('Loading...');

			this.joinFight();
		}

		if(this.sibling.hasClassName('selected')){
			this.sibling.delClassNames('selected');
			if(this.sibling.ready){
				this.sibling.ready.hide();
			}
		}
		
    });
}

function SelectView () {
	WuiView.call(this);

	var player1 = new Player(1);
	var player2 = new Player(2);

	player1.sibling = player2;
	player2.sibling = player1;

	mage.fight.getFightTotal(function(error, result){
		if(error){
			console.error("error", error);
			return;
		}

		player1.updateFightTotal(result.gretelFights, player1.partner);
		player2.updateFightTotal(result.hanselFights, player2.partner);

	});

	var stage = new Stage(player1, player2);
	
	this.appendChild(stage);

};

util.inherits(SelectView, WuiView);

module.exports = SelectView;

