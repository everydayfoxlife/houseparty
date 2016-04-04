var util = require('util');
var WuiView = require('WuiView');


function MainView() {
	WuiView.call(this);

	this.createChild('div', { text: 'This is the main view' });
	var button = this.createChild('button', { text: 'Another View' });
	button.allowDomEvents();
	button.on('dom.touchend', function () {
		window.mainNavTree.open('otherView');
	});
}

util.inherits(MainView, WuiView);
module.exports = MainView;