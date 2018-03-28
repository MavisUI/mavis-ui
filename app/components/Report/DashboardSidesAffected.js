const Mavis = require('../Global/Global');
const Graphs = require('./Graphs');
const Highcharts = require('highcharts');

Mavis.DashboardSidesAffected = {

	_render: () => {

		return new Promise(function(resolve, reject) {

			let el = document.createElement('div');
			el.setAttribute('class', 'reportDashboardChart');
			el.innerHTML = '<div id="dashboardSidesAffected"></div>';

			document.getElementById('reportDashboard').appendChild(el);

			resolve();
		});
	},

	_countSides: results => {

		let 	data = [],
				sides = {
					0: 0,
					1: 0,
					2: 0,
					3: 0,
					4: 0,
					5: 0
				},
				i;

		results.forEach(function(item, i) {

			if(item.sides.length > 0) {
				item.sides.forEach(function(side, i) {
					let n = side-1;
					sides[n] = sides[n] + 1;
				});
			}
		});

		for(i=0;i<6;i++) {

			let obj = {};
			obj.name = Mavis.Data.Construction.meta.cableSides[i];
			obj.color = Mavis.Global.paletteBlue[i];
			obj.y = sides[i];
			data.push(obj);
		}

		return data;
	},

	_renderChart: results => {

		return new Promise(function(resolve, reject) {

			let 	container = 'dashboardSidesAffected',
					label = 'Schadensfälle nach Seilseite',
					data = Mavis.DashboardSidesAffected._countSides(results),
					axisCategories = ['Oben-Links', 'Oben', 'Oben-Rechts', 'Unten-Links', 'Unten', 'Unten-Rechts'];

			Mavis.Graphs.barChart(container, label, data, axisCategories);

			resolve();
		});
	},

	init: results => {

		return new Promise(function(resolve, reject) {

			Mavis.DashboardSidesAffected._render()
			.then(Mavis.DashboardSidesAffected._renderChart(results))
			.then(resolve());
		});
	}
};

module.exports = Mavis.DashboardSidesAffected;