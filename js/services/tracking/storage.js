/**
 * Browser sync storage
 * data: anime_id => hash
 *
 */
ServiceTrackingStorage = {

    existId: async function(anime_id) {
        return chrome.storage.sync.get(['animeTrackList'])
            .then((data) => {
                return data.animeTrackList.hasOwnProperty(anime_id);
            });
    },

    getHashById: async function(anime_id) {
        return ServiceTrackingStorage.get(['animeTrackList'])
            .then((data) => {
                if (!data.hasOwnProperty(anime_id)) {
                    return false;
                }

                return data[anime_id];
            });
    },

    get: async function () {
        return chrome.storage.sync.get(['animeTrackList']).then((data) => {
            let anime_ids = {};

            if(data.animeTrackList === undefined) {
                chrome.storage.sync.set({animeTrackList: anime_ids});
            } else {
                anime_ids = data.animeTrackList;
            }

            return anime_ids;
        });
    },

    add: async function(anime_id, hash) {
        return this
            .get()
            .then((animeTrackList) => {
                animeTrackList[anime_id] = hash;
                return ServiceTrackingStorage.set(animeTrackList);
            });
    },

    remove: async function(anime_id) {
        return this
            .get()
            .then((animeTrackList) => {
                delete animeTrackList[anime_id];
                return ServiceTrackingStorage.set(animeTrackList);
            });
    },

    set: async function(anime_ids) {
        return chrome.storage.sync.set({animeTrackList: anime_ids});
    },
}