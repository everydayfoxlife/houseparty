exports.fight = {
	index: ['fight'],
	vaults: {
		client: {
			shard: function (value) {
				return value && value.data && value.data.users && value.data.users.slice() || [];
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
				return value && value.data && value.data.users && value.data.users.slice() || [];
			}
		},
		userVault: {}
	}
};