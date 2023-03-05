importScripts(
	'/js/modules/consts.js',
	'/js/modules/helper_functions.js',
	'/js/modules/api_methods.js',
	'/js/modules/helper_config.js',
	'/js/modules/helper_config_observer.js',
	'/js/services/tracking/storage.js',
);

const good_video_link_by_episodes = {};

WorkerEventHelper.addListener(WORKER_EVENTS.DOWNLOAD_FILE, function(request, _) {
	chrome.downloads.download({
		url: request.options.url,
		filename: request.options.filename
	});
});

let latest_job = null;

WorkerEventHelper.addListener(WORKER_EVENTS.CHECK_VIDEOLINKS, async function(request, sender) {
	let current_job = latest_job = generateString(8);
	let episode_id = request.options.episode_id;

	if (!good_video_link_by_episodes.hasOwnProperty(episode_id)) {
		good_video_link_by_episodes[episode_id] = [];
	}

	if (good_video_link_by_episodes[episode_id].length > 0) {
		let videolinks = good_video_link_by_episodes[episode_id];

		for (let i = 0; i < videolinks.length; i++) {
			chrome.tabs.sendMessage(sender['tab']['id'],
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
				if (good_video_link_by_episodes[episode_id].indexOf(videolink) === -1) {
					good_video_link_by_episodes[episode_id].push(videolink);
				}

				chrome.tabs.sendMessage(sender['tab']['id'],
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
		if (good_video_link_by_episodes[episode_id].length === 0) {
			console.warn('[OpenVost] error find servers');
			chrome.tabs.sendMessage(sender['tab']['id'],
				{
					type: WORKER_EVENTS.BAD_FIND_SERVERS,
					id: episode_id
				}
			);
		}
	})
});

async function checkNewEpisodes() {
	const animes = await getLastAnimes();

	animes.reverse();

	for (let i = 0; i < animes.length; i++) {
		let anime_data = animes[i];
		let anime_id = anime_data['id'];

		let old_hash = await ServiceTrackingStorage.getHashById(anime_id);

		if (old_hash === false) {
			continue;
		}

		let new_series = anime_data['series'] === "" ? [] : JSON.parse(anime_data['series'].replaceAll('\'', '"'));

		let new_hash = Object.keys(new_series).join('-').replace(/\s+/g,'').hashCode();

		if (old_hash === new_hash) {
			continue;
		}

		// important, first save info about new hash
		ServiceTrackingStorage.add(anime_id, new_hash).then();

		chrome.notifications.create(
			`openvost_${anime_id}_${new_hash}`,
			{
				type: "basic",
				title: "Залит новый эпизод",
				message: "На странице " + anime_data['title'].replace(/\[.+/, ''),
				iconUrl: anime_data['urlImagePreview'],
			},
		);
	}
}

chrome.notifications.onClicked.addListener(
	(notificationId) => {
		[_, anime_id, hash] = notificationId.split('_');
		chrome.tabs.create({'url': `https://animevost.org/${anime_id}-openvost-redirect.html`}, function(tab) {});
	}
);

checkNewEpisodes().then();
setInterval(checkNewEpisodes, 1000 * 60 * 5);