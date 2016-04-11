
var mage = require('mage');

exports.access = 'anonymous';
exports.params = ['character'];


exports.execute = function (state, character, cb) {
	mage.fight.joinFight(state, character, function (error, result) {
		if (error) {
			return state.error(error.message || error, error, cb);
		}

		state.respond(result);


		return cb();
	});
};
