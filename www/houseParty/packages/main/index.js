
var mage = require('mage');
var mageLoader = require('mage-loader.js');
var NavTree = require('NavTree');
var SelectView = require('SelectView');
var GameView = require('GameView');

window.globals = {};

// Disable elastic scroll on iOS devices
document.addEventListener('touchmove', function (e) {
	e.preventDefault();
}, false);


// Disable re-orientation when rotating iOS devices
window.addEventListener('orientationchange', function () {
	if (window.orientation === -90) {
		document.body.className = 'orientright';
	}
	if (window.orientation === 90) {
		document.body.className = 'orientleft';
	}
	if (window.orientation === 0) {
		document.body.className = '';
	}
}, true);


// MAGE modules
mage.useModules(require,
	'time',
	'logger',
	'session',
	'archivist',
	'ident'
);

// Application Modules
mage.useModules(require,
	'user',
	'fight'
);


function setupErrorHandlers() {
	mage.eventManager.on('io.error.auth', function () {
		// We are trying to do something on the server that we are not allowed to do.
		// Should we re-authenticate?

		mage.logger.debug('Authentication error');
	});

	mage.eventManager.on('io.error.busy', function () {
		// You can't run two user commands in parallel, in order to protect ourselves from race
		// conditions on our servers and databases.

		mage.logger.error('IO busy error');
	});

	mage.eventManager.on('io.error.network', function () {
		// We could not complete the user command call to the server due to a network glitch,
		// let's retry in 4 seconds.

		window.setTimeout(function () {
			mage.logger.verbose('Resending...');

			mage.httpServer.resend();
		}, 4000);
	});
}


mage.setup(function (error) {
	if (error) {
		return window.alert('Setup failed');
	}

	// Render and Display main page
	var pageElm = mageLoader.injectHtml('main');
	mageLoader.displayPackage('main');

	// Create wui-navTree
	var navTree = window.navTree = new NavTree({ createOnFirstUse: false }, { parentElement: pageElm });

	// Register views to nav tree
	navTree.register('selectView', new SelectView(), { create: true });
	//navTree.register('gameView', new GameView(), { create: true });

	// Open default view
	navTree.open('selectView');

	// Setup auth error handler
	setupErrorHandlers();
});

