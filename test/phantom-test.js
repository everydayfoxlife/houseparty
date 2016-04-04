var page = require('webpage').create();
var system = require('system');
var ss = require('./screenshotter');

var clientHost = system.args[1];

if (!clientHost) {
	console.error('clientHost missing.');
	phantom.exit(1);
}

var PHANTOM_TIMEOUT = 60000;

var testTimeout = setTimeout(function () {
	console.error('Timed out.');
	phantom.exit(1);
}, PHANTOM_TIMEOUT);

function exit(msg) {
	clearTimeout(testTimeout);

	if (msg) {
		console.error(msg);
		return phantom.exit(1);
	}

	phantom.exit(0);
}

page.open(clientHost + '/app/test', function (status) {
	if (status !== 'success') {
		exit(status);
	}

	ss(page, 'test-start');

	page.onConsoleMessage = function (msg) {
		var m = msg.match(/^__PHANTOM__:(.+)$/);
		if (!m) {
			// suppress console messages, unless they were targeted at PhantomJS
			return;
		}

		var data;

		try {
			data = JSON.parse(m[1]);
		} catch (error) {
			console.error('JSON parse error on: ' + m[1]);
			return exit(2);
		}

		if (data.hasOwnProperty('msg')) {
			console.log(data.msg);
		}

		if (data.hasOwnProperty('exit')) {
			return ss(page, 'test-end', function () {
				exit(data.exit);
			});
		}
	};

});
