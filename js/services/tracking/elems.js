ServiceTrackingElems = {

    imgCheckEpisode: chrome.runtime.getURL('img/cne.png'),
    imgCheckEpisodeGood: chrome.runtime.getURL('img/cne_good.png'),

    render: async function(storyShortElems = null) {
        ServiceTrackingElems.addAnimeIdToStoryHead(storyShortElems);

        const anime_infos = {};

        const promises = [];

        for (let i = 0; i < storyShortElems.length; i++) {
            const elem = storyShortElems[i];
            const anime_id = elem.dataset.id;

            promises.push(getAnimeInfo(anime_id).then((data) => {
                anime_infos[anime_id] = data;
            }));
        }

        await Promise.all(promises);

        ServiceTrackingElems.animeInfoTitlesBuetify(storyShortElems, anime_infos).then();

        ServiceTrackingElems.addTrackedButtonToUserHeader().then();

        ServiceTrackingElems.addTrackedButtonToAnimeShortStoryHead(storyShortElems).then(() => {
            ServiceTrackingElems.bindTrackButtons(storyShortElems)
        });

        CONFIG_MANAGER.callbackIf(CONFIG_VAR.SHOW_STORYSHORT_OFFICIAL_SCREENSHORTS,
            async () => {
                await ServiceTrackingElems.animeAddOfficialScreenshots(anime_infos).then();
            },
            () => {
                document.querySelectorAll('.skrin-official').forEach((elem) => elem.remove());
            }
        ).then();

        CONFIG_MANAGER.callbackIf(CONFIG_VAR.SHOW_STORYSHORT_POSTER_SCREENSHORTS,
            async () => {
                await ServiceTrackingElems.animeAddPosterScreenshots(anime_infos).then();
            },
            () => {
                document.querySelectorAll('.skrin-posters').forEach((elem) => elem.remove());
            }
        ).then();
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
                let preview_url = episodes[j]['preview'].replace('http:', 'https:');

                posters.push(preview_url);
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

    animeInfoTitlesBuetify: async function(storyShortElems, anime_infos) {
        for (let i = 0; i < storyShortElems.length; i++) {
            const storyShortElem = storyShortElems[i];
            const anime_id = +storyShortElem.dataset.id;
            const anime_info = anime_infos[anime_id];

            let rating = (anime_info['rating'] / anime_info['votes'] * 2).toFixed(1);

            if (storyShortElem.querySelector('.current-rating')) {
                storyShortElem.querySelector('.current-rating').innerText = rating;
                storyShortElem.querySelector('.current-rating').style.width = rating*10 + '%';
            }

            const vote_num_id = document.createElement('span');
            vote_num_id.id = "vote-num-id-" + anime_id.toString();
            vote_num_id.innerText = rating.toString() + '/10';

            const vote_num_parent = storyShortElem.querySelector('#vote-num-id-' + anime_id).parentElement;

            vote_num_parent.innerHTML = '';
            vote_num_parent.appendChild(vote_num_id);

            const classes_to_titles_map = {
                '.staticInfoRightSmotr': 'Посещений',
                '.staticInfoRight span a': 'Комментариев',
                '.staticInfoLeftData': 'Дата последнего обновления',
                '.staticInfoLeft span a': 'Многоликий человек-проект',
            };

            for (let class_name in classes_to_titles_map) {
                let title = classes_to_titles_map[class_name];
                let replace_elem = storyShortElem.querySelector(class_name);

                if (!replace_elem) {
                    continue;
                }

                let raw_text = replace_elem.innerText.trim();

                if (raw_text === (parseInt(raw_text)).toString()) {
                    replace_elem.innerText = new Intl.NumberFormat('ru-RU').format(+raw_text);
                    replace_elem.title = title + ': ' + replace_elem.innerText;
                } else {
                    replace_elem.title = title;
                }
            }
        }
    },

    addAnimeIdToStoryHead: function(storyShortElems) {
        for(let i=0; i<storyShortElems.length; i++) {
            let storyShortElem = storyShortElems[i];
            let elem = storyShortElem.querySelector('.shortstoryHead');
            elem.parentElement.dataset.id = elem.children[0].id.match(/fav-id-(\d+)/)[1];
        }
    },

    addTrackedButtonToAnimeShortStoryHead: async function(storyShortElems) {
        if(!ServiceTrackingElems.hasUser()) {
            return;
        }

        for(let i=0; i<storyShortElems.length; i++) {
            let storyShortElem = storyShortElems[i];
            let parent = storyShortElem.querySelector('.shortstoryHead');
            let anime_id = +storyShortElem.dataset.id;
            let isTracked = await ServiceTrackingStorage.existId(anime_id);

            let checkNewEpisode = document.createElement('img');
            checkNewEpisode.classList.add('checkNewEpisode');
            checkNewEpisode.title = isTracked ? 'Отключить уведомления' : 'Уведомлять о новых сериях';
            checkNewEpisode.src = isTracked ? ServiceTrackingElems.imgCheckEpisodeGood : ServiceTrackingElems.imgCheckEpisode;

            let checkNewEpisodeShortstory = document.createElement('a');
            checkNewEpisodeShortstory.classList.add('shortstoryShare');
            checkNewEpisodeShortstory.classList.add('checkNewEpisodeShortstory');
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

    refreshTrackButtonState: async function (anime_id) {
        const elem = document.querySelector(`.shortstory[data-id="${anime_id}"] .checkNewEpisodeShortstory`);

        elem.dataset.status = (await ServiceTrackingStorage.existId(anime_id)).toString();

        elem.children[0].src = elem.dataset.status === "true" ? ServiceTrackingElems.imgCheckEpisodeGood : ServiceTrackingElems.imgCheckEpisode;
    },

    bindTrackButtons: async function(storyShortElems) {
        for(let i = 0; i<storyShortElems.length; i++) {
            let storyShortElem = storyShortElems[i];
            let anime_tracking_button = storyShortElem.querySelector('.checkNewEpisodeShortstory');
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
                let anime_id = +storyShortElem.dataset.id;

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

                await ServiceTrackingElems.refreshTrackButtonState(anime_id);
                await ServiceTrackingElems.refreshCounter();

                HideLoadingEvent();
            }
        }
    }
}