$('#openvost_player2').html('');

var st = {
    "default": "#07b02206306e07407206c05f06c06906e06502203a07b00a02206207506606606c06906e06506306f06c06f07202203a02206606606606606606602202c00a02206802203a03402c02206206705f06f02203a03002c00a02206306f06c06f07205f06c06f06106402203a02203002202c00a02206206705f06102203a03002e03102c00a02206106c06c05f06102203a03102c00a02206c06f06106405f06102203a03002e03302c00a02207306805f06102203a03002e03402c00a02206306f06c06f07205f06106c06c02203a02203303703303703303702202c00a02206306f06c06f07205f07006c06107902203a02203503903703406106302207d02c00a02206306e07407206c06f07507406806506906706807402203a03303902c00a02206306e07407206c06206706306f06c06f07202203a02203306403306403306402202c00a02206306e07407206c06206706106c07006806103102203a03002e03702c00a02206306e07407206c05f07007206f06306506e07402203a07b02206306f06c06f07202203a02206606606606606606602207d02c00a02206306e07407206c05f07207506e05f07606f06c07506d06502203a07b02206802203a03602c02206306f06c06f07202203a02206306306306306306302202c02207702203a03607d02c00a02206e06f07406507306206706306f06c06f07202203a02203002202c00a02206e06f05f06802203a03303903002c00a02206306e07407206c05f06207506606606507202203a07b02206906306f06e02203a02203102202c02206306f06c06f07202203a02206606606606606606602202c02206306506e07406507202203a02203102207d02c00a02207307407206506106d02203a03102c00a02206e06f05f07702203a03603903402c00a02206306e07407206c05f07207506e02203a07b02206906306f06e02203a03002c02206802203a03602c02206306f06c06f07202203a02206306306306306306302202c02207702203a03602c02206d06107206706906e06c06506607402203a02d03207d02c00a02206306e07407206c05f06607506c06c02203a07b02206906306f06e02203a02203202202c02207306805f06102203a03002e03402c02207306802203a02203102202c02206d06107206706906e06c06506607402203a03207d02c00a02206306f06e07407206f06c07302203a02207006c06107902c07c02c07406906d06505f07006c06107902c06c06906e06502c07406906d06505f06206106306b02c07606f06c07506d06502c07606f06c06206107206c06906e06502c07c02c06607506c06c02c07307406107207402c07007206f06306506e07402c06207506606606507202c07207506e05f06c06906e06502c07207506e05f07606f06c07506d06502202c00a02206306e07407206c05f07006c06107902203a07b02207306805f06102203a03002e03402c02207306306106c06502203a03102e03502c02206d06107206706906e07206906706807402203a03103002c02206106c07006806102203a03002e03902c02206906306f06e02203a02203102202c02207306802203a02203102202c02206d06107206706906e06c06506607402203a03103307d02c00a02206306e07407206c06806906406502203a03102c02206306e07407206c05f07306507006107206107406f07202203a07b02207306306106c06502203a03202e03102c02206d06107206706906e07406f07002203a03202c02206106c07006806102203a03002e03302c02206306f06c06f07202203a02203002207d02c00a02206306e07407206c05f06806402203a07b02206906306f06e02203a02203c06903e03c06203e04804403c02f06203e03c02f06903e02202c02207306306106c06502203a03102e03307d02c00a02207306906402203a02203103603902d03103203303702202c02206306e07407206c05f07406906d06505f06206106306b02203a07b02206906306f06e02203a02203302202c02207306306106c06502203a03102e03102c02206d06107206706906e07406f07002203a03102c02206d06107206706906e07206906706807402203a03402c02206d06107206706906e06206f07407406f06d02203a03207d02c00a02206306e07407206c06206706607506c06c02203a03102c02206206706306f06c06f07202203a02206606606606606606602202c02206d02203a02207606906406506f02202c02206306e07407206c05f07307406107207402203a07b02206206702203a02203102202c02206206705f06802203a03803002c02206206705f06102203a03002e03103502c02206906306f06e02203a02203102202c02207306306106c06503202203a03202e03802c02206206705f07702203a03803002c02206206705f07306802203a02203102207d02c00a02206306e07407206c05f07606f06c07506d06502203a07b02207306805f06102203a03002e03402c02207306306106c06502203a03102e03102c02206d06107206706906e07406f07002203a03102c02206906306f06e02203a02203102202c02207306802203a02203102202c02206d06107206706906e06c06506607402203a03107d02c00a02206306e07407206c05f07406906d06505f07006c06107902203a07b02206206705f06f02203a03002c02206d06107206706906e07406f07002203a03102c02207306805f06206c07507202203a03103002c02206d06107206706906e06206f07407406f06d02203a03202c02206906306f06e02203a02203302202c02207306306106c06502203a03102e03102c02206206705f07306802203a02203102202c02206d06107206706906e06c06506607402203a03207d02c00a02207106806906406506607506c06c02203a03102c02206107507406f02203a02206e06f06e06502202c02207007206f02203a03102c02206306e07407206c05f07606f06c06206107206c06906e06502203a07b02206802203a03402c02206d06107206706906e07206906706807402203a03202c02206106c06c05f06102203a03102c02206306f06c06f07205f06c06f06106402203a02203503903703406106302202c02207702203a03603002c02206306f06c06f07205f06106c06c02203a02203303703303703303702207d02c00a02206607306306106c06502203a02203202202c02206c06106e06702203a02207207502202c02206806906406506106c07706107907302203a03102c00a00a02206507606506e07407302203a07b02207006c06107902203a02206807407407003a02f02f07006c06107902e06106e06906c06106e06402e06f07206702f07307406107402e07006807003f06906403d03203103403703403003703503903602202c02207307406107207402203a02206807407407003a02f02f07006c06107902e06106e06906c06106e06402e06f07206702f07307406107402e07006807003f06906403d03203103403703403003703503903602207d07d",
};

