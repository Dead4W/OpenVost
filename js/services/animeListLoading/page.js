

animeListLoadingPage = {

    _enabled: true,
    _current_page: 1,

    PAGE_DETECTOR_ELEM_CLASS: "page-detector-elem",

    render: function (page = 1) {
        animeListLoadingPage._current_page = page;

        CONFIG_MANAGER.callbackIf(CONFIG_VAR.LAZY_LOAD_ANIME_LIST,
            async () => {
                animeListLoadingPage._enabled = true;
            },
            () => {
                animeListLoadingPage._enabled = false;
            }
        ).then();

        CONFIG_MANAGER.callbackIf(CONFIG_VAR.MOVE_PAGE_BLOCK,
            async () => {
                animeListLoadingPage.movePageBlock('start');
            },
            () => {
                animeListLoadingPage.movePageBlock('end');
            }
        ).then();

        window.addEventListener('scroll', animeListLoadingPage.scrollHandler);
    },

    scrollHandler: function () {
        if (!animeListLoadingPage._enabled) {
            return;
        }

        let story_shorts = document.querySelectorAll('#dle-content .shortstory');
        let last_story_short = lastArr(story_shorts);

        if (!isElementInViewportOrUpper(last_story_short)) {
            animeListLoadingPage.changeUrlPage();
            return;
        }

        animeListLoadingPage.loadNextPage();
    },

    movePageBlock: function(position = 'start') {
        let elem = document.querySelector('.block_2');

        if (elem === null) {
            return;
        }

        if (position === 'start') {
            let append_before = document.querySelector('#stext');
            if (append_before === null) {
                append_before = document.querySelector('#dle-content');
            }
            append_before.before(elem);
        } else {
            document.querySelector('#dle-content').appendChild(elem);
        }
    },

    changeUrlPage: function () {
        const page_detector_elems = document.querySelectorAll(`.${animeListLoadingPage.PAGE_DETECTOR_ELEM_CLASS}`);
        let page = +document.querySelector('.block_2 .block_4 span').innerText;

        for ( let i = 0; i < page_detector_elems.length; i++) {
            let elem = page_detector_elems[i];

            if (isElementInViewportOrUpper(elem)) {
                page = +elem.dataset.page;
            }
        }

        if (page === 1 && location.pathname === '/') {
            return;
        }

        let url_page = document.querySelectorAll('.block_2 .block_4 a')[1].href.replace(/\/page\/\d+\//, `/page/${page}/`);;

        if (page === 1) {
            url_page = url_page.replace(/page\/(\d+)?\//, '')
        }

        if (url_page === location.pathname) {
            return;
        }

        history.replaceState({}, '', url_page);
    },

    _is_loading: false,

    loadNextPage: function () {
        if (animeListLoadingPage._is_loading) {
            return;
        }

        ShowLoadingEvent();
        animeListLoadingPage._is_loading = true;

        let page = animeListLoadingPage._current_page + 1;
        let page_url = document.querySelectorAll('.block_2 .block_4 a')[1].href;
        let last_page_url = lastArr(document.querySelectorAll('.block_2 .block_4 a')).href;

        let last_page = +last_page_url.match(/\/page\/(\d+)\//)[1]

        if (page > last_page) {
            return;
        }

        fetch(page_url.replace(/\/page\/\d+\//, `/page/${page}/`))
            .then((response) => {
                return response.text();
            }).then((text) => {
                const parser = new DOMParser();
                return parser.parseFromString(text, 'text/html');
            }).then((html) => {
                return html.querySelectorAll('#dle-content .shortstory');
            }).then((elems) => {
                const page_detector_elem = document.createElement('div');
                page_detector_elem.style.height = '0px';
                page_detector_elem.classList.add(animeListLoadingPage.PAGE_DETECTOR_ELEM_CLASS);
                page_detector_elem.dataset.page = page.toString();

                let last_short_story = lastArr(document.querySelectorAll('#dle-content .shortstory'));
                last_short_story.after(page_detector_elem);

                for (let i = 1; i <= elems.length; i++) {
                    page_detector_elem.after(elems[elems.length - i]);
                }

                ServiceTrackingElems.render(elems);

                animeListLoadingPage._current_page += 1;
            }).finally(() => {
                HideLoadingEvent();
                animeListLoadingPage._is_loading = false;
            });
    },

}