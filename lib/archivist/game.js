exports.fight = {
	index: ['fight'],
	vaults: {
		client: {
			shard: function (value) {
				return '*';
			}
		},
		userVault: {}
	}
};

exports.player = {
	index: ['playerId'],
	vaults: {
		client: {
			shard: function (value) {
				return '*';
			}
		},
		userVault: {}
	}
};