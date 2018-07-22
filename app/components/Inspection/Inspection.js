const Mavis = require('../Global/Global');
const CableSelection = require('./CableSelection');
const Player = require('./Player');
const Comment = require('./Comment');
const Visual = require('./Visual');
const Graph = require('./Graph');

Mavis.Inspection = {

	_render: () => {

		return new Promise(function(resolve, reject) {

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

	  return new Promise(function(resolve, reject) {

      Mavis.Data.Filter.Cable = cable;

	    resolve();
    });
  },

	init: data => {

		return new Promise(function(resolve, reject) {

			console.log('init Inspection ');

			document.getElementById('content').setAttribute('data-tab', 'Inspection');

      Mavis.Inspection._render()
      .then(Mavis.Filter.init('Inspection', 'cableSelection', ['cable']))
      .then(Mavis.Filter.init('Inspection', 'inspectionFilter', ['sides', 'ratings', 'markers']))
      .then(Mavis.Inspection._setFilterCable(data.cable))
      .then(Mavis.Data.Filter.filterData())
      .then(Visual.init(data))
      .then(Graph.init(data.cable))
      .then(Player.init(data))
      .then(Comment.init())
      .then(resolve());
    });
	}
};

module.exports = Mavis.Inspection;


