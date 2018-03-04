String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash + "_" + this.length;
};

var audio = document.createElement('audio');
audio.src = chrome.extension.getURL('lib/sound_push.wav');
audio.volume = 0.13;

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

    chrome.storage.sync.get(['animeTrackList'],function(data) {
        if( !data.animeTrackList.length ) return;
        for( var i = 0;i<result.data.length;i++ ) {
            let animeLast = result.data[i];

            let episodes = JSON.parse(animeLast.series.replace(/'/g,'"'));
            let episodesNames = [];
            for( name in episodes ) {
                episodesNames.push(name.toString());
            }
            episodesNames = episodesNames.join('-').replace(/\s+/g,'');

            let animeTrackIndex = getAnimeTrackindex(data.animeTrackList,animeLast.id);
            if( animeTrackIndex === undefined ) continue;

            if( animeTrackIndex !== undefined && data.animeTrackList[ animeTrackIndex ].status && episodesNames.hashCode() !== data.animeTrackList[ animeTrackIndex ].hash ) {

                let notification;

                if( first === false ) {
                    notification = new Notification("Залит новый эпизод", {
                        body: "На странице " + animeLast.title,
                        icon: animeLast.urlImagePreview.match(/^http/) ? animeLast.urlImagePreview : "http://animevost.org" + animeLast.urlImagePreview,
                    });
                    notification.onclick = function () {
                        window.open("http://animevost.org/" + animeLast.id + "-openvost-redirect.html");
                        this.close();
                    };

                    audio.play();
                } else if( first === true ) {
                    notification = new Notification("Похоже, вышло пару серий, пока вас не было", {
                        body: "В последнее время был залит новый эпизод",
                        icon: animeLast.urlImagePreview.match(/^http/) ? animeLast.urlImagePreview : "http://animevost.org" + animeLast.urlImagePreview,
                    }).onclick = function () {
                        window.open("http://animevost.org/tracked/");
                        this.close();
                    };

                    audio.play();

                    first = 'notificated';
                }

                data.animeTrackList[ animeTrackIndex ].hash = episodesNames.hashCode();
            }
        }
        first = false;
        chrome.storage.sync.set({animeTrackList:data.animeTrackList});
    });
}

var first = true;

setInterval(checkAnime,60000);