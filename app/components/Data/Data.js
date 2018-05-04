const Mavis = require('../Global/Global');

Mavis.Data = {

	State: {},
	Settings: {},
	Construction: {},
	CableData: {},
	Results: [],

	_loadState: () => {

		return new Promise(function(resolve, reject) {

			let state = Mavis.Global.fs.readFileSync(Mavis.AppPath + '/data/state.json');
			Mavis.Data.State = JSON.parse(state);
			resolve();
		});
	},

	_loadSettings: () => {

		return new Promise(function(resolve, reject) {

			let settings = Mavis.Global.fs.readFileSync(Mavis.AppPath + '/data/' + Mavis.Data.State.currentObject + '/settings.json');
			Mavis.Data.Settings = JSON.parse(settings);
			resolve();
		});
	},

	_loadConstruction: () => {

		return new Promise(function(resolve, reject) {

			let construction = Mavis.Global.fs.readFileSync(Mavis.AppPath + '/data/' + Mavis.Data.State.currentObject + '/construction.json');
			Mavis.Data.Construction = JSON.parse(construction);
			resolve();
		});
	},

	_loadCableData: () => {

		return new Promise(function(resolve, reject) {

			let cableData = Mavis.Global.fs.readFileSync(Mavis.AppPath + '/data/' + Mavis.Data.State.currentObject + '/cableData.json');
			Mavis.Data.CableData = JSON.parse(cableData);
			resolve();
		});
	},

	writeState: () => {

		return new Promise(function(resolve, reject) {

			let state = JSON.stringify(Mavis.Data.State);

			Mavis.Global.fs.writeFile(Mavis.AppPath + '/data/state.json', state, function (err) {

				if (err) {
					Mavis.Notifications.notify(4);
				} else {
					resolve();
				}
			});
		});
	},

	writeSettings: () => {

		return new Promise(function(resolve, reject) {

			let settings = JSON.stringify(Mavis.Data.Settings);

			Mavis.Global.fs.writeFile(Mavis.AppPath + '/data/' + Mavis.Data.State.currentObject + '/settings.json', settings, function (err) {

				if (err) {
					Mavis.Notifications.notify(4);
				} else {
					resolve();
				}
			});
		});
	},

	writeCableData: () => {

		return new Promise(function(resolve, reject) {

			let cableData = JSON.stringify(Mavis.Data.CableData);

			Mavis.Global.fs.writeFile(Mavis.AppPath + '/data/' + Mavis.Data.State.currentObject + '/cableData.json', cableData, function (err) {

				if (err) {
					Mavis.Notifications.notify(4);
				} else {
					resolve();
				}
			});
		});
	},

	_findImage: (array, position) => {

		let BiggerThan = (inArray) => {
		  return inArray > position;
		}

		let 	arrBiggerElements = array.filter(BiggerThan),
				nextElement = Math.min.apply(null, arrBiggerElements),
		   	elementIndex = array.indexOf(nextElement);

		return(elementIndex);
	},

	collectResults: () => {

		return new Promise(function(resolve, reject) {

			let 	settingsData = Mavis.Data.Settings,
					mods = ['automatic', 'din', 'manual'],
					counter = 0;

			Mavis.Data.Results = [];

			Mavis.Data.CableData.forEach(function(cable, c) {

				mods.forEach(function(module, m) {

					cable.modules[module].forEach(function(items, n) {

						if(items.all.length > 0) {

							items.all.forEach(function(item, i) {

								item.cable = c;
								item.color = settingsData[module][n].color;
								item.metric = settingsData.metrics[settingsData[module][n].metric];

								let image = Mavis.Data._findImage(cable.trigger, item.position);
								item.images = image;

								Mavis.Data.Results.push(item);
							});
						}
					});
				});
			});

			resolve();
		});
	},

	init: () => {

		return new Promise(function(resolve, reject) {

			console.log('init Data');

			Mavis.Data._loadState()
			.then(Mavis.Data._loadSettings())
			.then(Mavis.Data._loadConstruction())
			.then(Mavis.Data._loadCableData())
			.then(Mavis.Data.collectResults())
			.then(resolve());
		});
	}
};

module.exports = Mavis.Data;