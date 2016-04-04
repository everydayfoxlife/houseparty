var mage = require('mage');
var mageLoader = require('mage-loader.js');
var util = require('util');
var WuiDom = require('WuiDom');
var WuiView = require('WuiView');
var wuiButtonBehavior = require('wuiButtonBehavior');

var inherits = util.inherits;

var Stage = require('Stage');

function GameView(){
	WuiView.call(this);

	var stage = new Stage();
	
	this.appendChild(stage);

	this.on('opened', function (param) {
		stage.playerSetup(param);
		
	});
}

util.inherits(GameView, WuiView);

module.exports = GameView;