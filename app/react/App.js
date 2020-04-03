import React from 'react';
import Header from './_layout/header/Header';
import Store from './Store';
import {observer, Provider} from 'mobx-react';
import Loader from './_layout/loader/Loader';
import MainMenu from './_layout/main-menu/MainMenu';
import {ReportPage} from './_pages/ReportPage';
import {ModelPage} from './_pages/ModelPage';
import {InspectionPage} from './_pages/InspectionPage';
import {SettingsPage} from './_pages/SettingsPage';

@observer
export default class App extends React.Component{

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.store = new Store();
        this.pages = [
            {title: 'Report', name: 'report'},
            {title: '3D Modell', name: 'model'},
            {title: 'Visuelle Inspektion', name: 'inspection'},
            {title: 'Einstellungen', name: 'settings'},
        ];
    }

    /**
     * @inheritDoc
     */
    componentDidMount() {
        this.setLoading(true);
        this.store
            .init()
            .then(() => {
                this.setLoading(false);
                this.loadPage('report');
            });
    }

    /**
     * Provides both the App and store to all children (recursively).
     * @inheritDoc
     * @returns {*}
     */
    render() {
        return (
            <Provider store={this.store} app={this}>
                <div>
                    <Header/>
                    <div id="content">
                        {(() => {
                            switch(this.store.currentPage) {
                                case 'report':
                                    return <ReportPage/>;
                                case 'model':
                                    return <ModelPage />;
                                case 'inspection':
                                    return <InspectionPage />;
                                case 'settings':
                                    return <SettingsPage />;
                                default:
                                    return null;
                            }
                        })()}
                    </div>
                    <MainMenu items={this.pages}/>
                    <Loader isLoading={this.store.isLoading} message={this.store.message}/>
                </div>
            </Provider>
        )
    }

    /**
     * Loads the page with the given name and applies it after the given delay.
     * @param {string} name
     * @param {number} delay
     */
    loadPage(name, delay = 50) {
        let s = this.store,
            pageToLoad = this.pages.find(p => p.name === name);
        if (pageToLoad) {
            setTimeout(() => {
                s.currentPage = pageToLoad.name;
                s.pageTitle = pageToLoad.title;
                s.showMainMenu = false;
            }, delay);

        }
    }

    /**
     * Sets the isLoading flag to the given value and sets the message.
     * @param {boolean} value
     * @param {string} message
     */
    setLoading(value, message = 'Loading') {
        let s = this.store;
        s.isLoading = value;
        s.loadingMessage = message;
    }
}