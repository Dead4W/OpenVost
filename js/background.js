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

var storageSync = chrome.storage.sync;

var current_version_hash = 'UDFm0kG2Rn';

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://openvost.org/version', true);
xhr.onload = function() {
	if ( xhr.readyState === 4 && xhr.status == 200 ) {
		let saveData;
		data = JSON.parse(xhr.responseText);
		if( data.hash !== current_version_hash ) {
			console.log('new');
			saveData = {
				version_new: true,
				version_new_url: data.url
			}
		} else {
			console.log('old');
			saveData = {
				version_new: false,
				version_new_url: ''
			}
		}
		storageSync.set(saveData);
	}
}
xhr.setRequestHeader('Cache-Control', 'no-cache');
xhr.send();


var audio = document.createElement('audio');
audio.src = chrome.extension.getURL('lib/sound_push.wav');
audio.volume = 0.13;

var option_optimization = false;

var videolinks = {};
chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.type === "download_file") {
        chrome.downloads.download({
            url: request.options.url,
            filename: request.options.filename
        });
    } else if(request.type === 'check_videolinks') {
		let sendResponse = function(response) {
			if( response.status == 'ok' ) {
				chrome.tabs.executeScript(sender.tab.id, {code:'injectScript(\'addVideoUrl(' + response.id + ',"' + response.videolink + '")\');'});
			} else if ( response.status == 'error' ) {
				chrome.tabs.executeScript(sender.tab.id, {code:'injectScript(\'badFindServers(' + response.id + ')\');'});
			}
		}
		let id = request.options.id;
		let badServers = 0;
		let goodServers = false;
		let checkUrlServerRequest = function(videolink) {
			let xhr = new XMLHttpRequest();
			xhr.open('HEAD', videolink, true);
			xhr.timeout = 15000;
			if( !videolink.match(/drek\./) ) {
				xhr.setRequestHeader('Cache-Control', 'no-cache');
			}
			let xhr_error = function() {
				badServers++;
				if( badServers >= videolinksEpisode.length && !goodServers ) {
					console.warn('[OpenVost] error find servers');
					sendResponse({
						status: "error",
						id: id,
						videolink: ""
					});
				}
			};
			xhr.onload = function (e) {
				if ( xhr.readyState === 4 && xhr.status == 200 ) {
					sendResponse({
						status: "ok",
						id: id,
						videolink: videolink
					});
					goodServers = true;
				} else {
					xhr_error();
				}
			};
			xhr.onerror = xhr_error;
			xhr.ontimeout = xhr_error;
						
			xhr.send(null);
		};
		
        if( typeof(videolinks[id]) !== undefined ) {
			var videoservers = [
				"http://video.aniland.org/{%ID%}.mp4",
				"http://tk.aniland.org/{%ID%}.mp4",
				"http://new.aniland.org/{%ID%}.mp4",
				"http://fast.aniland.org/{%ID%}.mp4",
				"http://mp4.aniland.org/{%ID%}.mp4",
				"http://s.aniland.org/{%ID%}.mp4",
				"http://s0.aniland.org/{%ID%}.mp4",
				"http://s1.aniland.org/{%ID%}.mp4",
				"http://s2.aniland.org/{%ID%}.mp4",
				"http://ram.aniland.org/{%ID%}.mp4",
			];
			
			var videolinksEpisode = [];
			for( var i =0;i<videoservers.length;i++ ) {
				videolinksEpisode.push(videoservers[i].replace(/{%ID%}/,id));
				if( !option_optimization ) {
					videolinksEpisode.push(videoservers[i].replace(/{%ID%}/,'720/' + id));
				}
			}
			
			let xhr_api = new XMLHttpRequest();
			xhr_api.open('POST', 'https://api.animevost.org/v1/videolinks', true);
			xhr_api.onload = function() {
				if( xhr_api.readyState == 4 && xhr_api.status == 200 ) {
					let videolinksApi = JSON.parse(xhr_api.responseText);
					for( let videoLinkObjName in videolinksApi ) {
						if( videoLinkObjName === "hdlinks" && option_optimization ) {
							continue;
						}
						let videoLinkObj = videolinksApi[videoLinkObjName];
						for( var i =0;i<videoLinkObj.length;i++ ) {
							if( videolinksEpisode.indexOf(videoLinkObj[i]) === -1 && !videoLinkObj[i].match(/:hls:/) ) {
								checkUrlServerRequest(videoLinkObj[i]);
							}
						}
					}
				}
			};
			xhr_api.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr_api.send('id=' + id);
		} else {
			videolinksEpisode = videolinks[id];
		}

		for( var i =0;i<videolinksEpisode.length;i++ ) {
			checkUrlServerRequest(videolinksEpisode[i]);
		}
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
    {
		urls: ["*://video.aniland.org/*", "*://ram.aniland.org/*", "*://s2.aniland.org/*", "*://s1.aniland.org/*", "*://s0.aniland.org/*", "*://s.aniland.org/*", "*://mp4.aniland.org/*", "*://fast.aniland.org/*", "*://new.aniland.org/*", "*://tk.aniland.org/*", "*://drek.cdn.zerocdn.com/*"]
	},
    ["responseHeaders","blocking"]);


function checkAnime() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://api.animevost.org/v1/last?page=1&quantity=" + (option_optimization ? 10 : 20), true);
	xhr.onload = function (e) {
	  if (xhr.readyState === 4) {
		if (xhr.status !== 200) {
		  console.error(xhr.statusText);
		}
		var result = JSON.parse(xhr.responseText);
		result.data.reverse();

		storageSync.get(['animeTrackList'],function(data) {
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
			storageSync.set({animeTrackList:data.animeTrackList});
		});
	  }
	};
    xhr.send();
}

function checkTrackListThenCheckAnime() {
	storageSync.get(['animeTrackList','option_optimization'],function(data) {
		if( typeof(data.animeTrackList) !== undefined && data.animeTrackList.length ) {
			checkAnime();
		}
		if( typeof(data.option_optimization) !== "undefined" ) {
			option_optimization = data.option_optimization;
		}
		setTimeout(checkTrackListThenCheckAnime,( option_optimization ? 600000 : 60000 ));
	});
}

chrome.storage.sync.get(['option_optimization'],function(data) {
	checkTrackListThenCheckAnime();
});