const Mavis = require('../Global/Global');
const Graphs = require('./Graphs');
const Highcharts = require('highcharts');

Mavis.DashboardSidesAffected = {

  Count: 0,

	_render: () => {
		return new Promise((resolve, reject) => {
			let el = document.createElement('div');
			el.setAttribute('class', 'reportDashboardChart');
			el.innerHTML = '<div id="dashboardSidesAffected"></div>';
			document.getElementById('reportDashboard').appendChild(el);
			resolve();
		});
	},

  _loadSides: () => {
    return new Promise((resolve, reject) => {
      Mavis.Data.Stores['construction']
        .find({})
        .then(docs => {
          Mavis.DashboardSidesAffected.Sides = docs[0].meta.cableSides;
          resolve();
        });
    });
  },

	_countSides: () => {
	  return new Promise((resolve, reject) => {
	    let results = Mavis.Filter.Data,
          data = [],
          sides = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
          },
          i;
      results.forEach(item => {
        if (item.sides.length > 0) {
          item.sides.forEach(function (side, i) {
            let n = side - 1;
            sides[n] = sides[n] + 1;
          });
        }
      });

      for (i = 0; i < 6; i++) {
        let obj = {};
        obj.name = Mavis.DashboardSidesAffected.Sides[i];
        obj.color = Mavis.Global.paletteBlue[i];
        obj.y = sides[i];
        data.push(obj);
      }
      Mavis.DashboardSidesAffected.Sides = data;
      resolve();
    });
	},

  _checkSides: () => {
	  return new Promise((resolve, reject) => {
	    for(const side of Mavis.DashboardSidesAffected.Sides) {
	      Mavis.DashboardSidesAffected.Count += side.y;
      }
      resolve();
    });
  },

	_renderChart: () => {
		return new Promise((resolve, reject) => {
			let container = 'dashboardSidesAffected',
					label = 'Schadensfälle nach Seilseite',
          data = Mavis.DashboardSidesAffected.Sides,
					axisCategories = ['OL', 'O', 'OR', 'UL', 'U', 'UR'];
      if(Mavis.DashboardSidesAffected.Count > 0) {
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
		    Mavis.DashboardSidesAffected.Count = 0;
        Mavis.DashboardSidesAffected.Sides = [];
        await Mavis.DashboardSidesAffected._render();
        await Mavis.DashboardSidesAffected._countSides();
        await Mavis.DashboardSidesAffected._checkSides();
        await Mavis.DashboardSidesAffected._renderChart();
		    resolve();
      }
      initialize();
		});
	}
};

module.exports = Mavis.DashboardSidesAffected;