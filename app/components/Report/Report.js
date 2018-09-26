const Mavis = require('../Global/Global');
const Dashboards = require('./Dashboards');
const List = require('./List');
const Download = require('./Download');

Mavis.Report = {

	_render: () => {
		return new Promise((resolve, reject) => {
			let container = document.getElementById('content'),
			    content = [
            '<div id="report">',
              '<div class="inner">',
                '<div id="reportContainer"></div>',
              '</div>',
            '</div>'
          ];
			container.innerHTML = content.join('');
			resolve();
		});
	},

	_renderTabs: () => {
		return new Promise((resolve, reject) => {
			let container = document.getElementById('reportContainer');
			container.innerHTML = '';
			let modules = ['Dashboard','List'],
					labels = ['Dashboard','Liste'];
			Mavis.Global.tabs('reportContainer', labels, modules, 9);
			resolve();
		});
	},

	init: () => {
		return new Promise((resolve, reject) => {
			console.log('init Report');
			document.getElementById('content').setAttribute('data-tab', 'Dashboard');
      async function initialize() {
        await Mavis.Report._render();
        await Mavis.Report._renderTabs();
        await Mavis.Dashboards.init();
        await Mavis.List.init();
        await Mavis.Download.init();
        resolve();
      }
      initialize();
		});
	}
};

module.exports = Mavis.Report;