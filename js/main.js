// highlight js config
hs.graphicsDir = '/engine/classes/highslide/graphics/';
hs.outlineType = 'rounded-white';
hs.numberOfImagesToPreload = 0;
hs.showCredits = false;

hs.lang = {
	loadingText :     'Загрузка...',
	playTitle :       'Просмотр слайдшоу (пробел)',
	pauseTitle:       'Пауза',
	previousTitle :   'Предыдущее изображение',
	nextTitle :       'Следующее изображение',
	moveTitle :       'Переместить',
	closeTitle :      'Закрыть (Esc)',
	fullExpandTitle : 'Развернуть до полного размера',
	restoreTitle :    'Кликните для закрытия картинки, нажмите и удерживайте для перемещения',
	focusTitle :      'Сфокусировать',
	loadingTitle :    'Нажмите для отмены'
};

hs.align = 'center';
hs.transitions = ['expand', 'crossfade'];
hs.addSlideshow({
	interval: 4000,
	repeat: false,
	useControls: true,
	fixedControls: 'fit',
	overlayOptions: {
		opacity: .75,
		position: 'bottom center',
		hideOnMouseOut: true
	}
});

async function loadModules() {
	const promises = [];

	promises.push(injectScriptFile(chrome.runtime.getURL('/js/modules/consts.js')));
	promises.push(injectScriptFile(chrome.runtime.getURL('/js/modules/helper_functions.js')));

	return Promise.all(promises);
}


document.addEventListener("DOMContentLoaded", function() {
	const loadModulesPromise = loadModules()
		.then(() => {
			return injectScriptFile(chrome.runtime.getURL('/js/inject.js'))
		});

	if (document.querySelector('.login')) {
		// fix user link (404 error)
		const user_link_elem = document.querySelector('.login').children[2];
		user_link_elem.href = user_link_elem.href.toLowerCase();
	}

	//player inject
    if( location.pathname.match(/tip\/[^\/]+\/\d+-/) ) {
		WorkerEventHelper.addListener(WORKER_EVENTS.ADD_VIDEOLINK, (data) => {
			window.postMessage({
				"type": WINDOW_EVENTS.ADD_VIDEOLINK,
				"id": parseInt(data.id),
				"videolink": data.videolink,
			}, "*");
		});

		WorkerEventHelper.addListener(WORKER_EVENTS.BAD_FIND_SERVERS, (data) => {
			window.postMessage({
				"type": WINDOW_EVENTS.BAD_FIND_SERVERS,
				"id": parseInt(data.id),
			}, "*");
		});

		WindowEventHelper.addListener('FROM_PAGE_TO_OPENVOST_CHECK_SERVERS', (data) => {
			let id = +data.id;

			chrome.runtime.sendMessage({type: "check_videolinks", options: {
				type: "basic",
				episode_id: id,
			}});
		});

		WindowEventHelper.addListener('FROM_PAGE_TO_OPENVOST_DOWNLOAD_FILE', (data) => {
			chrome.runtime.sendMessage({type: "download_file", options: {
				type: "basic",
				url: data.url,
				filename: data.filename
			}});
		});

        // change id for player block cause origin js overwrite custom player randomly
        document.querySelector('#anime').id = 'openvost_anime';
        document.querySelector('#player2').id = 'openvost_player2';

		async function injectScripts() {
			await injectScriptFile(chrome.runtime.getURL('/js/vendors/HLS.js'));
			return injectScriptFile(chrome.runtime.getURL('js/openAnime.js'));
		}

		loadModulesPromise.then(() => {
			return injectScripts();
		});
    }

	ServiceTrackingPage.render().then(() => {
		return ServiceTrackingElems.render();
	});
});