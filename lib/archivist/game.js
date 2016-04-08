exports.fight = {
	index: ['fight'],
	vaults: {
		client: {
			shard: function (value) {
				var users = [];
				value.data.users.forEach(function (user) {
					users.push(user);
				});
				return users;
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
				return users;
			}
		},
		userVault: {}
	}
};