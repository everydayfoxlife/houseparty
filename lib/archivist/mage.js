/**
 *
 */


//
exports.session = {
	index: ['actorId'],
	vaults: {
		client: {
			shard: function (value) {
				return value.index.actorId;
			}
		},
		// Please add one or more vault references here (they must support key expiration)
		volatileVault: {}
	}
};


//
exports.ucResponseMeta = {
	index: ['session'],
	vaults: {
		// Please add one or more vault references here (they must support key expiration)
		volatileVault: {}
	}
};


//
exports.ucResponseData = {
	index: ['session'],
	vaults: {
		// Please add one or more vault references here (they must support key expiration)
		volatileVault: {}
	}
};