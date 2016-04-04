var SCREENSHOT_DELAY = 100;

var pathToScreenshots = 'test/screenshots/';

function screenshotter(page, name, cb) {
	var filename = [ name, '-', Math.floor(Date.now() / 1000), '.png' ];
	var out = pathToScreenshots.concat(filename.join(''));

	setTimeout(function () {
		page.render(out);

		console.log('Saved screenshot of', name, 'to', out);

		if (typeof cb === 'function') {
			cb();
		}
	}, SCREENSHOT_DELAY);
}

module.exports = screenshotter;
