const Mavis = require('../Global/Global');

Mavis.DashboardRatingsCount = {

  Data: [],
  Count: 0,

	_render: () => {
		return new Promise((resolve, reject) => {
			let el = document.createElement('div');
			el.setAttribute('class', 'reportDashboardChart');
			el.innerHTML = '<div id="dashboardRatingsCount"></div>';
			document.getElementById('reportDashboard').appendChild(el);
			resolve();
		});
	},

	_countRatings: () => {
    return new Promise((resolve, reject) => {
      let results = Mavis.Filter.Data,
          data = [],
          ratings = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
          },
          i;
      results.forEach(item => {
        ratings[item.rating] = ratings[item.rating] + 1;
      });
      for (i = 0; i < 6; i++) {
        let obj = {};
        obj.name = 'SK' + i;
        obj.color = Mavis.Global.paletteBlue[i];
        obj.y = ratings[i];
        data.push(obj);
      }
      Mavis.DashboardRatingsCount.Data = data;
      resolve();
    });
	},

  _checkResults: () => {
    return new Promise((resolve, reject) => {
      for(const _class of Mavis.DashboardRatingsCount.Data) {
        Mavis.DashboardRatingsCount.Count += _class.y;
      }
      resolve();
    });
  },

	_renderChart: () => {
		return new Promise((resolve, reject) => {
		  let container = 'dashboardRatingsCount',
					label = 'Schadensfälle nach Schadensklasse',
					data = Mavis.DashboardRatingsCount.Data,
					axisCategories = ['SK0', 'SK1', 'SK2', 'SK3', 'SK4', 'SK5'];
      if(Mavis.DashboardRatingsCount.Count > 0) {
        Mavis.Graphs.barChart(container, label, data, axisCategories);
      } else {
        Mavis.Graphs.blank(container, label);
      }
			resolve();
		});
	},

	init: () => {
		return new Promise((resolve, reject) => {
      async function initialize() {
        Mavis.DashboardRatingsCount.Count = 0;
        await Mavis.DashboardRatingsCount._render();
        await Mavis.DashboardRatingsCount._countRatings();
        await Mavis.DashboardRatingsCount._checkResults();
        await Mavis.DashboardRatingsCount._renderChart();
        resolve();
      }

      initialize();
    });
	}
};

module.exports = Mavis.DashboardRatingsCount;
