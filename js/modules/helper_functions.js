// *****************
// ****** Helpers
// *****************

String.prototype.hashCode = function() {
    let hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash + "_" + this.length;
};

function pad(num, length) {
    let s = num.toString();
    while (s.length < length) {
        s = "0" + s;
    }
    return s;
}

function generateString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

Array.prototype.remove = function(value) {
    let idx = this.indexOf(value);
    if (idx !== -1) {
        return this.splice(idx, 1);
    }
    return false;
};

// *****************
// ****** Worker event Helper
// *****************
WorkerEventHelper = {
    listeners: [],

    addListener: function (type, listener) {
        WorkerEventHelper.listeners[type] = listener;
    },

    _handleMessage: function (request, sender) {
        if (typeof(request.type) === "undefined") {
            return;
        }

        if (!WorkerEventHelper.listeners.hasOwnProperty(request.type)) {
            return;
        }

        WorkerEventHelper.listeners[request.type](request, sender);
    }
}
if (typeof(chrome.runtime) !== "undefined") {
    chrome.runtime.onMessage.addListener(WorkerEventHelper._handleMessage);
}


// *****************
// ****** Window event Helper
// *****************
WindowEventHelper = {
    listeners: {},

    addListener: function (type, listener) {
        WindowEventHelper.listeners[type] = listener;
    },

    _handleMessage: function (event) {
        if (event.type !== 'message') {
            return;
        }

        if (typeof(event.data.type) === "undefined") {
            return;
        }

        if (!WindowEventHelper.listeners.hasOwnProperty(event.data.type)) {
            return;
        }

        WindowEventHelper.listeners[event.data.type](event.data);
    }
}
if (typeof(window) !== "undefined") {
    window.addEventListener("message", WindowEventHelper._handleMessage);

    // loading functions
    function ShowLoadingEvent() {
        window.postMessage({
            "type": WINDOW_EVENTS.SHOW_LOADING,
        }, "*");
    }

    function HideLoadingEvent() {
        window.postMessage({
            "type": WINDOW_EVENTS.HIDE_LOADING,
        }, "*");
    }
}

async function injectScriptFile(file) {
    let s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    s.setAttribute('defer', "1");
    document.body.appendChild(s);

    return new Promise((resolve, _) => {
        s.onload = () => {
            resolve();
        };
    });
}

function isElementInViewportOrUpper(el) {
    const rect = el.getBoundingClientRect();

    if (rect.top < 0) {
        return true;
    }

    return rect.top - window.innerHeight <= 0;
}

function lastArr(arr) {
    return arr[arr.length - 1];
}