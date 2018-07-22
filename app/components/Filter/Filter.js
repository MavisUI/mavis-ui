const Mavis = require('../Global/Global');

Mavis.Filter = {

  _getCallback: mod => {

    let fn;

    switch (mod) {
      case 'Dashboard':
        fn = Mavis.Dashboards.initCharts;
        break;
      case 'List':
        fn = Mavis.List.renderItems;
        break;
      case 'Inspection':
        fn = Mavis.Graph.init;
        break;
      case 'Model':
        fn = Mavis.Model.rerender;
        break;
    }

    return fn;
  },

  Sort: {

    _render: (container, mod) => {

      let id = 'filterSort' + mod,
        filterElement = document.createElement('div'),
        options = [
          '<option value="0">Seil aufsteigend</option>',
          '<option value="1">Seil absteigend</option>',
          '<option value="2">Schadensfall A-Z</option>',
          '<option value="3">Schadensfall Z-A</option>',
          '<option value="4">Position aufsteigend</option>',
          '<option value="5">Position absteigend</option>',
          '<option value="6">Schadensklasse aufsteigend</option>',
          '<option value="7">Schadensklasse absteigend</option>',
          '<option value="8">Wert aufsteigend</option>',
          '<option value="9">Wert absteigend</option>'
        ],
        content = '<label for="' + id + '">Sortierung: </label><select id="' + id + '">' + options.join('')  + '</select>';

      filterElement.setAttribute('class', 'filter');
      filterElement.innerHTML = content;

      document.getElementById(container).appendChild(filterElement);
      document.getElementById(id).addEventListener('change', Mavis.Filter.Sort._events);
    },

    _events: e => {

      let n = Number(e.target.value);
      Mavis.Data.Sort.Order = n;

      Mavis.Data.Sort._sortData()
      .then(function() {
        Mavis.List.renderItems(Mavis.Data.Filtered);
      });
    }
  },

  Cable: {

    _render: (container, mod, conf) => {

      let id = 'filterCable' + mod,
          filterElement = document.createElement('div'),
          cables = Mavis.Data.Construction.cables,
          options = [];

      if(conf) options = ['<option value="all">Alle Seile</option>'];

      cables.forEach(function(cable, i) {
        let option = '<option value="' + i + '" data-cable-index="' + i + '">' + cable.name + '</option>';
        options.push(option);
      });

      let content = '<label for="' + id + '">Seil </label><select id="' + id + '">' + options.join('') + '</select>';

      filterElement.setAttribute('class', 'filter');
      filterElement.innerHTML = content;

      document.getElementById(container).appendChild(filterElement);
      document.getElementById(id).addEventListener('change', Mavis.Filter.Cable._events);
    },

    _events: e => {

      let n = e.target.value,
          mod = document.getElementById('content').getAttribute('data-tab'),
          fn = Mavis.Filter._getCallback(mod);

      if(n === 'all') {
        Mavis.Data.Filter.Cable = undefined;
      } else {
        Mavis.Data.Filter.Cable = Number(n);
      }

      Mavis.Data.Filter.filterData()
      .then(function() {
        fn(Mavis.Data.Filtered);
      });
    }
  },

  Sides: {

    _render: (container, mod, conf) => {

      let id = 'filterSides' + mod,
          filterElement = document.createElement('div'),
          sides = Mavis.Data.Construction.meta.cableSides,
          options = [];

      if(conf) options = ['<option value="all">Alle Seiten</option>'];

      sides.forEach(function(side, i) {
        let option = '<option value="' + (i+1) + '">' + side + '</option>';
        options.push(option);
      });

      let content = '<label for="' + id + '">Seite(n): </label><select id="' + id + '">' + options.join('') + '</select>';

      filterElement.setAttribute('class', 'filter');
      filterElement.innerHTML = content;

      document.getElementById(container).appendChild(filterElement);
      document.getElementById(id).addEventListener('change', Mavis.Filter.Sides._events);
    },

    _events: e => {

      let n = e.target.value,
          mod = document.getElementById('content').getAttribute('data-tab'),
          fn = Mavis.Filter._getCallback(mod);

      if(n === 'all') {
        Mavis.Data.Filter.Sides = undefined;
      } else {
        Mavis.Data.Filter.Sides = Number(n);
      }

      Mavis.Data.Filter.filterData()
      .then(function() {
        fn(Mavis.Data.Filtered);
      });
    }
  },

  Rating: {

    _render: (container, mod, conf) => {

      let id = 'filterRating' + mod,
          filterElement = document.createElement('div'),
          classes = Mavis.Data.Settings.damageClasses,
          options = [];

      if(conf) options = ['<option value="all">Alle Schadensklassen</option>'];

      classes.forEach(function(el, i) {
        let option = '<option value="' + (i+1) + '" data-class-index="' + i + '">' + el + '</option>';
        options.push(option);
      });

      let content = '<label for="' + id + '">Schadensklasse: </label><select id="' + id + '">' + options.join('') + '</select>';

      filterElement.setAttribute('class', 'filter');
      filterElement.innerHTML = content;

      document.getElementById(container).appendChild(filterElement);
      document.getElementById(id).addEventListener('change', Mavis.Filter.Rating._events);
    },

    _events: e => {

      let n = e.target.value,
          mod = document.getElementById('content').getAttribute('data-tab'),
          fn = Mavis.Filter._getCallback(mod);

      if(n === 'all') {
        Mavis.Data.Filter.Rating = undefined;
      } else {
        Mavis.Data.Filter.Rating = Number(n);
      }

      Mavis.Data.Filter.filterData()
      .then(function() {
        fn(Mavis.Data.Filtered);
      });
    }
  },

  Marker: {

    _render: (container, mod, conf) => {

      let id = 'filterMarker' + mod,
          filterElement = document.createElement('div'),
          automatic = Mavis.Data.Settings.automatic,
          din = Mavis.Data.Settings.din,
          manual = Mavis.Data.Settings.manual,
          counter = 0,
          options = [];

      if(conf) options = ['<option value="all">Alle Schadensfälle</option>'];

      automatic.forEach(function(mod, i) {
        counter++;
        let option = '<option value="' + counter + '" data-module-index="' + i + '">' + mod.label + '</option>';
        options.push(option);
      });

      din.forEach(function(mod, i) {
        counter++;
        let option = '<option value="' + counter + '" data-module-index="' + i + '">' + mod.label + '</option>';
        options.push(option);
      });

      manual.forEach(function(mod, i) {
        counter++;
        let option = '<option value="' + counter + '" data-module-index="' + i + '">' + mod.label + '</option>';
        options.push(option);
      });

      let content = '<label for="' + id + '">Schadensfall: </label><select id="' + id + '">' + options.join('') + '</select>';

      filterElement.setAttribute('class', 'filter');
      filterElement.innerHTML = content;

      document.getElementById(container).appendChild(filterElement);
      document.getElementById(id).addEventListener('change', Mavis.Filter.Marker._events);
    },

    _events: e => {

      let n = e.target.value,
          mod = document.getElementById('content').getAttribute('data-tab'),
          fn = Mavis.Filter._getCallback(mod);

      if(n === 'all') {
        Mavis.Data.Filter.Marker = undefined;
      } else {
        Mavis.Data.Filter.Marker = Number(n);
      }

      Mavis.Data.Filter.filterData()
      .then(function() {
        fn(Mavis.Data.Filtered);
      });
    }
  },

	init: (mod, container, filters) => {

		return new Promise(function(resolve, reject) {

			let filterContainer = document.getElementById(container),
					containerId = container + 'Filter';

			filterContainer.innerHTML = '<div id="' + containerId + '"></div>';

			if(filters.indexOf('sort') >= 0) Mavis.Filter.Sort._render(containerId, mod);
      if(filters.indexOf('cable') >= 0) Mavis.Filter.Cable._render(containerId, mod);
      if(filters.indexOf('cables') >= 0) Mavis.Filter.Cable._render(containerId, mod, true);
      if(filters.indexOf('side') >= 0) Mavis.Filter.Sides._render(containerId, mod);
      if(filters.indexOf('sides') >= 0) Mavis.Filter.Sides._render(containerId, mod, true);
			if(filters.indexOf('rating') >= 0) Mavis.Filter.Rating._render(containerId, mod);
      if(filters.indexOf('ratings') >= 0) Mavis.Filter.Rating._render(containerId, mod, true);
			if(filters.indexOf('marker') >= 0) Mavis.Filter.Marker._render(containerId, mod);
      if(filters.indexOf('markers') >= 0) Mavis.Filter.Marker._render(containerId, mod, true);

      Mavis.Data.Filter.Cable = undefined;
      Mavis.Data.Filter.Rating = undefined;
      Mavis.Data.Filter.Marker = undefined;
      Mavis.Data.Filter.Sides = undefined;
			Mavis.Data.Filtered = Mavis.Data.Results;

			resolve();
		});
	},
};

module.exports = Mavis.Filter;