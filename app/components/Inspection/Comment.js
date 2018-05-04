const Mavis = require('../Global/Global');

Mavis.Comment = {

	_renderButton: () => {

		return new Promise(function(resolve, reject) {

			const container = document.getElementById('controlsComment'),
            content = [
              '<button id="controlsMarkerCreate" class="active">',
                '<div class="icon iconMarker"></div>',
              '</button>'
            ];

			container.innerHTML = content.join('');
			resolve();
		});
	},

  _renderModal: () => {

    return new Promise(function(resolve, reject) {

      const container = document.getElementById('comment'),
            content = [
              '<div class="inner">',
                '<div id="commentBody">',
                  '<h2>Eintrag erstellen/bearbeiten</h2>',
                  '<div class="commentItem" id="commentsCases">',
                    '<label>Merkmal: </label>',
                    '<select id="commentsCasesSelection"></select>',
                  '</div>',
                  '<div class="commentItem" id="commentsRating">',
                    '<label>Schadensklasse: </label>',
                    '<select id="commentsRatingSelection"></select>',
                  '</div>',
                  '<div class="commentItem" id="commentsMeasure">',
                    '<label id="commentMeasureLabel" for="commentMeasureInput">Anteil (%): </label>',
                    '<input type="number" id="commentMeasureInput" value="0.00" />',
                  '</div>',
                  '<div class="commentItem" id="commentPosition">',
                    '<label for="commentPosition">Position (m): </label>',
                    '<input type="number" id="commentPositionInput" value="0.00" />',
                  '</div>',
                  '<div class="commentItem" id="commentDistance">',
                    '<label for="commentDistance">Länge (m): </label>',
                    '<input type="number" id="commentDistanceInput" value="0.00" />',
                  '</div>',
                  '<div class="commentItem" id="commentImages">',
                    '<label>Betroffene Seiten: </label>',
                    '<div id="commentImagesContainer"></div>',
                  '</div>',
                  '<div class="commentItem" id="commentText">',
                    '<label for="commentTextInput">Kommentar: </label>',
                    '<textarea id="commentTextInput"></textarea>',
                  '</div>',
                  '<div id="commentFunctions">',
                    '<button id="commentCancel"><div class="icon iconCancel"></div> Abbrechen</button>',
                    '<button id="commentReset"><div class="icon iconRefresh"></div> Reset</button>',
                    '<button id="commentRemove"><div class="icon iconTrash"></div> Löschen</button>',
                    '<button id="commentSave"><div class="icon iconConfirm"></div> Speichern</button>',
                  '</div>',
                '</div>',
              '</div>'
            ];

      container.innerHTML = content.join('');
      resolve();
    });
  },

  _cloneImages: () => {

    return new Promise(function(resolve, reject) {

      let images = document.getElementById('pictures'),
          imagesClone = images.cloneNode(true);

      document.getElementById('commentImagesContainer').appendChild(imagesClone);

      resolve();
    });
  },

  _setMarkerOptions: () => {

	  return new Promise(function(resolve, reject) {

      let din = Mavis.Data.Settings.din,
          manual = Mavis.Data.Settings.manual,
          counter = 0,
          options = [];

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

      document.getElementById('commentsCasesSelection').innerHTML = options.join('');

	    resolve();
    });
  },

  _setRatingOptions: () => {

    return new Promise(function(resolve, reject) {

      let options = [],
          classes = Mavis.Data.Settings.damageClasses;

      classes.forEach(function(el, i) {
        let option = '<option value="' + i + '" data-class-index="' + i + '">' + el + '</option>';
        options.push(option);
      });

      document.getElementById('commentsRatingSelection').innerHTML = options.join('');

      resolve();
    });
  },

  _toggleComment: () => {

	  let container = document.getElementById('comment');

	  if(container.classList.contains('hidden')) {
	    container.classList.remove('hidden');
    } else {
	    container.classList.add('hidden');
    }
  },

  _cancel: () => {

    document.getElementById('comment').classList.add('hidden');
  },

  _reset: () => {

    document.getElementById('comment').classList.add('hidden');
  },

  _remove: () => {

	  document.getElementById('comment').classList.add('hidden');
  },

  _save: () => {

	  document.getElementById('comment').classList.add('hidden');
  },

  _events: () => {

	  let commentButton = document.getElementById('controlsMarkerCreate'),
        commentCancel = document.getElementById('commentCancel'),
        commentReset = document.getElementById('commentReset'),
        commentRemove = document.getElementById('commentRemove'),
        commentSave = document.getElementById('commentSave'),
        commentImage = document.querySelectorAll('#commentImagesContainer .picture');

	  commentButton.addEventListener('mousedown', Mavis.Comment._toggleComment);
    commentCancel.addEventListener('mousedown', Mavis.Comment._cancel);
    commentReset.addEventListener('mousedown', Mavis.Comment._reset);
    commentRemove.addEventListener('mousedown', Mavis.Comment._remove);
    commentSave.addEventListener('mousedown', Mavis.Comment._save);

    commentImage.forEach(function(image, i){

      image.addEventListener('mousedown', function() {

        if(this.classList.contains('active')) {
          this.classList.remove('active');
        } else {
          this.classList.add('active');
        }
      });

    });


  },

	init: () => {

		return new Promise(function(resolve, reject) {

			Mavis.Comment._renderButton()
      .then(Mavis.Comment._renderModal())
      .then(Mavis.Comment._cloneImages())
      .then(Mavis.Comment._setMarkerOptions())
      .then(Mavis.Comment._setRatingOptions())
      .then(Mavis.Comment._events())
			.then(resolve());
		});
	}
};

