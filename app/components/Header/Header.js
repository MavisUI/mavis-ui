const Mavis = require('../Global/Global');

Mavis.Header = {

	updateTitle: txt => {
		document.getElementById('pageTitle').innerHTML = txt;
	},

	toggleHeaderIcon: state => {
	  document.getElementById('navIcon').setAttribute('class', state);
		let title = document.getElementById('pageTitle'),
			menu = document.getElementById('menuTitle');
		if(state === 'open') {
			title.setAttribute('class', 'hidden');
			menu.setAttribute('class', '');
		} else {
			title.setAttribute('class', '');
			menu.setAttribute('class', 'hidden');
		}
	},

	_events: () => {
	  return new Promise((resolve, reject) => {
			document.getElementById('mainMenuToggle').addEventListener('click', function(e) {
			  Mavis.MainMenu.toggleMainMenu();
			});
			resolve();
		});
	},

	init: () => {
	  return new Promise((resolve, reject) => {
	    Promise.all([
        Mavis.LoadingScreen.message('initializing Header'),
        Mavis.Header._events()
      ]).then(() => {
        console.log('init Header');
        resolve();
      });
		});
	}
};

module.exports = Mavis.Header;