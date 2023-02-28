WindowEventHelper.addListener(WINDOW_EVENTS.SHOW_LOADING, function () {
    // call native page function
    ShowLoading();
});

WindowEventHelper.addListener(WINDOW_EVENTS.HIDE_LOADING, function () {
    // call native page function
    HideLoading();
});

WindowEventHelper.addListener(WINDOW_EVENTS.ADD_VIDEOLINK, function (data) {
    addVideoUrl(data.id, data.videolink);
});

WindowEventHelper.addListener(WINDOW_EVENTS.BAD_FIND_SERVERS, function (data) {
    badFindServers(data.id);
});
