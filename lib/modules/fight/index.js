
var mage = require('mage');
var uuid = require('node-uuid');
var Tome = require('tomes').Tome;

// -------------------

var fights = {};
var hanselFights = 0;
var gretelFights = 0;

// -------------------

exports.setup = function (state, cb) {
	state.archivist.list('fight', {}, function (error, fightLobby) {
		if (error) {
			return cb(error);
		}
		// clear the whole database
		for (var i = 0; i < fightLobby.length; i++) {
			state.archivist.del('fight', { fight: fightLobby[i].fight });
		}
		return cb();
	});
};


function createFight(state, playerId, character, cb) {
	var fightId = uuid.v4();

	fights[fightId] = { fight: fightId, hansel: null, gretel: null, character: character, state: 'waiting' };

	if(character === "Hansel"){
		hanselFights++;
		fights[fightId].hansel = playerId;
	} else if (character === "Gretel"){
		gretelFights++;
		fights[fightId].gretel = playerId;
	}

	var tFight = Tome.conjure(fights[fightId]);

	state.archivist.set('fight', { fight: fightId }, tFight);

	return cb(null, { playerId: playerId, fight: tFight, hanselFights: hanselFights, gretelFights: gretelFights });

}

exports.joinFight = function (state, character, cb) {
	console.log('####################################### join fight ');
	var playerId = uuid.v4();

	mage.player.createPlayer(state, playerId, function(error, result) {
		var player = result.player;
		player.id = playerId;
		player.hp = 10;
		player.waitTime = 10;

		state.archivist.list('fight', {}, function (error, fightIds) {
			if (error) {
				return cb(error);
			}
			var queries = [];

			for (var i = 0; i < fightIds.length; i++) {
				queries.push({ topic: 'fight', index: { fight: fightIds[i].fight } });
			}

			state.archivist.mget(queries, null, function (error, fightLobby) {
				if (error) {
					return cb(error);
				}

				if (fightLobby.length > 0){

					for (var i = 0; i < fightLobby.length; i++){

						if(fightLobby[i].character.is(character) || fightLobby[i].state.is("engaged") ){
							continue;
						}

						if (!fightLobby[i].character.is(character) && fightLobby[i].state.is("waiting") ) {
							
							var fight = fightLobby[i];

							console.log('####################################### engaged');
							fight.set('state', 'engaged');

							if(fight.character.is("Hansel")){
								hanselFights--;
							} else if (fight.character.is("Gretel")){
								gretelFights--;
							}
							
							if(fight.hansel === null){
								fight.set('hansel', player.id);
							} else {
								fight.set('gretel', player.id);
							}
							
							return cb(null, { playerId: player.id, fight: fight });
						} 
					}
				}

				return createFight(state, player.id, character, cb);
		
			});
		});
	});

};

exports.getFights = function (state, cb) {
	state.archivist.list('fight', {}, cb);
};

exports.getFight = function (state, fightId, character, partner, cb) {
	state.archivist.get('fight', { fight: fightId, character: character, partner: partner, hanselFights: hanselFights, gretelFights: gretelFights }, null, cb);
};

exports.getFightTotal = function (state, cb) {
 	return cb(null, { hanselFights: hanselFights, gretelFights: gretelFights });
}
