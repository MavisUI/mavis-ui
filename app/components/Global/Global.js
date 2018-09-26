const path = require('path');
const Mavis = Mavis || {};

Mavis.AppPath = path.join(process.cwd(), "..", "app")

Array.prototype.forEachAsync = async function(callback){
  for(let x of this){
    let i = this.indexOf(x);
    await callback(x, i);
  }
};

Mavis.Global = {

	fs: null,
	gui: null,
	path: null,
	paletteBlue: ['#02070C', '#08213C', '#0C3461', '#104784', '#25578F', '#3B689A', '#4A6E96', '#5179A5', '#6085AD', '#6689B0', '#718CAA', '#7C9ABB', '#87A3C1', '#92ABC7', '#99ABBF', '#A8BCD2', '#AFC2D6', '#BDCCDD', '#C0C9D3', '#D3DDE8', '#D7E0EA', '#E9EEF3'],

	_getFileSystem: () => {
    // fn to get instance of filesystem
    const fs = require('fs');

    // make filesystem available in var
    Mavis.Global.fs = fs;
	},

	_getNwGui: () => {
    // fn to get gui
    const gui = require('nw.gui');

    // make gui available in var
    Mavis.Global.gui = gui;
	},

	_getArchiver: () => {
	  const archiver = require('archiver');
    Mavis.Global.archiver = archiver;
	},

	_tabsActivate: (container, position, width, module) => {

		let tabs = container.querySelectorAll('.tab'),
				tabLine = container.querySelector('.tabsLine'),
				tabBodies = container.querySelectorAll('.tabBody'),
				distance = (position * width) + 'rem',
				lineWidth = width - 1,
				styles = '-webkit-transform:translateX(' + distance + '); width:' + lineWidth + 'rem;',
				l = tabs.length,
				x = Number(position),
				i;

		for(i=0;i<l;i++) {
			if(i===x) {
				tabBodies[i].style.display = 'inline-block';
			} else {
				tabBodies[i].style.display = 'none';
			}
		}

		tabLine.setAttribute('style', styles);
		document.getElementById('content').setAttribute('data-tab', module);
	},

	tabs: (id, labels, modules, width) => {

		// get parent for tabs
		let container = document.getElementById(id),
				n = labels.length;

		// calc lineWidth
		var lineWidth = width - 1;

		// create tabs container
		var tabsContainer = document.createElement('div');
		tabsContainer.setAttribute('id', id + 'Tabs');
		tabsContainer.setAttribute('class', 'tabs');

		// create tabLine
		var tabLine = document.createElement('div');
		tabLine.setAttribute('id', id + 'TabsLine');
		tabLine.setAttribute('class', 'tabsLine');
		tabLine.setAttribute('style', 'width: ' + lineWidth + 'rem;');

		// create tabBodies container
		var tabsBody = document.createElement('div');
		tabsBody.setAttribute('id', id + 'Body');
		tabsBody.setAttribute('class', 'tabsBody');

		let i;

		// create & append inner tabs & bodies
		for(i=0;i<n;i++) {

			var tab = document.createElement('a'),
				tabBody = document.createElement('div');

			// generate tabs
			tab.setAttribute('class', 'tab');
			tab.setAttribute('data-position', i);
			tab.setAttribute('style', 'width:' + width + 'rem');
			tab.innerHTML = labels[i];

			// generate tabBodies
			tabBody.setAttribute('id', id + modules[i]);
			tabBody.setAttribute('class', 'tabBody');
			if(i!==0) tabBody.style.display = 'none';

			// create eventListener for Tabs
			tab.addEventListener('click', function(e) {
				var position = this.getAttribute('data-position');
				Mavis.Global._tabsActivate(container, position, width, modules[position]);

				if(id === 'charts') {


					// MAVIS.GRAPHS.active = modules[i];


				}
			});

			tabsContainer.appendChild(tab);
			tabsBody.appendChild(tabBody);
		}

		// append elements
		container.appendChild(tabsContainer);
		container.appendChild(tabLine);
		container.appendChild(tabsBody);
	},

	init: () => {
			Mavis.Global._getFileSystem();
			Mavis.Global._getNwGui();
			Mavis.Global._getArchiver();
      console.log('init Global');
	}
};

module.exports = Mavis;