var goodVideoUrls = {};
var goodVideoUrlsQ = {};

function getPlayer() {
    return player;
}

function check_videolinks_server(episode_id) {
	if(!goodVideoUrls.hasOwnProperty(episode_id)) {
        goodVideoUrls[episode_id] = [];
        goodVideoUrlsQ[episode_id] = {hd:[],sd:[]};

		window.postMessage({
			type: "FROM_PAGE_TO_OPENVOST_CHECK_SERVERS",
			id: episode_id
		}, "*");
	}
}

function addVideoUrl(id,url) {
    if(goodVideoUrls.hasOwnProperty(id)) {
        goodVideoUrls[id] = [];
        goodVideoUrlsQ[id] = {hd:[],sd:[]};
    }

    if(!goodVideoUrls[id].hasOwnProperty(url)) {
        goodVideoUrls[id].push(url);
		if( url.match('/720/') ) {
			goodVideoUrlsQ[id].hd.push(url);
		} else {
			goodVideoUrlsQ[id].sd.push(url);
		}
    }

    if(+getPlayer().Get('episode_id') === +id) {
        let isEmptyPlayerVideolinks = getPlayer().Get('file') === ""
            || getPlayer().Get('file') === false
            || getPlayer().Get('file') === null;

        if(
            isEmptyPlayerVideolinks &&
            (getPlayer().getStatus() === PLAYER_STATE.LOADING || getPlayer().Get('repeat'))
        ) {
            getPlayer().Play(goodVideoUrls[id].join('|'));
        } else {
            getPlayer().Set('file',goodVideoUrls[id].join('|'));
        }
    }
}

function badFindServers(id) {
    // empty now
}

function secToPlayerTime(time) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time-hours*3600) / 60);
    let seconds = time % 60;

    return [
        minutes,
        pad(seconds,2)
    ].join(':');
}

function getPoster(id) {
    return "https://media.aniland.org/img/" + id + ".jpg";
}

function horizontal_scroll_to(id,snum,autoPlay,startPlayTime) {
    var num = snum - 2;
    if (num < 0) {
        num = 0
    }

    $('.active').removeClass('active');
    $('#scrolltwo').scrollTo("#p" + num, 500, {
        axis: 'x'
    });
    $("#p" + snum).addClass('active');
    if( !startPlayTime || autoPlay  ) {
        $.cookie(window.location.pathname, snum, {
            expires: 365
        });
    }

    var poster = getPoster(id);

    if( player ) {
        player.Set('file','');
        if(startPlayTime) {
            $('.continuePlayer').remove();
            player.Set("start",startPlayTime);
            player.Play();
        } else {
            player.Set("start","0");
        }
        player.Set("poster",poster);
        player.Set('repeat',autoPlay);
        player.Stop();
    } else {
        player = new Uppod({
            m: "video",
            st: st.default,
            uid: 'openvost_player2',
            poster: poster,
            h: "390",
			w: "695",
            start: startPlayTime ? startPlayTime : 0,
            keyseek: 5,
            onReady: function(uppod){
                if( $("#p" + snum).hasClass('active') ) {
                    appendContinueDiv('openvost_player2');
                }
            }
        });
        constructPlayerOpenvostData('#openvost_player2',player);
    }
    player.Set("episode_id",id);
    player.Set("auto_play",autoPlay);

    if( typeof goodVideoUrls[id] !== 'undefined' ) {
        if( autoPlay ) {
            player.Play(goodVideoUrls[id].join('|'));
        } else {
            player.Set('file',goodVideoUrls[id].join('|'))
        }
    } else {
        player.Stop();
        check_videolinks_server(id);
	}
}

function appendContinueDiv(playerName) {
    startPlayTime = $.cookie(window.location.pathname + "/time");
    if(typeof startPlayTime === 'undefined' || startPlayTime < 5 ) {
        startPlayTime = 0;
    }
    let $player = $('#' + playerName);
    if( $player.find('.continuePlayer').length || !startPlayTime ) {
        return;
    }
    $('<div class="continuePlayer">Продолжить с ' + secToPlayerTime(startPlayTime) + '</div>').appendTo($player).css('top','calc( 50% + 65px )').on('click',function() {
        $player.find('.continuePlayer').remove();
        getPlayer().Set('start',startPlayTime);
        getPlayer().Play().catch(() => { /* discard runtime error */ });
    });
}

