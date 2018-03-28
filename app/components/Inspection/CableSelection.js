const Mavis = require('../Global/Global');

Mavis.CableSelection = {

	current: 0,

	_render: () => {

		return new Promise(function(resolve, reject) {

			let options = [];

			Mavis.Data.Construction.cables.forEach(function(cable, i) {
				let option = '<option value="' + i + '" data-cable-index="' + i + '">' + cable.name + '</option>';
				options.push(option);
			});

			document.getElementById('cableSelection').innerHTML = '<label for="cableSelectionOptions">Seil: </label><select id="cableSelectionOptions" value="0">' + options.join('') + '</select>';
			resolve();
		});
	},

	_changeCable: e => {

		Mavis.CableSelection.current = Number(e.target.value);
		Mavis.Filter.Data.Cable = 1;
		Mavis.Filter.Data.filterData();

		Mavis.Player.reset();

		//// init visual
		//// reset Comments

	},

	_events: () => {

		return new Promise(function(resolve, reject) {

			let selection = document.getElementById('cableSelection');

			selection.addEventListener('change', Mavis.CableSelection._changeCable);

			resolve();
		});
	},

	init: () => {

		return new Promise(function(resolve, reject) {

			Mavis.CableSelection._render()
			.then(Mavis.CableSelection._events())
			.then(resolve());
		});
	}
};

module.exports = Mavis.CableSelection;