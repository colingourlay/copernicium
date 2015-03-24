var cn = require('../../');

function App() {
	return cn.state({
		isOn: cn.value(false),
		channels: App.channels
	});
};

App.channels = {
	toggle: function toggle(state) {
		state.isOn.set(!state.isOn());
	}
};

App.render = function render(state) {
	return cn.h('button.' + (state.isOn ? 'on' : 'off'), {
		'ev-click': cn.send.click(state.channels.toggle, {})
	}, state.isOn ? 'ON' : 'OFF');
};

cn(document.body, App(), App.render);