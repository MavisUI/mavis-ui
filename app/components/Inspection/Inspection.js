const Mavis = require('../Global/Global');
const CableSelection = require('./CableSelection');
const Player = require('./Player');
const Comment = require('./Comment');
const Visual = require('./Visual');
const Graph = require('./Graph');

Mavis.Inspection = {

	_render: () => {
		return new Promise((resolve, reject) => {
			const container = document.getElementById('content'),
					content = [
						'<div class="inner">',
							'<div id="inspection">',
								'<div id="cableSelection"></div>',
								'<div id="controlsPlayer"></div>',
								'<div id="controlsComment"></div>',
								'<div id="visual"></div>',
								'<div id="inspectionFilter"></div>',
								'<div id="graph"></div>',
							'</div>',
						'</div>',
						'<aside id="comments" class="hidden"></aside>'
					];
			container.innerHTML = content.join('');
			resolve();
		});
	},

  _setFilterCable: cable => {
	  return new Promise((resolve, reject) => {
      Mavis.Filter.Criteria.cable = cable;
	    resolve();
    });
  },

  _filter: data => {
	  async function filterInspection() {
      await Visual.filter(data);
      await Graph.filter();
      await Player.filter(data);
      await Comment.init();
    }
    filterInspection();
  },

	init: data => {
		return new Promise((resolve, reject) => {
			async function initialize() {
			  document.getElementById('content').setAttribute('data-tab', 'inspection');
			  await Mavis.Inspection._render();
        await Mavis.Filter.init('Inspection', 'cableSelection', ['cable']);
        await Mavis.Filter.init('Inspection', 'inspectionFilter', ['sides', 'ratings', 'markers']);
        await Mavis.Inspection._setFilterCable(data.cable);
        await Mavis.Filter._loadData();
        await Visual.init(data);
        await Graph.init();
        await Player.init(data);
        await Comment.init();
        console.log('init Inspection ');
        resolve();
      }
      initialize();
    });
	}
};

module.exports = Mavis.Inspection;


