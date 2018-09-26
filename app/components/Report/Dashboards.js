const Mavis = require('../Global/Global');
const DashboardMarkerCount = require('./DashboardMarkerCount');
const DashboardRatingsCount = require('./DashboardRatingsCount');
const DashboardSidesAffected = require('./DashboardSidesAffected');

Mavis.Dashboards = {

  Data: [],

  _render: () => {
		return new Promise((resolve, reject) => {
			const container = document.getElementById('reportContainerDashboard'),
					  element = document.createElement('div');
			element.setAttribute('id', 'reportDashboard');
			container.appendChild(element);
			resolve();
		});
	},

  _assembleData: () => {
    return new Promise((resolve, reject) => {
      Mavis.Data.Stores['results']
        .find(Mavis.Filter.Criteria)
        .sort(Mavis.Filter.Order)
        .then(results => {
          Mavis.Dashboards.Data = results;
          resolve();
        });
    });
  },

  initCharts: () => {
		return new Promise((resolve, reject) => {
		  document.getElementById('reportDashboard').innerHTML = '';
      async function initializeCharts() {
        await Mavis.Dashboards._assembleData();
        await Mavis.DashboardMarkerCount.init();
        await Mavis.DashboardRatingsCount.init();
        await Mavis.DashboardSidesAffected.init();
        resolve();
      }
      initializeCharts();
		});
	},

	init: () => {
    return new Promise((resolve, reject) => {
      async function initialize() {
        await Mavis.Filter.init('Dashboard', 'reportContainerDashboard', ['cables', 'sides', 'ratings', 'markers']);
        await Mavis.Dashboards._render();
        await Mavis.Dashboards.initCharts();
        console.log('Dashboards done');
        resolve();
      }

      initialize();
    });
  }
};

module.exports = Mavis.Dashboards;