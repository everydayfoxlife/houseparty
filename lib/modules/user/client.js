var mage = require('mage');

exports.setup = function (cb) {
	cb();
};

exports.initTome = function (userId, cb) {
	mage.archivist.get('user', { userId: userId }, function (error, tUser) {
		if (error) {
			return cb(error);
		}

		mage.ident.user = tUser;
		return cb();
	});
};

exports.register = function (username, password, cb) {
	mage.user.ucRegister(username, password, function (error) {
		if (error) {
			return cb(error);
		}

		exports.login(username, password, cb);
	});
};
