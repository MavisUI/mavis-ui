const Mavis = require('../Global/Global');
const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);
const ProjectorRenderer = require('three-projector-renderer')(THREE);

Mavis.Model = {

  Camera: null,
  CameraPosition: {
    x: 20,
    y: 20,
    z: 220
  },
  ClickPosition: {
    x: 0,
    y: 0
  },
  Mouse: null,
  Scene: null,
  Renderer: null,
  Gravity: 0,
  View: null,
  Bridge: null,
  Labels: null,
  Animation: null,
  Orbit: null,
  Raycaster: null,
  Intersected: 0,
  Data: {},

  _render: () => {
    return new Promise((resolve, reject) => {

      // content container
      let content = [
        '<div class="inner">',
          '<menu id="modelFilter"></menu>',
        '</div>',
        '<div id="model"></div>',
        '<div id="cableInfo" class="hidden">',
          '<a id="cableInfoClose"><span class="icon iconCancel"></span></a>',
          '<h3 id="cableInfoCase">Schichtendicke</h3>',
          '<label>Seil:</label>',
          '<div id="cableInfoCable">0</div>',
          '<br />',
          '<label>Position:</label>',
          '<div id="cableInfoPosition">200.00</div>',
          '<br />',
          '<button id="cableInfoButton" class="active">Ansehen</button>',
        '</div>',
        '<div id="objectinfo">',
          '<h1 id="name">Name</h1>',
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

  _setMouse: () => {
    return new Promise((resolve, reject) => {
      Mavis.Model.Mouse = new THREE.Vector2();
      resolve();
    });
  },

  _setCamera:() => {
    return new Promise((resolve, reject) => {
      Mavis.Model.Camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
      Mavis.Model.Camera.position.set(Mavis.Model.CameraPosition.x,Mavis.Model.CameraPosition.y,Mavis.Model.CameraPosition.z);
      resolve();
    });
  },

  _setScene: () => {
    return new Promise((resolve, reject) => {
      Mavis.Model.Scene = new THREE.Scene();
      Mavis.Model.Scene.background = new THREE.Color(0xffffff);
      resolve();
    });
  },

  _setLight: () => {
    return new Promise((resolve, reject) => {
      Mavis.Model.Light = new THREE.DirectionalLight( 0xffffff, 1 );
      Mavis.Model.Light.position.set( 1, 1, 1 ).normalize();
      Mavis.Model.Scene.add(Mavis.Model.Light);
      resolve();
    });
  },



  Construction: {

    _load: () => {
      return new Promise((resolve, reject) => {

        Mavis.Data.Stores['construction']
          .find({})
          .then(construction => {
            Mavis.Model.Data = construction[0];
            resolve();
          });
      });
    },

    _renderFloor: function() {
      return new Promise((resolve, reject) => {

        let data = Mavis.Model.Data.ground,
            floorMaterial = new THREE.MeshBasicMaterial({color: data.color, side:THREE.DoubleSide}),
            floorGeometry = new THREE.PlaneGeometry(data.width, data.depth, data.height, 1),
            floor = new THREE.Mesh(floorGeometry, floorMaterial);

        floor.rotation.x = Mavis.Model.Gravity;
        floor.position.set(data.x, data.y, data.z);
        floor.name = 'Floor';

        Mavis.Model.View.add(floor);
        resolve();
      });
    },

    _renderRiver: function() {
      return new Promise((resolve, reject) => {

        let data = Mavis.Model.Data.river,
          riverMaterial = new THREE.MeshBasicMaterial({color: data.color, side: THREE.DoubleSide}),
          riverGeometry = new THREE.BoxGeometry(data.width, data.depth, data.height, 1),
          river = new THREE.Mesh(riverGeometry, riverMaterial);

        river.rotation.x = Mavis.Model.gravity;
        river.position.set(data.x, data.y, data.z);
        river.name = 'Rhein';

        Mavis.Model.View.add(river);
        resolve();
      });
    },

    _renderSupports: () => {
      return new Promise((resolve, reject) => {

        let data = Mavis.Model.Data.supports;

        data.forEach(el => {
          let supportMaterial = new THREE.MeshBasicMaterial({color: el.color, side: THREE.DoubleSide}),
              supportGeometry = new THREE.BoxGeometry(el.width, el.height, el.depth),
              support = new THREE.Mesh(supportGeometry, supportMaterial);

          support.position.set(el.x, el.y, el.z);
          support.name = data.name;
          Mavis.Model.Bridge.add(support);
        });

        resolve();
      });
    },

    _renderPillars: () => {
      return new Promise((resolve, reject) => {

        let data = Mavis.Model.Data.pillars;

        data.forEach((el, i) => {
          let pillarMaterial = new THREE.MeshBasicMaterial({color: el.color, side: THREE.DoubleSide}),
              pillarGeometry = new THREE.BoxGeometry(el.width, el.height, el.depth),
              pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);

          pillar.name = 'Pillar-' + i;
          pillar.position.set(el.x, el.y, el.z);
          Mavis.Model.Bridge.add(pillar);
        });

        resolve();
      });
    },

    _renderDeck: () => {
      return new Promise((resolve, reject) => {

        let data = Mavis.Model.Data.deck,
            deckMaterial = new THREE.MeshBasicMaterial({color: data.color, side: THREE.DoubleSide}),
            deckGeometry = new THREE.BoxGeometry(data.width, data.height, data.depth),
            deck = new THREE.Mesh(deckGeometry, deckMaterial);

        deck.position.set(data.x, data.y, data.z);
        deck.name = 'Deck';
        Mavis.Model.Bridge.add(deck);
        resolve();
      });
    },

    _generateMarkerMesh: (cableDiameter, distance, color, position, cableLength, cableIndex, label) => {

      if(distance === 0) distance = 0.5;

      let diameter = cableDiameter + 0.01,
          geometry = new THREE.CylinderGeometry(diameter, diameter, distance),
          material = new THREE.MeshBasicMaterial({color: color}),
          mesh = new THREE.Mesh(geometry, material),
          x = position - (cableLength / 2) + 6.1;

      mesh.position.set(0,x,0);
      mesh.name = 'marker(' + cableIndex + ')[' + position + ']{' + label + '}';
      // mesh.name = 'Marker';

      return(mesh);
    },


    _renderCables: () => {
      return new Promise((resolve, reject) => {

        let data = Mavis.Model.Data.cables,
            deg = Math.PI / 180;

        data.forEach((el, i) => {

          let cableGeometry = new THREE.CylinderGeometry(el.diameter, el.diameter, el.length),
              cableMaterial = new THREE.MeshBasicMaterial({color: el.color }),
              cable = new THREE.Mesh(cableGeometry, cableMaterial),
              cableDiameter = el.diameter,
              cableLength = el.length,
              cableIndex = i;

          cable.position.set(el.x, el.y, el.z);
          cable.rotation.x = el.rotateX * deg;
          cable.rotation.y = el.rotateY * deg;
          cable.rotation.z = el.rotateZ * deg;
          cable.name = el.name;

          let results = Mavis.Filter.Data;
          results.forEach(result => {
            if(result.cable === i){
              let mark = Mavis.Model.Construction._generateMarkerMesh(cableDiameter, result.distance, result.color, result.position, cableLength, cableIndex, result.label);
              cable.add(mark);
            }
          });

          Mavis.Model.Bridge.add(cable);
        });

        resolve();
      });
    },

    _renderLabels: () => {

      function makeText(message, parameters) {

        if(parameters === undefined) parameters = {};

        let fontface = parameters.hasOwnProperty('fontface') ? parameters.fontface : 'din_light',
            fontsize = parameters.hasOwnProperty('fontsize') ? parameters.fontsize : 15,
            borderThickness = parameters.hasOwnProperty('borderThickness') ? parameters.borderThickness : 10,
            canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');

        context.font = 'Bold ' + fontsize + 'px ' + fontface;
        context.rotate(parameters.rotation * Math.PI/180);

        context.fillStyle = 'rgba(0, 0, 0, 1)';
        context.fillText(message, borderThickness, fontsize + borderThickness);

        let texture = new THREE.Texture(canvas);

        texture.needsUpdate = true;

        let spriteMaterial = new THREE.SpriteMaterial({ map: texture }),
          sprite = new THREE.Sprite(spriteMaterial);

        sprite.scale.set(100,50,2.0);

        return sprite;
      }

      return new Promise((resolve, reject) => {

        let data = Mavis.Model.Data.labels;

        data.forEach(function(el) {

          let sprite = makeText(el.text, {fontface: 'din_light', fontsize: el.fontsize, rotation: el.rotation});
          sprite.position.set(el.x, el.y, el.z);
          Mavis.Model.Labels.add(sprite);
        });

        resolve();
      });
    },

    _addScenes: () => {
      return new Promise((resolve, reject) => {
        Mavis.Model.Scene.add(Mavis.Model.View);
        Mavis.Model.Scene.add(Mavis.Model.Bridge);
        Mavis.Model.Scene.add(Mavis.Model.Labels);
        resolve();
      });
    },

    _init: function() {

      return new Promise((resolve, reject) => {
        Mavis.Model.Gravity = Math.PI / 2;
        Mavis.Model.View = new THREE.Object3D();
        Mavis.Model.Bridge = new THREE.Object3D();
        Mavis.Model.Labels = new THREE.Object3D();

        async function loader() {

          await Mavis.Model.Construction._load();
          await Mavis.Model.Construction._renderFloor();
          await Mavis.Model.Construction._renderRiver();
          await Mavis.Model.Construction._renderSupports();
          await Mavis.Model.Construction._renderPillars();
          await Mavis.Model.Construction._renderDeck();
          await Mavis.Model.Construction._renderCables();
          await Mavis.Model.Construction._renderLabels();

          Mavis.Model.Construction._addScenes()
            .then(resolve());
        }

        loader();
      });
    }
  },

  _setRaycaster: () => {
    return new Promise((resolve, reject) => {
      Mavis.Model.Raycaster = new THREE.Raycaster();
      resolve();
    });
  },

  _setRenderer: () => {
    return new Promise((resolve, reject) => {

      Mavis.Model.Renderer = new THREE.WebGLRenderer();
      Mavis.Model.Renderer.setPixelRatio(window.devicePixelRatio);
      Mavis.Model.Renderer.setSize(window.innerWidth, window.innerHeight);
      Mavis.Model.Renderer.setClearColor(0xd3edfa, 1);

      document.getElementById('model').appendChild(Mavis.Model.Renderer.domElement);

      resolve();
    });
  },

  _rendering: () => {
    return new Promise((resolve, reject) => {

      // set Raycaster to listen to mouse and camera
      Mavis.Model.Raycaster.setFromCamera(Mavis.Model.Mouse, Mavis.Model.Camera);

      // get intersects
      let intersects = Mavis.Model.Raycaster.intersectObjects(Mavis.Model.Scene.children, true);

      // if there are intersects
      if (intersects.length > 0) {

        // just a helper
        let obj = intersects[0].object.name;

        // check if it is a marker
        if(obj.indexOf('marker') !== -1 && obj !== Mavis.Model.Intersected) {

          // set the object to jump into else loop
          Mavis.Model.Intersected = obj;

          // do something with the marker
          Mavis.Model._cableInfo(obj);
        }
      }

      Mavis.Model.Renderer.render(Mavis.Model.Scene, Mavis.Model.Camera);

      resolve();
    });
  },

  _animate: () => {
    return new Promise((resolve, reject) => {
      requestAnimationFrame(Mavis.Model._animate);

      Mavis.Model._rendering()
      .then(resolve());
    });
  },

  _animateEnd: function() {
    return new Promise((resolve, reject) => {
      cancelAnimationFrame(Mavis.Model._animate);
      resolve();
    });
  },

  _setOrbitControls: () => {
    return new Promise((resolve, reject) => {

      Mavis.Model.Orbit = new OrbitControls(Mavis.Model.Camera, Mavis.Model.Renderer.domElement);
      Mavis.Model.Orbit.minDistance = 10;
      Mavis.Model.Orbit.maxDistance = 500;
      Mavis.Model.Orbit.minPolarAngle = 0;
      Mavis.Model.Orbit.maxPolarAngle = (Math.PI / 2) - 0.1;
      Mavis.Model.Orbit.enableZoom = true;

      Mavis.Model.Orbit.addEventListener('change', () => {

        let x = (Mavis.Model.Camera.position.x).toFixed(2),
            y = (Mavis.Model.Camera.position.y).toFixed(2),
            z = (Mavis.Model.Camera.position.z).toFixed(2);

        Mavis.Model.CameraPosition.x = x;
        Mavis.Model.CameraPosition.y = y;
        Mavis.Model.CameraPosition.z = z;

        Mavis.Model.Renderer.render(Mavis.Model.Scene, Mavis.Model.Camera);
      });

      resolve();
    });
  },


  _onMouseInput: e => {

    e.preventDefault();

    let modelHeight = document.getElementById('model').clientHeight,
        modelOffset = window.innerHeight - modelHeight;

    Mavis.Model.ClickPosition.x = e.clientX;
    Mavis.Model.ClickPosition.y = e.clientY;

    Mavis.Model.Mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    Mavis.Model.Mouse.y = - ((e.clientY - modelOffset)/ window.innerHeight) * 2 + 1;
  },

  _cableInfo: obj => {

    let cableStart = obj.indexOf('(') + 1,
        cableEnd = obj.indexOf(')'),
        cable = Number(obj.substring(cableStart, cableEnd)),
        positionStart = obj.indexOf('[') + 1,
        positionEnd = obj.indexOf(']'),
        position = obj.substring(positionStart, positionEnd),
        warningStart = obj.indexOf('{') + 1,
        warningEnd = obj.indexOf('}'),
        warning = obj.substring(warningStart, warningEnd);

    document.getElementById('cableInfoCase').innerHTML = warning;
    document.getElementById('cableInfoCable').innerHTML = cable;
    document.getElementById('cableInfoPosition').innerHTML = position;

    let button = document.getElementById('cableInfoButton');
    button.setAttribute('data-cable', cable);
    button.setAttribute('data-position', position);

    let cableInfo = document.getElementById('cableInfo');
    cableInfo.style.left = (Mavis.Model.ClickPosition.x - 125) + 'px';
    cableInfo.style.top = (Mavis.Model.ClickPosition.y - 200) + 'px';
    cableInfo.classList.remove('hidden');

  },

  _hideInfo: event => {
    event.path[2].setAttribute('class', 'hidden');
  },

  _loadVisual: event => {
    let data = {};
    data.cable = Number(event.path[0].getAttribute('data-cable'));
    data.position = Number(event.path[0].getAttribute('data-position'));
    event.path[1].setAttribute('class', 'hidden');
    Mavis.Pages.loadPage('inspection', data);
  },

  _events: () => {
    return new Promise((resolve, reject) => {
      document.getElementById('model').addEventListener('mousedown', Mavis.Model._onMouseInput, false);
      document.getElementById('cableInfoButton').addEventListener('mousedown', Mavis.Model._loadVisual);
      document.getElementById('cableInfoClose').addEventListener('mousedown', Mavis.Model._hideInfo);
      resolve();
    });
  },

  render: () => {
    return new Promise((resolve, reject) => {
      async function renderModel() {

        await Mavis.Model._animateEnd();
        document.getElementById('model').innerHTML = '';

        Mavis.Model._setMouse();
        Mavis.Model._setCamera();
        Mavis.Model._setScene();
        Mavis.Model._setLight();
        await Mavis.Model.Construction._init();
        Mavis.Model._setRenderer();
        Mavis.Model._setRaycaster();
        Mavis.Model._events();
        Mavis.Model._animate();
        Mavis.Model._setOrbitControls();
        resolve();
      }

      renderModel();
    });
  },

  init: () => {
    return new Promise((resolve, reject) => {

      console.log('init MODEL');

      async function initialize() {

        Mavis.LoadingScreen.message('initializing 3D Model');
        document.getElementById('content').setAttribute('data-tab', 'Model');

        Mavis.Model._render();
        await Mavis.Filter.init('Model', 'modelFilter', ['ratings', 'markers']);
        await Mavis.Model.render();
        resolve();
      }

      initialize();
    });
  }
};

module.exports = Mavis.Model;