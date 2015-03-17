var extend = require('xtend/mutable');
var main = require('main-loop');
var vdom = {
    create: require('virtual-dom/vdom/create-element'),
    diff: require('virtual-dom/vtree/diff'),
    patch: require('virtual-dom/vdom/patch')
};

module.exports = extend(copernicium, {

    // State
    state: createState,
    array: require('observ-array'),
    struct: require('observ-struct'),
    value: require('observ'),
    varhash: require('observ-varhash'),

    // Events
    channels: createChannels,
    Delegator: require('dom-delegator')
    send: require('value-event/event'),
    sendChange: require('value-event/change'),
    sendClick: require('value-event/click'),
    sendKey: require('value-event/key'),
    sendSubmit: require('value-event/submit'),
    sendValue: require('value-event/value'),

    // Render
    h: require('virtual-dom/virtual-hyperscript'),
    partial: require('vdom-thunk')

});

function copernicium(el, state, render, options) {
    if (!el) { throw new Error('Element does not exist.'); }

    copernicium.Delegator(options);

    var loop = main(state(), render, extend({}, vdom, options));

    el.appendChild(loop.target);

    return state(loop.update);
}

function createChannels(channels, context) {
    return Object.keys(channels).reduce(createHandle, {});

    function createHandle(acc, name) {
        var handle = copernicium.Delegator.allocateHandle(channels[name].bind(null, context));

        acc[name] = handle;
        return acc;
    }
}

function createState(stateObj) {
    var copy = extend({}, stateObj);
    var channelsObj = copy.channels;

    if (channelsObj) {
        copy.channels = copernicium.value(null);
    }

    var state = copernicium.struct(copy);

    if (channelsObj) {
        state.channels.set(createChannels(channelsObj, state));
    }

    return state;
}