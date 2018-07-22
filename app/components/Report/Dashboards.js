const Mavis = require('../Global/Global');
const DashboardMarkerCount = require('./DashboardMarkerCount');
const DashboardRatingsCount = require('./DashboardRatingsCount');
const DashboardSidesAffected = require('./DashboardSidesAffected');

Mavis.Dashboards = {

	_render: () => {

		return new Promise(function(resolve, reject) {

			const container = document.getElementById('reportContainerDashboard'),
					element = document.createElement('div');

			element.setAttribute('id', 'reportDashboard');
			container.appendChild(element);
			resolve();
		});
	},

	initCharts: results => {

		return new Promise(function(resolve, reject) {

			document.getElementById('reportDashboard').innerHTML = '';

			Mavis.DashboardMarkerCount.init(results)
			.then(Mavis.DashboardRatingsCount.init(results))
			.then(Mavis.DashboardSidesAffected.init(results))
			.then(resolve());

		});
	},

	init: () => {

    return new Promise(function (resolve, reject) {
 			Mavis.Filter.init('Dashboard', 'reportContainerDashboard', ['cables', 'sides', 'ratings', 'markers'])
      .then(Mavis.Dashboards._render())
 		  .then(Mavis.Dashboards.initCharts(Mavis.Data.Filtered))
 			.then(resolve());
    });
  }
};

module.exports = Mavis.Dashboards;