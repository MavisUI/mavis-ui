const Mavis = require('../Global/Global');

Mavis.Comment = {

  Loaded: {},
  Updates: {},

  _renderButton: () => {
    return new Promise((resolve, reject) => {
      const container = document.getElementById('controlsComment'),
        content = [
          '<button id="controlsMarkerCreate" class="active">',
            '<div class="icon iconChat"></div>',
          '</button>'
        ];
      container.innerHTML = content.join('');
      document.getElementById('controlsMarkerCreate').addEventListener('click', Mavis.Comment.load);
      resolve();
    });
  },

  _renderModal: () => {
    return new Promise((resolve, reject) => {
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
              '<select id="commentFrequencyInputMetric" disabled></select>',
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

  _setIdentifier: (id, state) => {
    return new Promise((resolve, reject) => {
      let comment = document.getElementById('comment');
      comment.setAttribute('data-id', id);
      comment.setAttribute('data-state', state);
      resolve();
    });
  },

  _setMarkerOptions: n => {
    return new Promise((resolve, reject) => {
      let selection = document.getElementById('commentCasesSelection'),
          options = ['<option value="nn">Schadensmerkmal auswählen</option>'];
      Mavis.Data.Stores['modules']
        .find({active: true})
        .sort({name: 1})
        .then(modules => {
          modules.forEach(module => {
            let option = '<option value="' + module.index + '" data-color="' + module.color + '" data-metric="' + module.metric + '" data-label="' + module.label + '">' + module.label + '</option>';
            options.push(option);
          });
          selection.innerHTML = options.join('');
          selection.selectedIndex = (n);
          resolve();
        });
    });
  },

  _setRatingOptions: n => {
    return new Promise((resolve, reject) => {
      Mavis.Data.Stores['classes']
        .find({})
        .sort({id: 1})
        .then(classes => {
          let selection = document.getElementById('commentRatingSelection'),
              options = [];
          classes.forEach((el, i) => {
            let option = '<option value="' + el.id + '" data-class-index="' + el.id + '">' + el.name + '</option>';
            options.push(option);
          });
          selection.innerHTML = options.join('');
          selection.selectedIndex = n;
          resolve();
        });
    });
  },

  _setPosition: n => {
    return new Promise((resolve, reject) => {
      document.getElementById('commentPositionInput').value = Number(n).toFixed(2);
      resolve();
    });
  },

  _setDistance: (n, m) => {
    return new Promise((resolve, reject) => {
      let position = Number(n),
          distance = Number(m),
          val = position + distance;
      document.getElementById('commentDistanceInput').value = val;
      resolve();
    })
  },

  _setFrequency: (n, m) => {
    return new Promise((resolve, reject) => {
      let input = document.getElementById('commentFrequencyInput'),
          selection = document.getElementById('commentFrequencyInputMetric'),
          metrics = Mavis.Data.Metrics,
          i = metrics.indexOf(m),
          options = [];
      input.value = n;
      metrics.forEach((el, i) => {
        let option = '<option value="' + i + '" data-class-index="' + i + '">' + el + '</option>';
        options.push(option);
      });
      selection.innerHTML = options.join('');
      selection.selectedIndex = i;
      resolve();
    })
  },

  _setMetrics: n => {
    return new Promise((resolve, reject) => {
      Mavis.Data.Stores['modules']
        .find({})
        .sort({id: 1})
        .then(modules => {
          let selection = document.getElementById('commentFrequencyInputMetric'),
              options = [];
          modules.forEach(el => {
            let option = '<option value="' + el.metric + '">' + Mavis.Data.Metrics[el.metric].metric + '</option>';
            options.push(option);
          });
          selection.innerHTML = options.join('');
          selection.selectedIndex = n;
          resolve();
        });
    });
  },

  _setActiveSides: sides => {
    return new Promise((resolve, reject) => {
      let elements = document.querySelectorAll('.commentImage');
      elements.forEach((element, i) => {
        if(sides.indexOf(i) > -1) {
          element.classList.add('active');
        }
      });
      resolve();
    });
  },

  _setImages: (position, sides) => {
    return new Promise((resolve, reject) => {

      let container = document.getElementById('commentImagesContainer'),
          l = 6,
          i,
          n = Mavis.Player._getFrame(Mavis.Filter.Criteria.cable, position);

      n++;

      let img = Mavis.Visual._formatFileName(n),
          items = [];

      for(i=0;i<l;i++) {
        let backgroundImg = Mavis.Visual.imagePath + i + '/' + img,
            item = '<div class="commentImage" data-value="' + i + '" data-img="' + backgroundImg + '" style="background-image: url(' + backgroundImg + ')"><div class="icon iconCableActive' + i + '"></div> <div class="icon iconConfirm"></div></div>';
        items.push(item);
      }

      container.innerHTML = '';
      container.innerHTML = items.join('');

      Mavis.Comment._setActiveSides(sides)
        .then(resolve());
    });
  },

  _setText: txt => {
    return new Promise((resolve, reject) => {
      let input = document.getElementById('commentTextInput');
      input.value = txt;
      resolve();
    });
  },

  _selectSide: e => {
    if(e.target.classList.contains('active')) {
      e.target.classList.remove('active');
    } else {
      e.target.classList.add('active');
    }
    Mavis.Comment._getImagesAndSides();
  },

  load: data => {
    return new Promise((resolve, reject) => {
      let headline = document.getElementById('commentHeadline');
      if(!data.label) {
        data = {};
        data.id = '';
        data.status = 'new';
        data.caption = '';
        data.case = 0;
        data.distance = 0.1;
        data.metric = 0;
        data.position = Mavis.Player.currentPosition;
        data.rating = 0;
        data.sides = [];
        data.value = 0;
        headline.innerText = 'Eintrag erstellen';
      } else {
        headline.innerText = 'Eintrag bearbeiten';
        data.status = 'old';
      }
      Mavis.Comment.Loaded = data;

      async function loadData() {
        let container = document.getElementById('comment');
        await Mavis.Comment._setIdentifier(data.id, data.status);
        await Mavis.Comment._setMarkerOptions(data.case);
        await Mavis.Comment._setRatingOptions(data.rating);
        await Mavis.Comment._setPosition(data.position);
        await Mavis.Comment._setDistance(data.position, data.distance);
        await Mavis.Comment._setFrequency(data.value, data.metric);
        await Mavis.Comment._setMetrics(data.metric);
        await Mavis.Comment._setImages(data.position, data.sides);
        await Mavis.Comment._setText(data.caption);
        await Mavis.Comment._renderFunctions(data.status);
        await Mavis.Comment._events();

        if(container.classList.contains('hidden')) container.classList.remove('hidden');
        resolve();
      }

      loadData();
    });
  },

  _getCase: e => {
    let selected = e.target.selectedIndex,
        option = e.target[selected];
    Mavis.Comment.Updates.case = option.value;
    Mavis.Comment.Updates.label = option.getAttribute('data-label');
    Mavis.Comment.Updates.color = option.getAttribute('data-color');
    Mavis.Comment.Updates.metric = option.getAttribute('data-metric');
    document.getElementById('commentFrequencyInputMetric').selectedIndex = Mavis.Comment.Updates.metric;
  },

  _getRating: e => {
    let selected = e.target.selectedIndex,
        option = e.target[selected].value;
    Mavis.Comment.Updates.rating = option;
  },

  _getPosition: e => {
    let pos = Number(e.target.value);
    Mavis.Comment.Updates.position = pos;
    document.getElementById('commentDistanceInput').value = pos + 0.01;
  },

  _getDistance: e => {
    let distance = (Number(document.getElementById('commentDistanceInput').value) - Number(document.getElementById('commentPositionInput').value)).toFixed(2);
    Mavis.Comment.Updates.distance = distance;
  },

  _getImagesAndSides: e => {
    Mavis.Comment.Updates.images = new Array();
    Mavis.Comment.Updates.sides = new Array();

    let elements = document.querySelectorAll('.commentImage');
    elements.forEach((img, index) => {
      if(img.classList.contains('active') && Mavis.Comment.Updates.images.indexOf(img.getAttribute('data-img')) < 0) {
        Mavis.Comment.Updates.images.push(img.getAttribute('data-img'));
      }
      if(img.classList.contains('active') && Mavis.Comment.Updates.sides.indexOf(index) < 0) {
        Mavis.Comment.Updates.sides.push(index);
      }
    });
  },

  _getValue: e => {
    Mavis.Comment.Updates.value = e.target.value;
  },

  _getCaption: e => {
    Mavis.Comment.Updates.caption = e.target.value;
  },

  _getData: () => {
    let complete = true;
    if(!Mavis.Comment.Updates.caption) Mavis.Comment.Updates.caption = Mavis.Comment.Loaded.caption;
    if(!Mavis.Comment.Updates.case) {
      Mavis.Notifications.notify(8);
      complete = false;
    }
    if(!Mavis.Comment.Updates.distance) Mavis.Comment.Updates.distance = Mavis.Comment.Loaded.distance;
    if(complete && !Mavis.Comment.Updates.images || Mavis.Comment.Updates.images === []) {
      Mavis.Notifications.notify(9);
      complete = false;
    }
    if(!Mavis.Comment.Updates.position) Mavis.Comment.Updates.position = Mavis.Player.currentPosition;
    if(!Mavis.Comment.Updates.rating) Mavis.Comment.Updates.rating = Mavis.Comment.Loaded.rating;
    if(!Mavis.Comment.Updates.value) Mavis.Comment.Updates.value = Mavis.Comment.Loaded.value;
    if(complete) {
      let data = {};
      data.cable = Number(Mavis.Filter.Criteria.cable);
      data.caption = Mavis.Comment.Updates.caption;
      data.case = Number(Mavis.Comment.Updates.case);
      data.color = Mavis.Comment.Updates.color;
      data.distance = Number(Mavis.Comment.Updates.distance);
      data.images = Mavis.Comment.Updates.images;
      data.label = Mavis.Comment.Updates.label;
      data.metric = Mavis.Data.Metrics[Mavis.Comment.Updates.metric].metric;
      data.position = Number(Mavis.Comment.Updates.position);
      data.rating = Number(Mavis.Comment.Updates.rating);
      data.sides = Mavis.Comment.Updates.sides;
      data.type = "manual";
      data.value = Number(Mavis.Comment.Updates.value);
      return data;
    } else {
      return false;
    }
  },

  _reset: () => {
    Mavis.Comment.Updates = {};
    Mavis.Comment.load(Mavis.Comment.Loaded);
  },

  _cancel: e => {
    Mavis.Comment._toggle();
  },

  _insert: doc => {
    Mavis.Data.Stores['results'].insert(doc);
  },

  _save: e => {

    let state = document.getElementById('comment').getAttribute('data-state'),
        doc = Mavis.Comment._getData(),
        data = {};

    data.cable = Mavis.Filter.Criteria.cable;
    data.position = Mavis.Player.currentPosition;

    if (state === 'new') {
      async function insert() {
        Mavis.Comment._insert(doc);
        await Mavis.Filter._loadData();
        Mavis.Inspection._filter(data);
        Mavis.Comment._toggle();
      }

      insert();

    } else {
      Mavis.Comment._update();
    }
  },

  _remove: id => {
      Mavis.Data.Stores['results'].remove({_id: id});
  },

  _delete: e => {
    let id = document.getElementById('comment').getAttribute('data-id'),
        data = {};

    data.cable = Mavis.Filter.Criteria.cable;
    data.position = Mavis.Player.currentPosition;

    async function del() {
      Mavis.Comment._remove(id);
      await Mavis.Filter._loadData();
      Mavis.Inspection._filter(data);
      Mavis.Comment._toggle();
    }

    del();

  },

  _renderFunctions: status => {
    return new Promise((resolve, reject) => {
      let container = document.getElementById('commentFunctions'),
          functions = ['<button id="commentReset" class="ghost"><div class="icon iconRefresh"></div> zurücksetzen</button>'];
      if(status === 'new') {
        functions.push('<button id="commentCancel"><div class="icon iconCancel"></div> abbrechen</button>');
      } else {
        functions.push('<button id="commentRemove"><div class="icon iconTrash"></div> löschen</button>');
      }
      functions.push('<button id="commentSave" class="active"><div class="icon iconConfirm"></div> speichern</button>');
      container.innerHTML = functions.join('');

      document.getElementById('commentReset').addEventListener('click', Mavis.Comment._reset);
      if(status === 'new') {
        document.getElementById('commentCancel').addEventListener('click', Mavis.Comment._cancel);
      } else {
        document.getElementById('commentRemove').addEventListener('click', Mavis.Comment._delete);
      }
      document.getElementById('commentSave').addEventListener('click', Mavis.Comment._save);
      resolve();
    });
  },

  _toggle: () => {
    let container = document.getElementById('comment');
    if(container.classList.contains('hidden')) {
      container.classList.remove('hidden');
    } else {
      container.classList.add('hidden');
    }
  },

  _events: () => {
    return new Promise((resolve, reject) => {
      document.getElementById('commentCloseButton').addEventListener('click', Mavis.Comment._toggle);
      document.querySelectorAll('.commentImage').forEach((side) => {
        side.addEventListener('click', Mavis.Comment._selectSide);
      });
      document.getElementById('commentCasesSelection').addEventListener('change', Mavis.Comment._getCase);
      document.getElementById('commentRatingSelection').addEventListener('change', Mavis.Comment._getRating);
      document.getElementById('commentPositionInput').addEventListener('focusout', Mavis.Comment._getPosition);
      document.getElementById('commentDistanceInput').addEventListener('focusout', Mavis.Comment._getDistance);
      document.getElementById('commentFrequencyInput').addEventListener('focusout', Mavis.Comment._getValue);
      document.getElementById('commentTextInput').addEventListener('focusout', Mavis.Comment._getCaption);
      resolve();
    });
  },

  init: () => {
    return new Promise((resolve, reject) => {
      async function initialize() {
        await Mavis.Comment._renderButton();
        await Mavis.Comment._renderModal();
        console.log('comment init again');
        resolve();
      }
      initialize();
    });
  }
};

module.exports = Mavis.Comment;