var mage = require('mage');

exports.access = 'anonymous';
exports.params = ['playerId'];

exports.execute = function (state, playerId, cb) {
	mage.player.createPlayer(state, playerId, function (error, player) {
		if (error) {
			return state.error(error.message || error, error, cb);
		}

		state.respond(player);
		return cb();

	});
};
