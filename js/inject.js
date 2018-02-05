$(document).ready(function() {
    if( $('#blockRandomPost a').length ) {
        var randDiv = $('#blockRandomPost a')[0];
        randDiv.addEventListener('mouseover', function(){
            window.linkOver(this)
        });
        randDiv.addEventListener('mouseout', function(){
            window.linkOut(this)
        });
    }
});

if( location.pathname.match(/\/tracked\/?(\d*)\/?/) ) {
    document.addEventListener('openvost-info-animelist',function() {
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
        function constructAnimeTrackedElement(animelist,index) {
            var id = animelist[index];
            $.ajax('https://api.animevost.org/animevost/api/v0.2/GetInfo/' + id).then(function(result) {
                var title = result.data[0].title;
                var description = result.data[0].description;
                var year = result.data[0].year;
                var type = result.data[0].type;
                var genre = result.data[0].genre;
                var onlyTitle = title.match(/([^\[]+)/)[1];
                var poster = result.data[0].urlImagePreview.match(/^http/) ? result.data[0].urlImagePreview : "http://animevost.org" + result.data[0].urlImagePreview;
                var animePage = "http://animevost.org/" + id + "-openvost-redirect.html";

                var element = '<div class="shortstory">\n' +
                    '        <div class="shortstoryHead">\n' +
                    '        <a class="shortstoryShare checkNewEpisodeShortstory" style="right:5px;" data-status="true" data-id="' + id + '"><img class="checkNewEpisode" title="Отслеживать новые серий" src="chrome-extension://ooeealgadmhdnhebkhhbbcmckehpomcj/img/cne_good.png"></a>\n' +
                    '    <h2>\n' +
                    '    <a href="' + animePage + '">' + title + '</a>\n' +
                    '    </h2>\n' +
                    '    </div>\n' +
                    '\n' +
                    '    <div class="shortstoryContent">\n' +
                    '        <table width="100%" border="0" cellspacing="0" cellpadding="0">\n' +
                    '        <tbody><tr>\n' +
                    '        <td>\n' +
                    '        <div style="width: 240px; float: left; margin-right: 12px;">\n' +
                    '        <a href="' + animePage + '">\n' +
                    '        <img class="imgRadius" src="' + poster + '" alt="' + onlyTitle + '" title="' + onlyTitle + '">\n' +
                    '        </a>\n' +
                    '        </div>\n' +
                    '\n' +
                    '        <p><strong>Год выхода: </strong>' + year + '</p>\n' +
                    '    <p><strong>Жанр: </strong>' + genre + '</p>\n' +
                    '    <p><strong>Тип: </strong>' + type + '</p>\n' +
                    '\n' +
                    '\n' +
                    '    <p><strong>Описание: ' + description + '</strong></p>\n' +
                    '    </td>\n' +
                    '    </tr>\n' +
                    '    </tbody>\n' +
                    '    </table>\n' +
                    '    </div>\n' +
                    '    <div class="shortstoryFuter">\n' +
                    '        <form action="#">\n' +
                    '        <a href="' + animePage + '">Смотреть</a>\n' +
                    '        </form>\n' +
                    '    </div>\n' +
                    '    </div>';
                $("#dle-content").append(element);
                if( index+1<animelist.length ) {
                    setTimeout(function() {
                        constructAnimeTrackedElement(animelist,index+1);
                    },100);
                } else {
                    var evObj = document.createEvent('Events');
                    evObj.initEvent('openvost-animetracklist-done', true, true);
                    document.dispatchEvent(evObj);
                }
            });
        }
        var animelist = JSON.parse($("#dle-content").attr("data-anime-list"));
        constructAnimeTrackedElement(animelist,0);
    });
}

var evObj = document.createEvent('Events');
evObj.initEvent('openvost-inject', true, true);
document.dispatchEvent(evObj);