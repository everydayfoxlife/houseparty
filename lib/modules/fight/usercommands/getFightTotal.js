
var mage = require('mage');

exports.access = 'anonymous';
exports.params = [];

exports.execute = function (state, cb) {
	mage.fight.getFightTotal(state, function (error, fightTotal) {
		if (error) {
			return state.error(error.message || error, error, cb);
		}

		state.respond(fightTotal);

		return cb();
	});
};
