if( location.pathname.match(/\/tracked\/?(\d*)\/?/) ) {
    var imgCheckEpisodeGood = $('#dle-content').attr('data-openvost-cne-good');

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
            $.post('https://api.animevost.org/v1/info',{id:id}).success(function(result) {
                var title = result.data[0].title;
                var description = result.data[0].description.replace(/\\/g,'');
                var year = result.data[0].year;
                var type = result.data[0].type;
                var genre = result.data[0].genre;
                var onlyTitle = title.match(/([^\[]+)/)[1];
                var poster = result.data[0].urlImagePreview.match(/^http/) ? result.data[0].urlImagePreview : "http://animevost.org" + result.data[0].urlImagePreview;
                var animePage = "http://animevost.org/" + id + "-openvost-redirect.html";
                var rating = (result.data[0].rating / result.data[0].votes * 2).toFixed(1);

                var element = '<div class="shortstory">\n' +
                    '        <div class="shortstoryHead">\n' +
                    '        <a class="shortstoryShare checkNewEpisodeShortstory" style="right:5px;" data-status="true" data-id="' + id + '"><img class="checkNewEpisode" title="Отслеживать новые серий" src="' + imgCheckEpisodeGood + '"></a>\n' +
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
                    '<p><strong>Режиссёр: </strong><span itemprop="director"><a href="/xfsearch/' + encodeURIComponent(result.data[0].director) + '/">' + result.data[0].director + '</a></span></p>' +
                    '<div><strong>Рейтинг: </strong><div class="ratingIn" id="ratig-layer-' + id + '"><div class="rating">\n' +
                    '<ul class="unit-rating">\n' +
                    '<li class="current-rating" style="width:' + rating*10 + '%;">' + rating + '</li>\n' +
                    '<li><a href="#" title="Плохо" class="r1-unit" onclick="doRate(\'1\', \'' + id + '\'); return false;">1</a></li>\n' +
                    '<li><a href="#" title="Приемлемо" class="r2-unit" onclick="doRate(\'2\', \'' + id + '\'); return false;">2</a></li>\n' +
                    '<li><a href="#" title="Средне" class="r3-unit" onclick="doRate(\'3\', \'' + id + '\'); return false;">3</a></li>\n' +
                    '<li><a href="#" title="Хорошо" class="r4-unit" onclick="doRate(\'4\', \'' + id + '\'); return false;">4</a></li>\n' +
                    '<li><a href="#" title="Отлично" class="r5-unit" onclick="doRate(\'5\', \'' + id + '\'); return false;">5</a></li>\n' +
                    '</ul>\n' +
                    '</div></div>&nbsp;<span style="font-size:11px; color:#000;">(<span id="vote-num-id-' + id + '">' + rating + '/10</span>)</span></div>' +
                    '    <p><strong>Описание: </strong><span itemprop="description">' + description + '</span></p>\n' +
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
                    $("#dle-content").append('<div class="block_2">\n' +
                        '<table width="100%" border="0" cellspacing="0" cellpadding="0">\n' +
                        '<tbody><tr>\n' +
                        '<td class="block_3"></td>\n' +
                        '<td class="block_4"></td>\n' +
                        '<td class="block_5"></td>\n' +
                        '</tr>\n' +
                        '</tbody></table>\n' +
                        '</div>');
                    var evObj = document.createEvent('Events');
                    evObj.initEvent('openvost-animetracklist-done', true, true);
                    document.dispatchEvent(evObj);
                }
            }).fail(function() {
                throw new Error('OpenVost api error');
            });
        }
        var animelist = JSON.parse($("#dle-content").attr("data-anime-list"));
        if( animelist.length ) {
            constructAnimeTrackedElement(animelist,0);
        }
    });
}

var evObj = document.createEvent('Events');
evObj.initEvent('openvost-inject', true, true);
document.dispatchEvent(evObj);