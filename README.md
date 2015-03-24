# copernicium

A unidirectional frontend framework, based on github.com/Raynos/mercury, with the following features:

* Observable app state
* Reactive rendering using a virtual DOM
* Event dispatching via channels

Used correctly, you can implement an app with a unidirectional loop:

```
initial state ---> render view ---> dispatch events
                      ^                    |
                      |                    |
                      +--- update state <--+
```

## Usage

Here's a minimal app that contains an on/off button that you can toggle by pressing it:

```js
var cn = require('copernicium');

cn(
	// Root - node the app will be rendered inside
	document.body,
	// State - an observable, immutable model
	cn.state({
		isOn: cn.value(false),
		// Channels - can receive events & data from the DOM
		channels: {
			toggle: function (state) {
				state.isOn.set(!state.isOn());
			}
		}
	}),
	// Render function - creates a virtual DOM used to patch the real DOM
	function (state) {
		return cn.h('button', {
			// Delegated UI events that are sent to channels
			'ev-click': cn.send.click(state.channels.toggle, {})
		}, state.isOn ? 'ON' : 'OFF');
	}
);
```

## Example Apps

To try the any of the examples (including the minimal app above) in the `examples/` directory:

`$ npm run example <dirname>`

To get a listing of available examples:

`$ npm run example`