/*

var MAVIS = MAVIS || {};

MAVIS.GLOBAL = {

	WIN : null,
	ARCHIVER: null,

	// get the NW app window
	get_win: function() {

		return new Promise(function(resolve, reject) {

			// fn to get window
			var win = MAVIS.GLOBAL.GUI.Window.get();

			// make window available in var
			MAVIS.GLOBAL.WIN = win;

			resolve();
		});
	},

	// get archiver plugin
	get_archiver: function() {

		return new Promise(function(resolve, reject) {

			var archiver = require('archiver');

			MAVIS.GLOBAL.ARCHIVER = archiver;

			resolve();
		});
	},

	// creating a context-menu with NW
	set_contextmenu: function() {

		return new Promise(function(resolve, reject) {

			MAVIS.LOADING.message('building context menus')
			/*
			.then(function() {

				// init menu
				var menu = new MAVIS.GLOBAL.GUI.Menu();

				var mod = $('#app').attr('class');

				switch(mod) {
					case 'model':

						menu.append(new MAVIS.GLOBAL.GUI.MenuItem({
							label: 'Filter',
							click: function() {

								$('#modelfilter').toggleClass('hidden');
								$('#cable_info').removeClass('show');
								MAVIS.MODEL.CONTROLS.intersect = 0;
							}
						}));

						break;

					case 'inspection':


						break;

					default:

						break;
				}

				menu.append(new MAVIS.GLOBAL.GUI.MenuItem({
					type: 'separator'
				}));

				menu.append(new MAVIS.GLOBAL.GUI.MenuItem({
					label: 'Hilfe einblenden',
					click: function() {

						MAVIS.HELP.load_help($('#app').attr('class'));
						$('#help').removeClass('hidden');

					}
				}));

				// event listener for right-click context-menu calls
				document.body.addEventListener('contextmenu', function(e) {

					// prevent default menu from showing up
					e.preventDefault();

					MAVIS.MODEL.CONTROLS.orbit.disabled = true;

					// position the custom contextmenu
					menu.popup(e.x, e.y);
				});
			})
*/
/*
			.then(resolve());
		});
	},

	set_windowmenu: function() {

		return new Promise(function(resolve, reject) {

			console.log('set window menu');

			MAVIS.LOADING.message('building window menus').then(function() {

				// init menu
				var nw = MAVIS.GLOBAL.GUI;

				// var window_menu = new nw.Tray({ title: 'MAVIS UI' });

				// window menu
				var window_menu = new nw.Menu({
					type: 'menubar'
				});

				var main_menu = new nw.Menu();

				// add to window menu
				window_menu.append(new nw.MenuItem({
					label: 'MAVIS UI',
					submenu: main_menu
				}));

				// sub-entries
				main_menu.append(new nw.MenuItem({
					label: '3D Modell',
					key: 'm',
					click: function(){
						MAVIS.GUI.load('model');
					}
				}));

				main_menu.append(new nw.MenuItem({
					label: 'Visuelle Inspektion',
					key: 'i',
					click: function(){
						MAVIS.GUI.load('inspection');
					}
				}));

				main_menu.append(new nw.MenuItem({
					label: 'Reports',
					key: 'r',
					click: function(){
						MAVIS.GUI.load('report');
					}
				}));

				main_menu.append(new nw.MenuItem({
					label: 'Einstellungen',
					key: 'e',
					click: function(){
						MAVIS.GUI.load('settings');
					}
				}));

				main_menu.append(new nw.MenuItem({
					type: 'separator'
				}));

				main_menu.append(new nw.MenuItem({
					label: 'Hilfe einblenden',
					click: function() {

						MAVIS.HELP.load_help($('#app').attr('class'));
						$('#help').removeClass('hidden');

					}
				}));

				// Assign to window
				nw.Window.get().menu = window_menu;

			})
			.then(resolve());

		});
	},

	events: function() {

		return new Promise(function(resolve, reject) {

			$(window).on('resize', function() {

				MAVIS.LOADING.resize();

				if($('#app').hasClass('inspection')) {

					MAVIS.VISUAL.resize();
					MAVIS.COMMENTS.resize();
					MAVIS.CONTROLS.MARKER.init();

				} else if($('#app').hasClass('model')) {

					MAVIS.MODEL.CANVAS.resize();
					MAVIS.MODELFILTER.resize();

				} else if($('#app').hasClass('report')) {

					MAVIS.DOWNLOAD.resize();
					MAVIS.FILTER.resize();
					MAVIS.LIST.resize();

				} else if($('#app').hasClass('settings')) {


				}
			});

			resolve();
		});
	},

	// init global functions
	init: function() {

		return new Promise(function(resolve, reject) {

			console.log('init GLOBAL');

			MAVIS.GLOBAL.get_gui()
			.then(MAVIS.GLOBAL.get_fs())
			.then(MAVIS.GLOBAL.get_win())
			.then(MAVIS.GLOBAL.get_path())
			.then(MAVIS.GLOBAL.get_archiver())
			// .then(MAVIS.GLOBAL.set_contextmenu())
			// .then(MAVIS.GLOBAL.set_windowmenu())
			.then(MAVIS.GLOBAL.events())
			.then(resolve('MAVIS.GLOBAL ready'));

		});
	}
};

*/

