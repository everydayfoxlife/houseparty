var async = require('async');

exports.up = function (vault, cb) {
	async.series([
		function (callback) {
			vault.createTable('ident', [
				{ name: 'userId', type: 'VARCHAR(36) NOT NULL UNIQUE', pk: true },
				{ name: 'mediaType', type: 'VARCHAR(255) NOT NULL' },
				{ name: 'value', type: 'BLOB NOT NULL' }
			], callback);
		},
		function (callback) {
			vault.createTable('userIdent', [
				{ name: 'username', type: 'VARCHAR(255) NOT NULL UNIQUE', pk: true },
				{ name: 'mediaType', type: 'VARCHAR(255) NOT NULL' },
				{ name: 'value', type: 'BLOB NOT NULL' }
			], callback);
		}
	], function (error) {
		cb(error, {
			summary: 'Created `ident` and `userIdent` tables'
		});
	});
};

exports.down = function (vault, cb) {
	async.series([
		function (callback) {
			vault.dropTable('userIdent', callback);
		},
		function (callback) {
			vault.dropTable('ident', callback);
		}
	], function (error) {
		cb(error, {
			summary: 'Removed `ident` and `userIdent` tables'
		});
	});
};