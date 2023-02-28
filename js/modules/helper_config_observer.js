
let empty_callback = () => {};

CONFIG_OBSERVER = {
    _GOOD: 'good',
    _BAD: 'bad',

    _registeredCallbackIf: {},

    register: function (name, callback=empty_callback, callback_else=empty_callback) {
        if (!CONFIG_OBSERVER._registeredCallbackIf.hasOwnProperty(name)) {
            CONFIG_OBSERVER._registeredCallbackIf[name] = {};
            CONFIG_OBSERVER._registeredCallbackIf[name][CONFIG_OBSERVER._GOOD] = [];
            CONFIG_OBSERVER._registeredCallbackIf[name][CONFIG_OBSERVER._BAD] = [];
        }

        if (
            callback !== empty_callback
            && CONFIG_OBSERVER._registeredCallbackIf[name][CONFIG_OBSERVER._GOOD].indexOf(callback) === -1) {
            CONFIG_OBSERVER._registeredCallbackIf[name][CONFIG_OBSERVER._GOOD].push(callback);
        }

        if (
            callback_else !== empty_callback
            && CONFIG_OBSERVER._registeredCallbackIf[name][CONFIG_OBSERVER._BAD].indexOf(callback_else) === -1) {
            CONFIG_OBSERVER._registeredCallbackIf[name][CONFIG_OBSERVER._BAD].push(callback_else);
        }
    }
}

let observer_is_worked = false;

setInterval(async () => {
    if (observer_is_worked === true) {
        return;
    }

    observer_is_worked = true;

    try {
        for (let name in CONFIG_OBSERVER._registeredCallbackIf) {
            await CONFIG_MANAGER.get(name);
        }

        const edit_values = CONFIG_MANAGER.getEditNames();

        for (let name in edit_values) {
            if (!CONFIG_OBSERVER._registeredCallbackIf.hasOwnProperty(name)) {
                continue;
            }

            let value = edit_values[name];

            let callback_key = value ? CONFIG_OBSERVER._GOOD : CONFIG_OBSERVER._BAD;

            if (!CONFIG_OBSERVER._registeredCallbackIf[name].hasOwnProperty(callback_key)) {
                continue;
            }

            let callbacks = CONFIG_OBSERVER._registeredCallbackIf[name][callback_key];

            for (let i = 0; i < callbacks.length; i++) {
                await callbacks[i]();
            }
        }
    } finally {
        observer_is_worked = false;
    }
}, 100);