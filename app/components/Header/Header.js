const Mavis = require('../Global/Global');

Mavis.Header = {

	updateTitle: function(txt) {
		document.getElementById('pageTitle').innerHTML = txt;
	},

	toggleHeaderIcon: function(state) {

		document.getElementById('navIcon').setAttribute('class', state);

		var title = document.getElementById('pageTitle'),
			menu = document.getElementById('menuTitle');

		if(state === 'open') {
			title.setAttribute('class', 'hidden');
			menu.setAttribute('class', '');
		} else {
			title.setAttribute('class', '');
			menu.setAttribute('class', 'hidden');
		}
	},

	_events: function() {

		return new Promise(function(resolve, reject) {

			// click on header menu link
			document.getElementById('mainMenuToggle').addEventListener('click', function(e) {

				Mavis.MainMenu.toggleMainMenu();

			});

			resolve();
		});
	},

	init: function() {

		return new Promise(function(resolve, reject)  {

			console.log('init Header');

			Mavis.LoadingScreen.message('initializing Header');

			Mavis.Header._events()
			.then(resolve());

		});
	}
};

module.exports = Mavis.Header;