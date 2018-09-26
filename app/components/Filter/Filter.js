const Mavis = require('../Global/Global');

Mavis.Filter = {

  Criteria: {},
  Order: {cable: 1, position: 1},
  Data: [],

  _render: (filterContainer, containerId) => {
    return new Promise((resolve, reject) => {
      filterContainer.innerHTML = '<div id="' + containerId + '"></div>';
      resolve();
    });
  },

  _loadData: () => {
    return new Promise((resolve, reject) => {
      Mavis.Data.Stores['results']
        .find(Mavis.Filter.Criteria)
        .sort(Mavis.Filter.Order)
        .then(results => {
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
        fn = Mavis.Inspection._filter;
        break;
      case 'Model':
        fn = Mavis.Model.render;
        break;
    }
    return fn;
  },

  _getCallbackData: () => {
    let data = {},
        cable = Mavis.Filter.Criteria.cable,
        position = Mavis.Player.currentPosition;
    if(!cable) cable = 0;
    if(!position) position = 0;
    data.cable = cable;
    data.position = position;
    return data;
  },

  Cable: {

    _render: (container, mod, conf) => {
      return new Promise((resolve, reject) => {
        let id = 'filterCable' + mod,
            filterElement = document.createElement('div'),
            options = [];
        // classes = Mavis.Data.Settings.damageClasses,
        Mavis.Data.Stores['construction']
          .find({})
          .sort({id: 1})
          .then(construction => {
            let cables = construction[0].cables;
            if(conf) options = ['<option value="all">Alle Seile</option>'];
            cables.forEach(cable => {
              let option = '<option value="' + cable.index + '">' + cable.name + '</option>';
              options.push(option);
            });
            let content = '<label for="' + id + '">Seil </label><select id="' + id + '">' + options.join('') + '</select>';
            filterElement.setAttribute('class', 'filter');
            filterElement.innerHTML = content;
            document.getElementById(container).appendChild(filterElement);
            document.getElementById(id).addEventListener('change', Mavis.Filter.Cable._events);
            resolve();
          });
      });
    },

    _events: e => {
      return new Promise((resolve, reject) => {
        let n = e.target.value;
        if (n === 'all') {
          delete Mavis.Filter.Criteria.cable;
        } else {
          Mavis.Filter.Criteria.cable = Number(n);
          Mavis.Data.State.activeCable = Number(n);
        }
        async function filterCable() {
          await Mavis.Filter._loadData();
          let mod = document.getElementById('content').getAttribute('data-tab');
          let fn = Mavis.Filter._getCallback(mod),
              data = Mavis.Filter._getCallbackData();
          fn(data);
        }
        filterCable();
      });
    }
  },

  Sides: {

    _render: (container, mod, conf) => {
      return new Promise((resolve, reject) => {
        // classes = Mavis.Data.Settings.damageClasses,

        let id = 'filterSides' + mod,
            filterElement = document.createElement('div'),
            options = [];

        Mavis.Data.Stores['construction']
          .find({})
          .sort({id: 1})
          .then(construction => {

            if(conf) options = ['<option value="all">Alle Seiten</option>'];

            let sides = construction[0].meta.cableSides;

            sides.forEach((side, i) => {
              let option = '<option value="' + (i+1) + '">' + side + '</option>';
              options.push(option);
            });

            let content = '<label for="' + id + '">Seite(n): </label><select id="' + id + '">' + options.join('') + '</select>';

            filterElement.setAttribute('class', 'filter');
            filterElement.innerHTML = content;

            document.getElementById(container).appendChild(filterElement);
            document.getElementById(id).addEventListener('change', Mavis.Filter.Sides._events);

            resolve();
          });
        });
    },

    _events: e => {
      let n = e.target.value;
      if(n === 'all') {
        delete Mavis.Filter.Criteria.sides;
      } else {
        let i = Number(n);
        Mavis.Filter.Criteria.sides = {$in: [i]};
      }
      async function filterSides() {
        await Mavis.Filter._loadData();
        let mod = document.getElementById('content').getAttribute('data-tab'),
            fn = Mavis.Filter._getCallback(mod),
            data = Mavis.Filter._getCallbackData();
        fn(data);
      }
      filterSides();
    }
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
      async function filterRating() {
        await Mavis.Filter._loadData();
        let mod = document.getElementById('content').getAttribute('data-tab'),
          fn = Mavis.Filter._getCallback(mod),
          data = Mavis.Filter._getCallbackData();
        fn(data);
      }
      filterRating();
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
      async function filterMarker() {
        await Mavis.Filter._loadData();
        let mod = document.getElementById('content').getAttribute('data-tab'),
          fn = Mavis.Filter._getCallback(mod),
          data = Mavis.Filter._getCallbackData();
        fn(data);
      }
      filterMarker();
    }
  },

  Sort: {
    _render: (container, mod) => {
      return new Promise((resolve, reject) => {
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
          content = '<label for="' + id + '">Sortierung: </label><select id="' + id + '">' + options.join('') + '</select>';
        filterElement.setAttribute('class', 'filter');
        filterElement.innerHTML = content;
        document.getElementById(container).appendChild(filterElement);
        document.getElementById(id).addEventListener('change', Mavis.Filter.Sort._events);
        resolve();
      });
    },

    _events: e => {
      let n = Number(e.target.value);
      Mavis.Filter.Order = {};
      switch (n) {
        case 0:
          Mavis.Filter.Order.cable = 1;
          break;
        case 1:
          Mavis.Filter.Order.cable = -1;
          break;
        case 2:
          Mavis.Filter.Order.label = 1;
          break;
        case 3:
          Mavis.Filter.Order.label = -1;
          break;
        case 4:
          Mavis.Filter.Order.position = 1;
          break;
        case 5:
          Mavis.Filter.Order.position = -1;
          break;
        case 6:
          Mavis.Filter.Order.rating = 1;
          break;
        case 7:
          Mavis.Filter.Order.rating = -1;
          break;
        case 8:
          Mavis.Filter.Order.value = 1;
          break;
        case 9:
          Mavis.Filter.Order.value = -1;
          break;
        default:
          Mavis.Filter.Order.cable = 1;
          break;
      }
      async function sortBy() {
        await Mavis.Filter._loadData();
        let mod = document.getElementById('content').getAttribute('data-tab'),
          fn = Mavis.Filter._getCallback(mod),
          data = Mavis.Filter._getCallbackData();
        fn(data);
      }
      sortBy();
    }
  },

	init: (mod, container, filters) => {
		return new Promise((resolve, reject) => {
		  async function initFilter() {
        let filterContainer = document.getElementById(container),
            containerId = container + 'Filter';
        await Mavis.Filter._render(filterContainer, containerId);
        if(filters.indexOf('sort') >= 0) await Mavis.Filter.Sort._render(containerId, mod);
        if(filters.indexOf('cable') >= 0) await Mavis.Filter.Cable._render(containerId, mod, false);
        if(filters.indexOf('cables') >= 0) await Mavis.Filter.Cable._render(containerId, mod, true);
        if(filters.indexOf('side') >= 0) await Mavis.Filter.Sides._render(containerId, mod);
        if(filters.indexOf('sides') >= 0) await Mavis.Filter.Sides._render(containerId, mod, true);
        if(filters.indexOf('rating') >= 0) await Mavis.Filter.Rating._render(containerId, mod, false);
        if(filters.indexOf('ratings') >= 0) await Mavis.Filter.Rating._render(containerId, mod, true);
        if(filters.indexOf('marker') >= 0) await Mavis.Filter.Marker._render(containerId, mod, false);
        if(filters.indexOf('markers') >= 0) await Mavis.Filter.Marker._render(containerId, mod, true);
        await Mavis.Filter._loadData();
		    resolve();
      }
      initFilter();
		});
	},
};

module.exports = Mavis.Filter;