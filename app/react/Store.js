import {observable} from 'mobx';
import path from 'path';
const Datastore = require( 'nedb-promises');


export default class Store {
    appPath = process.env.NODE_ENV === 'development' ? path.join(process.cwd(), "..", "app") : process.cwd();

    @observable currentPage = '';
    @observable pageTitle = '';
    @observable showMainMenu = false;
    @observable isLoading = false;
    @observable loadingMessage = '';

    paletteBlue = ['#02070C', '#08213C', '#0C3461', '#104784', '#25578F', '#3B689A', '#4A6E96', '#5179A5', '#6085AD', '#6689B0', '#718CAA', '#7C9ABB', '#87A3C1', '#92ABC7', '#99ABBF', '#A8BCD2', '#AFC2D6', '#BDCCDD', '#C0C9D3', '#D3DDE8', '#D7E0EA', '#E9EEF3'];

    @observable userState = {
        userName: null,
        userRole: null,
        bridges: [],
        activeBridge: 'rheinknie',
        activeCable: 'all',
        activePosition: 0.00
    };

    @observable stores = {
        classes: null,
        metrics: null,
        modules: null,
        construction: null,
        results: null,
        appstate: null
    };
    @observable metrics = [];
    @observable cableData = [];

    /**
     * Loads the db with the given name from the given folder.
     * @param folder
     * @param name
     * @returns {Promise<any>}
     * @private
     */
    _loadDB(folder, name) {
        return new Promise((resolve, reject) => {
            let dataPath;
            console.log('loading db', folder, name);
            if (folder === '') {
                dataPath = this.appPath + '/data/' + name + '.db';
                this.stores[name] = Datastore.create(dataPath);
                this.stores[name].load().then(resolve(name + ' data loaded'));
            } else {
                dataPath = this.appPath + '/data/' + folder + '/' + name + '.db';
                this.stores[name] = Datastore.create(dataPath);
                this.stores[name].load().then(resolve(name + ' data loaded'));
            }
        });
    }

    /**
     * Loads the user data
     * @returns {Promise<any>}
     */
    loadState() {
        return new Promise((resolve, reject) => {
            this._loadDB('', 'appstate')
                .then(() => {
                    this.stores.appstate.find({})
                        .then((docs) => {
                            this.userState.userName = docs[0].userName;
                            this.userState.userRole = docs[0].userRole;
                            this.userState.bridges = docs[0].bridges;
                            this.userState.activeBridge = docs[0].activeBridge;
                            this.userState.activeCable = docs[0].activeCable;
                            this.userState.activePosition = docs[0].activePosition;
                        })
                        .then(() => {
                            resolve('user data loaded');
                        });
                });
        });
    }


    /**
     * Loads the bridge data
     * @param bridge
     * @returns {Promise<any>}
     */
    loadBridge(bridge) {
        return new Promise((resolve, reject) => {
            if (this.userState.bridges.indexOf(bridge) >= 0) {
                Promise.all([
                    this._loadDB(bridge, 'classes'),
                    this._loadDB(bridge, 'metrics'),
                    this._loadDB(bridge, 'modules'),
                    this._loadDB(bridge, 'construction'),
                    this._loadDB(bridge, 'results')
                ]).then(() => {
                    resolve('init data');
                });
            } else {
                resolve('no user access to this bridge');
            }
        });
    }

    /**
     * Loads the metric data
     * @returns {Promise<any>}
     */
    loadMetrics() {
        return new Promise((resolve, reject) => {
            this.stores.metrics.find({})
                .sort({id: 1})
                .then(res => {
                    this.metrics = res;
                    resolve();
                });
        });
    }

    /**
     * Loads the cable data
     * @returns {Promise<any>}
     */
    loadCableData() {
        return new Promise((resolve, reject) => {
            this.stores.construction
                .find({})
                .then(construction => {
                    this.cableData = construction[0].cables;
                    resolve();
                });
        });
    }

    /**
     * Loads the data from the different dbs
     * @returns {Promise<any>}
     */
    init() {
        return new Promise((resolve, reject) => {
            let userState = this.userState,
                self = this;
            async function initialize() {
                await self.loadState();
                await self.loadBridge(userState.activeBridge);
                await self.loadMetrics();
                await self.loadCableData();
                resolve();
            }

            initialize();
        });
    }
}