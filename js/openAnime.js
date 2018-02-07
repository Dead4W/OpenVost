$('#player2').html('');

var st = {
    "default": "#07b02206306e07407206c05f06c06906e06502203a07b00a02206207506606606c06906e06506306f06c06f07202203a02206606606606606606602202c00a02206802203a03402c02206206705f06f02203a03002c00a02206306f06c06f07205f06c06f06106402203a02203002202c00a02206206705f06102203a03002e03102c00a02206106c06c05f06102203a03102c00a02206c06f06106405f06102203a03002e03302c00a02207306805f06102203a03002e03402c00a02206306f06c06f07205f06106c06c02203a02203303703303703303702202c00a02206306f06c06f07205f07006c06107902203a02203503903703406106302207d02c00a02206306e07407206c06f07507406806506906706807402203a03303902c00a02206306e07407206c06206706306f06c06f07202203a02203306403306403306402202c00a02206306e07407206c06206706106c07006806103102203a03002e03702c00a02206306e07407206c05f07007206f06306506e07402203a07b02206306f06c06f07202203a02206606606606606606602207d02c00a02206306e07407206c05f07207506e05f07606f06c07506d06502203a07b02206802203a03602c02206306f06c06f07202203a02206306306306306306302202c02207702203a03607d02c00a02206e06f07406507306206706306f06c06f07202203a02203002202c00a02206e06f05f06802203a03303903002c00a02206306e07407206c05f06207506606606507202203a07b02206906306f06e02203a02203102202c02206306f06c06f07202203a02206606606606606606602202c02206306506e07406507202203a02203102207d02c00a02207307407206506106d02203a03102c00a02206e06f05f07702203a03603903402c00a02206306e07407206c05f07207506e02203a07b02206906306f06e02203a03002c02206802203a03602c02206306f06c06f07202203a02206306306306306306302202c02207702203a03602c02206d06107206706906e06c06506607402203a02d03207d02c00a02206306e07407206c05f06607506c06c02203a07b02206906306f06e02203a02203202202c02207306805f06102203a03002e03402c02207306802203a02203102202c02206d06107206706906e06c06506607402203a03207d02c00a02206306f06e07407206f06c07302203a02207006c06107902c07c02c07406906d06505f07006c06107902c06c06906e06502c07406906d06505f06206106306b02c07606f06c07506d06502c07606f06c06206107206c06906e06502c07c02c06607506c06c02c07307406107207402c07007206f06306506e07402c06207506606606507202c07207506e05f06c06906e06502c07207506e05f07606f06c07506d06502202c00a02206306e07407206c05f07006c06107902203a07b02207306805f06102203a03002e03402c02207306306106c06502203a03102e03502c02206d06107206706906e07206906706807402203a03103002c02206106c07006806102203a03002e03902c02206906306f06e02203a02203102202c02207306802203a02203102202c02206d06107206706906e06c06506607402203a03103307d02c00a02206306e07407206c06806906406502203a03102c02206306e07407206c05f07306507006107206107406f07202203a07b02207306306106c06502203a03202e03102c02206d06107206706906e07406f07002203a03202c02206106c07006806102203a03002e03302c02206306f06c06f07202203a02203002207d02c00a02206306e07407206c05f06806402203a07b02206906306f06e02203a02203c06903e03c06203e04804403c02f06203e03c02f06903e02202c02207306306106c06502203a03102e03307d02c00a02207306906402203a02203103603902d03103203303702202c02206306e07407206c05f07406906d06505f06206106306b02203a07b02206906306f06e02203a02203302202c02207306306106c06502203a03102e03102c02206d06107206706906e07406f07002203a03102c02206d06107206706906e07206906706807402203a03402c02206d06107206706906e06206f07407406f06d02203a03207d02c00a02206306e07407206c06206706607506c06c02203a03102c02206206706306f06c06f07202203a02206606606606606606602202c02206d02203a02207606906406506f02202c02206306e07407206c05f07307406107207402203a07b02206206702203a02203102202c02206206705f06802203a03803002c02206206705f06102203a03002e03103502c02206906306f06e02203a02203102202c02207306306106c06503202203a03202e03802c02206206705f07702203a03803002c02206206705f07306802203a02203102207d02c00a02206306e07407206c05f07606f06c07506d06502203a07b02207306805f06102203a03002e03402c02207306306106c06502203a03102e03102c02206d06107206706906e07406f07002203a03102c02206906306f06e02203a02203102202c02207306802203a02203102202c02206d06107206706906e06c06506607402203a03107d02c00a02206306e07407206c05f07406906d06505f07006c06107902203a07b02206206705f06f02203a03002c02206d06107206706906e07406f07002203a03102c02207306805f06206c07507202203a03103002c02206d06107206706906e06206f07407406f06d02203a03202c02206906306f06e02203a02203302202c02207306306106c06502203a03102e03102c02206206705f07306802203a02203102202c02206d06107206706906e06c06506607402203a03207d02c00a02207106806906406506607506c06c02203a03102c02206107507406f02203a02206e06f06e06502202c02207007206f02203a03102c02206306e07407206c05f07606f06c06206107206c06906e06502203a07b02206802203a03402c02206d06107206706906e07206906706807402203a03202c02206106c06c05f06102203a03102c02206306f06c06f07205f06c06f06106402203a02203503903703406106302202c02207702203a03603002c02206306f06c06f07205f06106c06c02203a02203303703303703303702207d02c00a02206607306306106c06502203a02203202202c02206c06106e06702203a02207207502202c02206806906406506106c07706107907302203a03102c00a00a02206507606506e07407302203a07b02207006c06107902203a02206807407407003a02f02f07006c06107902e06106e06906c06106e06402e06f07206702f07307406107402e07006807003f06906403d03203103403703403003703503903602202c02207307406107207402203a02206807407407003a02f02f07006c06107902e06106e06906c06106e06402e06f07206702f07307406107402e07006807003f06906403d03203103403703403003703503903602207d07d",
};

