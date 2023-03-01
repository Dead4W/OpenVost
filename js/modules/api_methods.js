const API_URL = 'https://api.animevost.org';

async function getLastAnimes(page = 1, count = 20) {
    return fetch(`${API_URL}/v1/last?page=${page}&quantity=${count}`, {
        cache: 'no-cache',
    }).then((result) => {
        return result.json();
    }).then((data) => {
        return data['data'];
    });
}

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