function parseAjaxFunction($elem) {
    return $elem.attr('onclick').replace(/ajax\d?|[\(\);]/g,'').split(',');
}
function constructPlayerOpenvostData(find, player) {
    $(find)[0].openvost_data = {
        player: player,
    };
}
function downloadEpisode(href,name) {
    window.postMessage({
        type: "FROM_PAGE_TO_OPENVOST_DOWNLOAD_FILE",
        url: href,
        filename: name
    }, "*");
}

if( typeof dle_news_id === "undefined" ) {
    let data = window.location.pathname.match(/tip\/[^\/]+\/(\d+)-/);
    if( data.length ) {
        dle_news_id = +data[1];
    }
}

if( dle_news_id ) {
	//download panel
	var playerDownloadPanel = document.createElement('div');
	playerDownloadPanel.className = 'playerDownloadPanel';

	var animPanel = document.createElement('div');
	animPanel.className = 'animPanel';

	var downloadButton1 = document.createElement('a');
	downloadButton1.className = 'downloadButton';
	downloadButton1.onclick = function() {
        var finder = '.epizode.active';
		var id = player.Get('episode_id')
		var link = goodVideoUrlsQ[id].sd[0];
		downloadEpisode(link,'openvost/anime/' + $('.shortstoryHead h1').text().split(' / ')[1].match(/([^\[]+)/)[1].replace(/\s+/g,'-').replace(/[^a-zA-Z0-9\s-_\.]+/g,'') + '/' + $(finder).text().replace(' серия','ep').replace(/[^a-zA-Z0-9\s-_\.]+/g,'') + '-480-sd.mp4');
    };
	downloadButton1.innerText = 'Скачать 480p';
	var downloadButton2 = document.createElement('a');
	downloadButton2.className = 'downloadButton';
	downloadButton2.onclick = function() {
        var finder = '.epizode.active';
		var id = player.Get('episode_id')
		var link = goodVideoUrlsQ[id].hd.length ? goodVideoUrlsQ[id].hd[0] : goodVideoUrlsQ[id].sd[0];
		downloadEpisode(link,'openvost/anime/' + $('.shortstoryHead h1').text().split(' / ')[1].match(/([^\[]+)/)[1].replace(/\s+/g,'-').replace(/[^a-zA-Z0-9\s-_\.]+/g,'') + '/' + $(finder).text().replace(' серия','ep').replace(/[^a-zA-Z0-9\s-_\.]+/g,'') + '-720-hd.mp4');
    };
	downloadButton2.innerText = 'Скачать 720p (HD)';

	animPanel.appendChild(downloadButton1);
	animPanel.appendChild(downloadButton2);

	playerDownloadPanel.appendChild(animPanel);

    $('#openvost_anime').append(playerDownloadPanel);

    if ($('#openvost_player2').html() !== '') {
        $('#openvost_player2').html('');
    }
}

var startPlayTime = $.cookie(window.location.pathname + "/time");
if(typeof startPlayTime === 'undefined' || startPlayTime < 5 ) {
    startPlayTime = 0;
}

var $elems = $("#scrolltwo #items .epizode");

player = false;

//set event
$elems.each(function() {
    $elem = $(this);
    var data = parseAjaxFunction($elem);

    var id = data[0];
    var snum = data[1];

    this.onclick = function() {
        $('.continuePlayer').remove();
        if( +snum !== +$.cookie(window.location.pathname) ) {
            $.cookie(window.location.pathname + "/time", 0, {
                expires: 365
            });
        }
        horizontal_scroll_to(id,snum,false);
    };

    if( $elem.hasClass('active') ) {
        horizontal_scroll_to(id,snum,false,0);
        appendContinueDiv('openvost_player2');
    }
});

//play next when current episode is ended
document.addEventListener('end', function () {
    $.cookie(window.location.pathname + "/time", 0, {
        expires: 365
    });

    let $elem = $("#scrolltwo #items .epizode.active").next();

    if( $elem.length ) {
        let data = parseAjaxFunction($elem);
        let id = data[0];
        let snum = data[1];

        getPlayer().Set('repeat',1);
        horizontal_scroll_to(id,snum,true,0);
    } else {
        getPlayer().Set('repeat',0);
        getPlayer().Stop();
    }
}, false);

document.addEventListener('play', function () {
	$('.continuePlayer').remove();
}, false);

//remember time of episode
setInterval(function() {
    var currentTime = Math.floor(getPlayer().CurrentTime());
    if( getPlayer().getStatus() === 1 && getPlayer().Duration() > 0 && getPlayer().Duration() - getPlayer().CurrentTime() >= 20 && +$.cookie(window.location.pathname + "/time") !== currentTime ) {
        $.cookie(window.location.pathname + "/time", currentTime, {
            expires: 365
        });
    }
},5000);