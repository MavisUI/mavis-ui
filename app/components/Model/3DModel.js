const Mavis = require('../Global/Global');
const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);
const ProjectorRenderer = require('three-projector-renderer')(THREE);

Mavis.Model = {

	Scene: null,
	Camera: null,
	Renderer: null,
	Gravity: 0,
	View: null,
	Bridge: null,
	Labels: null,
	Filter: '',
	Animation: null,
	Orbit: null,
	Raycaster: null,
	Projector: null,
	Vector: null,
	Intersect: 0,

	_render: () => {

		return new Promise(function(resolve, reject) {

			// content container
			const content = [
				'<div class="inner">',
					'<menu id="modelFilter"></menu>',
				'</div>',
				'<div id="model"></div>',
				'<div id="cableInfo"></div>',
				'<div id="objectinfo">',
					'<h1><span id="name">Name</span></h1>',
					'<p>',
						'<span id="street">Straßenname</span>,',
						'<span id="zip">0000</span>',
						'<span id="city">Stadt</span>,',
						'<span id="country">Land</span>',
					'</p>',
				'</div>'
			];

			document.getElementById('content').innerHTML = content.join('');
			resolve();
		});
	},

	Canvas: {

		_setScene: function() {
			return new Promise(function(resolve, reject) {

				// initiate new Three Scene
				let scene = new THREE.Scene({alpha: true});

				// make available in global var
				Mavis.Model.Scene = scene;

				resolve();
			});
		},

		_setCamera: function() {
			return new Promise(function(resolve, reject) {

				// get DOM container
				const content = document.getElementById('content');

				// get width & height and initiate new Three camera with properties
				let	width = content.clientWidth,
						height = content.clientHeight,
						camera = new THREE.PerspectiveCamera(80, width/height, 0.1, 1000);

				// set camera position
				camera.position.set(20,20,220);

				// set camera view
				camera.lookAt(Mavis.Model.Scene.position);

				// make camera available as global var
				Mavis.Model.Camera = camera;

				resolve();
			});
		},

		_setRenderer: function() {
			return new Promise(function(resolve, reject) {

				// get container element
				const modelContainer = document.getElementById('model');

				// clear container
				modelContainer.innerHTML = '';

				// initiate new Three Renderer
				let renderer = new THREE.WebGLRenderer();

				// Make available as var
				Mavis.Model.Renderer = renderer;

				// MAVIS.MODEL.CANVAS.renderer.clearTarget();

				// append to DOM
				modelContainer.appendChild(Mavis.Model.Renderer.domElement);


				resolve();
			});
		},

		resize: function() {
			return new Promise(function(resolve, reject) {

				// get DOM container
				const model = document.getElementById('model');

				// get client width and height
				let	width = model.clientWidth,
					height = model.clientHeight;

				Mavis.Model.Camera.aspect = width / height;
				Mavis.Model.Camera.updateProjectionMatrix();

				// set size of Three renderer
				Mavis.Model.Renderer.setSize(width, height);

				resolve();
			});
		},

		_init: function() {
			return new Promise(function(resolve, reject) {

				Mavis.Model.Canvas._setScene()
				.then(Mavis.Model.Canvas._setCamera())
				.then(Mavis.Model.Canvas._setRenderer())
				.then(Mavis.Model.Canvas.resize())
				.then(resolve());
			});
		}
	},

	Construction: {

		_renderFloor: function() {
			return new Promise(function(resolve, reject) {

				let 	data = Mavis.Data.Construction.ground,
						floorMaterial = new THREE.MeshBasicMaterial({color: data.color, side:THREE.DoubleSide}),
						floorGeometry = new THREE.PlaneGeometry(data.width, data.depth, data.height, 1),
						floor = new THREE.Mesh(floorGeometry, floorMaterial);

				floor.rotation.x = Mavis.Model.Gravity;
				floor.position.set(data.x, data.y, data.z);
				floor.name = data.name;

				Mavis.Model.View.add(floor);

				Mavis.Model.Renderer.setClearColor(0xd3edfa, 1);

				resolve();
			});
		},

		_renderRiver: function() {
			return new Promise(function(resolve, reject) {

				let 	data = Mavis.Data.Construction.river,
						riverMaterial = new THREE.MeshBasicMaterial({color: data.color, side:THREE.DoubleSide}),
						riverGeometry = new THREE.BoxGeometry(data.width, data.depth, data.height, 1),
						river = new THREE.Mesh(riverGeometry, riverMaterial);

				river.rotation.x = Mavis.Model.gravity;
				river.position.set(data.x, data.y, data.z);
				river.name = data.name;

				Mavis.Model.View.add(river);

				resolve();
			});
		},

		_renderSupports: function() {
			return new Promise(function(resolve, reject) {

				let data = Mavis.Data.Construction.supports;

				data.forEach(function(el) {

					let 	supportMaterial = new THREE.MeshBasicMaterial({color: el.color, side:THREE.DoubleSide}),
							supportGeometry = new THREE.BoxGeometry(el.width, el.height, el.depth),
							support = new THREE.Mesh(supportGeometry, supportMaterial);

					support.position.set(el.x, el.y, el.z);
					support.name = el.name;

					Mavis.Model.Bridge.add(support);
				});

				resolve();
			});
		},

		_renderPillars: function() {
			return new Promise(function(resolve, reject) {

				let data = Mavis.Data.Construction.pillars;

				data.forEach(function(el) {

					let 	pillarMaterial = new THREE.MeshBasicMaterial({color: el.color, side:THREE.DoubleSide}),
							pillarGeometry = new THREE.BoxGeometry(el.width, el.height, el.depth),
							pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);

					pillar.name = el.name;
					pillar.position.set(el.x, el.y, el.z);
					Mavis.Model.Bridge.add(pillar);
				});

				resolve();
			});
		},

		_renderDeck: function() {
			return new Promise(function(resolve, reject) {

				let 	data = Mavis.Data.Construction.deck,
						deckMaterial = new THREE.MeshBasicMaterial({color: data.color, side:THREE.DoubleSide}),
						deckGeometry = new THREE.BoxGeometry(data.width, data.height, data.depth),
						deck = new THREE.Mesh(deckGeometry, deckMaterial);

				deck.position.set(data.x, data.y, data.z);
				deck.name = 'deck';

				Mavis.Model.Bridge.add(deck);


				resolve();
			});
		},

		_generateMarkerMesh: function(marker, cableIndex, cableDiameter, cableLength, color) {

			let 	diameter = cableDiameter + 0.01,
					geometry = new THREE.CylinderGeometry(diameter, diameter, 0.5),
					material = new THREE.MeshBasicMaterial({color: color}),
					mesh = new THREE.Mesh(geometry, material),
					x = marker.position - (cableLength / 2) + 6.1;

			mesh.position.set(0,x,0);
			mesh.name = 'marker(' + cableIndex + ')[' + marker.position + ']{' + marker.label + '}';

			return(mesh);

		},

		_renderCables: function() {

			return new Promise(function(resolve, reject) {

				let 	data = Mavis.Data.Construction.cables,
						deg = Math.PI / 180;

				data.forEach(function(el, i) {

					let 	cableGeometry = new THREE.CylinderGeometry(el.diameter, el.diameter, el.length),
							cableMaterial = new THREE.MeshBasicMaterial({color: el.color }),
							cable = new THREE.Mesh(cableGeometry, cableMaterial),
							cableDiameter = el.diameter,
							cableLength = el.length,
							cableName = el,
							cableIndex = i;

					cable.position.set(el.x, el.y, el.z);
					cable.rotation.x = el.rotateX * deg;
					cable.rotation.y = el.rotateY * deg;
					cable.rotation.z = el.rotateZ * deg;
					cable.name = el.name;

					let 	warningsAutomatic = Mavis.Data.CableData[i].modules.automatic,
							warningsDin = Mavis.Data.CableData[i].modules.din,
							warningsManual = Mavis.Data.CableData[i].modules.manual,
							color;

					warningsAutomatic.forEach(function(warning, i) {

						if(warning.all.length) {

							color = Mavis.Data.Settings.automatic[i].color;

							warning.all.forEach(function(marker, i) {

								let mark = Mavis.Model.Construction._generateMarkerMesh(marker, cableIndex, cableDiameter, cableLength, color);
								cable.add(mark);
							});
						}
					});

					warningsDin.forEach(function(warning, i) {

						if(warning.all.length) {

							color = Mavis.Data.Settings.din[i].color;

							warning.all.forEach(function(marker, i) {

								let mark = Mavis.Model.Construction._generateMarkerMesh(marker, cableIndex, cableDiameter, cableLength, color);
								cable.add(mark);
							});
						}
					});

					warningsManual.forEach(function(warning, i) {

						if(warning.all.length) {

							color = Mavis.Data.Settings.manual[i].color;

							warning.all.forEach(function(marker, i) {

								let mark = Mavis.Model.Construction._generateMarkerMesh(marker, cableIndex, cableDiameter, cableLength, color);
								cable.add(mark);
							});
						}
					});

					Mavis.Model.Bridge.add(cable);

				});


				resolve();
			});
		},

		_renderLabels: function() {

			function makeText(message, parameters) {

				if(parameters === undefined) parameters = {};

				let 	fontface = parameters.hasOwnProperty('fontface') ? parameters.fontface : 'din_light',
						fontsize = parameters.hasOwnProperty('fontsize') ? parameters.fontsize : 15,
						rotation = parameters.hasOwnProperty('rotation') ? parameters.rotation : 0,
						borderThickness = parameters.hasOwnProperty('borderThickness') ? parameters.borderThickness : 10,
						canvas = document.createElement('canvas'),
						context = canvas.getContext('2d');

				context.font = 'Bold ' + fontsize + 'px ' + fontface;
				context.rotate(parameters.rotation * Math.PI/180);

				let 	metrics = context.measureText(message),
						textWidth = metrics.width;

				context.fillStyle = 'rgba(0, 0, 0, 1)';
				context.fillText(message, borderThickness, fontsize + borderThickness);

				let texture = new THREE.Texture(canvas);

				texture.needsUpdate = true;

				let 	spriteMaterial = new THREE.SpriteMaterial({ map: texture }),
						sprite = new THREE.Sprite(spriteMaterial);

				sprite.scale.set(100,50,2.0);

				return sprite;
			} 

			function makeLabel(message, parameters) {

				let 	fontface = parameters.hasOwnProperty('fontface') ? parameters.fontface : 'din_light',
						fontsize = parameters.hasOwnProperty('fontsize') ? parameters.fontsize : 15,
						rotation = parameters.hasOwnProperty('rotation') ? parameters.rotation : 0,
						borderThickness = parameters.hasOwnProperty('borderThickness') ? parameters.borderThickness : 10,
						canvas = document.createElement('canvas'),
						context = canvas.getContext('2d');

				context.font = 'Bold ' + fontsize + 'px ' + fontface;
				context.rotate(parameters.rotation * Math.PI/180);

				let 	metrics = context.measureText(message),
						textWidth = metrics.width;

				context.fillStyle = 'rgba(0, 0, 0, 1)';
				context.fillText(message, 20, 30);

				let texture = new THREE.Texture(canvas);
				texture.needsUpdate = true;

				let spriteMaterial = new THREE.MeshBasicMaterial( {map: texture, side:THREE.DoubleSide } );
				spriteMaterial.transparent = true;

				let mesh = new THREE.Mesh(new THREE.PlaneGeometry(50, 40),spriteMaterial);

				return mesh;
			}

			return new Promise(function(resolve, reject) {

				let data = Mavis.Data.Construction.labels;

				data.forEach(function(el) {

					var sprite = makeText(el.text, {fontface: 'din_light', fontsize: el.fontsize, rotation: el.rotation});
					sprite.position.set(el.x, el.y, el.z);
					Mavis.Model.Labels.add(sprite);

				});

				resolve();
			});
		},

		_updateScene: function() {

			Mavis.Model.Scene.remove(Mavis.Model.View);
			Mavis.Model.Scene.remove(Mavis.Model.Bridge);
			Mavis.Model.Scene.remove(Mavis.Model.Labels);

			this._init();
		},

		addScene: function() {
			return new Promise(function(resolve, reject) {

				Mavis.Model.Scene.add(Mavis.Model.View);
				Mavis.Model.Scene.add(Mavis.Model.Bridge);
				Mavis.Model.Scene.add(Mavis.Model.Labels);
				resolve();
			});
		},

		animate: function() {
			return new Promise(function(resolve, reject) {

				function render() {

					Mavis.Model.Animation = requestAnimationFrame(render);
					Mavis.Model.Renderer.render(Mavis.Model.Scene, Mavis.Model.Camera);
				}

				render();

				resolve();
			});
		},

		animateEnd: function() {
			return new Promise(function(resolve, reject) {

				cancelAnimationFrame(Mavis.Model.Animation);
				resolve();

			});
		},

		_init: function() {

			return new Promise(function(resolve, reject) {

				Mavis.Model.Gravity = Math.PI / 2;
				Mavis.Model.View = new THREE.Object3D();
				Mavis.Model.Bridge = new THREE.Object3D();
				Mavis.Model.Labels = new THREE.Object3D();

				Mavis.Model.Construction._renderFloor()
				.then(Mavis.Model.Construction._renderRiver())
				.then(Mavis.Model.Construction._renderSupports())
				.then(Mavis.Model.Construction._renderPillars())
				.then(Mavis.Model.Construction._renderDeck())
				.then(Mavis.Model.Construction._renderCables())
				.then(Mavis.Model.Construction._renderLabels())
				.then(Mavis.Model.Construction.addScene())
				.then(Mavis.Model.Construction.animate())
				.then(resolve());
			});
		}
	},

	Controls: {

		_orbitConfig: function() {

			return new Promise(function(resolve, reject) {

				Mavis.Model.Orbit.minDistance = 10;
				Mavis.Model.Orbit.maxDistance = 500;
				Mavis.Model.Orbit.minPolarAngle = 0;
				Mavis.Model.Orbit.maxPolarAngle = (Math.PI / 2) - 0.1;
				Mavis.Model.Orbit.enableZoom = true;

				resolve();
			});
		},

		_renderCableInfo: function(cable, position, styles) {

			console.log('cable: ' + cable + ', position: ' + position + ', styles: ' + styles);

/*
						$('#cable_info h3').text(warning);
						$('#cable_info_cable').text(MAVIS.DATA.OBJECT.BUILD.CABLES[cable].NAME);
						$('#cable_info_position').text(pos);
						$('#cable_info button').data('cable', cable).data('position', pos);
						$('#cable_info').attr('style', styles);
						$('#cable_info').attr('class', 'show');
*/
		},

		_getIntersection: function(mx,my) {

			const model = document.getElementById('model');

			// get client width and height
			let 	x = (mx / model.clientWidth) * 2 - 1,
					y = -(my / model.clientHeight) * 2 + 1;

			Mavis.Model.Vector.set(x, y, 1);
			Mavis.Model.Vector.sub(Mavis.Model.Camera.position);
			Mavis.Model.Vector.normalize();
			Mavis.Model.Raycaster.set(Mavis.Model.Camera.position, Mavis.Model.Vector);

			let intersects = Mavis.Model.Raycaster.intersectObjects(Mavis.Model.Scene.children, true);

			if (intersects.length) {

				let 	target = intersects[0].object,
						obj = target.name.toString();

				console.log(target);
/*
				if(obj.indexOf('marker') !== -1) {

					console.log(this.intersect);


					if(target.id !== this.intersect) {

						this.intersect = target.id;

						let 	cableStart = obj.indexOf('(') + 1,
								cableEnd = obj.indexOf(')'),
								cable = Number(obj.substring(cableStart, cableEnd)),
								positionStart = obj.indexOf('[') + 1,
								positionEnd = obj.indexOf(']'),
								position = obj.substring(positionStart, positionEnd),
								warningStart = obj.indexOf('{') + 1,
								warningEnd = obj.indexOf('}'),
								warning = obj.substring(warningStart, warningEnd),
								styles = 'top:' + (my - 180) + 'px; left:' + (mx - 80) + 'px;';

						Mavis.Model.Controls._renderCableInfo(cable, position, styles);
					}

				}
*/
			}
		},

		_render: function() {

			Mavis.Model.Renderer.render(Mavis.Model.Scene, Mavis.Model.Camera);

		},

		_events: function() {

			return new Promise(function(resolve, reject) {

				Mavis.Model.Orbit.addEventListener('change', Mavis.Model.Controls._render);

				const model = document.getElementById('model');

				model.addEventListener('mousedown', function(e) {

					Mavis.Model.Controls._getIntersection(e.clientX, e.clientY);

				});
/*

				$('#cable_info button').on('click', function() {

					var data = {};
					data.cable = Number($('#cable_info button').data('cable'));
					data.position = Number($('#cable_info button').data('position'));

					MAVIS.GUI.load('inspection', data);

				});
*/

				resolve();
			});
		},

		_init: function() {

			return new Promise(function(resolve, reject) {

				Mavis.Model.Orbit = new OrbitControls(Mavis.Model.Camera, Mavis.Model.Renderer.domElement);
				Mavis.Model.Raycaster = new THREE.Raycaster();
				Mavis.Model.Vector = new THREE.Vector3();
 				Mavis.Model.Controls._orbitConfig()
 				.then(Mavis.Model.Controls._events())
 				.then(resolve());

				resolve();
			});
		}
	},

	init: function() {

		return new Promise(function(resolve, reject) {

			console.log('init MODEL');

			Mavis.LoadingScreen.message('initializing 3D Model');

			document.getElementById('content').setAttribute('data-tab', 'Model');

			Mavis.Model._render()
				.then(Mavis.Filter.init('Model', 'modelFilter', ['rating', 'marker']))
				.then(Mavis.Model.Canvas._init())
				.then(Mavis.Model.Construction._init())
				.then(Mavis.Model.Controls._init())
				.then(resolve());
		});
	}
};

module.exports = Mavis.Model;
