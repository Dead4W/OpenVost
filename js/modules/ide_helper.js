/**
 * DO NOT inject anywhere
 * its use only for ignore PhpStorm error like chrome is unresolved variable
 */

const null_func = () => {}

const chrome = {
    downloads: {},
    notifications: {
        onClicked: {}
    },
    tabs: {
        sendMessage: null_func,
    },
    runtime: {
        getManifest: null_func,
        getURL: null_func,
        onMessage: {}
    },
    storage: {
        sync: {}
    },
};

const ShowLoading = null_func();
const HideLoading = null_func();