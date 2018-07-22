const Mavis = require('../Global/Global');

Mavis.Comment = {

  _loaded: {},

  _renderButton: () => {

    return new Promise(function(resolve, reject) {

      const container = document.getElementById('controlsComment'),
        content = [
          '<button id="controlsMarkerCreate" class="active">',
            '<div class="icon iconChat"></div>',
          '</button>'
        ];

      container.innerHTML = content.join('');

      let commentButton = document.getElementById('controlsMarkerCreate');
      commentButton.addEventListener('mousedown', Mavis.Comment.load);

      resolve();
    });
  },

  _renderModal: () => {

    return new Promise(function(resolve, reject) {
      const container = document.getElementById('comment'),
        content = [
          '<div class="inner">',
            '<div class="commentItem" id="commentClose">',
              '<button id="commentCloseButton"><div class="icon iconCancel"></div> schließen</button>',
            '</div>',
            '<h2 id="commentHeadline">Eintrag</h2>',
            '<div class="commentItem" id="commentCases">',
              '<label>Merkmal</label>',
              '<select id="commentCasesSelection"></select>',
            '</div>',
            '<div class="commentItem" id="commentRating">',
              '<label>Schadensklasse</label>',
              '<select id="commentRatingSelection"></select>',
            '</div>',
            '<div class="commentItem" id="commentPosition">',
              '<label for="commentPositionInput">Von (m)</label>',
              '<input type="number" id="commentPositionInput" value="0.00" min="0" steps="0.1" />',
            '</div>',
            '<div class="commentItem" id="commentDistance">',
              '<label for="commentDistanceInput">Bis (m)</label>',
              '<input type="number" id="commentDistanceInput" value="0.00" min="0" steps="0.1" />',
            '</div>',
            '<div class="commentItem" id="commentFrequency">',
              '<label for="commentFrequencyInput">Häufigkeit/Strecke</label>',
              '<input type="number" id="commentFrequencyInput" value="0" min="0" />',
              '<select id="commentFrequencyInputMetric"></select>',
            '</div>',
            '<div class="commentItem" id="commentImages">',
              '<label>Betroffene Seiten</label>',
              '<div id="commentImagesContainer"></div>',
            '</div>',
            '<div class="commentItem" id="commentText">',
              '<label for="commentTextInput">Kommentar </label>',
              '<textarea id="commentTextInput"></textarea>',
            '</div>',
            '<div class="commentItem" id="commentFunctions"></div>',
          '</div>'
        ];

      container.innerHTML = content.join('');
      resolve();
    });
  },

  _setMarkerOptions: n => {

    return new Promise(function(resolve, reject) {

      console.log(n);

      let selection = document.getElementById('commentCasesSelection'),
          din = Mavis.Data.Settings.din,
          manual = Mavis.Data.Settings.manual,
          counter = 0,
          options = ['<option value="nn" data-module-index="nn">Schadensmerkmal auswählen</option>'];

      din.forEach(function(mod, i) {
        let option = '<option value="' + i + '" data-module-index="' + i + '">' + mod.label + '</option>';
        options.push(option);
        counter++;
      });

      manual.forEach(function(mod, i) {
        let option = '<option value="' + counter + '" data-module-index="' + i + '">' + mod.label + '</option>';
        options.push(option);
        counter++;
      });

      selection.innerHTML = options.join('');
      selection.selectedIndex = (n-5);

      resolve();
    });
  },

  _setRatingOptions: n => {

    return new Promise(function(resolve, reject) {

      let selection = document.getElementById('commentRatingSelection'),
          options = [],
          classes = Mavis.Data.Settings.damageClasses;

      classes.forEach(function(el, i) {
        let option = '<option value="' + i + '" data-class-index="' + i + '">' + el + '</option>';
        options.push(option);
      });

      selection.innerHTML = options.join('');
      selection.selectedIndex = n;

      resolve();
    });
  },

  _setPosition: n => {

    return new Promise(function(resolve, reject) {

      document.getElementById('commentPositionInput').value = Number(n).toFixed(2);

      resolve();
    });
  },

  _setDistance: (n, m) => {

    return new Promise(function(resolve, reject) {

      document.getElementById('commentDistanceInput').value = (Number(n) + Number(m)).toFixed(2);

      resolve();
    })
  },

  _setFrequency: (n, m) => {

    return new Promise(function(resolve, reject) {

      let input = document.getElementById('commentFrequencyInput'),
          selection = document.getElementById('commentFrequencyInputMetric'),
          metrics = ['&#37;','m','cm','cm&#178;','cm&#179;','Stück'],
          i = metrics.indexOf(m),
          options = [];

      input.value = n;

      metrics.forEach(function(el, i) {
        let option = '<option value="' + i + '" data-class-index="' + i + '">' + el + '</option>';
        options.push(option);
      });

      selection.innerHTML = options.join('');
      selection.selectedIndex = i;

      resolve();
    })
  },

  _setActiveSides: sides => {

    return new Promise(function(resolve, reject) {

      let elements = document.querySelectorAll('.commentImage');

      elements.forEach(function(element, i) {

        if(sides.indexOf(i) > -1) {
          element.classList.add('active');
        }

      });

      resolve();
    });
  },

  _setImages: (position, sides) => {

    return new Promise(function(resolve, reject) {

      let container = document.getElementById('commentImagesContainer'),
          l = 6,
          i = 0,
          img = Mavis.Player._getFrame(position),
          items = [];

      for(i=0;i<l;i++) {
        let backgroundImg = Mavis.Visual.imagePath + i + '/' + img + '.jpg',
            item = '<div class="commentImage" data-value="' + i + '">' + backgroundImg + '<div class="icon iconCableActive' + i + '"></div> <div class="icon iconConfirm"></div></div>';

        items.push(item);
      }

      container.innerHTML = items.join('');

      Mavis.Comment._setActiveSides(sides)
        .then(resolve());
    });
  },

  _selectSide: e => {

    if(e.target.classList.contains('active')) {
      e.target.classList.remove('active');
    } else {
      e.target.classList.add('active');
    }
  },

  _setText: txt => {

    return new Promise(function(resolve, reject) {

      let input = document.getElementById('commentTextInput');
      input.value = txt;
      resolve();
    });
  },

  _renderFunctions: status => {

    return new Promise(function(resolve, reject) {

      let container = document.getElementById('commentFunctions'),
          functions = ['<button id="commentReset" class="ghost"><div class="icon iconRefresh"></div> zurücksetzen</button>'];

      if(status === 'new') {
        functions.push('<button id="commentCancel"><div class="icon iconCancel"></div> abbrechen</button>');
      } else {
        functions.push('<button id="commentRemove"><div class="icon iconTrash"></div> löschen</button>');
      }

      functions.push('<button id="commentSave" class="active"><div class="icon iconConfirm"></div> speichern</button>');

      container.innerHTML = functions.join('');

      resolve();
    });
  },

  _events: () => {

    return new Promise(function(resolve, reject) {

      let commentClose = document.getElementById('commentCloseButton'),
          commentSides = document.querySelectorAll('.commentImage'),
          commentReset = document.getElementById('commentReset');

      commentClose.addEventListener('mousedown', Mavis.Comment._toggle);

      commentSides.forEach(function(side, index) {
        side.addEventListener('mousedown', Mavis.Comment._selectSide);
      });

      commentReset.addEventListener('mousedown', Mavis.Comment._reset);

      resolve();
    });
  },

  _reset: () => {
    Mavis.Comment.load(Mavis.Comment._loaded);
  },

  _toggle: () => {

    let container = document.getElementById('comment');

    if(container.classList.contains('hidden')) {
      container.classList.remove('hidden');
    } else {
      container.classList.add('hidden');
    }
  },

  load: data => {

    return new Promise(function(resolve, reject) {

      // let id = Mavis.Data.Results.indexOf(data);
      // console.log(id);

      let headline = document.getElementById('commentHeadline');

      if(!data.label) {

        data = {};
        data.status = 'new';
        data.caption = '';
        data.case = 0;
        data.distance = 0.1;
        data.metric = '&#37;';
        data.position = Mavis.Player.currentPosition;
        data.rating = 0;
        data.sides = [];
        data.value = 0;

        headline.innerText = 'Eintrag erstellen';

      } else {

        headline.innerText = 'Eintrag bearbeiten';
        data.status = 'old';
      }

      Mavis.Comment._loaded = data;

      Mavis.Comment._setMarkerOptions(data.case)
        .then(Mavis.Comment._setRatingOptions(data.rating))
        .then(Mavis.Comment._setPosition(data.position))
        .then(Mavis.Comment._setDistance(data.position, data.distance))
        .then(Mavis.Comment._setFrequency(data.value, data.metric))
        .then(Mavis.Comment._setImages(data.position, data.sides))
        .then(Mavis.Comment._setText(data.caption))
        .then(Mavis.Comment._renderFunctions(data.status))
        .then(Mavis.Comment._events())
        .then(function() {
          let container = document.getElementById('comment');
          if(container.classList.contains('hidden')) {
            container.classList.remove('hidden');
          }
        })
        .then(resolve());
    });
  },

  init: () => {

    return new Promise(function(resolve, reject) {

      Mavis.Comment._renderButton()
        .then(Mavis.Comment._renderModal())
        .then(resolve());
    });
  }
};

