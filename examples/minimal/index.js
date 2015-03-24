var cn = require('../../');

cn(
	document.body,
	cn.state({
		isOn: cn.value(false),
		channels: {
			toggle: function (state) {
				state.isOn.set(!state.isOn());
			}
		}
	}),
	function (state) {
		return cn.h('button', {
			'ev-click': cn.send.click(state.channels.toggle, {})
		}, state.isOn ? 'ON' : 'OFF');
	}
);