var mage = require('mage');

exports.setup = function (cb) {
	cb();
};

exports.initTome = function (playerId, cb) {
	mage.archivist.get('player', { playerId: playerId }, function (error, tPlayer) {
		if (error) {
			return cb(error);
		}

		mage.ident.user = tPlayer;
		return cb();
	});
};
