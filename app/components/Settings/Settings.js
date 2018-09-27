const Mavis = require('../Global/Global');
const Manual = require('./Manual');
const Presets = require('./Presets');
const Procedures = require('./Procedures');
const Users = require('./Users');

Mavis.Settings = {

	Pending: false,
  Inserts: [],
  Removes: [],
  Updates: [],

  _renderView: () => {
    return new Promise((resolve, reject) => {
      const container = document.getElementById('content');
      let content = [
        '<div id="settings">',
          '<div class="inner">',
            '<div id="settingsContainer"></div>',
          '</div>',
        '</div>'
      ];
      container.innerHTML = content.join('');
      resolve();
    });
  },

  _renderTabs: () => {
    return new Promise((resolve, reject) => {
      let container = document.getElementById('settingsContainer');
      container.innerHTML = '';
      let modules = ['Manual', 'Presets', 'Procedures', 'Users'],
          labels = ['Custom', 'Presets', 'Verfahren', 'User'];
      Mavis.Global.tabs('settingsContainer', labels, modules, 12);
      resolve();
    });
  },

  _update: (id, key, value) => {

    let isNew = false;

    if(Mavis.Settings.Inserts.length) {
      Mavis.Settings.Inserts.forEach(el => {
        if (el._id === Number(id)) {
          el[key] = value;
          isNew = true;
        }
      });
    }

    if(!isNew) {

      if(Mavis.Settings.Updates.length) {

        let isUpdate = false;

        Mavis.Settings.Updates.forEach((el, index) => {
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
          Mavis.Settings.Updates.push(data);

        }
      } else {

        let data = {};
        data._id = id;
        data.updated = {};
        data.updated[key] = value;
        Mavis.Settings.Updates.push(data);
      }
    }
  },



  init: () => {

    return new Promise((resolve, reject) => {
      document.getElementById('content').setAttribute('data-tab', 'Manual');
      Promise.all([
        Mavis.Settings._renderView(),
        Mavis.Settings._renderTabs(),
        Mavis.Manual.init(),
        Mavis.Presets.init(),
        Mavis.Procedures.init()
      ])
      .then(() => {
        console.log('init Settings');
        resolve();
      })
    });
  }
};

module.exports = Mavis.Settings;