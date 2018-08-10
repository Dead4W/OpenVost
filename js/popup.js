if( location.pathname == '/popup.html' ) {
	var input = document.getElementsByTagName('input')[0];
	if( input ) {
		input.onclick = function(event) {
			console.log('optimization is ' + event.target.checked );
			chrome.storage.sync.set({option_optimization:event.target.checked});
		}
	}

	var optimizationTitle = document.getElementById('optimizationTitle');
	optimizationTitle.onclick = function() {
		input.click();
	}
}

var version = document.getElementById('version');

version.innerText = 'Версия: ' + chrome.runtime.getManifest().version;

chrome.storage.sync.get(['option_optimization','version_new','version_new_url'],function(data) {
	if( typeof(data.option_optimization) !== "undefined" ) {
		input.checked = data.option_optimization;
	}
	if( typeof(data.version_new) !== "undefined" && data.version_new ) {
		version.innerHTML += ' <a target="__blank" href="' + data.version_new_url + '">(Доступна новая версия)</a>';
	}
});