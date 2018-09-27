const Mavis = require('../Global/Global');
const ColorPicker = require('expose-loader?ColorPicker!flexi-color-picker');

Mavis.Manual = {

  Data: [],
  Deleted: [],

  _loadData: () => {
    return new Promise((resolve, reject) => {
      Mavis.Data.Stores['modules']
        .find({type: 'manual'})
        .sort({index: 1})
        .then(results => {
          Mavis.Manual.Data = results;
          resolve();
        });
    });
  },

  _renderView: () => {
    return new Promise((resolve, reject) => {
      const container = document.getElementById('settingsContainerManual');
      let content = [
        '<ul id="settingsManualList" class="settingsList"></ul>',
        '<button id="settingsResetManual" class="settingsReset"><div class="icon iconRefresh"></div> zurücksetzen</button>',
        '<button id="settingsSaveManual" class="settingsSave"><div class="icon iconConfirm"></div> speichern</button>'
      ];
      container.innerHTML = content.join('');
      resolve();
    });
  },

  _getMetrics: item => {
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
    return options;
  },

  _colorpickers: data => {
    let item = document.getElementById(data._id),
        picker = item.querySelector('.picker'),
        slide = item.querySelector('.slide'),
        _id = 'col_' + data._id;
    window.ColorPicker(slide, picker,
      (hex, hsv, rgb) => {
        document.getElementById(_id).style.backgroundColor = hex;
        document.getElementById(_id).setAttribute('data-color', hex);
      });
  },

  _generateItem: item => {
    let ul = document.getElementById('settingsManualList'),
        textMenu = '<div class="markerLabel"><input type="text" class="markerLabelInput" value="' + item.label + '"><div class="textChange hidden"><div class="icon iconCancel"></div><div class="icon iconConfirm"></div></div></div>',
        metricMenu = '<div  class="markerMetrics"><select name="markerMetrics" class="markerMetricsSelect">' + Mavis.Manual._getMetrics(item) + '</select></div>',
        markerColor = '<div class="markerColor"><div id="col_' + item._id + '" class="color changableColor" style="background-color: ' + item.color + ';"  data-color="' + item.color + '"><div class="icon iconEdit"></div></div></div>',
        trashCan = '<div class="markerDelete"><div class="icon iconTrash" data-id="' + item._id + '"></div></div>',
        cpMenu = '<menu class="colorPickerMenu hidden"><div id="cp_' + item._id + '" class="colorPicker" data-id="' + item._id + '" data-color="' + item.color + '"><div id="cpPicker_' + item._id + '" class="picker"></div><div id="cpSlide_' + item._id + '" class="slide"></div></div><button class="colorCancel"><div class="icon iconCancel"></div></button><button class="colorConfirm"><div class="icon iconConfirm"></div></button></menu>',
        trashMenu = '<menu class="trashMenu hidden"><button class="trashCancel"><div class="icon iconCancel"></div></button><button class="trashConfirm"><div class="icon iconConfirm"></div></button></menu>';
    let li = document.createElement("li");
    li.setAttribute('id', item._id);
    li.setAttribute('data-index', item.index);
    li.setAttribute('class', 'marker editable');
    li.innerHTML = textMenu + metricMenu + markerColor + trashCan + cpMenu + trashMenu;
    return li;
  },

  _renderList: () => {
    return new Promise((resolve, reject) => {
      document.getElementById('settingsManualList').innerHTML = '';
      Mavis.Manual.Data.forEach((module, index) => {
        module.index = index;
        document.getElementById('settingsManualList').appendChild(Mavis.Manual._generateItem(module));
        Mavis.Manual._colorpickers(module);
        Mavis.Manual._itemEvents(module);
      });
      resolve();
    });
  },

  _renderAddButton: () => {
    return new Promise((resolve, reject) => {
      let ul = document.getElementById('settingsManualList'),
          addMarker = document.createElement('li');
      addMarker.setAttribute('class', 'addMarker');
      addMarker.setAttribute('id', 'settingsAddManual');
      addMarker.innerHTML = '<a id="settingsAddManualButton">Merkmal hinzufügen <div class="icon iconPlus"></div></a>';
      ul.appendChild(addMarker);
      resolve();
    });
  },

  _activateButtons: () => {
    let saveButton = document.getElementById('settingsSaveManual');
    saveButton.classList.add('active');
    let resetButton = document.getElementById('settingsResetManual');
    resetButton.classList.add('active');
  },

  _deactivateButtons: () => {
    let saveButton = document.getElementById('settingsSaveManual');
    saveButton.classList.remove('active');
    let resetButton = document.getElementById('settingsResetManual');
    resetButton.classList.remove('active');
  },

  _add: e => {
    let id = Number(Mavis.Manual.Data.length),
        name = 'user' + id,
        data = {
          active: true,
          chart: {
            pointInterval: 0,
            type: ""
          },
          color: '#000000',
          index: id,
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
    let item = Mavis.Manual._generateItem(data),
        list = document.getElementById('settingsManualList'),
        addButton = document.getElementById('settingsAddManual');
    list.insertBefore(item, addButton);
    Mavis.Manual.Data.push(data);
    Mavis.Manual._colorpickers(data);
    Mavis.Manual._itemEvents(data);
  },

  _editText: e => {
    let input = e.target,
        label = input.parentNode;
    label.querySelector('.textChange').classList.remove('hidden');
  },

  _editTextCancel: e => {
    let menu = e.target.parentNode,
        item = menu.parentNode.parentNode,
        index = Number(item.getAttribute('data-index')),
        input = item.querySelector('.markerLabelInput');
    input.value = Mavis.Manual.Data[index].label;
    menu.classList.add('hidden');
  },

  _editTextConfirm: e => {
    let menu = e.target.parentNode,
        item = menu.parentNode.parentNode,
        index = Number(item.getAttribute('data-index')),
        input = item.querySelector('.markerLabelInput');

    Mavis.Manual.Data[index].label = input.value;
    menu.classList.add('hidden');
    Mavis.Manual._activateButtons();
  },

  _editMetric: e => {
    let select = e.target,
        selected = select.selectedIndex,
        index = select.parentNode.parentNode.getAttribute('data-index');
    Mavis.Manual.Data[index].metric = selected;
    Mavis.Manual._activateButtons();
  },

  _editColor: e => {
    e.target.parentNode.parentNode.parentNode.querySelector('.colorPickerMenu').classList.remove('hidden');
  },

  _editColorCancel: e => {
    let menu = e.target.parentNode.parentNode,
        id = menu.parentNode.getAttribute('id'),
        index = menu.parentNode.getAttribute('data-index'),
        _id = 'col_' + id;
    document.getElementById(_id).style.backgroundColor = Mavis.Manual.Data[index].color;
    document.getElementById(_id).setAttribute('data-color', Mavis.Manual.Data[index].color);
    menu.classList.add('hidden');
  },

  _editColorConfirm: e => {
    let menu = e.target.parentNode.parentNode,
        item = menu.parentNode,
        index = item.getAttribute('data-index'),
        color = item.querySelector('.markerColor .color').getAttribute('data-color');
    Mavis.Manual.Data[index].color = color;
    menu.classList.add('hidden');
    Mavis.Manual._activateButtons();
  },

  _remove: id => {
    let list = document.getElementById('settingsManualList'),
        item = document.getElementById(id),
        arrIndex = 0;
    Mavis.Manual.Data.forEach((module, i) => {
      if(module._id === id) {
        arrIndex = i;
      }
    });

    Mavis.Manual.Data.splice(arrIndex, 1);
    if(Mavis.Manual.Deleted.indexOf(id) < 0 && id.length > 4) {
      Mavis.Manual.Deleted.push(id);
    }
    list.removeChild(item);
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

  _insert: data => {
    delete data._id;
    Mavis.Data.Stores['modules'].insert(data);
  },

  _update: data => {
    Mavis.Data.Stores['modules']
      .update(
        {_id: data._id},
        {$set:
          {
            color: data.color,
            index: data.index,
            label: data.label,
            metric: data.metric,
            name: data.name
          }
        });
  },

  _delete: () => {
    return new Promise((resolve, reject) => {
      Mavis.Manual.Deleted.forEach(id => {
        Mavis.Data.Stores['modules'].remove({_id: id});
      });
      resolve();
    });
  },

  _save: () => {
    Mavis.Manual.Data.forEach(module => {
      if(module._id.length > 4) {
        Mavis.Manual._update(module);
      } else {
        Mavis.Manual._insert(module);
      }
    });

    async function saveAll() {
      await Mavis.Manual._delete();
      Mavis.Manual.init();
    }
    saveAll();
  },

  _itemEvents: item => {

    let li = document.getElementById(item._id);

    // edit text start
    li.querySelector('.markerLabelInput').addEventListener('keyup', Mavis.Manual._editText);

    // edit text cancel
    li.querySelector('.textChange .iconCancel').addEventListener('click', Mavis.Manual._editTextCancel);

    // edit text confirm
    li.querySelector('.textChange .iconConfirm').addEventListener('click', Mavis.Manual._editTextConfirm);

    // edit metrics
    li.querySelector('.markerMetricsSelect').addEventListener('change', Mavis.Manual._editMetric);

    // user clicks on color to change it, show ColorPicker
    li.querySelector('.color').addEventListener('click', Mavis.Manual._editColor);

    // user cancels color change
    li.querySelector('.colorCancel').addEventListener('click', Mavis.Manual._editColorCancel);

    // user accepts color change
    li.querySelector('.colorConfirm').addEventListener('click', Mavis.Manual._editColorConfirm);

    // show remove menu
    li.querySelector('.markerDelete').addEventListener('click', Mavis.Manual._removeMenu);

    // remove cancel
    li.querySelector('.trashCancel').addEventListener('click', Mavis.Manual._removeCancel);

    // remove confirm
    li.querySelector('.trashConfirm').addEventListener('click', Mavis.Manual._removeConfirm);

  },

  _events: () => {
    return new Promise((resolve, reject) => {

      // add new button
      document.getElementById('settingsAddManual').addEventListener('click', Mavis.Manual._add);

      // reset form
      document.getElementById('settingsResetManual').addEventListener('click', Mavis.Manual.init);

      // save form
      document.getElementById('settingsSaveManual').addEventListener('click', Mavis.Manual._save);

      resolve();
    });
  },

  init: () => {
    return new Promise((resolve, reject) =>{

      Mavis.Manual.Deleted = [];
      Mavis.Manual.Data = [];

      async function initialize() {
        await Mavis.Manual._loadData();
        await Mavis.Manual._renderView();
        await Mavis.Manual._renderList();
        await Mavis.Manual._renderAddButton();
        await Mavis.Manual._events();
        resolve();
      }
      initialize();
    });
  }
};

module.exports = Mavis.Manual;