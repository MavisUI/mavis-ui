const Mavis = require('../Global/Global');
const Graphs = require('./Graphs');
const Highcharts = require('highcharts');

Mavis.DashboardMarkerCount = {

	_render: () => {

		return new Promise(function(resolve, reject) {

			let el = document.createElement('div');
			el.setAttribute('class', 'reportDashboardChart');
			el.innerHTML = '<div id="dashboardMarkerCount"></div>';

			document.getElementById('reportDashboard').appendChild(el);

			resolve();
		});
	},

	_getData: results => {

		const modules = ['automatic','din','manual'];
		let data = [];

		// create data containers with info
		modules.forEach(function(module, i) {

			Mavis.Data.Settings[module].forEach(function(mod, i) {
				let obj = {};
				obj.name = mod.label;
				obj.color = Mavis.Global.paletteBlue[i];
				obj.y = 0;
				data.push(obj);
			});
		});

		// fill counter from data
		results.forEach(function(item, i) {
			let n = item.case - 1;
			data[n].y++;
		});

		// filter out all items without data
		let _dataFilter = data => {
			return data.y > 0;
		}

		let chartData = data.filter(_dataFilter);

		return chartData;
	},

	_getCategories: (data) => {

		let categories = [];

		data.forEach(function(item, i) {
			categories.push(item.name);
		});

		return categories;
	},

	_renderChart: results => {

		return new Promise(function(resolve, reject) {

			let 	container = 'dashboardMarkerCount',
					label = 'Schadensfälle nach Merkmal',
					data = Mavis.DashboardMarkerCount._getData(results),
					axisCategories = Mavis.DashboardMarkerCount._getCategories(data);

			Mavis.Graphs.barChart(container, label, data, axisCategories);

			resolve();
		});
	},

	init: results => {

		return new Promise(function(resolve, reject) {

			Mavis.DashboardMarkerCount._render()
			.then(Mavis.DashboardMarkerCount._renderChart(results))
			.then(resolve());
		});
	}
};

module.exports = Mavis.DashboardMarkerCount;