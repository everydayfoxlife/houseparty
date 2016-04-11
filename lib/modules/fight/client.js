
var mage = require('mage');

exports.setup = function (cb) {

	return cb();
};

exports.get = function (fightId, cb) {

	mage.fight.get(fightId, cb);

	return cb();
};

exports.create = function (fightId, cb) {

	mage.fight.createFight(fightId, function (error) {
		if (error) {
			exports.tome = null;
			return cb(error);
		}

		return cb();
	});
	
};
