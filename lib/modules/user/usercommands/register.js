
var mage = require('mage');

exports.access = 'anonymous';
exports.params = ['username', 'password'];

exports.execute = function (state, username, password, cb) {
	mage.user.registerUserGuest(state, username, password, function (error, tUser) {
		if (error) {
			return state.error(error.message || error, error, cb);
		}

		return cb();
	});
};
