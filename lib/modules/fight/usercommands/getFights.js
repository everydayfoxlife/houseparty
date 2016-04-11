
var mage = require('mage');

exports.access = 'anonymous';
exports.params = [];

exports.execute = function (state, cb) {
	mage.fight.getFights(state, function (error, fights) {
		if (error) {
			return state.error(error.message || error, error, cb);
		}

		state.respond(fights);

		return cb();
	});
};