module.exports = Mavis.Comment;


/*************************** LATER *************************/

/*
  _getMetricLabel: metric => {

    let metricLabel;

    switch (metric) {

      case '&#37;':
        metricLabel = 'Anteil';
        break;

      case 'cm':
        metricLabel = 'Länge';
        break;

      case 'm':
        metricLabel = 'Länge';
        break;

      case 'cm&#178;':
        metricLabel = 'Fläche';
        break;

      case 'cm&#179;':
        metricLabel = 'Volumen';
        break;

      case 'Stück':
        metricLabel = 'Anzahl';
        break;

      case 'µ':
        metricLabel = 'Dicke';
        break;

      case 'Hz':
        metricLabel = 'Frequenz';
        break;

      case '°Mohs':
        metricLabel = 'Härte';
        break;

      case 'Ri':
        metricLabel = 'Brüche';
        break;

      default:
        metricLabel = 'Länge/Fläche';
        break;
    }

    return metricLabel;
  },


  _remove: () => {

	  document.getElementById('comment').classList.add('hidden');
  },

  _save: () => {

	  document.getElementById('comment').classList.add('hidden');
  },

*/

/********************************** OLD **********************************/

/*

MAVIS.COMMENTS = {

	overwrite: false,
	current: {
		module: 0,
		comment: 0
	},

	remove: function() {

		var mod = MAVIS.COMMENTS.current.module,
			com = MAVIS.COMMENTS.current.comment,
			data = MAVIS.DATA.RESULTS.CABLES[MAVIS.CONTROLS.FILTERS.cable].usergenerated[mod].all;

		data.splice(com, 1);
		MAVIS.COMMENTS.erase();
		MAVIS.CONTROLS.MARKER.init();
		MAVIS.DATA.write_results();
	},

	save: function() {

		var mod = Number(this._getCase()),
			i = mod - 4;

		var comment = {};
		comment.position = Number(this._getPosition());
		comment.distance = Number(this._getDistance());
		comment.sides = this._getSides();
		comment.case = mod;
		comment.value = Number(this._getValue());
		comment.rating = Number(this._getClass());
		comment.content = this._getComment();
		comment.images = MAVIS.VISUAL.last_image;

		if(!MAVIS.COMMENTS.overwrite) {
			MAVIS.DATA.RESULTS.CABLES[MAVIS.CONTROLS.FILTERS.cable].usergenerated[i].all.push(comment);
		} else {
			MAVIS.DATA.RESULTS.CABLES[MAVIS.CONTROLS.FILTERS.cable].usergenerated[i].all[MAVIS.COMMENTS.current.comment].position = this._getPosition();
			MAVIS.DATA.RESULTS.CABLES[MAVIS.CONTROLS.FILTERS.cable].usergenerated[i].all[MAVIS.COMMENTS.current.comment].distance = this._getDistance();
			MAVIS.DATA.RESULTS.CABLES[MAVIS.CONTROLS.FILTERS.cable].usergenerated[i].all[MAVIS.COMMENTS.current.comment].sides = this._getSides();
			MAVIS.DATA.RESULTS.CABLES[MAVIS.CONTROLS.FILTERS.cable].usergenerated[i].all[MAVIS.COMMENTS.current.comment].case = i;
			MAVIS.DATA.RESULTS.CABLES[MAVIS.CONTROLS.FILTERS.cable].usergenerated[i].all[MAVIS.COMMENTS.current.comment].value = this._getValue();
			MAVIS.DATA.RESULTS.CABLES[MAVIS.CONTROLS.FILTERS.cable].usergenerated[i].all[MAVIS.COMMENTS.current.comment].rating = this._getClass();
			MAVIS.DATA.RESULTS.CABLES[MAVIS.CONTROLS.FILTERS.cable].usergenerated[i].all[MAVIS.COMMENTS.current.comment].content = this._getComment();
			MAVIS.DATA.RESULTS.CABLES[MAVIS.CONTROLS.FILTERS.cable].usergenerated[i].all[MAVIS.COMMENTS.current.comment].images = MAVIS.VISUAL.last_image;
		}

		MAVIS.COMMENTS.erase();
		MAVIS.CONTROLS.MARKER.init();
		MAVIS.DATA.write_results();
		MAVIS.COMMENTS.overwrite = false;
		document.getElementById('comments').classList.add('hidden');
	},

*/