const Mavis = require('../Global/Global');

Mavis.Presets = {

  _renderList: () => {
    return new Promise((resolve, reject) => {
      let container = document.getElementById('settingsContainerPresets');
      container.innerHTML = '<ul id="settingsPresetsList" class="settingsList"></ul>';
      resolve();
    });
  },

  _renderItems: () => {
    return new Promise((resolve, reject) => {

      let ul = document.getElementById('settingsPresetsList');

      Mavis.Data.Stores['modules']
        .find({type: 'din'})
        .sort({label: 1})
        .then(modules => {
          modules.forEach((module, i) => {

            let textMenu = '<div class="markerLabel"><input disabled type="text" class="markerLabelInput" value="' + module.label + '"></div>';
            let metric = '<div class="markerMetrics">' + Mavis.Data.Metrics[module.metric].metric + '</div>';
            let markerColor = '<div class="markerColor"><div class="color" style="background-color: ' + module.color + ';"></div></div>';

            // assemble all elements into li item
            let li = document.createElement("li");
            li.setAttribute('id', module.name);
            li.setAttribute('class', 'marker');
            li.setAttribute('data-id', i);
            li.innerHTML = textMenu + metric + markerColor;

            // append li item to list
            ul.appendChild(li);
          });
        })
        .then(() => {
          resolve();
        });
    });
  },

  init: () => {
    return new Promise((resolve, reject) =>{
      Promise.all([
        Mavis.Presets._renderList(),
        Mavis.Presets._renderItems()
      ])
        .then(() => {
          resolve();
      });
    });
  }
};

module.exports = Mavis.Presets;