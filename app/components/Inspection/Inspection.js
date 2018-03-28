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

	init: () => {

		return new Promise(function(resolve, reject) {

			console.log('init Inspection ');

			document.getElementById('content').setAttribute('data-tab', 'Inspection');

			Mavis.Inspection._render()
			.then(CableSelection.init())
			.then(Player.init())
			.then(Comment.init())
			.then(Mavis.Filter.init('Inspection', 'inspectionFilter', ['sides', 'rating', 'marker']))
			.then(Visual.init())
			.then(Graph.init())
			.then(resolve());
		});
	}
};

module.exports = Mavis.Inspection;

/*
graphs:
comments: '<div id="commentsToggle"><div class="icon iconMarker"></div><div class="icon iconCancel"></div></div><div id="commentsBody"><h1>Eintrag</h1><div id="commentPositions"><h2>Position / Länge</h2><p>Startpunkt: <input type="number" id="commentPosition" step="0.01" value="0.00" min="0" placeholder="0.00" />m</p><p>Länge: <input type="number" id="commentDistance" step="0.01" value="0.00" min="0" max="0" placeholder="0.00" />m</p> </div><div id="commentCableview"><h2>Seilseite</h2><div id="commentCableSides"></div></div><div id="commentsCases"><h2>Merkmal</h2><div id="commentsCasesSelection"></div></div><div id="commentsRating"><h2>Schadensbewertung</h2><p>Wert: <input type="number" id="commentsRatingValue" value="0" /><span id="commentsRatingValueMetric">µ</span></p><p>Schadensklasse: <select name="commentsRatingSelect" id="commentsRatingSelect" value="0"></select></p></div><div id="commentsText"><h2>Kommentar</h2><textarea id="commentsTextarea"></textarea></div><div id="commentsFunctions" class="new"><button id="commentsCancel"><div class="icon iconCancel"></div> Abbrechen</button><button id="commentsReset"><div class="icon iconRefresh"></div> Reset</button><button id="commentsRemove"><div class="icon iconTrash"></div> Löschen</button><button id="commentsSave"><div class="icon iconConfirm"></div> Speichern</button></div></div></aside>'
*/
