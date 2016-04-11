var fs = require('fs');
var mage = exports.mage = require('mage');
var less = require('component-less');

// MAGE Modules
mage.useModules([
	'archivist',
	'assets',
	'dashboard',
	'ident',
	'logger',
	'session',
	'time'
]);

// Application Modules
mage.addModulesPath('./lib/modules');
mage.useModules([
	'fight',
	'user',
	'player'
]);

//
function createHouseParty(app) {
	var indexPage = app.addIndexPage('loader', './www/houseParty/');
	indexPage.routes.push('/houseParty');

	// Setup component plugins
	app.on('build-component', function (builder) {
		// less for css
		builder.use(less);
	});

	// Load all specified packages as components
	var packages = fs.readdirSync('./www/houseParty/packages');
	packages.forEach(function (pkgName) {
		var pkgStats = fs.lstatSync('./www/houseParty/packages/' + pkgName);
		if (!pkgStats.isDirectory()) {
			return;
		}

		indexPage.registerComponent(pkgName, './www/houseParty/packages/' + pkgName);
	});
}

//
function mageSetup(cb) {
	mage.setup(function (error, apps) {
		if (error) {
			return cb(error);
		}

		// Timezone configuration
		var timezone = mage.core.config.get('timezone');

		if (!timezone) {
			return cb(new Error('You MUST specify the timezone of the application in your configuration'));
		}

		process.env.TZ = timezone;

		//
		createHouseParty(apps.houseParty);

		//
		cb();
	});
}


// We can setup the project with this.
exports.setup = function (cb) {
	// Backward compatibility
	if (mage.cli) {
		mage.cli.run();
	}

	mageSetup(cb);
};


// We can start the project with this.
exports.start = function (cb) {
	cb = cb || function () {};
	mage.start(cb);
};


// We can quit the project with this.
exports.quit = function (exitCode) {
	mage.quit(exitCode);
};
