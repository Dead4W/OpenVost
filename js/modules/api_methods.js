const API_URL = 'https://api.animevost.org';
const WEB_URL = 'https://animevost.org';

async function getAnimeEpisodes(anime_id) {
    return fetch(`${API_URL}/v1/playlist`, {
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `id=${anime_id}`,
    }).then((response) => {
        return response.json();
    }).then((data) => {
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            data[i]['id'] = +item['std'].match(/(\d+)\.mp4/)[1]
        }

        return data;
    });
}

async function getWebVideolinkPart(episode_id) {
    const episode_response = await fetch(`${WEB_URL}/frame5.php?play=${episode_id}`, {
        cache: 'no-cache',
    });

    if (!episode_response.ok) {
        return false;
    }

    const raw_episode_response = await episode_response.text();

    const re = new RegExp(`${episode_id}\\.mp4\\?md5=\\w+\\&time=\\d+`);
    const episode_links = raw_episode_response.replace('&amp;', '&').match(re);

    if (episode_links === null) {
        return false;
    }

    return episode_links[0];
}

async function getAnimeInfo(anime_id) {
    return fetch(`${API_URL}/v1/info`, {
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `id=${anime_id}`,
    }).then(async function (response) {
        let data = await response.json();

        return data.data[0];
    });
}

async function checkVideolink(videolink) {
    try {
        const response = await fetch(videolink, {
            cache: 'no-cache',
            method: "HEAD",
        });

        if (response.ok) {
            return true;
        }
    } catch (e) {
        // pass
    }

    return false;
}