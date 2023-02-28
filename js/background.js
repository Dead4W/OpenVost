importScripts(
	'/js//modules/consts.js',
	'/js/modules/helper_functions.js',
	'/js/modules/api_methods.js',
	'/js/modules/helper_config.js',
	'/js/modules/helper_config_observer.js',
);

const good_videolink_by_episodes = {};

WorkerEventHelper.addListener(WORKER_EVENTS.DOWNLOAD_FILE, function(request, sender) {
	chrome.downloads.download({
		url: request.options.url,
		filename: request.options.filename
	});
});

let latest_job = null;

WorkerEventHelper.addListener(WORKER_EVENTS.CHECK_VIDEOLINKS, async function(request, sender) {
	let current_job = latest_job = generateString(8);
	let anime_id = request.options.anime_id;
	let episode_id = request.options.episode_id;

	if (!good_videolink_by_episodes.hasOwnProperty(episode_id)) {
		good_videolink_by_episodes[episode_id] = [];
	}

	if (good_videolink_by_episodes[episode_id].length > 0) {
		let videolinks = good_videolink_by_episodes[episode_id];

		for (let i = 0; i < videolinks.length; i++) {
			chrome.tabs.sendMessage(sender.tab.id,
				{
					type: WORKER_EVENTS.ADD_VIDEOLINK,
					id: episode_id,
					videolink: videolinks[i]
				}
			);
		}
		return;
	}

	let videolinksToCheck = [];
	// check 720p first
	for(let i = 0; i<videoservers.length; i++) {
		videolinksToCheck.push(videoservers[i].replace(/{%ID%}/,'720/' + episode_id));
	}

	// then low quality
	for(let i = 0; i<videoservers.length; i++) {
		videolinksToCheck.push(videoservers[i].replace(/{%ID%}/, episode_id));
	}

	let promises = [];

	for (let i = 0; i < videolinksToCheck.length; i++) {
		let videolink = videolinksToCheck[i];

		let request_promise = checkVideolink(videolink).then((result) => {
			if (latest_job !== current_job) {
				// ignore if job id has been changed
				return;
			}

			if (result) {
				if (good_videolink_by_episodes[episode_id].indexOf(videolink) === -1) {
					good_videolink_by_episodes[episode_id].push(videolink);
				}

				chrome.tabs.sendMessage(sender.tab.id,
					{
						type: WORKER_EVENTS.ADD_VIDEOLINK,
						id: episode_id,
						videolink: videolink
					}
				);
			}
		});

		promises.push(request_promise);
	}

	Promise.all(promises).then(() => {
		if (good_videolink_by_episodes[episode_id].length === 0) {
			console.warn('[OpenVost] error find servers');
			chrome.tabs.sendMessage(sender.tab.id,
				{
					type: WORKER_EVENTS.BAD_FIND_SERVERS,
					id: episode_id
				}
			);
		}
	})
});


// function getAnimeTrackindex(list,id) {
//     var i;
//     for( i in list ) {
//         if( list[i].id === id ) {
//             return i;
//         }
//     }
//     return undefined;
// }
//
// async function checkNewEpisodes() {
// 	const response = fetch("https://api.animevost.org/v1/last?page=1&quantity=20", {
// 		cache: 'no-cache',
// 	});
//
// 	if (!response.ok) {
// 		return;
// 	}
//
// 	const result = response.json();
// 	result.data.reverse();
//
// 	const animeTrackList = await storageSync.get(['animeTrackList']);
//
// 	if( !animeTrackList.animeTrackList.length ) return;
//
// 	for(let i = 0; i<result.data.length; i++) {
// 		let animeLast = result.data[i];
//
// 		let episodes = animeLast.series === "" ? [] : JSON.parse(animeLast.series.replace(/'/g,'"'));
// 		let episodesNames = [];
// 		for( name in episodes ) {
// 			episodesNames.push(name.toString());
// 		}
// 		episodesNames = episodesNames.join('-').replace(/\s+/g,'');
//
// 		let animeTrackIndex = getAnimeTrackindex(animeTrackList.animeTrackList,animeLast.id);
// 		if( animeTrackIndex === undefined ) continue;
//
// 		if( animeTrackList.animeTrackList[animeTrackIndex].status && episodesNames.hashCode() !== animeTrackList.animeTrackList[ animeTrackIndex ].hash ) {
// 			let notification;
//
// 			notification = new Notification("Залит новый эпизод", {
// 				body: "На странице " + animeLast.title,
// 				icon: animeLast.urlImagePreview.match(/^http/) ? animeLast.urlImagePreview : "http://animevost.org" + animeLast.urlImagePreview,
// 			});
// 			notification.onclick = function () {
// 				window.open("https://animevost.org/" + animeLast.id + "-openvost-redirect.html");
// 				this.close();
// 			};
//
// 			//update anime episodes hash for monitoring
// 			animeTrackList.animeTrackList[ animeTrackIndex ].hash = episodesNames.hashCode();
//
// 			//update position anime in tracked list
// 			let currentAnimeInfo = animeTrackList.animeTrackList[ animeTrackIndex ];
// 			animeTrackList.animeTrackList.remove(animeTrackList.animeTrackList[ animeTrackIndex ]);
// 			animeTrackList.animeTrackList.push(currentAnimeInfo);
// 		}
// 	}
// 	storageSync.set({animeTrackList:animeTrackList.animeTrackList});
// }
//
// function checkStorageThenCheckNewEpisodes() {
// 	storageSync.get(['animeTrackList'],function(data) {
// 		if( typeof data.animeTrackList !== 'undefined' && data.animeTrackList.length ) {
// 			checkNewEpisodes();
// 		}
// 	});
// }
//
// checkStorageThenCheckNewEpisodes();
// setTimeout(checkStorageThenCheckNewEpisodes, 60000);