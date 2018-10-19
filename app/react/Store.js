import {observable} from 'mobx';
import path from 'path';
const Datastore = require( 'nedb-promises');


export default class Store {
    appPath = process.env.NODE_ENV === 'development' ? path.join(process.cwd(), "..", "app") : process.cwd();

    @observable currentPage = 'report';
    @observable pageTitle = 'Report';
    @observable showMainMenu = false;
    @observable isLoading = false;
    @observable loadingMessage = '';

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

    loadState() {
        return new Promise((resolve, reject) => {
            this._loadDB('', 'appstate')
                .then(() => {
                    console.log(this.stores.appstate)
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