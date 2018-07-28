String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash + "_" + this.length;
};

var audio = document.createElement('audio');
audio.src = chrome.extension.getURL('lib/sound_push.wav');
audio.volume = 0.13;

chrome.runtime.onMessage.addListener(function(request) {
    if (request.type === "download_file") {
        chrome.downloads.download({
            url: request.options.url,
            filename: request.options.filename
        });
    }
});

Array.prototype.remove = function(value) {
    var idx = this.indexOf(value);
    if (idx !== -1) {
        return this.splice(idx, 1);
    }
    return false;
};
function getAnimeTrackindex(list,id) {
    var i;
    for( i in list ) {
        if( list[i].id === id ) {
            return i;
        }
    }
    return undefined;
}

chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        if( details.url.match(/\?openvost_savemoment/) ) {
            for( var i = 0;i<details.responseHeaders.length;i++ ) {
                if( details.responseHeaders[i].name.toLowerCase() === "location" ) {
                    var params = details.url.match(/\?(.+)/)[1];
                    details.responseHeaders[i].value = details.responseHeaders[i].value + '?' + params;
                    break;
                }
            }
        }
        return {responseHeaders: details.responseHeaders};
    },
    {urls: ["*://*.aniland.org/*", "*://*.zerocdn.com/*"]},
    ["responseHeaders","blocking"]);


function checkAnime() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://api.animevost.org/v1/last?page=1&quantity=20", false);
    xhr.send();

    var result = JSON.parse(xhr.responseText);
    result.data.reverse();

    chrome.storage.sync.get(['animeTrackList'],function(data) {
        if( !data.animeTrackList.length ) return;

        for( var i = 0;i<result.data.length;i++ ) {
            let animeLast = result.data[i];

            let episodes = animeLast.series === "" ? [] : JSON.parse(animeLast.series.replace(/'/g,'"'));
            let episodesNames = [];
            for( name in episodes ) {
                episodesNames.push(name.toString());
            }
            episodesNames = episodesNames.join('-').replace(/\s+/g,'');

            let animeTrackIndex = getAnimeTrackindex(data.animeTrackList,animeLast.id);
            if( animeTrackIndex === undefined ) continue;

            if( animeTrackIndex !== undefined && data.animeTrackList[ animeTrackIndex ].status && episodesNames.hashCode() !== data.animeTrackList[ animeTrackIndex ].hash ) {
                let notification;

                notification = new Notification("Залит новый эпизод", {
                    body: "На странице " + animeLast.title,
                    icon: animeLast.urlImagePreview.match(/^http/) ? animeLast.urlImagePreview : "http://animevost.org" + animeLast.urlImagePreview,
                });
                notification.onclick = function () {
                    window.open("http://animevost.org/" + animeLast.id + "-openvost-redirect.html");
                    this.close();
                };

                audio.play();

                //update anime episodes hash for monitoring
                data.animeTrackList[ animeTrackIndex ].hash = episodesNames.hashCode();

                //update position anime in tracked list
                let currentAnimeInfo = data.animeTrackList[ animeTrackIndex ];
                data.animeTrackList.remove(data.animeTrackList[ animeTrackIndex ]);
                data.animeTrackList.push(currentAnimeInfo);
            }
        }
        chrome.storage.sync.set({animeTrackList:data.animeTrackList});
    });
}

chrome.storage.sync.get(['animeTrackList'],function(data) {
    if( typeof(data.animeTrackList) !== undefined && data.animeTrackList.length ) {
        setInterval(checkAnime,60000);
    }
});