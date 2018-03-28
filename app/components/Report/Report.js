const Mavis = require('../Global/Global');
const Dashboards = require('./Dashboards');
const List = require('./List');
const Download = require('./Download');

Mavis.Report = {

	_render: () => {

		return new Promise(function(resolve, reject) {

			const container = document.getElementById('content');
			container.innerHTML = content;

			let content = [
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

		return new Promise(function(resolve, reject) {

			let container = document.getElementById('reportContainer');
			container.innerHTML = '';

			let 	modules = ['Dashboard','List'],
					labels = ['Dashboard', 'Liste'];

			Mavis.Global.tabs('reportContainer', labels, modules, 9);

			resolve();
		});
	},

	init: () => {

		return new Promise(function(resolve, reject) {

			console.log('init Report');

			document.getElementById('content').setAttribute('data-tab', 'Dashboard');

			Mavis.Report._render()
			.then(Mavis.Report._renderTabs())
			.then(Mavis.Dashboards.init())
			.then(Mavis.List.init())
			.then(Mavis.Download.init())
			.then(resolve());
		});
	}
};

module.exports = Mavis.Report;