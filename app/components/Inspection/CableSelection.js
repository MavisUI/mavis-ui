const Mavis = require('../Global/Global');

Mavis.CableSelection = {

	_render: n => {

		return new Promise(function(resolve, reject) {

			let options = [];

			Mavis.Data.Construction.cables.forEach(function(cable, i) {
        let option = '<option value="' + (i + 1) + '" data-cable-index="' + i + '">' + cable.name + '</option>';
				options.push(option);
			});

			document.getElementById('cableSelection').innerHTML = '<label for="cableSelectionOptions">Seil: </label><select id="cableSelectionOptions" value="' + n +'">' + options.join('') + '</select>';
			document.getElementById('cableSelectionOptions').selectedIndex = n;

			resolve();
		});
	},

	_changeCable: e => {

    Mavis.Player.pause();

    let n = Number(e.target.value);

    console.log(n);

    Mavis.Filter.Data.Cable = n;

    Mavis.Visual.setPath((n-1));
    Mavis.Visual.renderImages(0);

    Mavis.Player._setMax();
    Mavis.Player.playerSet(0);

    Mavis.Filter.Data.filterData()
      .then(function() {
        Mavis.Graph.init();
      });
	},

	_events: () => {

		return new Promise(function(resolve, reject) {

			let selection = document.getElementById('cableSelection');
			selection.addEventListener('change', Mavis.CableSelection._changeCable);

			resolve();
		});
	},

	init: cable => {

		return new Promise(function(resolve, reject) {

		  Mavis.CableSelection._render(cable)
        .then(Mavis.CableSelection._events())
        .then(resolve());
		});
	}
};

module.exports = Mavis.CableSelection;