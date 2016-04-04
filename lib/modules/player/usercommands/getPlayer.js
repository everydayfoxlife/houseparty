var mage = require('mage');

exports.access = 'anonymous';
exports.params = ['playerId', 'hp', 'waitTime'];

exports.execute = function (state, playerId, hp, waitTime, cb) {
	mage.player.getPlayer(state, playerId, hp, waitTime, function (error, result) {
		if (error) {
			return state.error(error.message || error, error, cb);
		}

		state.respond(result);
		return cb();

	});
};
