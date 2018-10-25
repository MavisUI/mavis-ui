import React from 'react';
import Icon from '../_ui/icon/Icon';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import Store from '../Store';
import App from '../App';
import Button from '../_ui/button/Button';

const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);
const ProjectorRenderer = require('three-projector-renderer')(THREE);

@inject('store', 'app')
@observer
export default class BridgeRenderer extends React.Component {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.animationRequestId = null;
        this.stageRef = React.createRef();
        this.cableInfoRef = React.createRef();
        this.Camera = null;
        this.CameraPosition = {
            x: 20,
            y: 20,
            z: 220
        };
        this.Scene = null;
        this.Renderer = null;
        this.Gravity = 0;
        this.View = null;
        this.Bridge = null;
        this.Labels = null;
        this.Cables = null;
        this.Orbit = null;
        this.Raycaster = null;

        this.state = {
            cableInfo: null,
            mesh: null
        }
    }

    /**
     * @inheritDoc
     */
    componentDidMount() {
        this.init();
    }

    /**
     * @inheritDoc
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        let {markers} = {...this.props};
        if (markers !== prevProps.markers) {
            this.renderCables();
            this.setCableInfo(null, null);
        }
    }

    /**
     * @inheritDoc
     */
    componentWillUnmount() {
        this.animateEnd();
    }

    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        let {cableInfo} = {...this.state};
        return (
            <div className="bridgeRenderer">
                <div className="inner">
                    <menu id="modelFilter"/>
                </div>
                <div className="bridgeRenderer__stageWrapper">
                    <div id="model"
                         className="bridgeRenderer__stage"
                         ref={this.stageRef}
                         onMouseDown={(e) => this.onMouseInput(e)}/>

                    {cableInfo &&
                    <div className="bridgeRenderer__cableInfo__pivot" ref={this.cableInfoRef}>
                        <div className="bridgeRenderer__cableInfo">
                            <a className="bridgeRenderer__cableInfo__close"
                               onClick={() => this.setCableInfo(null, null)}>
                                <Icon name={'iconCancel'}/>
                            </a>
                            <h3 className="bridgeRenderer__cableInfo__headline">
                                {cableInfo.headline}
                            </h3>
                            <label className="bridgeRenderer__cableInfo__label">
                                Seil:
                            </label>
                            <div className="bridgeRenderer__cableInfo__cable">
                                {cableInfo.cable}
                            </div>
                            <br/>
                            <label className="bridgeRenderer__cableInfo__label">
                                Position:
                            </label>
                            <div className="bridgeRenderer__cableInfo__position">
                                {cableInfo.position}
                            </div>
                            <br/>
                            <Button className="bridgeRenderer__cableInfo__button"
                                    type="blue"
                                    onClick={() => this.navigateToInspection(cableInfo.cableIndex, cableInfo.position)}>
                                Ansehen
                            </Button>
                        </div>
                    </div>
                    }
                </div>
            </div>
        )
    }

    /**
     * Event handler for the click on the stage.
     * It will cast a ray and calls "clickCallback" on the first
     * object that intersects.
     * @param e
     */
    onMouseInput(e) {
        e.preventDefault();
        let modelHeight = this.stageRef.current.clientHeight,
            modelWidth = this.stageRef.current.clientWidth,
            rect = this.stageRef.current.getBoundingClientRect(),
            pos = {
                x: ((e.clientX - rect.left) / modelWidth) * 2 - 1,
                y: -((e.clientY - rect.top) / modelHeight) * 2 + 1
            };


        // set Raycaster to listen to mouse and camera
        this.Raycaster.setFromCamera(new THREE.Vector2(pos.x, pos.y), this.Camera);

        // get intersects
        let intersects = this.Raycaster.intersectObjects(this.Scene.children, true);

        // if there are intersects
        if (intersects.length > 0) {
            let obj = intersects[0].object;

            if (obj && obj.clickCallback) {
                obj.clickCallback(obj);
            }
        }
    }

    /**
     * Sets the cable info and the corresponding marker mesh to the state.
     * @param cable
     * @param mesh
     */
    setCableInfo(cable, mesh = null) {
        this.setState({
            cableInfo: cable,
            mesh: mesh
        });
    }

    /**
     * Sets the cable index and position in the store and navigates
     * to the inspection page.
     * @param cableIndex
     * @param position
     */
    navigateToInspection(cableIndex, position) {
        let {store, app} = {...this.props};

        store.playerState.cableIndex = cableIndex;
        store.playerState.position = position;
        app.loadPage('inspection');
    }

    /**
     * Initializes the THREE js scene.
     */
    init() {
        this.initStage();
        this.initConstruction();
        this.animate();
    }

    /**
     * Initializes the stage
     */
    initStage() {
        this.setCamera();
        this.setScene();
        this.setLight();
        this.setRenderer();
        this.setRaycaster();
        this.setOrbitControls();
    }

    /**
     * Initializes the bridge.
     */
    initConstruction() {
        this.Gravity = Math.PI / 2;
        this.View = new THREE.Object3D();
        this.Bridge = new THREE.Object3D();
        this.Labels = new THREE.Object3D();
        this.Cables = new THREE.Object3D();

        this.renderFloor();
        this.renderRiver();
        this.renderSupports();
        this.renderPillars();
        this.renderDeck();
        this.renderCables();
        this.renderLabels();
        this.addScenes();
    }

    /**
     * Adds the different parts to the scene.
     */
    addScenes() {
        this.Scene.add(this.View);
        this.Scene.add(this.Bridge);
        this.Scene.add(this.Labels);
        this.Scene.add(this.Cables);
    }

    /**
     * Initializes the camera
     */
    setCamera() {
        this.Camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
        this.Camera.position.set(this.CameraPosition.x, this.CameraPosition.y, this.CameraPosition.z);
    }

    /**
     * Initializes the scene
     */
    setScene() {
        this.Scene = new THREE.Scene();
        this.Scene.background = new THREE.Color(0xffffff);
    }

    /**
     * Initializes the light.
     */
    setLight() {
        this.Light = new THREE.DirectionalLight(0xffffff, 1);
        this.Light.position.set(1, 1, 1).normalize();
        this.Scene.add(this.Light);
    }

    /**
     * Initializes the raycaster
     */
    setRaycaster() {
        this.Raycaster = new THREE.Raycaster();
    }

    /**
     * Initializes the renderer
     */
    setRenderer() {
        this.Renderer = new THREE.WebGLRenderer();
        this.Renderer.setPixelRatio(window.devicePixelRatio);
        this.Renderer.setSize(this.stageRef.current.clientWidth, this.stageRef.current.clientHeight);
        this.Renderer.setClearColor(0xd3edfa, 1);

        this.stageRef.current.appendChild(this.Renderer.domElement);
    }

    /**
     * Rendering method that will be called from requestAnimationFrame
     */
    rendering() {
        let {cableInfo, mesh} = {...this.state},
            targetPos,
            ref;
        this.Renderer.render(this.Scene, this.Camera);
        if (cableInfo && mesh && this.cableInfoRef.current) {
            ref = this.cableInfoRef.current;
            targetPos = this.project3dPosition(mesh);
            ref.style.transform = 'translateX(' +parseInt(targetPos.x) +'px) translateY(' + parseInt(targetPos.y) + 'px)';
        }
    }

    /**
     * Requests an animation frame
     */
    animate() {
        this.animationRequestId = requestAnimationFrame(() => this.animate());
        this.rendering();
    }

    /**
     * Stops the requestAnimationFrame cycle.
     */
    animateEnd() {
        cancelAnimationFrame(this.animationRequestId);
    }

    /**
     * Initializes the orbit controls.
     */
    setOrbitControls() {
        this.Orbit = new OrbitControls(this.Camera, this.Renderer.domElement);
        this.Orbit.minDistance = 10;
        this.Orbit.maxDistance = 500;
        this.Orbit.minPolarAngle = 0;
        this.Orbit.maxPolarAngle = (Math.PI / 2) - 0.1;
        this.Orbit.enableZoom = true;

        this.Orbit.addEventListener('change', () => {

            let x = (this.Camera.position.x).toFixed(2),
                y = (this.Camera.position.y).toFixed(2),
                z = (this.Camera.position.z).toFixed(2);

            this.CameraPosition.x = x;
            this.CameraPosition.y = y;
            this.CameraPosition.z = z;

            this.Renderer.render(this.Scene, this.Camera);
        });
    }


    /**
     * Renders the floor.
     */
    renderFloor() {

        let {data} = {...this.props},
            ground = data.ground,
            floorMaterial = new THREE.MeshBasicMaterial({color: ground.color, side: THREE.DoubleSide}),
            floorGeometry = new THREE.PlaneGeometry(ground.width, ground.depth, ground.height, 1),
            floor = new THREE.Mesh(floorGeometry, floorMaterial);

        floor.rotation.x = this.Gravity;
        floor.position.set(ground.x, ground.y, ground.z);
        floor.name = 'Floor';

        this.View.add(floor);
    }

    /**
     * Renders the river
     */
    renderRiver() {
        let {data} = {...this.props},
            riverData = data.river,
            riverMaterial = new THREE.MeshBasicMaterial({color: riverData.color, side: THREE.DoubleSide}),
            riverGeometry = new THREE.BoxGeometry(riverData.width, riverData.depth, riverData.height, 1),
            river = new THREE.Mesh(riverGeometry, riverMaterial);

        river.rotation.x = this.gravity;
        river.position.set(riverData.x, riverData.y, riverData.z);
        river.name = 'River';

        this.View.add(river);
    }

    /**
     * Renders the supports.
     */
    renderSupports() {

        let {data} = {...this.props},
            supportsData = data.supports;

        supportsData.forEach(el => {
            let supportMaterial = new THREE.MeshBasicMaterial({color: el.color, side: THREE.DoubleSide}),
                supportGeometry = new THREE.BoxGeometry(el.width, el.height, el.depth),
                support = new THREE.Mesh(supportGeometry, supportMaterial);

            support.position.set(el.x, el.y, el.z);
            support.name = supportsData.name;
            this.Bridge.add(support);
        });

    }

    /**
     * Renders the pillars.
     */
    renderPillars() {
        let {data} = {...this.props},
            pillarsData = data.pillars;

        pillarsData.forEach((el, i) => {
            let pillarMaterial = new THREE.MeshBasicMaterial({color: el.color, side: THREE.DoubleSide}),
                pillarGeometry = new THREE.BoxGeometry(el.width, el.height, el.depth),
                pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);

            pillar.name = 'Pillar-' + i;
            pillar.position.set(el.x, el.y, el.z);
            this.Bridge.add(pillar);
        });
    }

    /**
     * Renders the deck.
     */
    renderDeck() {
        let {data} = {...this.props},
            deckData = data.deck,
            deckMaterial = new THREE.MeshBasicMaterial({color: deckData.color, side: THREE.DoubleSide}),
            deckGeometry = new THREE.BoxGeometry(deckData.width, deckData.height, deckData.depth),
            deck = new THREE.Mesh(deckGeometry, deckMaterial);

        deck.position.set(deckData.x, deckData.y, deckData.z);
        deck.name = 'Deck';
        this.Bridge.add(deck);
    }

    /**
     * Renders the cables and their corresponding markers.
     */
    renderCables() {
        let {data, markers} = {...this.props},
            cablesData = data.cables || [],
            deg = Math.PI / 180;

        this.clearThreeObject(this.Cables);

        cablesData.map((cable, i) => {
            let cableGeometry = new THREE.CylinderGeometry(cable.diameter, cable.diameter, cable.length),
                cableMaterial = new THREE.MeshBasicMaterial({color: cable.color}),
                cableMesh = new THREE.Mesh(cableGeometry, cableMaterial),
                cableDiameter = cable.diameter,
                cableLength = cable.length,
                cableIndex = i;

            cableMesh.position.set(cable.x, cable.y, cable.z);
            cableMesh.rotation.x = cable.rotateX * deg;
            cableMesh.rotation.y = cable.rotateY * deg;
            cableMesh.rotation.z = cable.rotateZ * deg;
            cableMesh.name = cable.name;

            (markers || []).map(marker => {
                if (marker.cable === i) {
                    let markerMesh = this.generateMarkerMesh(cableDiameter, marker.distance, marker.color, marker.position, cableLength, cableIndex, marker.label);
                    markerMesh.clickCallback = (self) => {
                        this.setCableInfo({
                            headline: marker.label,
                            cable: cable.name,
                            position: marker.position,
                            cableIndex: cable.index
                        }, markerMesh);
                    };
                    cableMesh.add(markerMesh);
                }
            });
            this.Cables.add(cableMesh);
        });
    }

    /**
     * Renders the labels (directions at the end of the bridge)
     */
    renderLabels() {
        function makeText(message, parameters) {

            if (parameters === undefined) parameters = {};

            let fontface = parameters.hasOwnProperty('fontface') ? parameters.fontface : 'din_light',
                fontsize = parameters.hasOwnProperty('fontsize') ? parameters.fontsize : 15,
                borderThickness = parameters.hasOwnProperty('borderThickness') ? parameters.borderThickness : 10,
                canvas = document.createElement('canvas'),
                context = canvas.getContext('2d');

            context.font = 'Bold ' + fontsize + 'px ' + fontface;
            context.rotate(parameters.rotation * Math.PI / 180);

            context.fillStyle = 'rgba(0, 0, 0, 1)';
            context.fillText(message, borderThickness, fontsize + borderThickness);

            let texture = new THREE.Texture(canvas);

            texture.needsUpdate = true;

            let spriteMaterial = new THREE.SpriteMaterial({map: texture}),
                sprite = new THREE.Sprite(spriteMaterial);

            sprite.scale.set(100, 50, 2.0);

            return sprite;
        }

        let {data} = {...this.props},
            labelsData = data.labels;

        labelsData.forEach((el) => {

            let sprite = makeText(el.text, {fontface: 'din_light', fontsize: el.fontsize, rotation: el.rotation});
            sprite.position.set(el.x, el.y, el.z);
            this.Labels.add(sprite);
        });
    }


    /// UTILS

    /**
     * Creates the mesh for a marker
     * @param cableDiameter
     * @param distance
     * @param color
     * @param position
     * @param cableLength
     * @param cableIndex
     * @param label
     * @returns {Mesh}
     */
    generateMarkerMesh(cableDiameter, distance, color, position, cableLength, cableIndex, label) {

        if (distance === 0) distance = 0.5;

        let diameter = cableDiameter + 0.01,
            geometry = new THREE.CylinderGeometry(diameter, diameter, distance),
            material = new THREE.MeshBasicMaterial({color: color}),
            mesh = new THREE.Mesh(geometry, material),
            x = position - (cableLength / 2) + 6.1;

        mesh.position.set(0, x, 0);
        mesh.name = 'marker(' + cableIndex + ')[' + position + ']{' + label + '}';
        // mesh.name = 'Marker';

        return (mesh);
    }

    /**
     * Removes all children from the given THREE js object.
     * @param obj
     */
    clearThreeObject(obj) {
        if (obj) {
            while (obj.children.length > 0) {
                obj.remove(obj.children[0]);
            }
        }
    }

    /**
     * Returns the 2d coordinates of the given THREE js object.
     * @param obj
     * @returns {Vector3}
     */
    project3dPosition(obj) {
        let stage = this.stageRef.current,
            vector = new THREE.Vector3(),
            width,
            height,
            widthHalf,
            heightHalf;
        vector.setFromMatrixPosition(obj.matrixWorld);
        vector.project(this.Camera);
        width = stage.clientWidth;
        height = stage.clientHeight;
        widthHalf = width / 2;
        heightHalf = height / 2;
        vector.x = ( vector.x * widthHalf ) + widthHalf;
        vector.y = -( vector.y * heightHalf ) + heightHalf;
        return vector;
    }
}

BridgeRenderer.propTypes = {
    store: PropTypes.instanceOf(Store),
    app: PropTypes.instanceOf(App),
    markers: PropTypes.any,
    data: PropTypes.any,
};
