const Mavis = require('../Global/Global');

Mavis.LoadingScreen = {

	toggle: function(state) {

		return new Promise(function(resolve, reject) {

			const loadingScreen = document.getElementById('loading'),
					spinner = document.getElementById('spinnerElement');

			if(state === 'show') {
				loadingScreen.classList.remove('hidden');
				spinner.classList.add('spinning');
			} else {
				setTimeout(function() {
					loadingScreen.classList.add('hidden');
					spinner.classList.remove('spinning');
				}, 1000);
			}

			resolve();
		});
	},

	message: function(txt) {

		return new Promise(function(resolve, reject) {

			setTimeout(function() {
				const statusText = document.getElementById('statusText');
				statusText.innerHTML = txt;
				resolve();
			}, 100);
		});
	},

	init: function() {

		return new Promise(function(resolve, reject) {

			console.log('init LoadingScreen');

			Mavis.LoadingScreen.message('Loading Application')
			.then(resolve());
		});
	}
};

module.exports = Mavis.LoadingScreen;