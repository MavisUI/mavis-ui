const Mavis = require('../Global/Global');

Mavis.CableSelection = {

	_render: n => {

		return new Promise(function(resolve, reject) {

			let options = [];

			Mavis.Data.Construction.cables.forEach(function(cable, i) {

        let option;

				if(i===n) {
          option = '<option value="' + i + '" data-cable-index="' + i + '" selected>' + cable.name + '</option>';
        } else {
          option = '<option value="' + i + '" data-cable-index="' + i + '">' + cable.name + '</option>';
        }

				options.push(option);

			});

			document.getElementById('cableSelection').innerHTML = '<label for="cableSelectionOptions">Seil: </label><select id="cableSelectionOptions" value="' + n +'">' + options.join('') + '</select>';
			resolve();
		});
	},

	_changeCable: e => {

	  Mavis.Player.pause();

	  let cable = Number(e.target.value);
    Mavis.Filter.Data.Cable = cable;
    Mavis.Filter.Data.filterData();

    Mavis.Visual.setPath(cable);
    Mavis.Visual.renderImages(0);

    Mavis.Player._setMax();
    Mavis.Player.playerSet(0);

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