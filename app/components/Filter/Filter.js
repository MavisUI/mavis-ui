const Mavis = require('../Global/Global');

Mavis.Filter = {

	Module: undefined,

	Data: {

		Cable: 0,
		Sides: 0,
		Rating: 0,
		Marker: 0,
		Results: [],

		filterData: () => {

			return new Promise(function(resolve, reject) {

				let data = Mavis.Data.Results;

				let _cables = item => {
					if(Mavis.Filter.Data.Cable === (Number(item.cable)) + 1) return item;
				}

				let _sides = item => {
					if(item.sides.indexOf(Mavis.Filter.Data.Sides) >= 0) return item;
				}

				let _rating = item => {
					if(Mavis.Filter.Data.Rating === (item.rating + 1)) return item;
				}

				let _marker = item => {
					if(Mavis.Filter.Data.Marker === item.case) return item;
				}

				let _filter = () => {
					if(Mavis.Filter.Data.Cable) data = data.filter(_cables);
					if(Mavis.Filter.Data.Sides) data = data.filter(_sides);
					if(Mavis.Filter.Data.Rating) data = data.filter(_rating);
					if(Mavis.Filter.Data.Marker) data = data.filter(_marker);
				}

				_filter();

				Mavis.Filter.Data.Results = data;

				resolve();
			});
		}
	},

	Sort: {

		Order: 0,

		_cableAscending: () => {

			let sorted = Mavis.Filter.Data.Results.sort(function(a, b) {
				return a.cable - b.cable;
			});

			Mavis.Filter.Data.Results = [];

			sorted.forEach(function(item, i) {
				Mavis.Filter.Data.Results.push(item);
			});
		},

		_cableDescending: () => {

			let sorted = Mavis.Filter.Data.Results.sort(function(a, b) {
				return b.cable - a.cable;
			});

			Mavis.Filter.Data.Results = [];

			sorted.forEach(function(item, i) {
				Mavis.Filter.Data.Results.push(item);
			});
		},

		_markerAscending: () => {

			let sorted = Mavis.Filter.Data.Results.sort(function(a, b) {
				let 	x = a.label.toLowerCase().substring(0, 12),
						y = b.label.toLowerCase().substring(0, 12);
				return x < y ? -1 : x > y ? 1 : 0;
			});

			Mavis.Filter.Data.Results = [];

			sorted.forEach(function(item, i) {
				Mavis.Filter.Data.Results.push(item);
			});
		},

		_markerDescending: () => {

			let sorted = Mavis.Filter.Data.Results.sort(function(a, b) {
				let 	x = a.label.toLowerCase().substring(0, 12),
						y = b.label.toLowerCase().substring(0, 12);
				return x < y ? 1 : x > y ? -1 : 0;
			});

			Mavis.Filter.Data.Results = [];

			sorted.forEach(function(item, i) {
				Mavis.Filter.Data.Results.push(item);
			});
		},

		_positionAscending: () => {

			let sorted = Mavis.Filter.Data.Results.sort(function(a, b) {
				return a.position - b.position;
			});

			Mavis.Filter.Data.Results = [];

			sorted.forEach(function(item, i) {
				Mavis.Filter.Data.Results.push(item);
			});
		},

		_positionDescending: () => {

			let sorted = Mavis.Filter.Data.Results.sort(function(a, b) {
				return b.position - a.position;
			});

			Mavis.Filter.Data.Results = [];

			sorted.forEach(function(item, i) {
				Mavis.Filter.Data.Results.push(item);
			});
		},

		_ratingAscending: () => {

			let sorted = Mavis.Filter.Data.Results.sort(function(a, b) {
				return a.rating - b.rating;
			});

			Mavis.Filter.Data.Results = [];

			sorted.forEach(function(item, i) {
				Mavis.Filter.Data.Results.push(item);
			});
		},

		_ratingDescending: () => {

			let sorted = Mavis.Filter.Data.Results.sort(function(a, b) {
				return b.rating - a.rating;
			});

			Mavis.Filter.Data.Results = [];

			sorted.forEach(function(item, i) {
				Mavis.Filter.Data.Results.push(item);
			});
		},

		_valueAscending: () => {

			let sorted = Mavis.Filter.Data.Results.sort(function(a, b) {
				return a.value - b.value;
			});

			Mavis.Filter.Data.Results = [];

			sorted.forEach(function(item, i) {
				Mavis.Filter.Data.Results.push(item);
			});
		},

		_valueDescending: () => {

			let sorted = Mavis.Filter.Data.Results.sort(function(a, b) {
				return b.value - a.value;
			});

			Mavis.Filter.Data.Results = [];

			sorted.forEach(function(item, i) {
				Mavis.Filter.Data.Results.push(item);
			});
		},

		_sortData: () => {

			return new Promise(function(resolve,reject) {

				switch (Mavis.Filter.Sort.Order) {

					case 0:
						Mavis.Filter.Sort._cableAscending();
						break;

					case 1:
						Mavis.Filter.Sort._cableDescending();
						break;

					case 2:
						Mavis.Filter.Sort._markerAscending();
						break;

					case 3:
						Mavis.Filter.Sort._markerDescending();
						break;

					case 4:
						Mavis.Filter.Sort._positionAscending();
						break;

					case 5:
						Mavis.Filter.Sort._positionDescending();
						break;

					case 6:
						Mavis.Filter.Sort._ratingAscending();
						break;

					case 7:
						Mavis.Filter.Sort._ratingDescending();
						break;

					case 8:
						Mavis.Filter.Sort._valueAscending();
						break;

					case 9:
						Mavis.Filter.Sort._valueDescending();
						break;
				}

				resolve();
			});
		}
	},

	Render: {

		_sort: (container, mod) => {

			let 	id = 'filterSort' + mod,
					filterElement = document.createElement('div'),
					options = [
						'<option value="0">Seil aufsteigend</option>',
						'<option value="1">Seil absteigend</option>',
						'<option value="2">Schadensfall A-Z</option>',
						'<option value="3">Schadensfall Z-A</option>',
						'<option value="4">Position aufsteigend</option>',
						'<option value="5">Position absteigend</option>',
						'<option value="6">Schadensklasse aufsteigend</option>',
						'<option value="7">Schadensklasse absteigend</option>',
						'<option value="8">Wert aufsteigend</option>',
						'<option value="9">Wert absteigend</option>'
					],
					content = '<label for="' + id + '">Sortierung: </label><select id="' + id + '">' + options.join('')  + '</select>';

			filterElement.setAttribute('class', 'filter');
			filterElement.innerHTML = content;

			document.getElementById(container).appendChild(filterElement);
			document.getElementById(id).addEventListener('change', Mavis.Filter.Events._sort);

		},

		_cable: (container, mod) => {

			let 	id = 'filterCable' + mod,
					filterElement = document.createElement('div'),
					options = ['<option value="0">Alle Seile</option>'],
					cables = Mavis.Data.Construction.cables;

			cables.forEach(function(cable, i) {
				let option = '<option value="' + (i + 1) + '" data-cable-index="' + i + '">' + cable.name + '</option>';
				options.push(option);
			});

			let content = '<label for="' + id + '">Seil: </label><select id="' + id + '">' + options.join('') + '</select>';

			filterElement.setAttribute('class', 'filter');
			filterElement.innerHTML = content;

			document.getElementById(container).appendChild(filterElement);
			document.getElementById(id).addEventListener('change', Mavis.Filter.Events._cable);

		},

		_sides: (container, mod) => {

			let 	id = 'filterSides' + mod,
					filterElement = document.createElement('div'),
					options = ['<option value="0">Alle Seiten</option>'],
					sides = Mavis.Data.Construction.meta.cableSides;

			sides.forEach(function(side, i) {
				let option = '<option value="' + (i + 1) + '">(' + (i+1) + ') ' + side + '</option>';
				options.push(option);
			});

			let content = '<label for="' + id + '">Seite(n): </label><select id="' + id + '">' + options.join('') + '</select>';

			filterElement.setAttribute('class', 'filter');
			filterElement.innerHTML = content;

			document.getElementById(container).appendChild(filterElement);
			document.getElementById(id).addEventListener('change', Mavis.Filter.Events._sides);
		},

		_rating: (container, mod) => {

			let 	id = 'filterRating' + mod,
					filterElement = document.createElement('div'),
					options = ['<option value="0">Alle Schadensklassen</option>'],
					classes = Mavis.Data.Settings.damageClasses;

			classes.forEach(function(el, i) {
				let option = '<option value="' + (i+1) + '" data-class-index="' + i + '">' + el + '</option>';
				options.push(option);
			});

			let content = '<label for="' + id + '">Schadensklasse: </label><select id="' + id + '">' + options.join('') + '</select>';

			filterElement.setAttribute('class', 'filter');
			filterElement.innerHTML = content;

			document.getElementById(container).appendChild(filterElement);
			document.getElementById(id).addEventListener('change', Mavis.Filter.Events._rating);
		},

		_marker: (container, mod) => {

			let 	id = 'filterMarker' + mod,
					filterElement = document.createElement('div'),
					options = ['<option value="0">Alle Schadensfälle</option>'],
					automatic = Mavis.Data.Settings.automatic,
					din = Mavis.Data.Settings.din,
					manual = Mavis.Data.Settings.manual,
					counter = 0;

			automatic.forEach(function(mod, i) {
				counter++;
				let option = '<option value="' + counter + '" data-module-index="' + i + '">' + mod.label + '</option>';
				options.push(option);
			});

			din.forEach(function(mod, i) {
				counter++;
				let option = '<option value="' + counter + '" data-module-index="' + i + '">' + mod.label + '</option>';
				options.push(option);
			});

			manual.forEach(function(mod, i) {
				counter++;
				let option = '<option value="' + counter + '" data-module-index="' + i + '">' + mod.label + '</option>';
				options.push(option);
			});

			let content = '<label for="' + id + '">Schadensfall: </label><select id="' + id + '">' + options.join('') + '</select>';

			filterElement.setAttribute('class', 'filter');
			filterElement.innerHTML = content;

			document.getElementById(container).appendChild(filterElement);
			document.getElementById(id).addEventListener('change', Mavis.Filter.Events._marker);
		}
	},

	Events: {

		_getCallback: mod => {

			let fn;

			switch (mod) {
				case 'Dashboard':
					fn = Mavis.Dashboards.initCharts;
					break;
				case 'List':
					fn = Mavis.List.renderItems;
					break;
				case 'Inspection':
					fn = Mavis.Graph.init;
					break;
				case 'Model':
					fn = Mavis.Model.rerender;
					break;
			}

			return fn;
		},

		_sort: e => {

			let n = Number(e.target.value);
			Mavis.Filter.Sort.Order = n;

			Mavis.Filter.Sort._sortData()
			.then(function() {
				Mavis.List.renderItems(Mavis.Filter.Data.Results);
			});
		},

		_cable: e => {

			let 	n = Number(e.target.value),
					mod = document.getElementById('content').getAttribute('data-tab'),
					fn = Mavis.Filter.Events._getCallback(mod);

			Mavis.Filter.Data.Cable = n;

			Mavis.Filter.Data.filterData()
			.then(function() {
				fn(Mavis.Filter.Data.Results);
			});
		},

		_sides: e => {

			let 	n = Number(e.target.value),
					mod = document.getElementById('content').getAttribute('data-tab'),
					fn = Mavis.Filter.Events._getCallback(mod);

			Mavis.Filter.Data.Sides = n;

			Mavis.Filter.Data.filterData()
			.then(function() {
				fn(Mavis.Filter.Data.Results);
			});
		},

		_rating: e => {

			let 	n = Number(e.target.value),
					mod = document.getElementById('content').getAttribute('data-tab'),
					fn = Mavis.Filter.Events._getCallback(mod);

			console.log(mod);

			Mavis.Filter.Data.Rating = n;

			console.log(fn);

			Mavis.Filter.Data.filterData()
			.then(function() {
				fn(Mavis.Filter.Data.Results);
			});
		},

		_marker: e => {

			let 	n = Number(e.target.value),
					mod = document.getElementById('content').getAttribute('data-tab'),
					fn = Mavis.Filter.Events._getCallback(mod);

			Mavis.Filter.Data.Marker = n;

			Mavis.Filter.Data.filterData()
			.then(function() {
				fn(Mavis.Filter.Data.Results);
			});
		}
	},

	init: (mod, container, filters) => {

		return new Promise(function(resolve, reject) {

			let 	filterContainer = document.getElementById(container),
					containerId = container + 'Filter';

			filterContainer.innerHTML = '<div id="' + containerId + '"></div>';

			if(filters.indexOf('sort') >= 0) Mavis.Filter.Render._sort(containerId, mod);
			if(filters.indexOf('cable') >= 0) Mavis.Filter.Render._cable(containerId, mod);
			if(filters.indexOf('sides') >= 0) Mavis.Filter.Render._sides(containerId, mod);
			if(filters.indexOf('rating') >= 0) Mavis.Filter.Render._rating(containerId, mod);
			if(filters.indexOf('marker') >= 0) Mavis.Filter.Render._marker(containerId, mod);

			Mavis.Filter.Data.Results = Mavis.Data.Results;

			resolve();
		});
	},
};

module.exports = Mavis.Filter;