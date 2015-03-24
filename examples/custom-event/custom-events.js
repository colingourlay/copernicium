var cn = require('../../');
var extend = require('xtend');

module.exports = function addCustomEvents() {
    cn.listenTo('dragover', dragoverEvent);
    cn.listenTo('dragleave', dragleaveEvent);
    cn.listenTo('drop', dropEvent);
};

function dragoverEvent(ev, broadcast) {
    bubbled.call(this, ev);

    if (ev._rawEvent.dataTransfer) {
        ev._rawEvent.dataTransfer.dropEffect = 'copy';
    }

    broadcast(this.data);
}

function dragleaveEvent(ev, broadcast) {
    bubbled.call(this, ev);

    if (ev._rawEvent.dataTransfer) {
        ev._rawEvent.dataTransfer.dropEffect = 'none';
    }

    broadcast(this.data);
}

function dropEvent(ev, broadcast) {
    bubbled.call(this, ev);

    if (ev._rawEvent.dataTransfer) {
        return broadcast(extend({
            url: ev._rawEvent.dataTransfer.getData('URL'),
            text: ev._rawEvent.dataTransfer.getData('Text'),
            files: Array.prototype.slice.call(ev._rawEvent.dataTransfer.files)
        }, this.data));
    }

    broadcast(this.data);
}

function bubbled(ev) {
	if (ev.stopPropagation) {
        ev.stopPropagation();
    }

    if (ev.preventDefault) {
        ev.preventDefault();
    }
}