function open_vost(id,snum,autoplay,startPlayTime) {

    var num = snum - 2;
    if (num < 0) {
        num = 0
    }
    $('.active').removeClass('active');
    $('#scrolltwo').scrollTo("#p" + num, 500, {
        axis: 'x'
    });
    $("#p" + snum).addClass('active');
    if( !startPlayTime || autoplay  ) {
        $.cookie(window.location.pathname, snum, {
            expires: 365
        });
        $.cookie("time" + window.location.pathname, 0, {
            expires: 365
        });
    }

    var videolinks = "http://new.aniland.org/720/" + id + ".mp4|http://new.aniland.org/" + id + ".mp4|http://tk.aniland.org/" + id + ".mp4|http://fast.aniland.org/" + id + ".mp4|http://mp4.aniland.org/" + id + ".mp4";
    var poster = "http://media.aniland.org/img/" + id + ".jpg";

    if( player ) {
        player.Set("poster",poster);
        if(!startPlayTime) {
            player.Set("start","0");
        }
        if( autoplay ) {
            player.Play(videolinks);
        } else {
            player.Set("file",videolinks);
            player.Stop();
        }
    } else {
        player = new Uppod({
            m: "video",
            st: st.default,
            uid: "player2",
            file: videolinks,
            poster: poster,
            h: "390",
            start: startPlayTime ? startPlayTime : 0
        });
    }

    player.Set('repeat',1);
}

