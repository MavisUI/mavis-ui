const Mavis = require('../Global/Global');
const ColorPicker = require('expose-loader?ColorPicker!flexi-color-picker');

Mavis.Manual = {

  _inserts: [],
  _removes: [],
  _updates: [],

  _renderView: () => {
    return new Promise((resolve, reject) => {

      const container = document.getElementById('settingsContainerManual');

      let content = [
        '<ul id="settingsManualList" class="settingsList"></ul>',
        '<button id="settingsSaveManual" class="settingsSave">Einstellungen speichern</button>',
        '<button id="settingsResetManual" class="settingsReset">Einstellungen zurücksetzen</button>'
      ];

      container.innerHTML = content.join('');

      resolve();
    });
  },

  _add: () => {

    let id = Number(Mavis.Settings.Inserts.length),
        name = 'user' + document.querySelectorAll('#settingsManualList li').length;

    let marker = {
      active: true,
      chart: {
        pointInterval: 0,
        type: ""
      },
      color: '#000000',
      label: "Please set marker name",
      max: 0,
      metric: 0,
      min: 0,
      name: name,
      points: 1,
      steps: 1,
      threshMax: 0,
      threshMin: 0,
      type: "manual",
      _id: id
    };

    Mavis.Settings.Inserts.push(marker);
    Mavis.Manual._renderListItem(marker);
    Mavis.Manual._activateButtons();
  },
/*
  _update: (id, key, value) => {

    let isNew = false;

    if(Mavis.Manual._inserts.length) {
      Mavis.Manual._inserts.forEach(el => {
        if (el._id === Number(id)) {
          el[key] = value;
          isNew = true;
        }
      });
    }

    if(!isNew) {

      if(Mavis.Manual._updates.length) {

        let isUpdate = false;

        Mavis.Manual._updates.forEach((el, index) => {
          if(el._id === id) {
            el.updated[key] = value;
            isUpdate = true;
          }
        });

        if(!isUpdate) {

          let data = {};
          data._id = id;
          data.updated = {};
          data.updated[key] = value;
          Mavis.Manual._updates.push(data);

        }
      } else {

        let data = {};
        data._id = id;
        data.updated = {};
        data.updated[key] = value;
        Mavis.Manual._updates.push(data);
      }
    }
  },
*/
  _editTextStart: e => {
    let input = e.target,
        label = input.parentNode;

    label.querySelector('.textChange').classList.remove('hidden');
  },

  _editTextCancel: e => {
    let menu = e.target.parentNode,
        item = menu.parentNode.parentNode,
        input = item.querySelector('input'),
        id = item.getAttribute('id');

    Mavis.Data.Stores['modules']
      .find({_id: id})
      .then(el => {
        input.value = el[0].label;
        menu.classList.add('hidden');
      });
  },

  _editTextConfirm: e => {
    let menu = e.target.parentNode,
        item = menu.parentNode.parentNode,
        id = item.getAttribute('id'),
        input = item.querySelector('input');

    Mavis.Settings._update(id, 'label', input.value);
    menu.classList.add('hidden');
    Mavis.Settings._activateButtons();
  },

  _editMetrics: e => {

    let select = e.target,
        selected = select.selectedIndex,
        id = select.parentNode.parentNode.getAttribute('id');

    Mavis.Settings._update(id, 'metric', selected);
    Mavis.Settings._activateButtons();
  },

  _colorpicker: id => {

    let slide = 'cpSlide_' + id,
        picker = 'cpPicker_' + id,
        markerColorId = '#' + id + ' .markerColor .color';

    window.ColorPicker(
      document.getElementById(slide),
      document.getElementById(picker),
      function(hex, hsv, rgb) {
        document.querySelector(markerColorId).style.backgroundColor = hex;
        document.querySelector(markerColorId).setAttribute('data-color', hex);
      });
  },

  _changeColor: e => {
    e.target.parentNode.parentNode.parentNode.querySelector('.colorPickerMenu').classList.remove('hidden');
  },

  _changeColorCancel: e => {

    let menu = e.target.parentNode.parentNode,
        id = menu.parentNode.getAttribute('id'),
        markerColorId = '#' + id + ' .markerColor .color';

    Mavis.Data.Stores['modules']
      .find({_id: id})
      .then(el => {
        document.querySelector(markerColorId).style.backgroundColor = el[0].color;
        document.querySelector(markerColorId).setAttribute('data-color', el[0].color);
        menu.classList.add('hidden');
      });
  },

  _changeColorConfirm: e => {

    let menu = e.target.parentNode.parentNode,
        item = menu.parentNode,
        id = item.getAttribute('id'),
        color = item.querySelector('.markerColor .color').getAttribute('data-color');

    Mavis.Manual._update(id, 'color', color);
    Mavis.Manual._activateButtons();
    menu.classList.add('hidden');
  },

  _remove: id => {

    let list = document.getElementById('settingsManualList'),
        listItems = document.querySelectorAll('.marker.editable'),
        removedItem = '';

    Mavis.Manual._removes.push(id);

    listItems.forEach(item => {
      if(item.getAttribute('id') === id) {
        removedItem = item;
      }
    });

    list.removeChild(removedItem);
  },

  _removeConfirm: e => {

    let buttonConfirm = e.target.parentNode,
        trashMenu = buttonConfirm.parentNode,
        item = trashMenu.parentNode,
        id = item.getAttribute('id');

    trashMenu.classList.add('hidden');
    Mavis.Manual._remove(id);
    Mavis.Manual._activateButtons();
  },

  _removeCancel: e => {
    e.target.parentNode.parentNode.parentNode.querySelector('.trashMenu').classList.add('hidden');
  },

  _removeMenu: e => {
    Mavis.Notifications.notify(7);
    e.target.parentNode.parentNode.querySelector('.trashMenu').classList.remove('hidden');
  },

  _renderListItem: item => {

    let options = '',
        selected = '';

    Mavis.Data.Metrics.forEach((m, i) => {
      if(i === item.metric) {
        selected = 'selected';
      } else {
        selected = '';
      }
      options += '<option value="' + m._id + '" ' + selected + '>' + m.metric + '</option>';
    });

    let ul = document.getElementById('settingsManualList'),
        textMenu = '<div class="markerLabel"><input type="text" class="markerLabelInput" value="' + item.label + '"><div class="textChange hidden"><div class="icon iconCancel"></div><div class="icon iconConfirm"></div></div></div>',
        metricMenu = '<div  class="markerMetrics"><select name="markerMetrics" class="markerMetricsSelect">' + options + '</select></div>',
        markerColor = '<div class="markerColor"><div class="color changableColor" style="background-color: ' + item.color + ';"  data-color="' + item.color + '"><div class="icon iconEdit"></div></div></div>',
        trashCan = '<div class="markerDelete"><div class="icon iconTrash" data-id="' + item._id + '"></div></div>',
        cpMenu = '<menu class="colorPickerMenu hidden"><div id="cp_' + item._id + '" class="colorPicker"><div id="cpPicker_' + item._id + '" class="picker"></div><div id="cpSlide_' + item._id + '" class="slide"></div></div><button class="colorCancel"><div class="icon iconCancel"></div></button><button class="colorConfirm"><div class="icon iconConfirm"></div></button></menu>',
        trashMenu = '<menu class="trashMenu hidden"><button class="trashCancel"><div class="icon iconCancel"></div></button><button class="trashConfirm"><div class="icon iconConfirm"></div></button></menu>';

    // assemble all elements into li item
    let li = document.createElement("li");
    li.setAttribute('id', item._id);
    li.setAttribute('class', 'marker editable');
    li.innerHTML = textMenu + metricMenu + markerColor + trashCan + cpMenu + trashMenu;

    // event listeners;

    // edit text start
    li.querySelector('.markerLabelInput').addEventListener('keyup', Mavis.Manual._editTextStart);

    // edit text cancel
    li.querySelector('.textChange .iconCancel').addEventListener('click', Mavis.Manual._editTextCancel);

    // edit text cancel
    li.querySelector('.textChange .iconConfirm').addEventListener('click', Mavis.Manual._editTextConfirm);

    // edit metrics
    li.querySelector('.markerMetricsSelect').addEventListener('change', Mavis.Manual._editMetrics);

    // user clicks on color to change it, show ColorPicker
    li.querySelector('.color').addEventListener('click', Mavis.Manual._changeColor);

    // user cancels color change
    li.querySelector('.colorCancel').addEventListener('click', Mavis.Manual._changeColorCancel);

    // user accepts color change
    li.querySelector('.colorConfirm').addEventListener('click', Mavis.Manual._changeColorConfirm);

    // show remove menu
    li.querySelector('.markerDelete').addEventListener('click', Mavis.Manual._removeMenu);

    // remove cancel
    li.querySelector('.trashCancel').addEventListener('click', Mavis.Manual._removeCancel);

    // remove confirm
    li.querySelector('.trashConfirm').addEventListener('click', Mavis.Manual._removeConfirm);


    // append li item to list
    let addButton = document.getElementById('settingsAddManual');
    ul.insertBefore(li, addButton);

    // init colorpicker
    Mavis.Manual._colorpicker(item._id);
  },

  _renderList: () => {
    return new Promise((resolve, reject) => {

      Mavis.Data.Stores['modules']
        .find({type: 'manual'})
        .sort({label: 1})
        .then(modules => {
          modules.forEach((item, i) => {
            Mavis.Manual._renderListItem(item);
          });

          resolve();
        });
    });
  },

  _renderAddButton: () => {
    return new Promise((resolve, reject) => {

      let ul = document.getElementById('settingsManualList'),
        addMarker = document.createElement('li');

      addMarker.setAttribute('class', 'addMarker');
      addMarker.setAttribute('id', 'settingsAddManual');
      addMarker.innerHTML = '<a id="settingsAddManualButton">Merkmal hinzufügen <div class="icon iconPlus"></div></a>';
      addMarker.addEventListener('click', Mavis.Manual._add);

      ul.appendChild(addMarker);

      resolve();
    });
  },

  _deactiveButtons: () => {

    let saveButton = document.getElementById('settingsSaveManual');
    saveButton.classList.remove('confirm');
    saveButton.removeEventListener('click', Mavis.Manual._save);

    let resetButton = document.getElementById('settingsResetManual');
    resetButton.classList.remove('reset');
    resetButton.removeEventListener('click', Mavis.Manual._reset);

  },

  _activateButtons: () => {

    let saveButton = document.getElementById('settingsSaveManual');
    saveButton.classList.add('confirm');
    saveButton.addEventListener('click', Mavis.Manual._save);

    let resetButton = document.getElementById('settingsResetManual');
    resetButton.classList.add('reset');
    resetButton.addEventListener('click', Mavis.Manual._reset);

  },

  _save: e => {

    Mavis.Manual._deactiveButtons();

    if(Mavis.Manual._inserts.length) {
      Mavis.Manual._inserts.forEach(el => {
        let data = {};
        data.active = el.active;
        data.chart = el.chart;
        data.color = el.color;
        data.label = el.label;
        data.max = el.max;
        data.metric = el.metric;
        data.min = el.min;
        data.name = el.name;
        data.points = el.points;
        data.steps = el.steps;
        data.threshMax = el.threshMax;
        data.threshMin = el.threshMin;
        data.type = el.type;

        Mavis.Data.Stores['modules']
          .insert(data);
      });
    }

    if(Mavis.Manual._removes.length) {
      Mavis.Manual._removes.forEach(id => {
        Mavis.Data.Stores['modules']
          .remove({_id: id});
      });
    }

    if(Mavis.Manual._updates.length) {
      Mavis.Manual._updates.forEach(el => {
        Mavis.Data.Stores['modules']
          .update({_id: el._id}, {$set: el.updated});
      });
    }

    Mavis.Manual._inserts = [];
    Mavis.Manual._removes = [];
    Mavis.Manual._updates = [];

    document.getElementById('settingsManualList').innerHTML = '';
    Mavis.Manual._renderAddButton()
      .then(Mavis.Manual._renderList());
  },

  _reset: () => {

    Mavis.Manual._deactiveButtons();

    Mavis.Manual._inserts = [];
    Mavis.Manual._removes = [];
    Mavis.Manual._updates = [];

    document.getElementById('settingsManualList').innerHTML = '';
    Mavis.Manual._renderAddButton()
      .then(Mavis.Manual._renderList());
  },

  init: () => {
    return new Promise((resolve, reject) =>{
      Promise.all([
        Mavis.Manual._renderView(),
        Mavis.Manual._renderAddButton(),
        Mavis.Manual._renderList()
      ]).then(() => {
        resolve();
      });
    });
  }
};

module.exports = Mavis.Manual;