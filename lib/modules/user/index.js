
var mage = require('mage');
var Tome = require('tomes').Tome;

var IDENT_ENGINE_GUEST = 'gameUsersGuests';


function createUserTome(state, userId) {
	var newUser = {
		id: userId,
		name: userId,
		gamesNumber: 1
	};

	var tNewUser = Tome.conjure(newUser);
	state.archivist.set('user', { userId: userId }, tNewUser);

	return tNewUser;
}


exports.setup = function (state, cb) {
	return cb();
};

exports.registerUserGuest = function (state, username, password, cb) {
	var credentials = {
		username: username,
		password: password
	};

	var engine = mage.ident.getEngine(IDENT_ENGINE_GUEST);

	engine.createUser(state, credentials, username, function (error, userId) {
		if (error) {
			return cb(error);
		}

		var tUser = createUserTome(state, userId);
		console.log('====== engine.createUser ===== ', tUser.gamesNumber.valueOf());

		return cb(null, tUser);
	});
};

exports.getUser = function (state, userId, cb) {
	state.archivist.get('user', { userId: userId }, cb);
};


// -------------------------------------


