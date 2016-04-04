var mage = require('mage');
var mageLoader = require('mage-loader.js');
//var moment = require('moment');
var NavTree = require('NavTree');


// Attach gettext function to window
window.GetText = require('gettextlight');

// Override gettext function with our custom one. This will support defined replacing.
function getTextReplace(text, replaceObject) {
	replaceObject = replaceObject || {};
	for (var replaceKey in replaceObject) {
		if (!replaceObject.hasOwnProperty(replaceKey)) {
			continue;
		}
		text = text.split('%' + replaceKey + '%').join(replaceObject[replaceKey]);
	}
	return text;
}

window.GetText._gettext = window.GetText.gettext;
window.GetText.gettext = function (msgid, replaceObject) {
	return getTextReplace(window.GetText._gettext(msgid), replaceObject);
};

window.GetText._ngettext = window.GetText.ngettext;
window.GetText.ngettext = function (msgid, msgidPlural, n, replaceObject) {
	return getTextReplace(window.GetText._ngettext(msgid, msgidPlural, n), replaceObject);
};


// Function which loads gettext po file
function setupGetText(cb) {
	var po = mage.assets.getAsset('po/messages');
	if (!po) {
		return cb();
	}

	po.getContents(null, function (err, data) {
		if (err) {
			mage.logger.error('gettext loading failed, err:' + err);
			return window.alert('An error occurred. Please retry from the top page.');
		}

		var language = mage.getLanguage();
		window.GetText.loadDomain(language, data);
		window.GetText.textdomain(language);

		// Also setup moment.js
		//moment.lang(language);

		cb();
	});
}


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
	'assets'
);

// Application Modules
//mage.useModules(require,
// YOUR APPLICATION MODULES HERE
//);


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

	setupGetText(function () {
		// Render and Display main page
		var pageElm = mageLoader.injectHtml('main');
		mageLoader.displayPackage('main');

		// Create wui-navTree
		var mainNavTree = window.mainNavTree = new NavTree({ createOnFirstUse: false }, { parentElement: pageElm });

		// Register views to nav tree
		mainNavTree.register('mainView', new (require('MainView'))(), { create: true });
		mainNavTree.register('otherView', new (require('OtherView'))(), { create: true });

		// Open default view
		mainNavTree.open('mainView');

		// Setup auth error handler
		setupErrorHandlers();
	});
});