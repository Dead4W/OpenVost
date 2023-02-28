ServiceTrackingPage = {

    short_story_example: null,

    ITEMS_ON_PAGE: 3,

    render: async function () {
        if (!ServiceTrackingPage.isTrackedLink()) {
            return;
        }

        await ServiceTrackingPage.addUntrackAllButton();

        await ServiceTrackingPage.renderStoryShorts();
        await ServiceTrackingPage.renderPages();
    },

    renderStoryShorts: async function() {
        const anime_list = Object.keys(await ServiceTrackingStorage.get());

        if (anime_list.length === 0) {
            ServiceTrackingPage.emptyList("Вы ничего не вносили в свой список отслеживаемых.");
            return;
        }

        let current_page = ServiceTrackingPage.getTrackedPage();
        let startOffset = ServiceTrackingPage.ITEMS_ON_PAGE * (current_page-1);
        let endOffset = ServiceTrackingPage.ITEMS_ON_PAGE * current_page;
        let animeListPage = anime_list.reverse().slice(startOffset,endOffset);

        if (animeListPage.length === 0) {
            ServiceTrackingPage.emptyList("Похоже вы слишком далеко забежали...");
            return;
        }

        let promises = [];

        for (let i = 0; i < animeListPage.length; i++) {
            let anime_id = animeListPage[i];

            promises.push(ServiceTrackingPage.appendAnimeShortstory(anime_id));
        }

        await Promise.all(promises);
    },

    renderPages: async function () {
        const animeTrackList = await ServiceTrackingStorage.get();
        const animeIds = Object.keys(animeTrackList);

        //page list generate
        const currentPage = ServiceTrackingPage.getTrackedPage();
        const countPages = Math.ceil(animeIds.length / ServiceTrackingPage.ITEMS_ON_PAGE);
        let minPage, maxPage;
        document.querySelector('#dle-content').innerHTML += '<div class=\"block_2\"><table><tr>' +
            '<td class="block_3"></td>' +
            '<td class="block_4"></td>' +
            '<td class="block_5"></td>' +
            '</tr></table></div>';
        const pageBlock = document.querySelector('.block_4');

        if( countPages > 1 ) {

            if( countPages < 10 ) {
                minPage = 1;
                maxPage = countPages;
            } else if( countPages - currentPage  < 4 ) {
                minPage = countPages - 8;
                maxPage = countPages;
            } else if( currentPage - 4 < 4 ) {
                minPage = 1;
                maxPage = minPage + 8;
            } else {
                minPage = currentPage - 4;
                maxPage = currentPage + 4;
            }

            function constructPage(n) {
                let link = ServiceTrackingPage.getTrackedLink() + '/' + n;

                return n === currentPage ? '<span>' + n + '</span>' : `<a href="${link}" onclick="location.href='${link}';location.reload(true);">` + n + '</a>';
            }

            if( minPage > 1 ) {
                pageBlock.insertAdjacentHTML('beforeend',constructPage(1) + "<span class=\"nav_ext\">...</span>");
            }

            for(let page=minPage; page<=maxPage; page++) {
                pageBlock.insertAdjacentHTML('beforeend',constructPage(page));
            }

            if(countPages > maxPage) {
                pageBlock.insertAdjacentHTML('beforeend',"<span class=\"nav_ext\">...</span>" + constructPage(countPages));
            }
        }
    },

    addUntrackAllButton: async function() {
        const anime_list = Object.keys(await ServiceTrackingStorage.get());

        if (anime_list.length === 0) {
            return;
        }

        const button = document.createElement('a');
        button.classList.add('untrack-all');
        button.innerText = 'Отписаться от всего!';

        async function handler() {
            ShowLoadingEvent();
            await ServiceTrackingStorage.set({});
            HideLoadingEvent();
            location.reload();
        }

        document.getElementById('dle-content').appendChild(button);

        let interval = setInterval(function () {
            let elem = document.querySelector('.untrack-all');

            if (elem.onclick === null) {
                elem.onclick = handler;
            }
        }, 100);
    },

    appendAnimeShortstory: async function(anime_id) {
        const example_shortstory = await ServiceTrackingPage.getAnimeShortStory(anime_id);

        example_shortstory.querySelector('.shortstoryFuter').remove();

        const content_blocks = example_shortstory.querySelector('.shortstoryContent').children;

        const titleLink = document.createElement('a');
        titleLink.href = `https://animevost.org/tip/tv/${anime_id}-.html`;
        titleLink.innerText = example_shortstory.querySelector('.shortstoryHead h1').innerText;

        example_shortstory.querySelector('.shortstoryHead h1').innerHTML = '';
        example_shortstory.querySelector('.shortstoryHead h1').appendChild(titleLink);
        example_shortstory.querySelector('.shortstoryHead h1 br').remove();

        for (let i = content_blocks.length-1; i >= 1; i--) {
            content_blocks[i].remove();
        }

        document.querySelector('#dle-content').appendChild(example_shortstory);
    },

    getAnimeShortStory: async function(anime_id) {
        return fetch(`https://animevost.org/tip/tv/${anime_id}-.html`).then((response) => {
            return response.text();
        }).then((text) => {
            const parser = new DOMParser();
            return parser.parseFromString(text, 'text/html');
        }).then((html) => {
            return html.querySelector('#dle-content .shortstory');
        });
    },

    emptyList(message) {
        const dleContent = document.getElementById('dle-content');

        const mainInfoBadTrackList = document.createElement('div');
        mainInfoBadTrackList.className = "userinfo";
        const headInfoBadTrackList = document.createElement('p');
        headInfoBadTrackList.className = "userinfoHead";
        headInfoBadTrackList.innerText = "Информация";
        const bodyInfoBadTrackList = document.createElement('div');
        bodyInfoBadTrackList.className = "userinfoCenter";
        bodyInfoBadTrackList.innerText = message;

        mainInfoBadTrackList.appendChild(headInfoBadTrackList);
        mainInfoBadTrackList.appendChild(bodyInfoBadTrackList);

        dleContent.appendChild(mainInfoBadTrackList);
    },

    getTrackedLink: function() {
        if (!ServiceTrackingElems.hasUser()) {
            return false;
        }

        const user_link_elem = document.querySelector('.login').children[2];
        return user_link_elem.href + '#tracked';
    },

    getTrackedPage: function() {
        const tracked_link = ServiceTrackingPage.getTrackedLink();

        let re = new RegExp(`${tracked_link}/(\\d+)|${tracked_link}`);
        const tracked_path_match = location.href.match(re);

        if (!tracked_path_match) {
            return false;
        }

        return tracked_path_match[1] !== undefined ? Math.max(+tracked_path_match[1], 1) : 1;
    },

    isTrackedLink: function() {
        return ServiceTrackingPage.getTrackedPage() !== false;
    }

}