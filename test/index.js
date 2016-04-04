var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
var async = require('async');
var path = require('path');

var SETUP_TIMEOUT = 90000;
var START_TIMEOUT = 90000;
var PHANTOM_TIMEOUT = 90000;

var phantomTestArray = [
	'phantom-test.js'
];

var now = Date.now();

var project;

function projectRequire(cb) {
	try {
		project = require('../lib');
		console.log('required in', Date.now() - now, 'msec');
		now = Date.now();
		return cb(null, project);
	} catch (e) {
		return cb(e);
	}
}

function projectSetup(project, cb) {
	var testTimeout = setTimeout(function () {
		console.log('setup timed out.');
		process.exit(1);
	}, SETUP_TIMEOUT);

	project.setup(function (error, apps) {
		console.log('setup in', Date.now() - now, 'msec');
		now = Date.now();

		// setting 'prebuild' to true tells MAGE to build the app during the
		// start phase instead of on every http request.

		for (var appId in apps) {
			apps[appId].prebuild = true;
		}

		clearTimeout(testTimeout);

		return cb(error, project);
	});
}

function projectStart(project, cb) {
	var testTimeout = setTimeout(function () {
		console.log('start timed out.');
		process.exit(1);
	}, START_TIMEOUT);

	project.start(function (error) {
		console.log('started in', Date.now() - now, 'msec');
		now = Date.now();

		clearTimeout(testTimeout);

		return cb(error, project);
	});
}

function phantomTest(filename, cb) {
	var testTimeout = setTimeout(function () {
		console.log(filename, 'timed out.');
		process.exit(1);
	}, PHANTOM_TIMEOUT);

	// Backwards compatibility
	var httpServer = project.mage.core.httpServer || project.mage.core.msgServer.getHttpServer();

	var address = httpServer.server.address();

	var childArgs = [ path.join(__dirname, filename), 'http://' + address.address + ':' + address.port ];

	console.log('executing', binPath, childArgs[0], childArgs[1]);

	childProcess.execFile(binPath, childArgs, function (error, stdout) {
		console.log(filename, 'ran in', Date.now() - now, 'msec');
		now = Date.now();
		console.log(stdout);

		clearTimeout(testTimeout);

		return cb(error);
	});
}

function phantomTests(project, cb) {
	async.eachSeries(phantomTestArray, phantomTest, function (error) {
		return cb(error, project);
	});
}

async.waterfall([
	projectRequire,
	projectSetup,
	projectStart,
	phantomTests
], function (error, project) {
	var exitCode = error ? 1 : 0;

	if (error) {
		console.error(error);
	}

	console.log('Exiting with code:', exitCode);

	if (project) {
		return project.quit(exitCode);
	}

	process.exit(exitCode);
});