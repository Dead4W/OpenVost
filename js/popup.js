

async function render_options() {
	const insert_elem = document.querySelector('#checkbox-options');
	let options_boolean = [];

	for (let name in CONFIG_VAR_CASTS) {
		let type = CONFIG_VAR_CASTS[name];

		if (type === CONFIG_CASTS.BOOLEAN_TYPE) {
			options_boolean.push(name);
		}
	}

	for (let i = 0; i < options_boolean.length; i++) {
		let name = options_boolean[i];
		let value = await CONFIG_MANAGER.get(name);
		let title = name;

		if (name in CONFIG_VAR_TITLES) {
			title = CONFIG_VAR_TITLES[name];
		}

		const elem = document.querySelector('.example-boolean.config-option-block').cloneNode(true);

		elem.querySelector('.config-option-title').innerText = title;

		const input = elem.querySelector('input');
		input.checked = value;
		input.dataset.option = name;

		elem.onclick = (_) => {
			input.checked = !input.checked;
			CONFIG_MANAGER.set(name, input.checked);
			return false;
		}
		elem.style.display = 'block';

		console.log('insert');
		insert_elem.appendChild(elem);
	}
}

if( location.pathname === '/popup.html' ) {
	render_options().then();
}

const version = document.getElementById('version');

version.innerText = 'Версия: ' + current_version;

// chrome.storage.sync.get(['option_optimization','version_new','version_new_url'],function(data) {
// 	if( typeof(data.option_optimization) !== "undefined" ) {
// 		input.checked = data.option_optimization;
// 	}
// 	if( typeof(data.version_new) !== "undefined" && data.version_new ) {
// 		version.innerHTML += ' <a target="__blank" href="' + escapeHtml(data.version_new_url) + '">(Доступна новая версия)</a>';
// 	}
// });