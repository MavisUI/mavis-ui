const Mavis = require('../Global/Global');

Mavis.Data = {

	State: {},
	Settings: {},
	Construction: {},
	CableData: {},
	Results: [],
  Filtered: [],

  Sort: {

    Order: 0,

    _cableAscending: () => {

      let sorted = Mavis.Data.Results.sort(function(a, b) {
        return a.cable - b.cable;
      });

      Mavis.Data.Filtered = [];

      sorted.forEach(function(item, i) {
        Mavis.Data.Filtered.push(item);
      });
    },

    _cableDescending: () => {

      let sorted = Mavis.Data.Results.sort(function(a, b) {
        return b.cable - a.cable;
      });

      Mavis.Data.Filtered = [];

      sorted.forEach(function(item, i) {
        Mavis.Data.Filtered.push(item);
      });
    },

    _markerAscending: () => {

      let sorted = Mavis.Filter.Data.Results.sort(function(a, b) {
        let x = a.label.toLowerCase().substring(0, 12),
          y = b.label.toLowerCase().substring(0, 12);
        return x < y ? -1 : x > y ? 1 : 0;
      });

      Mavis.Data.Filtered = [];

      sorted.forEach(function(item, i) {
        Mavis.Data.Filtered.push(item);
      });
    },

    _markerDescending: () => {

      let sorted = Mavis.Filter.Data.Results.sort(function(a, b) {
        let x = a.label.toLowerCase().substring(0, 12),
          y = b.label.toLowerCase().substring(0, 12);
        return x < y ? 1 : x > y ? -1 : 0;
      });

      Mavis.Data.Filtered = [];

      sorted.forEach(function(item, i) {
        Mavis.Data.Filtered.push(item);
      });
    },

    _positionAscending: () => {

      let sorted = Mavis.Data.Results.sort(function(a, b) {
        return a.position - b.position;
      });

      Mavis.Data.Filtered = [];

      sorted.forEach(function(item, i) {
        Mavis.Data.Filtered.push(item);
      });
    },

    _positionDescending: () => {

      let sorted = Mavis.Data.Results.sort(function(a, b) {
        return b.position - a.position;
      });

      Mavis.Data.Filtered = [];

      sorted.forEach(function(item, i) {
        Mavis.Data.Filtered.push(item);
      });
    },

    _ratingAscending: () => {

      let sorted = Mavis.Data.Results.sort(function(a, b) {
        return a.rating - b.rating;
      });

      Mavis.Data.Filtered = [];

      sorted.forEach(function(item, i) {
        Mavis.Data.Filtered.push(item);
      });
    },

    _ratingDescending: () => {

      let sorted = Mavis.Data.Results.sort(function(a, b) {
        return b.rating - a.rating;
      });

      Mavis.Data.Filtered = [];

      sorted.forEach(function(item, i) {
        Mavis.Data.Filtered.push(item);
      });
    },

    _valueAscending: () => {

      let sorted = Mavis.Data.Results.sort(function(a, b) {
        return a.value - b.value;
      });

      Mavis.Data.Filtered = [];

      sorted.forEach(function(item, i) {
        Mavis.Data.Filtered.push(item);
      });
    },

    _valueDescending: () => {

      let sorted = Mavis.Data.Results.sort(function(a, b) {
        return b.value - a.value;
      });

      Mavis.Data.Filtered = [];

      sorted.forEach(function(item, i) {
        Mavis.Data.Filtered.push(item);
      });
    },

    _sortData: () => {

      return new Promise(function(resolve,reject) {

        switch (Mavis.Data.Sort.Order) {

          case 0:
            Mavis.Data.Sort._cableAscending();
            break;

          case 1:
            Mavis.Data.Sort._cableDescending();
            break;

          case 2:
            Mavis.Data.Sort._markerAscending();
            break;

          case 3:
            Mavis.Data.Sort._markerDescending();
            break;

          case 4:
            Mavis.Data.Sort._positionAscending();
            break;

          case 5:
            Mavis.Data.Sort._positionDescending();
            break;

          case 6:
            Mavis.Data.Sort._ratingAscending();
            break;

          case 7:
            Mavis.Data.Sort._ratingDescending();
            break;

          case 8:
            Mavis.Data.Sort._valueAscending();
            break;

          case 9:
            Mavis.Data.Sort._valueDescending();
            break;
        }

        resolve();
      });
    }
  },

  Filter: {

    Cable: undefined,
    Sides: undefined,
    Rating: undefined,
    Marker: undefined,

    filterData: () => {

      return new Promise(function(resolve, reject) {

        let data = Mavis.Data.Results;

        let _cables = item => {
          if(Mavis.Data.Filter.Cable === item.cable) return item;
        }

        let _sides = item => {
          if(item.sides.indexOf(Mavis.Data.Filter.Sides) >= 0) return item;
        }

        let _rating = item => {
          if(Mavis.Data.Filter.Rating === (item.rating + 1)) return item;
        }

        let _marker = item => {
          if(Mavis.Data.Filter.Marker === item.case) return item;
        }

        let _filter = () => {
          if(Mavis.Data.Filter.Cable !== undefined) data = data.filter(_cables);
          if(Mavis.Data.Filter.Sides !== undefined) data = data.filter(_sides);
          if(Mavis.Data.Filter.Rating !== undefined) data = data.filter(_rating);
          if(Mavis.Data.Filter.Marker !== undefined) data = data.filter(_marker);
        }

        _filter();

        Mavis.Data.Filtered = data;

        resolve();
      });
    }
  },

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

		let arrBiggerElements = array.filter(BiggerThan),
				nextElement = Math.min.apply(null, arrBiggerElements),
		   	elementIndex = array.indexOf(nextElement);

		return(elementIndex);
	},

	collectResults: () => {

		return new Promise(function(resolve, reject) {

			let settingsData = Mavis.Data.Settings,
					mods = ['automatic', 'din', 'manual'];

			Mavis.Data.All = [];

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
      .then(Mavis.Data.Filter.filterData())
			.then(resolve());
		});
	}
};

module.exports = Mavis.Data;