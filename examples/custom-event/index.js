var cn = require('../../');
var h = require('../../').h;

require('./custom-events')();

var state = cn.state({
	droppedData: cn.value(null),
	isDroppable: cn.value(false),
	channels: {
		enableDroppable: enableDroppable,
		disableDroppable: disableDroppable,
		updateDroppedData: updateDroppedData
	}
});

function enableDroppable(state) {
	state.isDroppable.set(true);
}

function disableDroppable(state) {
	state.isDroppable.set(false);
}

function updateDroppedData(state, data) {
	state.droppedData.set(data);
	disableDroppable(state);
}

function render(state) {
	return h('dl.dropzone' + (state.isDroppable ? '.is-droppable' : ''), {
		'ev-dragover': cn.send.dragover(state.channels.enableDroppable),
		'ev-dragleave': cn.send.dragleave(state.channels.disableDroppable),
		'ev-drop': cn.send.drop(state.channels.updateDroppedData)
	}, state.droppedData ? [
		h('dt', 'URL:'),
		h('dd', h('pre', state.droppedData.url || '-')),
		h('dt', 'Text:'),
		h('dd', h('pre', state.droppedData.text || '-')),
		h('dt', 'Files:'),
		h('dd', h('pre', JSON.stringify(state.droppedData.files, null, 2)))
	] : h('h1', 'Drop stuff here'));
};

cn(document.body, state, render);