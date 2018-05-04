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

	init: data => {

		return new Promise(function(resolve, reject) {

			console.log('init Inspection ');

			document.getElementById('content').setAttribute('data-tab', 'Inspection');

			Mavis.Inspection._render()
			.then(CableSelection.init(data.cable))
      .then(Visual.init(data))
      .then(Mavis.Filter.init('Inspection', 'inspectionFilter', ['sides', 'rating', 'marker']))
			.then(Graph.init())
      .then(Player.init(data))
      .then(Comment.init())
			.then(resolve());
		});
	}
};

module.exports = Mavis.Inspection;


