
var mage = require('mage');

exports.access = 'anonymous';

exports.execute = function (state, cb) {
	mage.fight.createFight(state, function (error, fightId, character, partner) {
		if (error) {
			return state.error(error.message || error, error, cb);
		}

		state.respond(fightId, character, partner);

		return cb();
	});
};
