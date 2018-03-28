const Mavis = require('../Global/Global');
const Highcharts = require('highcharts');

Mavis.DashboardRatingsCount = {

	_render: () => {

		return new Promise(function(resolve, reject) {

			let el = document.createElement('div');
			el.setAttribute('class', 'reportDashboardChart');
			el.innerHTML = '<div id="dashboardRatingsCount"></div>';

			document.getElementById('reportDashboard').appendChild(el);

			resolve();
		});
	},

	_countRatings: results => {

		let 	data = [],
				ratings = {
					0: 0,
					1: 0,
					2: 0,
					3: 0,
					4: 0,
					5: 0
				},
				i;

		results.forEach(function(item, i) {
			ratings[item.rating] = ratings[item.rating] + 1;
		});

		for(i=0;i<6;i++) {

			let obj = {};
			obj.name = 'SK' + i;
			obj.color = Mavis.Global.paletteBlue[i];
			obj.y = ratings[i];
			data.push(obj);
		}

		return data;
	},

	_renderChart: results => {

		return new Promise(function(resolve, reject) {

			let 	container = 'dashboardRatingsCount',
					label = 'Schadensfälle nach Schadensklasse',
					data = Mavis.DashboardRatingsCount._countRatings(results),
					axisCategories = ['SK0', 'SK1', 'SK2', 'SK3', 'SK4', 'SK5'];

			Mavis.Graphs.barChart(container, label, data, axisCategories);

			resolve();
		});
	},

	init: results => {

		return new Promise(function(resolve, reject) {

			Mavis.DashboardRatingsCount._render()
			.then(Mavis.DashboardRatingsCount._renderChart(results))
			.then(resolve());
		});
	}
};

module.exports = Mavis.DashboardRatingsCount;
