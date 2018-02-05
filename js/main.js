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

function bindTrackButton() {
    $('.shortstoryShare.checkNewEpisodeShortstory img').on('mouseover',function() {
        this.src = $(this).parents('.checkNewEpisodeShortstory').attr('data-status') == "true" ? imgCheckEpisode : imgCheckEpisodeGood;
    }).on('mouseout',function() {
        this.src = $(this).parents('.checkNewEpisodeShortstory').attr('data-status') == "true" ? imgCheckEpisodeGood : imgCheckEpisode;
    });
    $('.shortstoryShare.checkNewEpisodeShortstory').on('click',function() {
        var elem = $(this);
        var id = +elem.data('id');
        ShowLoading();
        $.ajax('https://api.animevost.org/animevost/api/v0.2/GetInfo/' + id).then(function(result) {
            var episodes = JSON.parse(result.data[0].series.replace(/'/g,'"'));
            var episodesNames = [];
            for( name in episodes ) {
                episodesNames.push(name);
            }
            var hashEpisode = episodesNames.join('-').hashCode();
            chrome.storage.sync.get(['animeTrackList'],function(data) {
                if(  data.animeTrackList === undefined ) {
                    data.animeTrackList = [];
                    chrome.storage.sync.set({animeTrackList:data.animeTrackList});
                }
                if( elem.attr('data-status') === "true" ) {
                    for( var i=0;i<data.animeTrackList.length;i++ ) {
                        if( data.animeTrackList[i].id === id ) {
                            data.animeTrackList[i].status = false;
                        }
                    }
                } else {
                    var success = false;
                    for( var i=0;i<data.animeTrackList.length;i++ ) {
                        if( data.animeTrackList[i].id === id ) {
                            data.animeTrackList[i].status = true;
                            success = true;
                            break;
                        }
                    }
                    if( !success ) {
                        data.animeTrackList.push({
                            id: id,
                            hash: hashEpisode,
                            status: true
                        });
                    }
                }

                chrome.storage.sync.set({"animeTrackList":data.animeTrackList},function() {
                    HideLoading();
                    var countTrackList = 0;
                    for( var i=0;i<data.animeTrackList.length;i++ ) {
                        if( data.animeTrackList[i].status ) {
                            countTrackList++;
                        }
                    }
                    $('.trackedAnimeHead').attr('title','Количество отслеживаемых аниме: ' + countTrackList).text('Отслеживаемые (' + countTrackList + ')');
                    elem.find('img').attr('src',elem.attr('data-status') === "true" ? imgCheckEpisode : imgCheckEpisodeGood).attr('title','Отслеживать новые серий');
                    elem.attr('data-status',elem.attr('data-status') === "true" ? "false" : "true");
                });
            });
        });
    });
}

function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}

if( location.pathname.match(/tip\/[^\/]+\/\d+-/) ) {
    var scriptPlayer;
    if( navigator.userAgent.match(/Opera/i) || navigator.userAgent.match(/Windows Phone/i)  ) {
        scriptPlayer = $.getScript('http://old.play.aniland.org/HLS.js');
    } else {
        scriptPlayer = $.getScript('http://hplay.aniland.org/player.js');
    }
    scriptPlayer.success(function() {
        injectScript( chrome.extension.getURL('js/openAnime.js'), 'body');
    });
}

$('.staticInfoRightSmotr').each(function() {
    var countViews = $(this);
    countViews.text(new Intl.NumberFormat('ru-RU').format(+countViews.text())).attr('title','Просмотров: ' + countViews.text());
});

$('.staticInfoRight span a').each(function() {
    var comments = $(this);
    comments.text(new Intl.NumberFormat('ru-RU').format(+comments.text())).attr('title','Комментариев: ' + comments.text());
});

$('.staticInfoLeft span.staticInfoLeftData').attr('title','Дата последнего обновления');

function Confirm(msg) {
    return confirm(msg);
}
function Alert(msg) {
    return alert(msg);
}

/* hide banner */
var textBanner = $('.banerTopTwo').html();
var hashBanner = textBanner.hashCode();
chrome.storage.sync.get(['lastHashBanner','isBannerHide'],function(data) {
    if( data.isBannerHide === undefined ) {
        chrome.storage.sync.set({lastHashBanner:0,isBannerHide:false});
        data.lastHashBanner = 0;
        data.isBannerHide = false;
    }
    if( hashBanner === data.lastHashBanner && data.isBannerHide ) {
        $('.banerTopTwo').hide();
    } else {
        $('<span class="close" title="Скрыть">X</span>').appendTo('.banerTopTwo').on('click',function() {
            if( Confirm('Не показывать это объявление в будущем?') ) {
                $('.banerTopTwo').slideUp();
                chrome.storage.sync.set({lastHashBanner:hashBanner,isBannerHide:true});
            }
        });
    }
});

function ShowLoading(a){$("#loading-layer").remove();$("body").append("<div id='loading-layer' style='display:none'></div>");a?$("#loading-layer").html(a):$("#loading-layer").html("Загрузка. Пожалуйста, подождите...");a=($(window).width()-$("#loading-layer").width())/2;var b=($(window).height()-$("#loading-layer").height())/2;$("#loading-layer").css({left:a+"px",top:b+"px",position:"fixed",zIndex:"99"});$("#loading-layer").fadeTo("slow",.6)}
function HideLoading(a){$("#loading-layer").fadeOut("slow",function(){$("#loading-layer").remove()})}

/* check new episodes icon */
var imgCheckEpisode = chrome.extension.getURL('img/cne.png');
var imgCheckEpisodeGood = chrome.extension.getURL('img/cne_good.png');
chrome.storage.sync.get(['animeTrackList'],function(data) {
    if( data.animeTrackList === undefined ) {
        data.animeTrackList = [];
        chrome.storage.sync.set({animeTrackList:data.animeTrackList});
    }
    var countTrackList = 0;
    for( var i=0;i<data.animeTrackList.length;i++ ) {
        if( data.animeTrackList[i].status ) {
            countTrackList++;
        }
    }
    $('.loginLink .loginLinkZ').before('<a class="loginLinkZ trackedAnimeHead" title="Количество отслеживаемых аниме: ' + countTrackList + '" href="http://animevost.org/tracked">Отслеживаемые (' + countTrackList + ')</a>');
    var elemsCount = $('.shortstoryHead a.shortstoryShare img').length;
    var indexElemsCount = 0;
    $('.shortstoryHead a.shortstoryShare img').each(function() {
        var elem = $(this);
        var parent = $(this).parents('.shortstoryShare');
        var id = +parent[0].id.match(/fav-id-(\d+)/)[1];
        var isChecking = false;
        for( var i=0;i<data.animeTrackList.length;i++ ) {
            if( data.animeTrackList[i].id === id ) {
                isChecking = data.animeTrackList[i].status;
                break
            }
        }
        parent.after('<a class="shortstoryShare checkNewEpisodeShortstory" data-status="' + isChecking + '" data-id="' + id + '"><img class="checkNewEpisode" title="Отслеживать новые серий" src="' + ( isChecking ? imgCheckEpisodeGood : imgCheckEpisode ) + '"></a>');
        if( ++indexElemsCount >= elemsCount ) {
            bindTrackButton();
        }
    });
});

if( trackedPageOffset = location.pathname.match(/\/tracked\/?(\d*)\/?/) ) {
    var trackedAnimeOnPage = 10;
    trackedPageOffset = (trackedPageOffset[1] === "" || +trackedPageOffset[1] === 0) ? 1 : +trackedPageOffset[1];
    document.addEventListener('openvost-inject',function() {
        chrome.storage.sync.get(['animeTrackList'],function(data) {
            var animeListGood = [];
            for( i in data.animeTrackList ) {
                if( data.animeTrackList[i].status ) {
                    animeListGood.push(data.animeTrackList[i].id);
                }
            }
            if( animeListGood.length === 0 ) {
                $('<div class="userinfo">\n' +
                    '<p class="userinfoHead">\n' +
                    'Информация\n' +
                    '</p>\n' +
                    '<div class="userinfoCenter">\n' +
                    'Вы ничего не вносили в свой список отслеживаемых.\n' +
                    '</div>\n' +
                    '</div>').appendTo('#dle-content');
            }
            $("#dle-content").attr("data-anime-list",JSON.stringify(animeListGood.slice(trackedAnimeOnPage*(trackedPageOffset-1),trackedAnimeOnPage*trackedPageOffset)));
            var evObj = document.createEvent('Events');
            evObj.initEvent('openvost-info-animelist', true, true);
            $("#dle-content").get(0).dispatchEvent(evObj);
        });
    });
    document.addEventListener('openvost-animetracklist-done',function() {
        bindTrackButton();
        chrome.storage.sync.get(['animeTrackList'],function(data) {
            var animeListGood = [];
            for( i in data.animeTrackList ) {
                if( data.animeTrackList[i].status ) {
                    animeListGood.push(data.animeTrackList[i].id);
                }
            }

            //page list generate
            $("#dle-content").append('<div class="block_2">\n' +
                '<table width="100%" border="0" cellspacing="0" cellpadding="0">\n' +
                '<tbody><tr>\n' +
                '<td class="block_3"></td>\n' +
                '<td class="block_4"></td>\n' +
                '<td class="block_5"></td>\n' +
                '</tr>\n' +
                '</tbody></table>\n' +
                '</div>');

            var currentPage = trackedPageOffset;
            var countPages = Math.ceil(animeListGood.length/trackedAnimeOnPage);
            var minPage,maxPage;

            if( animeListGood.length > trackedAnimeOnPage ) {

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

                if( minPage > 1 ) {
                    $("#dle-content table td.block_4").append('<a href="/tracked/1/">1</a><span class="nav_ext">...</span>');
                }

                for( var page=minPage;page<=maxPage;page++ ) {
                    if( page === currentPage ) {
                        $("#dle-content table td.block_4").append('<span>' + page + '</span>');
                    } else {
                        $("#dle-content table td.block_4").append('<a href="/tracked/' + page + '/">' + page + '</a>');
                    }
                }

                if( countPages - currentPage  >= 4 ) {
                    $("#dle-content table td.block_4").append('<span class="nav_ext">...</span><a href="/tracked/' + countPages + '/">' + countPages + '</a>');
                }
            }
        });
    });
}

injectScript( chrome.extension.getURL('/js/inject.js'), 'body');