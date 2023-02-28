CONFIG_VAR = {
    SHOW_STORYSHORT_OFFICIAL_SCREENSHORTS: 'SHOW_STORYSHORT_OFFICIAL_SCREENSHORTS',
    SHOW_STORYSHORT_POSTER_SCREENSHORTS: 'SHOW_STORYSHORT_POSTER_SCREENSHORTS',
}

CONFIG_CASTS = {
    BOOLEAN_TYPE: (x) => {return !!x},
}

CONFIG_VAR_CASTS = {};
CONFIG_VAR_CASTS[CONFIG_VAR.SHOW_STORYSHORT_OFFICIAL_SCREENSHORTS] = CONFIG_CASTS.BOOLEAN_TYPE;
CONFIG_VAR_CASTS[CONFIG_VAR.SHOW_STORYSHORT_POSTER_SCREENSHORTS] = CONFIG_CASTS.BOOLEAN_TYPE;

CONFIG_VAR_DEFAULT = {};
CONFIG_VAR_DEFAULT[CONFIG_VAR.SHOW_STORYSHORT_OFFICIAL_SCREENSHORTS] = true;
CONFIG_VAR_DEFAULT[CONFIG_VAR.SHOW_STORYSHORT_POSTER_SCREENSHORTS] = true;

CONFIG_VAR_TITLES = {};
CONFIG_VAR_TITLES[CONFIG_VAR.SHOW_STORYSHORT_OFFICIAL_SCREENSHORTS] = 'Показывать стандартные скриншоты';
CONFIG_VAR_TITLES[CONFIG_VAR.SHOW_STORYSHORT_POSTER_SCREENSHORTS] = 'Показывать скриншоты из серий';

CONFIG_MANAGER = {
    _current_values: {},
    _edit_values: {},

    getEditNames: function() {
        const result = CONFIG_MANAGER._edit_values;
        for (let name in CONFIG_MANAGER._edit_values) {
            CONFIG_MANAGER._current_values[name] = CONFIG_MANAGER._edit_values[name];
        }

        CONFIG_MANAGER._edit_values = {};

        return result;
    },

    callbackIf: async function (name, callback=empty_callback, callback_else=empty_callback) {
        const value = await CONFIG_MANAGER.get(name);

        CONFIG_OBSERVER.register(name, callback, callback_else);

        if (value) {
            callback();
        } else {
            callback_else();
        }
    },

    get: async function (name) {
        const value = CONFIG_MANAGER.cast(
            name,
            (await storageSync.get(name))[name]
        );

        // monitoring editing values for observer
        if (name in CONFIG_MANAGER._current_values) {
            if (name in CONFIG_MANAGER._edit_values && CONFIG_MANAGER._edit_values[name] === value) {
                delete CONFIG_MANAGER._edit_values[name];
            } else if (CONFIG_MANAGER._current_values[name] !== value) {
                CONFIG_MANAGER._edit_values[name] = value;
            }
        }

        // save actual value if not exist
        if (!CONFIG_MANAGER._current_values.hasOwnProperty(name)) {
            CONFIG_MANAGER._current_values[name] = value;
        }

        return value;
    },

    set: function (name, value) {
        value = CONFIG_MANAGER.cast(name, value);

        let save_data = {};

        save_data[name] = value;

        // save name of edited value
        if (name in CONFIG_MANAGER._current_values && CONFIG_MANAGER._current_values[name] !== value) {
            CONFIG_MANAGER._edit_values[name] = value;
        }

        // save actual value if not exist
        if (!CONFIG_MANAGER._current_values.hasOwnProperty(name)) {
            CONFIG_MANAGER._current_values[name] = value;
        }

        storageSync.set(save_data);
    },

    cast: function (name, value) {
        if (typeof(value) === "undefined" && name in CONFIG_VAR_DEFAULT) {
            value = CONFIG_VAR_DEFAULT[name];
        }

        if (name in CONFIG_VAR_CASTS) {
            value = CONFIG_VAR_CASTS[name](value);
        }

        return value;
    },
}