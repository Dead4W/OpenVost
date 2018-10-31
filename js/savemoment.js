function parseURLParams(url) {
	var queryStart = url.indexOf("#") + 1,
		queryEnd   = url.length + 1,
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
	var params = parseURLParams(location.hash);

	var video = document.getElementsByTagName('video')[0];
	video.style.display = "none";
	video.volume = 0;
	video.muted = true;
	video.currentTime = +params.openvost_savemoment[0];
	video.pause();
	document.body.innerHTML += '<span style="color: #fff;font-size: 33px;text-align: center;display: block;top: 20vh;position: absolute;width: 100%;">Сохранение :3</span>'

	video.addEventListener('loadeddata',function() {
		var canvas = document.createElement('canvas');
		canvas.height = video.videoHeight;
		canvas.width = video.videoWidth;
		var ctx = canvas.getContext('2d');
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		var data = canvas.toDataURL('image/png');
		
		chrome.runtime.sendMessage({type: "save_screenshot", options: {
			type: "basic",
			name: 'openvost/screenshots/' + params.name[0] + "-" + rand_string(4) + ".png",
			data: data
		}});
		
		video.remove();
		window.close();
	})
});