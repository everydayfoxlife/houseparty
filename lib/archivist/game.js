exports.fight = {
	index: ['fight'],
	vaults: {
		client: {
			shard: function (value) {
				var users = [];
				value.data.users.forEach(function (user) {
					users.push(user);
				});
				return value.data.users.slice();
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
				var users = [];
				value.data.users.forEach(function (user) {
					users.push(user);
				});
				return value.data.users.slice();
			}
		},
		userVault: {}
	}
};