/*
function open_vost_kino(id,snum,autoplay,startPlayTime) {
    var num = snum - 2;
    if (num < 0) {
        num = 0
    }
    $('.kactive').removeClass('kactive');
    $('#scroll').scrollTo("#" + num, 500, {
        axis: 'x'
    });
    $("#" + snum).addClass('kactive');

    $.cookie(window.location.pathname, snum, {
        expires: 365
    });
    $.cookie("time" + window.location.pathname, 0, {
        expires: 365
    });

    if( kinoPlayer ) {
        kinoPlayer.Set("file","http://tk.aniland.org/" + id + ".mp4|http://fast.aniland.org/" + id + ".mp4|http://mp4.aniland.org/" + id + ".mp4");
        kinoPlayer.Set("poster","http://media.aniland.org/img/" + id + ".jpg");
        kinoPlayer.Set("start","0");
        kinoPlayer.Stop();
    } else {
        kinoPlayer = new Uppod({
            m: "video",
            st: "",
            uid: "player",
            file: "http://tk.aniland.org/" + id + ".mp4|http://fast.aniland.org/" + id + ".mp4|http://mp4.aniland.org/" + id + ".mp4",
            poster: "http://media.aniland.org/img/" + id + ".jpg",
            h: "559"
        });
    }
}
*/

var startPlayTime = Math.floor($.cookie("time" + window.location.pathname));
if(startPlayTime === undefined) {
    startPlayTime = 0;
}

var $elems = $("#scrolltwo #items .epizode");
var count = $elems.length;
var player = false;
//var kinoPlayer = false;

//set event
$elems.each(function() {
    $elem = $(this);
    var data = $elem.attr('onclick').replace(/ajax2|[\(\);]/g,'').split(',');

    var id = data[0];
    var snum = data[1];

    this.onclick = function() {
        open_vost(id,snum,false);
    };

    if( $elem.hasClass('active') ) {
        open_vost(id,snum,false,startPlayTime);
    }

    //remember time of episode
    if (!--count) {
        setInterval(function() {
            if( //$("#kinoplayer").css('display') == "none" &&
                player.getStatus() === 1 && player.Duration() > 0 && player.Duration() - player.currentTime() >= 10 && Math.floor($.cookie("time" + window.location.pathname)) != player.currentTime() ) {
                $.cookie("time" + window.location.pathname, player.currentTime(), {
                    expires: 365
                });
            }
            /*
            if( $("#kinoplayer").css('display') == "none" && kinoPlayer) {
                kinoPlayer.Stop();
            }
            */
        },4000)
    }
});

//set event kino player
/*
$elems = $("#list .series");
$elems.each(function() {
    $elem = $(this);
    var data = $elem.attr('onclick').replace(/ajax|[\(\);]/g,'').split(',');

    var id = data[0];
    var snum = data[1];

    unbindEpisode(this.id);

    this.onclick = function() {
        open_vost_kino(id,snum,false);
    };

    if( $elem.hasClass('kactive') ) {
        open_vost_kino(id,snum,false);
    }
});
 */

//episode download button
/*
$(".functionPanel div").css('width','25%').first().before("<a href=\"#download\" class=\"downloadEpisode fastPunkt\">Скачать серию</a>").parent().find('.downloadEpisode').css({
    "display": "block",
    "cursor": "pointer",
    "width": "170px"
}).on('click',function() {
    var href = player.Get(['file']).substr(0,player.Get(['file']).indexOf("|"));
    $('.downloadEpisode').attr('href',href).attr('download','');
});
 */

/*
$('#kinoon').on('click',function() {
    if( player ) {
        player.Pause();
    }
});
$(document).on('keyup',function(e) {
    if(e.keyCode===27 && kinoPlayer) {
        kinoPlayer.Stop();
    }
});
 */

//play next when current episode is ended
document.addEventListener('end', function () {
    if( $('.mfp-content').length ) {
        return;
    }
    var $elem = $("#scrolltwo #items .epizode.active").next();
    if( $elem.length ) {
        var data = $elem.attr('onclick').replace(/ajax2|[\(\);]/g,'').split(',');

        var id = data[0];
        var snum = data[1];

        open_vost(id,snum,true,0);
        return false;
    } else {
        player.Set('repeat',0);
        player.Stop();
    }
}, false);