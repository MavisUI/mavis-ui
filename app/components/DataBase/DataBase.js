const Mavis = require('../Global/Global');

Mavis.DataBase = {

  Store: {},

  _initStore: () => {

    return new Promise(function(resolve, reject) {

      let Datastore = require('nedb'),
        DataPath = App.Global.path + '/assets/data/' + name + '.db';

      Mavis.Data.Stores[name] = new Datastore({filename: DataPath});
      Mavis.Data.Stores[name].loadDatabase();

      resolve();
    });
  },

  init: () => {

    return new Promise(function(resolve, reject) {

      console.log('init DataBase');

      Mavis.DataBase._initStore()
        .then(resolve());
    });
  }
};

module.exports = Mavis.DataBase;