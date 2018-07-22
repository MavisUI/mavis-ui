const Mavis = require('../Global/Global');

Mavis.Pages = {

	Views: {

		_model: () => {

			return new Promise(function(resolve, reject) {
				Mavis.Model.init()
				.then(resolve());
			});
		},

		_inspection: data => {

			return new Promise(function(resolve, reject) {

				Mavis.Inspection.init(data)
				.then(resolve());
			});
		},

		_report: () => {

			return new Promise(function(resolve, reject) {

				Mavis.Report.init()
				.then(resolve());
			});
		},

		_settings: () => {

			return new Promise(function(resolve, reject) {

				Mavis.Settings.init()
				.then(resolve());
			});
		}
	},

	clearPage: () => {
		return new Promise(function(resolve, reject) {
			const content = document.getElementById('content');
			content.innerHTML = '';
      // document.getElementById('comment').classList.add('hidden');
			resolve();
		});
	},

	loadPage: (mod, data) => {

		const app = document.getElementById('app');

		// if no mod has been passed (which would be an error), load the model screen;
		if(!mod) mod = 'model';
		if(!data) {
		  data = {};
		  data.cable = 0;
		  data.position = 0;
    }

		// check if notification is still visible and remove it
		if(Mavis.Notifications.Status) {
			Mavis.Notifications.Status = false;
			Mavis.Notifications.noted();
		}

		Mavis.LoadingScreen.toggle('show')
		.then(Mavis.Pages.clearPage())
		.then(function() {

			let title = '';

			// set app class for css inheritance in modules
			app.setAttribute('class', mod);

			// print message on loading screen
			Mavis.LoadingScreen.message('initializing ' + mod);

			// load module
			switch(mod) {

				case 'model':

					Mavis.Pages.Views._model();
					title = '3D Modell';
					break;

				case 'inspection':

					Mavis.Pages.Views._inspection(data);
					title = 'Visuelle Inspektion';
					break;

				case 'report':

					Mavis.Pages.Views._report(data);
					title = 'Reports';
					break;

				case 'settings':

					Mavis.Pages.Views._settings();
					title = 'Einstellungen';
					break;
			}

			Mavis.Header.updateTitle(title);

		})
		.then(Mavis.LoadingScreen.toggle());
	}
};

module.exports = Mavis.Pages;
