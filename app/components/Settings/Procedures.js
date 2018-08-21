const Mavis = require('../Global/Global');

Mavis.Procedures = {

  _updates: [],

  _setRangeBar: (name, min, max, threshMin, threshMax) => {

    let barSelector = name + 'SliderBar',
      bar = document.getElementById(barSelector),
      barLeft = Math.round((threshMin / Number(max)) * 100),
      barRight = Math.round(((Number(max) - threshMax) / Number(max)) * 100),
      barLength = 100 - barLeft - barRight;

    bar.style.width = barLength + '%';
    bar.style.left = barLeft + '%';
  },

  _render: () => {

    return new Promise((resolve, reject) => {

      // get container
      let container = document.getElementById('settingsContainerProcedures'),
          content = [
            '<div id="settingsProcedures"></div>',
            '<button id="settingsSaveProcedures" class="settingsSave">Einstellungen speichern</button>',
            '<button id="settingsResetProcedures" class="settingsReset">Einstellungen zurücksetzen</button>'
          ];

      container.innerHTML = content.join('');

      Mavis.Data.Stores['modules']
        .find({type: 'automatic'})
        .then(modules => {

          modules.forEach((mod, i) => {

            let activity = (mod.active) ? 'active':'inactive';

            let content = [
              '<div class="activate">',
                '<label for="' + mod.name + 'Activate">' + mod.label + '</label>',
                '<button id="' + mod.name + 'Switch" class="switchButton ' + activity + '" data-id="' + mod._id + '" data-name="' + mod.name + '" data-active="' + mod.active + '">',
                  '<div class="switchLid"></div>',
                '</button>',
              '</div>',
              '<div class="settings ' + activity + '">',
                '<label>Schwellen (' + Mavis.Data.Metrics[mod.metric].metric + ')</label>',
                '<input type="number" id="' + mod.name + 'ThreshMeterMin" class="threshCurrentValueMin" data-module="' + mod.name + '" data-id="' + i + '" data-mom="min" value="' + mod.threshMin + '">',
                '<div class="threshSlider">',
                  '<input type="range" id="' + mod.name + 'ThreshMin" class="thresholdMin" data-value="' + mod.threshMin + '" data-module="' + mod.name + '" data-id="' + i + '" data-mom="min" min="' + mod.min + '" max="' + mod.max + '" value="' + mod.threshMin + '" step="' + mod.steps + '"/>',
                  '<input type="range" id="' + mod.name + 'ThreshMax" class="thresholdMax" data-value="' + mod.threshMax + '" data-module="' + mod.name + '" data-id="' + i + '" data-mom="max" min="' + mod.min + '" max="' + mod.max + '" value="' + mod.threshMax + '" step="' + mod.steps + '" />',
                  '<div id="' + mod.name + 'SliderBar" class="sliderBar" style="width: 100%; left: 0;"></div>',
                '</div>',
                '<input type="number" id="' + mod.name + 'ThreshMeterMax" class="threshCurrentValueMax" data-module="' + mod.name + '" data-id="' + i + '" data-mom="max" value="' + mod.threshMax + '">',
              '</div>'
            ];

            let testModule = document.createElement('div');
            testModule.setAttribute('id', mod.name);
            testModule.classList.add('testModule');
            testModule.innerHTML = content.join('');

            // append modules to container
            document.getElementById('settingsProcedures').appendChild(testModule);

            // set range slider values
            Mavis.Procedures._setRangeBar(mod.name, mod.min, mod.max, mod.threshMin, mod.threshMax);

          });

          resolve();
        });
    });
  },

  _toggleSettings: (button, name, state) => {

    let _settings = '#' + name + ' .settings',
        settings = document.querySelector(_settings),
        _state = false,
        _class = 'inactive';

    if(state) {
      _state = true;
      _class = 'active';
    }

    button.setAttribute('class', 'switchButton ' + _class);
    button.setAttribute('data-active', _state);
    settings.setAttribute('class', 'settings ' + _class);
  },

  _activateModule: e => {

    let button = e.target;
    if(e.target.classList.contains('switchLid')) button = e.target.parentNode;

    let moduleActive = button.getAttribute('data-active'),
        moduleName = button.getAttribute('data-name');

//    if(Mavis.Data.Stores[moduleName]) {

      if(moduleActive === 'true') {

        Mavis.Procedures._toggleSettings(button, moduleName, false);

      } else {

        Mavis.Procedures._toggleSettings(button, moduleName, true);

      }

//      Mavis.Settings._activateSaveButton();

//    } else {
//      Mavis.Notifications.notify(3);
//    }

  },

  _events: () => {
    return new Promise((resolve, reject) => {

      let switches = document.querySelectorAll('.switchButton'),
          threshMin = document.querySelectorAll('.thresholdMin'),
          threshMax = document.querySelectorAll('.thresholdMax'),
          labelsMin = document.querySelectorAll('.threshCurrentValueMin'),
          labelsMax = document.querySelectorAll('.threshCurrentValueMax');

      switches.forEach(_switch => {
        _switch.addEventListener('click', Mavis.Procedures._activateModule);
      });


/*




      threshMin.forEach(function(slider, i) {

        slider.addEventListener('mousedown', function() {
          slider.addEventListener('mousemove', Mavis.Settings.Modules._handleSlider);
        });

        slider.addEventListener('mouseup', function() {

          slider.removeEventListener('mousemove', Mavis.Settings.Modules._handleSlider);

          let 	i = Number(slider.getAttribute('data-id')),
            data = Mavis.Data.Settings.automatic[i],
            valid = Mavis.Settings.Modules._validateMinThresh(i, slider.value);

          if(valid) {
            Mavis.Data.Settings.automatic[i].threshMin = Number(slider.value);
            Mavis.Settings._activateSaveButton();
          } else {
            slider.value = data.threshMin;
            Mavis.Settings.Modules._resetSlider(slider);
          };
        });
      });

      threshMax.forEach(function(slider, i) {

        slider.addEventListener('mousedown', function() {
          slider.addEventListener('mousemove', Mavis.Settings.Modules._handleSlider);
        });

        slider.addEventListener('mouseup', function() {

          slider.removeEventListener('mousemove', Mavis.Settings.Modules._handleSlider);

          let 	i = Number(slider.getAttribute('data-id')),
            data = Mavis.Data.Settings.automatic[i],
            valid = Mavis.Settings.Modules._validateMaxThresh(i, slider.value);

          if(valid) {
            Mavis.Data.Settings.automatic[i].threshMax = Number(slider.value);
            Mavis.Settings._activateSaveButton();
          } else {
            slider.value = data.threshMax;
            Mavis.Settings.Modules._resetSlider(slider);
          }
        });
      });

      labelsMin.forEach(function(label, i) {
        label.addEventListener('input', Mavis.Settings.Modules._handleLabels);
      });

      labelsMax.forEach(function(label, i) {
        label.addEventListener('input', Mavis.Settings.Modules._handleLabels);
      });

*/
      resolve();
    });
  },

  init: () => {
    return new Promise((resolve, reject) =>{

      Mavis.Procedures._render()
        .then(() => {
          Mavis.Procedures._events()
            .then(resolve());
        });
    });
  }
};

