const Mavis = require('../Global/Global');

Mavis.MainMenu = {

	toggleMainMenu: state => {

		const menu = document.getElementById('mainMenu'),
          menuState = menu.getAttribute('class');

		if(state) {
		  menu.setAttribute('class', state);
			Mavis.Header.toggleHeaderIcon('');
		} else {
			if(menuState === 'hidden') {
				menu.classList.remove('hidden');
				Mavis.Header.toggleHeaderIcon('open');
			} else {
				menu.classList.add('hidden');
				Mavis.Header.toggleHeaderIcon('');
			}
		}
	},

	_events: () => {
		return new Promise((resolve, reject) => {
			document.getElementById('mainMenuClose').addEventListener('click', function(e) {
				Mavis.MainMenu.toggleMainMenu('hidden');
			});

			var mainMenuLinks = document.querySelectorAll('#mainMenuLinks a'),
				i;

			for(i=0;i<mainMenuLinks.length;i++) {
				mainMenuLinks[i].addEventListener('click', function(e) {
					let text = this.innerHTML,
							mod = this.getAttribute('data-href');

					// check if there is any unsafed data
					// if(MAVIS.SETTINGS.PENDING === true) {

						// MAVIS.NOTIFICATIONS.notify(5);
						// MAVIS.SETTINGS.PENDING = false;

					// } else {

						Mavis.MainMenu.toggleMainMenu('hidden');

						// load site content
						Mavis.Pages.loadPage(mod);

					// }
				});
			}
			resolve();
		});
	},

	init: () => {
		return new Promise((resolve, reject) => {
			Mavis.MainMenu._events()
			.then(() => {
        console.log('init MainMenu');
        resolve();
      });
		});
	}
};

module.exports = Mavis.MainMenu;

/*
	menu: function() {

		return new Promise(function(resolve, reject) {

			// handle event on menu-title click
			$('#page_title').on('click', function() {

				// show menu
				$('header menu').toggleClass('hidden');

				// change chevron-icon direction
				$('#page_title').toggleClass('up');


				if($('#app').hasClass('model')) {
					$('#cable_info').removeClass('show');
					MAVIS.MODEL.CONTROLS.intersect = 0;
				}
			});



			resolve();
		});
	},
*/
