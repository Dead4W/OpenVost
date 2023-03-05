// OPENVOST_SCRIPT_TYPE = 'UNDEFINED TYPE';
//
// if (typeof(chrome.runtime) !== "undefined" && typeof(window) !== "undefined") {
//     OPENVOST_SCRIPT_TYPE = 'main';
// } else if (typeof(chrome.runtime) === "undefined" && typeof(window) !== "undefined") {
//     OPENVOST_SCRIPT_TYPE = 'inject';
// } else if (typeof(chrome.runtime) !== "undefined" && typeof(window) === "undefined") {
//     OPENVOST_SCRIPT_TYPE = 'background';
// }

if (typeof(chrome.storage) !== "undefined") {
    manifestData = chrome.runtime.getManifest();
    current_version = manifestData.version;
}

videoservers = [
    // new servers
    "https://static.trn.su/{%ID%}.mp4",
    "https://hd.trn.su/{%ID%}.mp4", // 720 only
    "https://ram.trn.su/{%ID%}.mp4",
    "https://video.animetop.info/{%ID%}.mp4",

    // old servers
    "https://video.aniland.org/{%ID%}.mp4",
    "https://ram.aniland.org/{%ID%}.mp4",
];

WORKER_EVENTS = {
    CHECK_VIDEOLINKS: 'check_videolinks',
    DOWNLOAD_FILE: 'download_file',
    BAD_FIND_SERVERS: 'bad_find_servers',
    ADD_VIDEOLINK: 'add_videolink',
}

WINDOW_EVENTS = {
    BAD_FIND_SERVERS: 'bad_find_servers',
    ADD_VIDEOLINK: 'add_videolink',
    SHOW_LOADING: 'show_loading',
    HIDE_LOADING: 'hide_loading',
}

PLAYER_STATE = {
    STOPPED: 0,
    PLAYING: 1,
    PAUSED: 2,
    LOADING: 3,
}