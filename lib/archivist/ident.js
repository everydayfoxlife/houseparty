/**
 *
 */


//
exports.ident = {
	index: ['userId'],
	vaults: {
		client: {
			shard: function (value) {
				return value.index.userId;
			}
		},
		userVault: {}
	}
};


//
exports.mageUsernames = {
	index: ['username'],
	vaults: {
		userVault: {}
	}
};