module.exports = Mavis.Comment;


/*

MAVIS.COMMENTS = {

	overwrite: false,
	current: {
		module: 0,
		comment: 0
	},

	_resize: function() {

		return new Promise(function(resolve, reject) {

			var header = document.getElementsByTagName('header'),
				controls = document.getElementById('controls'),
				comments = document.getElementById('comments'),
 				commentsHeight = (Math.ceil(window.innerHeight - header[0].clientHeight - controls.clientHeight)) + 'px';

			comments.style.height = commentsHeight;

			resolve();
		});
	},

	_toggleMenu: function() {

		var comments = document.getElementById('comments'),
			commentsFunctions = document.getElementById('commentsFunctions');

		if(comments.classList.contains('hidden')) {
			MAVIS.COMMENTS.erase();
			comments.classList.remove('hidden');
		} else {
			comments.classList.add('hidden');
			MAVIS.COMMENTS.erase();
		}

		commentsFunctions.setAttribute('class', 'new');
	},

	_setPosition: function(n) {

		if(!n) var n = 0;

		var cableLength = MAVIS.DATA.OBJECT.BUILD.CABLES[MAVIS.CONTROLS.FILTERS.cable].LENGTH,
			maxDistance = cableLength - n,
			commentPosition = document.getElementById('commentPosition'),
			commentDistance = document.getElementById('commentDistance');

		commentPosition.setAttribute('value', n);
		commentPosition.setAttribute('max', cableLength);
		commentDistance.setAttribute('max', maxDistance);
	},

	_getPosition: function() {

		var posititonInput = document.getElementById('commentPosition'),
			pos = Number(posititonInput.value);

		return pos;
	},

	_setDistance: function(n) {

		if(!n) var n = 0;

		var el = document.getElementById('commentDistance'),
			x = n.toFixed(2);

		el.value = x;
	},

	_getDistance: function() {

		var el = document.getElementById('commentDistance');
		return el.value;
	},

	_setSides: function(arr) {

		if(!arr) var arr = new Array;

		var container = document.querySelector('#commentCableSides'),
			sides = MAVIS.DATA.OBJECT.BUILD.CABLES[MAVIS.CONTROLS.FILTERS.cable].SIDES,
			content = '';

		container.innerHTML = '';

		for(i=1; i<=sides; i++) {

			if(arr.indexOf(i) > -1) {
				content += '<label>' + i + ': </label><input type="checkbox" data-side="' + i + '" class="commentCableSide" checked>';
			} else {
				content += '<label>' + i + ': </label><input type="checkbox" data-side="' + i + '" class="commentCableSide">';
			}

		}

		container.innerHTML = content;
	},

	_getSides: function() {

		var checkboxes = document.querySelectorAll('.commentCableSide'),
			sides = MAVIS.DATA.OBJECT.BUILD.CABLES[MAVIS.CONTROLS.FILTERS.cable].SIDES,
			arr = new Array;

		for(i=0; i<sides; i++) {
			if(checkboxes[i].checked) arr.push(i);
		}

		return arr;
	},

	_setCase: function (c) {

		if(!c) var c = 0;

		var commentsCasesSelection = document.getElementById('commentsCasesSelection');
		commentsCasesSelection.innerHTML = '';

		MAVIS.DATA.CONFIG.MODULES.forEach(function(obj, i) {

			if(i > 3) {

				var n = i-4,
					check;

				if(n === c) {
					check = 'checked';
				} else {
					check = '';
				}

				var el = '<div class="commentsCasesEntry"><input type="radio" name="usergenerated" value="' + n + '" data-id="' + i + '" ' + check + '/><label>' + MAVIS.DATA.CONFIG.MODULES[i].label + '</label></div>';

				commentsCasesSelection.innerHTML += el;
			}
		});

		var cases = document.querySelectorAll('#commentsCasesSelection input'),
			l = cases.length;

		for(x=0;x<l;x++) {
			cases[x].addEventListener('change', function(e) {

				var mod = this.getAttribute('data-id'),
					m = MAVIS.DATA.CONFIG.MODULES[mod].metric;

				MAVIS.COMMENTS._setMetric(m);
			});
		}
	},

	_getCase: function() {

		var cases = document.querySelectorAll('.commentsCasesEntry > input'),
			n = cases.length,
			x = 0;

		for(i=0; i<n; i++) {
			if(cases[i].checked) x = cases[i].getAttribute('data-id');
		}

		return x;
	},

	_setValue: function(n) {

		if(!n) var n = 0;

		var x = Number(n),
			el = document.getElementById('commentsRatingValue');

		el.value = x;
	},

	_getValue: function() {

		var el = document.getElementById('commentsRatingValue');
		return el.value;
	},

	_setMetric: function(n) {

		if(!n) var n = 0;

		var el = document.getElementById('commentsRatingValueMetric');
		el.innerHTML = MAVIS.DATA.CONFIG.METRICS[n];
	},

	_setClass: function(n) {

		if(!n) var n = 0;

		var select = document.getElementById('commentsRatingSelect'),
			classes = MAVIS.DATA.CONFIG.CLASSES,
			content = '';

		select.innerHTML = '';

		for(i=0; i<classes.length; i++) {

			var selected = '';

			if(i === n) selected = 'selected';

			content += '<option value="' + i + '" ' + selected + '>' + classes[i] + '</option>';
		}

		select.innerHTML = content;
	},

	_getClass: function() {

		var options = document.querySelectorAll('#commentsRatingSelect > option'),
			n = options.length,
			x = 0;

		for(i=0;i<n;i++) {
			if(options[i].selected) x = i;
		}

		return x;
	},

	_setComment: function(txt) {

		if(!txt) var txt = '';

		var el = document.getElementById('commentsTextarea');
		el.value = txt;
	},

	_getComment: function() {

		var el = document.getElementById('commentsTextarea');
		return el.value;
	},

	erase: function() {
		MAVIS.COMMENTS._setPosition(Number(MAVIS.CONTROLS.currentPosition));
		MAVIS.COMMENTS._setDistance(0);
		MAVIS.COMMENTS._setSides();
		MAVIS.COMMENTS._setCase(0);
		MAVIS.COMMENTS._setValue(0);
		MAVIS.COMMENTS._setMetric(0);
		MAVIS.COMMENTS._setClass(0);
		MAVIS.COMMENTS._setComment('');

		MAVIS.COMMENTS.overwrite = false;
	},

	load: function(mod, i) {

		var data = MAVIS.DATA.RESULTS.CABLES[MAVIS.CONTROLS.FILTERS.cable].usergenerated[mod].all[i],
			selectedCase = data.case -4,
			comments = document.getElementById('comments'),
			commentsFunctions = document.getElementById('commentsFunctions');

		MAVIS.COMMENTS._setPosition(Number(data.position));
		MAVIS.COMMENTS._setDistance(data.distance);
		MAVIS.COMMENTS._setSides(data.sides);
		MAVIS.COMMENTS._setCase(selectedCase);
		MAVIS.COMMENTS._setValue(data.value);
		MAVIS.COMMENTS._setMetric(MAVIS.DATA.CONFIG.MODULES[data.case].metric);
		MAVIS.COMMENTS._setClass(data.rating);
		MAVIS.COMMENTS._setComment(data.content);

		MAVIS.COMMENTS.current.module = mod;
		MAVIS.COMMENTS.current.comment = i;
		MAVIS.COMMENTS.overwrite = true;

		commentsFunctions.setAttribute('class', 'overwrite');
		comments.classList.remove('hidden');
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

	_events: function() {

		return new Promise(function(resolve, reject) {

			var btnToggle = document.getElementById('commentsToggle'),
				btnReset = document.getElementById('commentsReset'),
				btnSave = document.getElementById('commentsSave'),
				btnCancel = document.getElementById('commentsCancel'),
				btnRemove = document.getElementById('commentsRemove');

			btnToggle.addEventListener('click', function(e) {
				MAVIS.COMMENTS._toggleMenu();
				MAVIS.COMMENTS.overwrite = false;
			});

			btnReset.addEventListener('click', function(e) {
				MAVIS.COMMENTS.erase();
			});

			btnSave.addEventListener('click', function(e) {
				MAVIS.COMMENTS.save();
			});

			btnCancel.addEventListener('click', function(e) {
				MAVIS.COMMENTS.erase();
				MAVIS.COMMENTS._toggleMenu();
			});

			btnRemove.addEventListener('click', function(e) {
				MAVIS.COMMENTS.remove();
			});

			resolve();
		});
	},

	init: function() {

		return new Promise(function(resolve, reject) {

			console.log('init COMMENTS');

			MAVIS.COMMENTS._resize()
			.then(MAVIS.COMMENTS._setPosition())
			.then(MAVIS.COMMENTS._setDistance())
			.then(MAVIS.COMMENTS._setSides())
			.then(MAVIS.COMMENTS._setCase())
			.then(MAVIS.COMMENTS._setValue())
			.then(MAVIS.COMMENTS._setMetric())
			.then(MAVIS.COMMENTS._setClass())
			.then(MAVIS.COMMENTS._setComment())
			.then(MAVIS.COMMENTS._events())
			.then(resolve());
		});
	}
};

*/