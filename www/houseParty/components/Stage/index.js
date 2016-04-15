var inherit = require('util').inherits;
var WuiDom = require('WuiDom');
var util = require('util');

var inherits = util.inherits;

var Interface = require('Interface');
var Enemy = require('Enemy');
var Player = require('GamePlayer');

function Stage(){
	WuiDom.call(this, 'div', { className: 'battle' });

	this.currPlayer = null;

	this.player1 = new Player();
	this.player2 = new Player();

	this.enemy = new Enemy();
	this.appendChild(this.enemy);

	this.players = this.createChild('div', { className: 'players' });

	this.players.appendChild(this.player1);
	this.players.appendChild(this.player2);
}

inherits(Stage, WuiDom);
module.exports = Stage;

Stage.prototype.playerSetup = function(param){
	console.log("test", param.tFight);

	if(param.playerNumber === 1){
		this.currPlayer = this.player1;
		this.currPlayer.set(param.character, param.playerNumber);
		this.player2.set(param.sibling, 2);
	} else if(param.playerNumber === 2){
		this.currPlayer = this.player2;
		this.currPlayer.set(param.character, param.playerNumber);
		this.player1.set(param.sibling, 1);
	}

	this.playerInterface = new Interface(this.currPlayer, this.player1, this.player2);
	this.appendChild(this.playerInterface);
}