module.exports = Mavis.Procedures;


  /*



            _validateMinThresh: function(i, val) {

                let 	valid = true,
                        data = Mavis.Data.Settings.automatic[i];

                if(val < data.min || val >= data.threshMax) {
                    valid = false;
                }

                return valid;
            },

            _validateMaxThresh: function(i, val) {

                let 	valid = true,
                        data = Mavis.Data.Settings.automatic[i];

                if(val <= data.threshMin || val > data.max) {
                    valid = false;
                }

                return valid;
            },



            _setLabels: function(i, min, max) {

                let 	labelMinSelect = Mavis.Data.Settings.automatic[i].name + 'ThreshMeterMin',
                        labelMin = document.getElementById(labelMinSelect),
                        labelMaxSelect = Mavis.Data.Settings.automatic[i].name + 'ThreshMeterMax',
                        labelMax = document.getElementById(labelMaxSelect);

                labelMin.value = min;
                labelMax.value = max;
            },

            _handleLabels: function() {

                let 	i = Number(this.getAttribute('data-id')),
                        data = Mavis.Data.Settings.automatic[i],
                        valid;

                if(this.classList.contains('threshCurrentValueMin')) {

                    valid = Mavis.Settings.Modules._validateMinThresh(i, this.value);

                    if(valid) {

                        // set Slider
                        let sliderSelector = data.name + 'ThreshMin';
                        document.getElementById(sliderSelector).value = this.value;

                        // set sliderBar
                        Mavis.Settings.Modules._setRangeBar(i, this.value, data.threshMax);

                        // set data value
                        Mavis.Data.Settings.automatic[i].threshMin = Number(this.value);

                        // enable user to safe
                        Mavis.Settings._activateSaveButton();

                    } else {

                        this.value = data.threshMin;
                    }

                } else {

                    valid = Mavis.Settings.Modules._validateMaxThresh(i, this.value);

                    if(valid) {

                        // set Slider
                        let sliderSelector = data.name + 'ThreshMax';
                        document.getElementById(sliderSelector).value = this.value;

                        // set sliderBar
                        Mavis.Settings.Modules._setRangeBar(i, data.threshMin, this.value);

                        // set data value
                        Mavis.Data.Settings.automatic[i].threshMax = Number(this.value);

                        // enable user to safe
                        Mavis.Settings._activateSaveButton();

                    } else {

                        this.value = data.threshMax;
                    }
                }
            },



            _handleSlider: function() {

                let 	i = Number(this.getAttribute('data-id')),
                        data = Mavis.Data.Settings.automatic[i];

                if(this.classList.contains('thresholdMin')) {

                    // set sliderBar
                    Mavis.Settings.Modules._setRangeBar(i, this.value, data.threshMax);

                    // set labels
                    Mavis.Settings.Modules._setLabels(i, this.value, data.threshMax);

                } else {

                    // set sliderBar
                    Mavis.Settings.Modules._setRangeBar(i, data.threshMin, this.value);

                    // set labels
                    Mavis.Settings.Modules._setLabels(i, data.threshMin, this.value);
                }
            },

            _resetSlider: function(el) {

                // get min and max
                let 	i = Number(el.getAttribute('data-id')),
                        data = Mavis.Data.Settings.automatic[i];

                // set sliderBar
                Mavis.Settings.Modules._setRangeBar(i, data.threshMin, data.threshMax);

                // set textfield value
                Mavis.Settings.Modules._setLabels(i, data.threshMin, data.threshMax);

            },


  */
