var extend = require('xtend/mutable');
var main = require('main-loop');
var vdom = {
    create: require('virtual-dom/vdom/create-element'),
    diff: require('virtual-dom/vtree/diff'),
    patch: require('virtual-dom/vdom/patch')
};

var copernicium = module.exports = extend(init, {

    // State
    array: require('observ-array'),
    struct: require('observ-struct'),
    value: require('observ'),
    varhash: require('observ-varhash'),
    state: createState,

    // Events
    BaseEvent: require('value-event/base-event'),
    Delegator: require('dom-delegator'),
    listenTo: listenTo,
    send: extend(require('value-event/event'), {
        change: require('value-event/change'),
        click: require('value-event/click'),
        key: require('value-event/key'),
        submit: require('value-event/submit'),
        value: require('value-event/value')
    }),
    channels: createChannels,

    // Render
    h: require('virtual-dom/virtual-hyperscript'),
    partial: require('vdom-thunk')

});

function init(el, state, render, options) {
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

function listenTo(eventName, sendFn) {
    if (copernicium.send[eventName]) { throw new Error('"' + eventName + '" event is already defined.'); }

    copernicium.Delegator().listenTo(eventName);
    copernicium.send[eventName] = (sendFn.name == 'EventHandler') ? sendFn : copernicium.BaseEvent(sendFn);

    return copernicium;
}