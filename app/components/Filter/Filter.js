const Mavis = require('../Global/Global');

Mavis.Filter = {

  Criteria: {},
  Order: {},
  Data: [],

  _render: (filterContainer, containerId) => {
    return new Promise((resolve, reject) => {
      filterContainer.innerHTML = '<div id="' + containerId + '"></div>';
      resolve();
    });
  },

  _loadData: () => {
    return new Promise((resolve, reject) => {

      // console.log(Mavis.Filter.Criteria);

      Mavis.Data.Stores['results']
        .find(Mavis.Filter.Criteria)
        .sort(Mavis.Filter.Order)
        .then(results => {

          // console.log(results);
          Mavis.Filter.Data = results;
          resolve();
        });
    });
  },

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
        fn = Mavis.Model.render;
        break;
    }

    return fn;
  },

  Rating: {

    _render: (container, mod, conf) => {
      return new Promise((resolve, reject) => {

        let id = 'filterRating' + mod,
          filterElement = document.createElement('div'),
          options = [];

        // classes = Mavis.Data.Settings.damageClasses,
        Mavis.Data.Stores['classes']
          .find({})
          .sort({id: 1})
          .then(classes => {

            if(conf) options = ['<option value="all" selected>Alle Schadensklassen</option>'];

            classes.forEach(el => {
              let option = '<option value="' + el.id + '">' + el.name + '</option>';
              options.push(option);
            });

            let content = '<label for="' + id + '">Schadensklasse: </label><select id="' + id + '">' + options.join('') + '</select>';

            filterElement.setAttribute('class', 'filter');
            filterElement.innerHTML = content;

            document.getElementById(container).appendChild(filterElement);
            document.getElementById(id).addEventListener('change', Mavis.Filter.Rating._events);
            resolve();
          });
      });
    },

    _events: e => {
      let n = e.target.value;

      if(n === 'all') {
        delete Mavis.Filter.Criteria.rating;
      } else {
        Mavis.Filter.Criteria.rating = Number(n);
      }

      Mavis.Filter._loadData()
        .then(() => {
          let mod = document.getElementById('content').getAttribute('data-tab'),
              fn = Mavis.Filter._getCallback(mod);
          fn(Mavis.Data.Filtered);
        });
    }
  },

  Marker: {

    _render: (container, mod, conf) => {
      return new Promise((resolve, reject) => {

        let id = 'filterMarker' + mod,
            filterElement = document.createElement('div'),
            options = [];

        if(conf) options = ['<option value="all">Alle Schadensfälle</option>'];

        Mavis.Data.Stores['modules']
          .find({active: true})
          .sort({name: 1})
          .then(modules => {

            modules.forEach(module => {
              let option = '<option value="' + module.label + '">' + module.label + '</option>';
              options.push(option);
            });

            let content = '<label for="' + id + '">Schadensfall: </label><select id="' + id + '">' + options.join('') + '</select>';

            filterElement.setAttribute('class', 'filter');
            filterElement.innerHTML = content;

            document.getElementById(container).appendChild(filterElement);
            document.getElementById(id).addEventListener('change', Mavis.Filter.Marker._events);

            resolve();
          });
      });
    },

    _events: e => {

      let n = e.target.value;

      if(n === 'all') {
        delete Mavis.Filter.Criteria.label;
      } else {
        Mavis.Filter.Criteria.label = n;
      }

      Mavis.Filter._loadData()
        .then(() => {
          let mod = document.getElementById('content').getAttribute('data-tab'),
              fn = Mavis.Filter._getCallback(mod);
          fn(Mavis.Data.Filtered);
        });
    }
  },





/*



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




*/

	init: (mod, container, filters) => {
		return new Promise((resolve, reject) => {

		  async function initFilter() {

        let filterContainer = document.getElementById(container),
            containerId = container + 'Filter';

        await Mavis.Filter._render(filterContainer, containerId);

        if(filters.indexOf('rating') >= 0) Mavis.Filter.Rating._render(containerId, mod, false);
        if(filters.indexOf('ratings') >= 0) Mavis.Filter.Rating._render(containerId, mod, true);
        if(filters.indexOf('marker') >= 0) Mavis.Filter.Marker._render(containerId, mod, false);
        if(filters.indexOf('markers') >= 0) Mavis.Filter.Marker._render(containerId, mod, true);

        await Mavis.Filter._loadData();
		    resolve();
      }

      initFilter();


//			if(filters.indexOf('sort') >= 0) Mavis.Filter.Sort._render(containerId, mod);
//      if(filters.indexOf('cable') >= 0) Mavis.Filter.Cable._render(containerId, mod);
//      if(filters.indexOf('cables') >= 0) Mavis.Filter.Cable._render(containerId, mod, true);
//      if(filters.indexOf('side') >= 0) Mavis.Filter.Sides._render(containerId, mod);
//      if(filters.indexOf('sides') >= 0) Mavis.Filter.Sides._render(containerId, mod, true);
//
//

//      Mavis.Data.Filter.Cable = undefined;
//      Mavis.Data.Filter.Rating = undefined;
//      Mavis.Data.Filter.Marker = undefined;
//      Mavis.Data.Filter.Sides = undefined;
//			Mavis.Data.Filtered = Mavis.Data.Results;

		});
	},
};

module.exports = Mavis.Filter;