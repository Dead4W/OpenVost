if( location.search.match(/\?openvost_savemoment/) ) {
    function parseURLParams(url) {
        var queryStart = url.indexOf("?") + 1,
            queryEnd   = url.indexOf("#") + 1 || url.length + 1,
            query = url.slice(queryStart, queryEnd - 1),
            pairs = query.replace(/\+/g, " ").split("&"),
            parms = {}, i, n, v, nv;

        if (query === url || query === "") return;

        for (i = 0; i < pairs.length; i++) {
            nv = pairs[i].split("=", 2);
            n = decodeURIComponent(nv[0]);
            v = decodeURIComponent(nv[1]);

            if (!parms.hasOwnProperty(n)) parms[n] = [];
            parms[n].push(nv.length === 2 ? v : null);
        }
        return parms;
    }
    function rand_string(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    document.addEventListener("DOMContentLoaded", function() {
        var params = parseURLParams(location.href);

        var video = document.getElementsByTagName('video')[0];
        video.style.display = "none";
        video.volume = 0;
        video.muted = true;
        video.currentTime = +params.openvost_savemoment[0];
        video.pause();

        video.addEventListener('loadeddata',function() {
            document.body.style.background = "#fff";
            document.documentElement.style.width = '100vw';
            document.documentElement.style.height = '100vh';
            document.documentElement.style.overflow = 'hidden';

            var loadImage = document.createElement('img');
            loadImage.src = "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif";
            loadImage.style.position = "fixed";
            loadImage.style.zIndex = "999";
            loadImage.style.width = '100vw';
            loadImage.style.height = '100vh';

            document.body.appendChild(loadImage);
            document.body.style.margin = 0;

            var canvas = document.createElement('canvas');
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            var data = canvas.toDataURL('image/png');

            var a = document.createElement('a');
            a.setAttribute("download", params.name[0] + "_" + rand_string(4) + ".png");
            a.setAttribute("href", data);
            a.click();
            setTimeout(function() {
                window.close();
            }, 600);
        })
    });
}