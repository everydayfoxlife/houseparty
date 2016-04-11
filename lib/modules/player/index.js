var mage = require('mage');
var Tome = require('tomes').Tome;
var uuid = require('node-uuid');

// -------------------------------------

var players = {};

exports.setup = function (state, cb) {
	state.archivist.list('player', {}, function (error) {
		if (error) {
			return cb(error);
		}
		return cb();
	});
};

exports.getPlayer = function (state, playerId, cb) {

	state.archivist.get('player', { playerId: playerId }, null, function(error) {
		if (error) {
			return cb(error);
		}
		return cb();
	});

};

exports.createPlayer = function(state, playerId, cb){
	var player = { id: playerId, hp: 10, waitTime: 10 };

	players[playerId] = player;

	var tPlayer = Tome.conjure(players[playerId]);

	state.archivist.set('player', { playerId: playerId }, tPlayer);

	return cb(null, { player: tPlayer });
}