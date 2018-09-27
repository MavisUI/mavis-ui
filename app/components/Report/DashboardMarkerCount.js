const Mavis = require('../Global/Global');

Mavis.DashboardMarkerCount = {

  _render: () => {
    return new Promise((resolve, reject) => {
      let el = document.createElement('div');
      el.setAttribute('class', 'reportDashboardChart');
      el.innerHTML = '<div id="dashboardMarkerCount"></div>';
      document.getElementById('reportDashboard').appendChild(el);
      resolve();
    });
  },

  _getModules: () => {
    return new Promise((resolve, reject) => {
      let dataFilter = {};
      if(Mavis.Filter.Criteria.label) dataFilter.label = Mavis.Filter.Criteria.label;
      Mavis.Data.Stores['modules']
        .find(dataFilter)
        .then(modules => {
          modules.forEach((mod, i) => {
            let obj = {};
            obj.label = mod.label;
            obj.color = Mavis.Global.paletteBlue[i];
            obj.y = 0;
            Mavis.DashboardMarkerCount.Modules.push(obj);
          });
          resolve();
        });
    });
  },

  _countResults: () => {
    return new Promise((resolve, reject) => {
      async function count(result) {
        return new Promise((resolve, reject) => {
          for (const module of Mavis.DashboardMarkerCount.Modules) {
            if(module.label === result.label) module.y++;
          }
          resolve();
        });
      }
      async function processModules(results) {
        for (const result of results) {
          await count(result);
        }
        resolve();
      }
      processModules(Mavis.Filter.Data);
    });
  },

  _filterNoResults: () => {
    return new Promise((resolve, reject) => {
      let _dataFilter = data => {
        return data.y > 0;
      };
      Mavis.DashboardMarkerCount.Modules = Mavis.DashboardMarkerCount.Modules.filter(_dataFilter);
      resolve();
    });
  },

  _getCategories: () => {
    return new Promise((resolve, reject) => {
      for(const module of Mavis.DashboardMarkerCount.Modules) {
        Mavis.DashboardMarkerCount.Categories.push(module.label);
      }
      resolve();
    });
  },

  _renderChart: () => {
    return new Promise((resolve, reject) => {
      let container = 'dashboardMarkerCount',
        label = 'Schadensfälle nach Merkmal',
        data = Mavis.DashboardMarkerCount.Modules,
        axisCategories = Mavis.DashboardMarkerCount.Categories;

      if(data.length > 0) {
        Mavis.Graphs.barChart(container, label, data, axisCategories);
      } else {
        Mavis.Graphs.blank(container, 'Schadensfälle nach Merkmal');
      }

      resolve();
    });
  },

  init: () => {
    return new Promise((resolve, reject) => {
      Mavis.DashboardMarkerCount.Modules = new Array();
      Mavis.DashboardMarkerCount.Categories = new Array();
      async function initialize() {
        await Mavis.DashboardMarkerCount._render();
        await Mavis.DashboardMarkerCount._getModules();
        await Mavis.DashboardMarkerCount._countResults();
        await Mavis.DashboardMarkerCount._filterNoResults();
        await Mavis.DashboardMarkerCount._getCategories();
        await Mavis.DashboardMarkerCount._renderChart();
        resolve();
      }
      initialize();
    });
  }
};

module.exports = Mavis.DashboardMarkerCount;