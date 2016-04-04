var assert = require('assert');


window.describe('helloworld', function () {
	it('Can echo hello world', function (done) {
		console.log('Hello World!!!');
		return done();
	});

	it('Can assert true', function (done) {
		assert(true);
		return done();
	});
});