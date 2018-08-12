var storageSync = chrome.storage.sync;

String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash + "_" + this.length;
};
Array.prototype.remove = function(value) {
    var idx = this.indexOf(value);
    if (idx !== -1) {
        return this.splice(idx, 1);
    }
    return false;
};
function injectScript(actualCode) {
    var script = document.createElement('script');
    script.textContent = actualCode;
    (document.head||document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
}

function ShowLoading() {
	injectScript("ShowLoading();");
}
function HideLoading() {
	injectScript("HideLoading();");
}
function bindTrackButton() {
	var animeTrackIcons = document.getElementsByClassName('checkNewEpisodeShortstory');
	for( var i = 0;i<animeTrackIcons.length;i++ ) {
		var trackedAnime = animeTrackIcons[i];

		trackedAnime.children[0].onmouseover = function(e) {
			var elem = e.currentTarget;
			elem.src = elem.parentElement.dataset.status === "true" ? imgCheckEpisode : imgCheckEpisodeGood;
		};
		trackedAnime.children[0].onmouseout = function(e) {
			var elem = e.currentTarget;
			elem.src = elem.parentElement.dataset.status === "true" ? imgCheckEpisodeGood : imgCheckEpisode;
		};

		trackedAnime.onclick = function(e) {
			var elem = e.currentTarget;
			var id = +elem.dataset.id;
			ShowLoading();
			storageSync.get(['animeTrackList'],function(data) {
				if(  data.animeTrackList === undefined ) {
					data.animeTrackList = [];
					storageSync.set({animeTrackList:data.animeTrackList});
				}

				var xhr = new XMLHttpRequest();
				xhr.open("POST", 'https://api.animevost.org/v1/info', true);
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

				xhr.onreadystatechange = function() {
					if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
						var result = JSON.parse(xhr.responseText);

						var episodes = result.data[0].series === "" ? [] : JSON.parse(result.data[0].series.replace(/'/g,'"'));
						var episodesNames = [];
						for( name in episodes ) {
							episodesNames.push(name);
						}
						episodesNames = episodesNames.join('-').replace(/\s+/g,'');

						var success = false;
						for( var i=0;i<data.animeTrackList.length;i++ ) {
							if( data.animeTrackList[i].id === id ) {
								data.animeTrackList[i].status = !elem.dataset.status === "true";
								if( data.animeTrackList[i].status === false ) {
									data.animeTrackList.remove(data.animeTrackList[i]);
								} else {
									data.animeTrackList[i].hash = episodesNames.hashCode();
								}
								success = true;
								break;
							}
						}
						if( !success && elem.dataset.status === "false" ) {
							data.animeTrackList.push({
								id: id,
								hash: episodesNames.hashCode(),
								status: true
							});
						}

						storageSync.set({"animeTrackList":data.animeTrackList},function() {
							HideLoading();
							var countTrackList = 0;
							for( var i=0;i<data.animeTrackList.length;i++ ) {
								if( data.animeTrackList[i].status ) {
									countTrackList++;
								}
							}
							document.getElementsByClassName('trackedAnimeHead')[0].title = 'Количество отслеживаемых аниме: ' + countTrackList;
							document.getElementsByClassName('trackedAnimeHead')[0].text = 'Отслеживаемые (' + countTrackList + ')';
							elem.children[0].src = elem.dataset.status === "true" ? imgCheckEpisode : imgCheckEpisodeGood;
							elem.dataset.status = elem.dataset.status === "true" ? "false" : "true";
						});
					}
				};
				xhr.send("id=" + id);
			});
		}
	}

}
function injectScriptFile(file, callback) {
	var th = document.getElementsByTagName('body')[0];
	var s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('src', file);
	th.appendChild(s);
	if( typeof(callback) === "function" ) {
		s.onload = callback;
	} else return s;
}
function Confirm(msg) {
	return confirm(msg);
}

var imgCheckEpisode = chrome.extension.getURL('img/cne.png');
var imgCheckEpisodeGood = chrome.extension.getURL('img/cne_good.png');

document.addEventListener("DOMContentLoaded", function() {
	injectScript('ajax2 = function(id,snum) {var num=snum -2; if (num<0) {num=0} $(\'.active\').removeClass(\'active\'); $(\'#scrolltwo\').scrollTo("#p" +num , 500, {axis:\'x\'}); $("#p" +snum).addClass(\'active\');}');

    /* hide info banner */
    var textBanner = document.getElementsByClassName('banerTopTwo')[0];
    if( textBanner !== undefined ) {
        var hashBanner = textBanner.innerHTML.hashCode();
        storageSync.get(['banner'],function(data) {
            if( data.banner === undefined ) {
                data.banner = {
                    hash: "",
                    isHidden: false
                };
                storageSync.set({banner:data.banner});
            }
            if( hashBanner === data.banner.hash && data.banner.isHidden ) {
                textBanner.className += ' openvost-isHidden';
            } else {
                textBanner.className += ' openvost-isVisible';
                var closeBannerIcon = document.createElement('span');
                closeBannerIcon.className = 'close';
                closeBannerIcon.title = 'Скрыть';
                closeBannerIcon.innerText = 'X';

                closeBannerIcon.onclick = function() {
                    if( Confirm('Не показывать это объявление в будущем?') ) {
                        textBanner.className = 'banerTopTwo openvost-isHidden';
                        data.banner = {
                            hash: hashBanner,
                            isHidden: true
                        };
                        storageSync.set({banner:data.banner});
                    }
                };

                textBanner.appendChild(closeBannerIcon);
            }
        });
    }
	
	
//player inject
    var videolinks = {};
    if( location.pathname.match(/tip\/[^\/]+\/\d+-/) ) {
        window.addEventListener("message", function(event) {
            if( event.type === 'message' ) {
                if( event.data.type === 'FROM_PAGE_TO_OPENVOST_CHECK_SERVERS' ) {
                    let id = +event.data.id;
                    let goodServers = false;
                    if( !id ) {
                        return;
                    }
					
					chrome.runtime.sendMessage({type: "check_videolinks", options: {
						type: "basic",
						id: id
					}});
                }
                else if( event.data.type === 'FROM_PAGE_TO_OPENVOST_DOWNLOAD_FILE' ) {
                    chrome.runtime.sendMessage({type: "download_file", options: {
                        type: "basic",
                        url: event.data.url,
                        filename: event.data.filename
                    }},function() {});
                }
            }
        });

        var loadOpenAnime = function() {
            injectScriptFile( chrome.extension.getURL('js/openAnime.js'));
        };

        injectScriptFile('http://old.play.aniland.org/HLS.js',loadOpenAnime);
    }

//counters format
	var classes = [
		'.staticInfoRightSmotr',
		'.staticInfoRight span a',
		'.staticInfoLeftData',
		'.staticInfoLeft span a',
	];
	var titles = [
		'Просмотров',
		'Комментариев',
		'Дата последнего обновления',
		'Многоликий человек-проект',
	];

    for( var i = 0;i<classes.length;i++ ) {
		var elems = document.querySelectorAll(classes[i]);
		for( var e = 0;e<elems.length;e++ ) {
			if( i < 2 ) {
				if( typeof(elems[e]) != "undefined" ) {
					elems[e].innerHTML = new Intl.NumberFormat('ru-RU').format(+elems[e].innerText);
					elems[e].title = titles[i] + ': ' + elems[e].innerText;
				}
			} else {
				elems[e].title = titles[i];
			}
		}
	}

//added icon for tracked anime
    storageSync.get(['animeTrackList'],function(data) {
        if( data.animeTrackList === undefined ) {
            data.animeTrackList = [];
            storageSync.set({animeTrackList:data.animeTrackList});
        }
        var countTrackList = 0;
        for( var i=0;i<data.animeTrackList.length;i++ ) {
            if( data.animeTrackList[i].status ) {
                countTrackList++;
            }
        }
		var trackedAnimeHeadLink = document.createElement('a');
		trackedAnimeHeadLink.classList = 'loginLinkZ trackedAnimeHead';
		trackedAnimeHeadLink.title = "Количество отслеживаемых: " + countTrackList;
		trackedAnimeHeadLink.href = "http://animevost.org/tracked";
		trackedAnimeHeadLink.style = "padding-right: 37px;";
		trackedAnimeHeadLink.text = "Отслеживаемые (" + countTrackList + ")";
		
		document.getElementsByClassName('loginLinkZ')[0].style = '';

		document.getElementsByClassName('loginLink')[0].insertBefore(trackedAnimeHeadLink, document.getElementsByClassName('loginExit')[0]);

        var shortstoryShareElems = document.getElementsByClassName('shortstoryHead');
        for( var i=0;i<shortstoryShareElems.length;i++ ) {
            var elem = shortstoryShareElems[i].children[0];
            var parent = shortstoryShareElems[i];
            var id = +elem.id.match(/fav-id-(\d+)/)[1];
            var isChecking = false;

            for( var indexTrack=0;indexTrack<data.animeTrackList.length;indexTrack++ ) {
                if( data.animeTrackList[indexTrack].id === id ) {
                    isChecking = data.animeTrackList[indexTrack].status;
                    break;
                }
            }

            var checkNewEpisode = document.createElement('img');
            checkNewEpisode.classList = 'checkNewEpisode';
            checkNewEpisode.title = 'Отслеживать новые серий';
            checkNewEpisode.src = isChecking ? imgCheckEpisodeGood : imgCheckEpisode;

            var checkNewEpisodeShortstory = document.createElement('a');
            checkNewEpisodeShortstory.classList = 'shortstoryShare checkNewEpisodeShortstory';
            checkNewEpisodeShortstory.dataset.id = id;
            checkNewEpisodeShortstory.dataset.status = isChecking;

            checkNewEpisodeShortstory.appendChild(checkNewEpisode);
            parent.insertBefore(checkNewEpisodeShortstory, parent.children[1] );
        }

        bindTrackButton();
    });

//tracked anime list page
    if( trackedPageOffset = location.pathname.match(/\/tracked\/?(\d*)\/?/) ) {
        var dleContent = document.getElementById('dle-content');
        var trackedAnimeOnPage = 10;
        trackedPageOffset = (trackedPageOffset[1] === "" || +trackedPageOffset[1] === 0) ? 1 : +trackedPageOffset[1];
        document.addEventListener('openvost-inject',function() {
            storageSync.get(['animeTrackList'],function(data) {
                var animeListGood = [];
                for( i in data.animeTrackList ) {
                    if( data.animeTrackList[i].status ) {
                        animeListGood.push(data.animeTrackList[i].id);
                    }
                }

                var dleContent = document.getElementById('dle-content');

                function trackInfo(msg) {
                    var mainInfoBadTrackList = document.createElement('div');
                    mainInfoBadTrackList.className = "userinfo";
                    var headInfoBadTrackList = document.createElement('p');
                    headInfoBadTrackList.className = "userinfoHead";
                    headInfoBadTrackList.innerText = "Информация";
                    var bodyInfoBadTrackList = document.createElement('div');
                    bodyInfoBadTrackList.className = "userinfoCenter";
                    bodyInfoBadTrackList.innerText = msg;

                    mainInfoBadTrackList.appendChild(headInfoBadTrackList);
                    mainInfoBadTrackList.appendChild(bodyInfoBadTrackList);

                    dleContent.appendChild(mainInfoBadTrackList);
                }

                if( animeListGood.length === 0 ) {
                    trackInfo("Вы ничего не вносили в свой список отслеживаемых.");
                }

                var startOffset = trackedAnimeOnPage*(trackedPageOffset-1);
                var endOffset = trackedAnimeOnPage*trackedPageOffset;
                var animeListPage = animeListGood.reverse().slice(startOffset,endOffset);

                dleContent.dataset.animeList = JSON.stringify( animeListPage );

                var evObj = document.createEvent('Events');
                evObj.initEvent('openvost-info-animelist', true, true);
                dleContent.dispatchEvent(evObj);
            });
        });
        document.addEventListener('openvost-animetracklist-done',function() {
            bindTrackButton();
            storageSync.get(['animeTrackList'],function(data) {
                var animeListGood = [];
                for( i in data.animeTrackList ) {
                    if( data.animeTrackList[i].status ) {
                        animeListGood.push(data.animeTrackList[i].id);
                    }
                }

                //page list generate
                var currentPage = trackedPageOffset;
                var countPages = Math.ceil(animeListGood.length/trackedAnimeOnPage);
                var minPage,maxPage;
                var pageBlock = document.getElementsByClassName('block_4')[0];

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
                        return n === currentPage ? '<span>' + n + '</span>' : '<a href="/tracked/' + n + '/">' + n + '</a>';
                    }

                    if( minPage > 1 ) {
                        pageBlock.insertAdjacentHTML('beforeend',constructPage(1) + "<span class=\"nav_ext\">...</span>");
                    }

                    for( var page=minPage;page<=maxPage;page++ ) {
                        pageBlock.insertAdjacentHTML('beforeend',constructPage(page));
                    }

                    if( countPages - currentPage  >= 4 ) {
                        pageBlock.insertAdjacentHTML('beforeend',"<span class=\"nav_ext\">...</span>" + constructPage(countPages));
                    }
                }
            });
        });
    }

//send icon url to element data for anime track list
	var contentElement = document.getElementById('dle-content')
	if( contentElement ) {
		contentElement.dataset.openvostCneGood = imgCheckEpisodeGood;
	}

//inject track list script
    injectScriptFile( chrome.extension.getURL('/js/inject.js'));
});