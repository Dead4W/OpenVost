ServiceTrackingElems = {

    imgCheckEpisode: chrome.runtime.getURL('img/cne.png'),
    imgCheckEpisodeGood: chrome.runtime.getURL('img/cne_good.png'),

    render: async function() {
        ServiceTrackingElems.addAnimeIdToStoryHead();

        const anime_infos = {};
        const storyShortElems = document.querySelectorAll('.shortstory');

        const promises = [];

        for (let i = 0; i < storyShortElems.length; i++) {
            const elem = storyShortElems[i];
            const anime_id = elem.dataset.id;

            promises.push(getAnimeInfo(anime_id).then((data) => {
                anime_infos[anime_id] = data;
            }));
        }

        await Promise.all(promises);

        ServiceTrackingElems.animeInfoTitlesBuetify(anime_infos).then();

        ServiceTrackingElems.addTrackedButtonToUserHeader().then();

        ServiceTrackingElems.addTrackedButtonToAnimeShortStoryHead().then(() => {
            ServiceTrackingElems.bindTrackButtons()
        });

        CONFIG_MANAGER.callbackIf(CONFIG_VAR.SHOW_STORYSHORT_OFFICIAL_SCREENSHORTS,
            async () => {
                await ServiceTrackingElems.animeAddOfficialScreenshots(anime_infos).then();
            },
            () => {
                document.querySelectorAll('.skrin-official').forEach((elem) => elem.remove());
            }
        );

        CONFIG_MANAGER.callbackIf(CONFIG_VAR.SHOW_STORYSHORT_POSTER_SCREENSHORTS,
            async () => {
                await ServiceTrackingElems.animeAddPosterScreenshots(anime_infos).then();
            },
            () => {
                document.querySelectorAll('.skrin-posters').forEach((elem) => elem.remove());
            }
        );
    },

    hasUser: function() {
        return document.getElementsByClassName('loginLinkZ').length;
    },

    animeAddOfficialScreenshots: async function(anime_infos) {
        const anime_ids = Object.keys(anime_infos);

        for (let i = 0; i < anime_ids.length; i++) {
            const anime_id = anime_ids[i];
            const anime_info = anime_infos[anime_id];

            // check is singe anime page
            if (document.querySelector('#playerbox') !== null) {
                continue;
            }

            ServiceTrackingElems._animeAddScreensots(anime_id, 'Скриншоты', anime_info['screenImage'], 'official')
        }
    },

    animeAddPosterScreenshots: async function(anime_infos) {
        const anime_ids = Object.keys(anime_infos);

        for (let i = 0; i < anime_ids.length; i++) {
            const anime_id = anime_ids[i];
            const episodes = await getAnimeEpisodes(anime_id);

            let posters = [];

            for (let j = 0; j < Math.min(3, episodes.length); j++) {
                posters.push(episodes[j]['preview']);
            }

            if (posters.length > 0) {
                ServiceTrackingElems._animeAddScreensots(anime_id, 'Постеры первых серий', posters, 'posters');
            }
        }
    },

    _animeAddScreensots(anime_id, title, image_links, type= 'official') {
        const screenshotsTitle = document.createElement('legend');
        screenshotsTitle.innerText = title;

        const screenshotsElem = document.createElement('fieldset');
        screenshotsElem.classList.add('skrin');
        screenshotsElem.classList.add('skrin-' + type);
        screenshotsElem.appendChild(screenshotsTitle);

        for (let i = 0; i < image_links.length; i++) {
            const image_link = image_links[i];

            const screenshotImage = document.createElement('img');
            screenshotImage.src = image_link;

            const screenshotElem = document.createElement('a');
            screenshotElem.href = image_link;
            screenshotElem.onclick = function () {
                return hs.expand(this)
            };

            screenshotElem.appendChild(screenshotImage);
            screenshotsElem.appendChild(screenshotElem);
        }

        const existScreenshots = document.querySelector(`.shortstory[data-id="${anime_id}"] .shortstoryContent .skrin`);

        if (existScreenshots) {
            if (type === 'official') {
                existScreenshots.before(screenshotsElem);
            } else {
                existScreenshots.after(screenshotsElem);
            }
        } else {
            document.querySelector(`.shortstory[data-id="${anime_id}"] .shortstoryContent table`).after(screenshotsElem);
        }
    },

    animeInfoTitlesBuetify: async function(anime_infos) {
        const anime_ids = Object.keys(anime_infos);

        for (let i = 0; i < anime_ids.length; i++) {
            const anime_id = +anime_ids[i];
            const anime_info = anime_infos[anime_id];
            const elem = document.querySelector(`.shortstory[data-id="${anime_id}"]`);

            let rating = (anime_info.rating / anime_info.votes * 2).toFixed(1);
            elem.querySelector('.current-rating').innerText = rating;
            elem.querySelector('.current-rating').style.width = rating*10 + '%';
            elem.querySelector('#vote-num-id-' + anime_id).parentElement.innerHTML = '(<span id="vote-num-id-' + anime_id + '">' + rating + '/10</span>)'
        }

        const classes_to_titles_map = {
            '.staticInfoRightSmotr': 'Посещений',
            '.staticInfoRight span a': 'Комментариев',
            '.staticInfoLeftData': 'Дата последнего обновления',
            '.staticInfoLeft span a': 'Многоликий человек-проект',
        };

        for (let class_name in classes_to_titles_map) {
            let title = classes_to_titles_map[class_name];
            let elems = document.querySelectorAll(class_name);

            for(let i = 0; i<elems.length; i++) {
                let elem = elems[i];
                let raw_text = elem.innerText.trim();

                if (raw_text === (parseInt(raw_text)).toString()) {
                    elem.innerHTML = new Intl.NumberFormat('ru-RU').format(+elem.innerText);
                    elem.title = title + ': ' + title.innerText;
                } else {
                    elem.title = title;
                }
            }
        }
    },

    addAnimeIdToStoryHead: function() {
        let shortstoryShareElems = document.getElementsByClassName('shortstoryHead');

        for(let i=0; i<shortstoryShareElems.length; i++) {
            let elem = shortstoryShareElems[i];
            elem.parentElement.dataset.id = elem.children[0].id.match(/fav-id-(\d+)/)[1];
        }
    },

    addTrackedButtonToAnimeShortStoryHead: async function() {
        if(!ServiceTrackingElems.hasUser()) {
            return;
        }

        let shortstoryShareElems = document.getElementsByClassName('shortstoryHead');

        for(let i=0; i<shortstoryShareElems.length; i++) {
            let elem = shortstoryShareElems[i].children[0];
            let parent = shortstoryShareElems[i];
            let anime_id = +elem.parentElement.parentElement.dataset.id;
            let isTracked = await ServiceTrackingStorage.existId(anime_id);

            let checkNewEpisode = document.createElement('img');
            checkNewEpisode.classList.add('checkNewEpisode');
            checkNewEpisode.title = isTracked ? 'Отключить уведомления' : 'Уведомлять о новых сериях';
            checkNewEpisode.src = isTracked ? ServiceTrackingElems.imgCheckEpisodeGood : ServiceTrackingElems.imgCheckEpisode;

            let checkNewEpisodeShortstory = document.createElement('a');
            checkNewEpisodeShortstory.classList.add('shortstoryShare');
            checkNewEpisodeShortstory.classList.add('checkNewEpisodeShortstory');
            checkNewEpisodeShortstory.dataset.id = anime_id.toString();
            checkNewEpisodeShortstory.dataset.status = isTracked;

            checkNewEpisodeShortstory.appendChild(checkNewEpisode);
            parent.insertBefore(checkNewEpisodeShortstory, parent.children[1] );
        }
    },

    addTrackedButtonToUserHeader: async function() {
        if(!ServiceTrackingElems.hasUser()) {
            return;
        }

        const trackedAnimeHeadLink = document.createElement('a');
        trackedAnimeHeadLink.classList.add('loginLinkZ');
        trackedAnimeHeadLink.classList.add('trackedAnimeHead');
        trackedAnimeHeadLink.href = ServiceTrackingPage.getTrackedLink();
        trackedAnimeHeadLink.style.paddingRight = "37px";

        document.getElementsByClassName('loginLinkZ')[0].style = '';

        document
            .getElementsByClassName('loginLink')[0]
            .insertBefore(
                trackedAnimeHeadLink,
                document.getElementsByClassName('loginExit')[0]
            );

        ServiceTrackingElems.refreshCounter().then();
    },

    refreshCounter: async function () {
        const trackList = await ServiceTrackingStorage.get();
        const countTrackList = Object.keys(trackList).length;

        document.getElementsByClassName('trackedAnimeHead')[0].title = 'Количество отслеживаемых аниме: ' + countTrackList;
        document.getElementsByClassName('trackedAnimeHead')[0].text = 'Отслеживаемые (' + countTrackList + ')';
    },

    refreshTrackButtonsState: async function () {
        const buttons = document.querySelectorAll('.checkNewEpisodeShortstory');

        for (let i = 0; i < buttons.length; i++) {
            const elem = buttons[i];
            const anime_id = +elem.dataset.id;

            elem.dataset.status = (await ServiceTrackingStorage.existId(anime_id)).toString();

            elem.children[0].src = elem.dataset.status === "true" ? ServiceTrackingElems.imgCheckEpisodeGood : ServiceTrackingElems.imgCheckEpisode;
        }
    },

    bindTrackButtons: async function() {
        const animeTrackIcons = document.getElementsByClassName('checkNewEpisodeShortstory');

        for(let i = 0; i<animeTrackIcons.length; i++) {
            let anime_tracking_button = animeTrackIcons[i];
            const anime_tracking_button_image = anime_tracking_button.children[0];

            anime_tracking_button_image.onmouseover = function(e) {
                let elem = e.currentTarget;
                elem.src = elem.parentElement.dataset.status === "true" ? ServiceTrackingElems.imgCheckEpisode : ServiceTrackingElems.imgCheckEpisodeGood;
            };
            anime_tracking_button_image.onmouseout = function(e) {
                let elem = e.currentTarget;
                elem.src = elem.parentElement.dataset.status === "true" ? ServiceTrackingElems.imgCheckEpisodeGood : ServiceTrackingElems.imgCheckEpisode;
            };

            anime_tracking_button.onclick = async function(e) {
                let elem = e.currentTarget;
                let anime_id = +elem.dataset.id;

                ShowLoadingEvent();

                let is_tracked = await ServiceTrackingStorage.existId(anime_id);

                if (is_tracked) {
                    await ServiceTrackingStorage.remove(anime_id);
                } else {
                    const episodes = await getAnimeEpisodes(anime_id);

                    let hash = Object.keys(episodes).join('-').replace(/\s+/g,'').hashCode();

                    await ServiceTrackingStorage.add(anime_id, hash);

                    await ServiceTrackingElems.refreshCounter();
                }

                await ServiceTrackingElems.refreshTrackButtonsState();
                await ServiceTrackingElems.refreshCounter();

                HideLoadingEvent();
            }
        }
    }
}