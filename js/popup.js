

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

const version_elem = document.getElementById('version');
const change_title_elem = document.querySelector('#changelog-title');

version_elem.innerText = 'Версия: ' + current_version;

fetch('https://openvost.org/update')
	.then((response) => {
		return response.json();
	}).then((data) => {
	const version = data['hash'];
	const version_date = data['date'];

	if (change_title_elem) {
		if (version !== current_version) {
			change_title_elem.innerText = `Вы можете обновится до версии ${version} (${version_date})`;
		} else {
			change_title_elem.innerText = `Поздравляю, у вас актуальная версия ${version} (${version_date})`;
		}

		const changelog_options_elem = document.querySelector('#changelog-options');

		for (let i = 0; i < data['changelog'].length; i++) {
			let changelog_option_title = data['changelog'][i];
			let changelog_option_title_elem = document.createElement('li');

			changelog_option_title_elem.innerText = changelog_option_title;

			changelog_options_elem.appendChild(changelog_option_title_elem);
		}
	}

	if (version !== current_version) {
		const new_version_elem = document.createElement('a');
		new_version_elem.style.display = 'block';
		new_version_elem.target = '_black';
		new_version_elem.href = data['url'];
		new_version_elem.innerText = `(Доступна новая версия от ${version_date}`;

		version_elem.appendChild(new_version_elem);
	}
});