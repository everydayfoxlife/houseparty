
var mage = require('mage');

exports.access = 'anonymous';
exports.params = ['fightId', 'character', 'partner'];

exports.execute = function (state, fightId, character, partner, cb) {
	mage.fight.getFight(state, fightId, function (error, fight) {
		if (error) {
			return state.error(error.message || error, error, cb);
		}

		state.respond(fight);

		return cb();
	});
};
