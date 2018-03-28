const Mavis = require('../Global/Global');
const ColorPicker = require('expose-loader?ColorPicker!flexi-color-picker');

Mavis.Settings = {

	Pending: false,

	Marker: {

		_createList: function() {
			return new Promise(function(resolve, reject) {

				const container = document.getElementById('settingsContainerMarker');

				let list = document.createElement('ul');
				list.setAttribute('id', 'usergeneratedMarkersList');

				container.innerHTML = '';
				container.appendChild(list);

				resolve();
			});
		},

		// init color picker on every list item
		_colorpicker: function(tag) {

			let 	slide = tag + 'Slide',
					picker = tag + 'Picker',
					color = '#' + tag + ' .markerColor .color',
					markerColor = document.querySelector(color);

			window.ColorPicker(
				document.getElementById(slide),
				document.getElementById(picker),
				function(hex, hsv, rgb) {
					markerColor.style.backgroundColor = hex;
					markerColor.setAttribute('data-color', hex);
			});
		},

		_renderDinMarkers: function() {
			return new Promise(function(resolve, reject) {

				const ul = document.getElementById('usergeneratedMarkersList'),
						markers = Mavis.Data.Settings.din,
						metrics = Mavis.Data.Settings.metrics;

				markers.forEach(function(item, i) {

					let 	textMenu = '<div class="markerLabel"><input disabled type="text" class="markerLabelInput" value="' + item.label + '"></div>',
							metric = '<div class="markerMetrics">' + metrics[item.metric] + '</div>',
							markerColor = '<div class="markerColor"><div class="color" style="background-color: ' + item.color + ';"></div></div>';

					// assemble all elements into li item
					let li = document.createElement("li");
					li.setAttribute('id', item.name);
					li.setAttribute('class', 'marker');
					li.setAttribute('data-id', i);
					li.innerHTML = textMenu + metric + markerColor;

					// append li item to list
					ul.appendChild(li);
				});

				resolve();
			});
		},

		_renderManualMarkers: function() {
			return new Promise(function(resolve, reject) {

				const ul = document.getElementById('usergeneratedMarkersList'),
						markers = Mavis.Data.Settings.manual,
						metrics = Mavis.Data.Settings.metrics;

				markers.forEach(function(item, i) {

					// get values from data
					let units = '';

					// create units dropdown and mark active as selected
					metrics.forEach(function(metric, m) {
						// if metric matches

						if(metrics[item.metric] === metric) {
							// mark this as selected and add it to container
							units += '<option value="' + m + '" selected>' + metrics[m] + '</option>';
						} else {
							// else just add it to container
							units += '<option value="' + m + '">' + metrics[m] + '</option>';
						}
					});

					let	textMenu = '<div class="markerLabel"><input type="text" class="markerLabelInput" value="' + item.label + '"><div class="textChange hidden"><div class="icon iconCancel"></div><div class="icon iconConfirm"></div></div></div>',
							metricMenu = '<div  class="markerMetrics"><select name="markerMetrics" class="markerMetricsSelect">' + units + '</select></div>',
							markerColor = '<div class="markerColor"><div class="color changableColor" style="background-color: ' + item.color + ';"  data-color="' + item.color +'"><div class="icon iconEdit"></div></div></div>',
							trashCan = '<div class="markerDelete"><div class="icon iconTrash"></div></div>',
							cpMenu = '<menu class="colorPickerMenu hidden"><div id="' + item.name + 'ColorPicker" class="colorPicker"><div id="' + item.name + 'Picker" class="picker"></div><div id="' + item.name + 'Slide" class="slide"></div></div><button class="colorCancel"><div class="icon iconCancel"></div></button><button class="colorConfirm"><div class="icon iconConfirm"></div></button></menu>',
							trashMenu = '<menu class="trashMenu hidden"><button class="trashCancel"><div class="icon iconCancel"></div></button><button class="trashConfirm"><div class="icon iconConfirm"></div></button></menu>';


					// assemble all elements into li item
					let li = document.createElement("li");
					li.setAttribute('id', item.name);
					li.setAttribute('class', 'marker editable');
					li.setAttribute('data-id', i);
					li.innerHTML = textMenu + metricMenu + markerColor + trashCan + cpMenu + trashMenu;

					// append li item to list
					ul.appendChild(li);

					// init colorpicker
					Mavis.Settings.Marker._colorpicker(item.name);
				});

				resolve();
			});
		},

		_renderAddMarkerButton: function() {
			return new Promise(function(resolve, reject) {

				// create and add an 'add-new-marker' button to list;

				const ul = document.getElementById('usergeneratedMarkersList');

				let addMarker = document.createElement('li');

				addMarker.setAttribute('class', 'addMarker');
				addMarker.innerHTML = '<a id="usergeneratedAddMarker">Merkmal hinzufügen <div class="icon iconPlus"></div></a>',

				ul.appendChild(addMarker);

				resolve();
			});
		},

		_add: function() {

			// get current length of usergenerated markers array
			let n = Mavis.Data.Settings.manual.length + 1;

			// assemble new blank marker
			let marker = {};
			marker.active = true;
			marker.color = '#104784';
			marker.index = n;
			marker.label = 'Neues Merkmal';
			marker.max = 0;
			marker.metric = 0;
			marker.min = 0;
			marker.name = 'user' + n;
			marker.points = 1;
			marker.steps = 1;
			marker.threshMax = 0;
			marker.threshMin = 0;

			// push new marker into config data
			Mavis.Data.Settings.manual.push(marker);

			// add new blank array in results data
			let 	item = '{"above_thresh":[],"all": [],"below_thresh": []}',
					obj = JSON.parse(item);

			Mavis.Data.CableData.forEach(function(cable, i) {

				cable.modules.manual.push(obj);
			});

			// re-render list
			Mavis.Settings.Marker._init();

			// activate safe action
			Mavis.Settings._activateSaveButton();
		},

		// delete list item
		_delete: function(n) {

			// remove data from cable
			Mavis.Data.CableData.forEach(function(cable, i) {
				cable.modules.manual.splice(n, 1);
			});

			// remove marker from data
			Mavis.Data.Settings.manual.splice(n);

			// refresh list ids
			Mavis.Data.Settings.manual.forEach(function(el, i) {

				el.index = i;
				el.name = 'user' + i;
			});

			// re-render list
			Mavis.Settings.Marker._init();

			// get user to safe data
			Mavis.Settings._activateSaveButton();
		},

		_events: function() {
			return new Promise(function(resolve, reject) {

				// user focusses on label-text
				let markers = document.querySelectorAll('.marker.editable');

				markers.forEach(function(marker, i) {

					// user sets focus on input and textMenu shows
					marker.querySelector('.markerLabelInput').addEventListener('focus', function(e) {
						this.parentNode.querySelector('.textChange').setAttribute('class', 'textChange');
					});

					// user cancels text input
					marker.querySelector('.iconCancel').addEventListener('click', function(e) {

						let 	menu = this.parentNode,
								li = menu.parentNode.parentNode,
								id = Number(li.getAttribute('data-id')),
								input = marker.querySelector('.markerLabel .markerLabelInput'),
								original = Mavis.Data.Settings.manual[id].label;

						input.value = original;
						menu.setAttribute('class', 'textChange hidden');
					});

					// user confirms text input
					marker.querySelector('.iconConfirm').addEventListener('click', function(e) {

						let 	menu = this.parentNode,
								li = menu.parentNode.parentNode,
								id = Number(li.getAttribute('data-id')),
								input = marker.querySelector('.markerLabel .markerLabelInput');

						Mavis.Data.Settings.manual[id].label = input.value;
						menu.setAttribute('class', 'textChange hidden');

						Mavis.Settings._activateSaveButton();
					});

					// user changes metic scale
					marker.querySelector('.markerMetricsSelect').addEventListener('change', function(e) {

						let id = this.parentNode.parentNode.getAttribute('data-id');

						if(this.value != Mavis.Data.Settings.manual[id].metric) {

							Mavis.Data.Settings.manual[id].metric = Number(this.value);

							Mavis.Settings._activateSaveButton();
						}
					});

					// user clicks on color to change it, show ColorPicker
					marker.querySelector('.color').addEventListener('click', function(e) {

						this.parentNode.parentNode.querySelector('.colorPickerMenu').classList.remove('hidden');
					});

					// !!! add eventlistener for changing color !!!

					// user cancels color change
					marker.querySelector('.colorCancel').addEventListener('click', function(e) {

						let id = this.parentNode.parentNode.getAttribute('data-id');

						this.parentNode.parentNode.querySelector('.color').style.backgroundColor = Mavis.Data.Settings.manual[id].color;
						this.parentNode.classList.add('hidden');
					});

					// user accepts color change
					marker.querySelector('.colorConfirm').addEventListener('click', function(e) {

						let 	id = this.parentNode.parentNode.getAttribute('data-id'),
								hex = this.parentNode.parentNode.querySelector('.color').getAttribute('data-color');

						this.parentNode.parentNode.querySelector('.color').style.backgroundColor = hex;
						this.parentNode.classList.add('hidden');

						Mavis.Data.Settings.manual[id].color = hex;

						Mavis.Settings._activateSaveButton();
					});

					// user clicks on trashcan
					marker.querySelector('.markerDelete').addEventListener('click', function(e) {

						Mavis.Notifications.notify(7);
						this.parentNode.querySelector('.trashMenu').classList.remove('hidden');
					});

					// user cancels deleting action
					marker.querySelector('.trashCancel').addEventListener('click', function(e) {

						this.parentNode.parentNode.querySelector('.trashMenu').classList.add('hidden');
					});

					// user confirms deleting action
					marker.querySelector('.trashConfirm').addEventListener('click', function(e) {

						let id = this.parentNode.parentNode.getAttribute('data-id');

						Mavis.Settings.Marker._delete(id);
						this.parentNode.parentNode.querySelector('.trashMenu').classList.add('hidden');
					});
				});

				// add new marker
				document.getElementById('usergeneratedAddMarker').addEventListener('mouseup', function(e) {
					Mavis.Settings.Marker._add();
				});

				resolve();
			});
		},

		_init: function() {

			return new Promise(function(resolve, reject) {

				Mavis.Settings.Marker._createList()
				.then(Mavis.Settings.Marker._renderDinMarkers())
				.then(Mavis.Settings.Marker._renderManualMarkers())
				.then(Mavis.Settings.Marker._renderAddMarkerButton())
				.then(Mavis.Settings.Marker._events())
				.then(resolve());
			});
		}
	},

	Modules: {

		_renderModules: function() {

			return new Promise(function(resolve, reject) {

				// get container
				const container = document.getElementById('settingsContainerModules');

				// empty container
				container.innerHTML = '';

				Mavis.Data.Settings.automatic.forEach(function(mod, i) {

					// generate the code with vars
					let 	testModuleLabel = '<label for="' + mod.name + 'Activate">' + mod.label + '</label>',
							activity = (mod.active) ? 'active':'inactive',
							testModuleSwitch = '<button id="' + mod.name + 'Switch" class="switchButton ' + activity + '" data-id="' + i + '" data-name="' + mod.name + '" data-active="' + mod.active + '"><div class="switchLid"></div></button>',
							label = '<label>Schwellen (' + Mavis.Data.Settings.metrics[mod.metric] + ')</label>',
							minInput = '<input type="number" id="' + mod.name + 'ThreshMeterMin" class="threshCurrentValueMin" data-module="' + mod.name + '" data-id="' + i + '" data-mom="min" value="' + mod.threshMin + '">',
							rangeMinId = mod.name + 'ThreshMin',
							rangeMin = '<input type="range" id="' + rangeMinId + '" class="thresholdMin" data-value="' + mod.threshMin + '" data-module="' + mod.name + '" data-id="' + i + '" data-mom="min" min="' + mod.min + '" max="' + mod.max + '" value="' + mod.threshMin + '" step="' + mod.steps + '"/>',
							rangeMaxId = mod.name + 'ThreshMax',
							rangeMax = '<input type="range" id="' + rangeMaxId + '" class="thresholdMax" data-value="' + mod.threshMax + '" data-module="' + mod.name + '" data-id="' + i + '" data-mom="max" min="' + mod.min + '" max="' + mod.max + '" value="' + mod.threshMax + '" step="' + mod.steps + '" />',
							rangeBarId = mod.name + 'SliderBar',
							rangeBar = '<div id="' + rangeBarId + '" class="sliderBar" style="width: 100%; left: 0;"></div>',
							maxInput = '<input type="number" id="' + mod.name + 'ThreshMeterMax" class="threshCurrentValueMax" data-module="' + mod.name + '" data-id="' + i + '" data-mom="max" value="' + mod.threshMax + '">',
							assembledContent = '<div class="activate">' + testModuleLabel + testModuleSwitch + '</div><div class="settings ' + activity + '">' + label + minInput + '<div class="threshSlider">' + rangeMin + rangeMax + rangeBar + '</div>' + maxInput + '</div>';

					let testModule = document.createElement('div');
					testModule.setAttribute('id', mod.name);
					testModule.classList.add('testModule');
					testModule.innerHTML = assembledContent;

					// append modules to container
					container.appendChild(testModule);

					// set range slider values
					Mavis.Settings.Modules._setRangeBar(i, mod.threshMin, mod.threshMax);

				});
				resolve();
			});
		},

		_toggleSettings: function(el, state) {

			let 	_settings = '#' + el.getAttribute('data-name') + ' .settings',
					settings = document.querySelector(_settings),
					_state = false,
					_class = 'inactive';

			if(state) {
				_state = true;
				_class = 'active';
			}

			el.setAttribute('class', 'switchButton ' + _class);
			el.setAttribute('data-active', _state);
			settings.setAttribute('class', 'settings ' + _class);
		},

		_checkDataAvailability: function(mod) {

			let availability = false;

			Mavis.Data.CableData.forEach(function(cable, i) {
				if(cable.modules.automatic[mod].all.length > 0) availability = true;
			});

			return availability;
		},

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

		_activateModule: function() {

			let 	moduleIndex = Number(this.getAttribute('data-id')),
					moduleActive = this.getAttribute('data-active');

			if(Mavis.Settings.Modules._checkDataAvailability(moduleIndex)) {

				if(moduleActive === 'true') {
					Mavis.Settings.Modules._toggleSettings(this, false);
				} else {
					Mavis.Settings.Modules._toggleSettings(this, true);
				}

				Mavis.Settings._activateSaveButton();

			} else {

				Mavis.Notifications.notify(3);
			}
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

		_setRangeBar: function(i, min, max) {

			let 	data = Mavis.Data.Settings.automatic[i],
					barSelector = data.name + 'SliderBar',
					bar = document.getElementById(barSelector),
					barLeft = Math.round((min / Number(data.max)) * 100),
					barRight = Math.round(((Number(data.max) - max) / Number(data.max)) * 100),
					barLength = 100 - barLeft - barRight;

			bar.style.width = barLength + '%';
			bar.style.left = barLeft + '%';
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

		_events: function() {

			return new Promise(function(resolve, reject) {

				let 	switches = document.querySelectorAll('.switchButton'),
						threshMin = document.querySelectorAll('.thresholdMin'),
						threshMax = document.querySelectorAll('.thresholdMax'),
						labelsMin = document.querySelectorAll('.threshCurrentValueMin'),
						labelsMax = document.querySelectorAll('.threshCurrentValueMax');

				switches.forEach(function(_switch, i) {
					_switch.addEventListener('click', Mavis.Settings.Modules._activateModule);
				});

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

				resolve();
			});
		},

		_init: function() {

			return new Promise(function(resolve, reject) {

				Mavis.Settings.Modules._renderModules()
				.then(Mavis.Settings.Modules._events())
				.then(resolve());
			});
		}
	},

	_renderView: () => {

		return new Promise(function(resolve, reject) {

			const container = document.getElementById('content');

			let content = [
				'<div id="settings">',
					'<div class="inner">',
					 	'<div id="settingsContainer"></div>',
					 	'<button id="settingsSave">Einstellungen speichern</button>',
					 '</div>',
				'</div>'
			];

			container.innerHTML = content.join('');

			resolve();
		});
	},

	_renderTabs: function() {

		return new Promise(function(resolve, reject) {

			// clear container
			let container = document.getElementById('settingsContainer');
			container.innerHTML = '';

			let 	modules = ['Marker','Modules'],
					labels = ['Merkmale', 'Verfahren'];

			Mavis.Global.tabs('settingsContainer', labels, modules, 10);

			resolve();
		});
	},

	_activateSaveButton: function() {
		Mavis.Settings.Pending = true;
		document.getElementById('settingsSave').classList.add('active');
	},

	_deactivateSaveButton: function() {
		Mavis.Settings.Pending = false;
		document.getElementById('settingsSave').classList.remove('active');
	},

	save: function() {

		return new Promise(function(resolve, reject) {

			Mavis.Data.writeSettings()
			.then(Mavis.Data.writeCableData())
			.then(Mavis.Data.collectResults())
			.then(function() {
				Mavis.Settings._deactivateSaveButton();
				Mavis.Notifications.notify(6);
				resolve();
			});
		});
	},

	_events: function() {

		return new Promise(function(resolve, reject) {

			const saveButton = document.getElementById('settingsSave');

			saveButton.addEventListener('click', function(e) {

				e.preventDefault;

				if(this.classList.contains('active')) {
					Mavis.Settings.save()
					.then(resolve());
				}
			});
		});
	},

	init: function() {

		return new Promise(function(resolve, reject) {

			console.log('init Settings');

			document.getElementById('content').setAttribute('data-tab', 'Marker');

			Mavis.Settings._renderView()
			.then(Mavis.Settings._renderTabs())
 			.then(Mavis.Settings.Marker._init())
 			.then(Mavis.Settings.Modules._init())
 			.then(Mavis.Settings._events())
			.then(resolve());
		});
	}
};

module.exports = Mavis.Settings;