var util = require('util');
var WuiView = require('WuiView');


function OtherView() {
	WuiView.call(this);

	this.createChild('div', { text: 'This is the other view' });
	var button = this.createChild('button', { text: 'Main View' });
	button.allowDomEvents();
	button.on('dom.touchend', function () {
		window.mainNavTree.open('mainView');
	});
}

util.inherits(OtherView, WuiView);
module.exports = OtherView;