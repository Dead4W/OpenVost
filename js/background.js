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

audio = document.createElement('audio');
audio.src = chrome.extension.getURL('lib/sound_push.wav');
audio.volume = 0.13;

function getAnimeTrackindex(list,id) {
    for( i in list ) {
        if( list[i].id === id ) {
            return i;
        }
    }
    return undefined;
}

function checkAnime(list,index) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://api.animevost.org/animevost/api/v0.2/GetInfo/" + list[index], false);
    xhr.send();
    var result = JSON.parse(xhr.responseText);
    var episodes = JSON.parse(result.data[0].series.replace(/'/g,'"'));
    var episodesNames = [];
    for( name in episodes ) {
        episodesNames.push(name);
    }
    episodesNames = episodesNames.join('-');
    chrome.storage.sync.get(['animeTrackList'],function(data) {
        var animeTrackIndex = getAnimeTrackindex(data.animeTrackList,list[index]);
        if( animeTrackIndex !== undefined && data.animeTrackList[ animeTrackIndex ].status && episodesNames.hashCode() !== data.animeTrackList[ animeTrackIndex ].hash ) {
            var notification = new Notification("Залит новый эпизод", {
                body: "На странице " + result.data[0].title + "\r\nБыл залит новый эпизод",
                icon: result.data[0].urlImagePreview.match(/^http/) ? result.data[0].urlImagePreview : "http://animevost.org" + result.data[0].urlImagePreview,
            });
            audio.play();
            notification.onclick = function () {
                window.open("http://animevost.org/" + list[index] + "-openvost-redirect.html");
                notification.close();
            };
            data.animeTrackList[ animeTrackIndex ].hash = episodesNames.hashCode();
            chrome.storage.sync.set({animeTrackList:data.animeTrackList});
        }
    });
    if( index+1<list.length ) {
        setTimeout(function() {
            checkAnime(list,index+1);
        },500);
    } else {
        main();
    }
}

function main() {
    chrome.storage.sync.get(['animeTrackList'],function(data) {
        var animeListGood = [];
        for( i in data.animeTrackList ) {
            if( data.animeTrackList[i].status ) {
                animeListGood.push(data.animeTrackList[i].id);
            }
        }
        if( animeListGood.length ) {
            checkAnime(animeListGood,0);
        }
    });
}

setTimeout(main,5000);