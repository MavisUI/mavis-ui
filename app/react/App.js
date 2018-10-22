import React from 'react';
import Header from './header/Header';
import Store from './Store';
import {observer, Provider} from 'mobx-react';
import Loader from './loader/Loader';
import MainMenu from './main-menu/MainMenu';
import {ReportPage} from './pages/ReportPage';
import {ModelPage} from './pages/ModelPage';
import {InspectionPage} from './pages/InspectionPage';
import {SettingsPage} from './pages/SettingsPage';

@observer
export default class App extends React.Component{
    store = new Store();
    pages = [
        {title: 'Report', name: 'report'},
        {title: '3D Modell', name: 'model'},
        {title: 'Visuelle Inspektion', name: 'inspection'},
        {title: 'Einstellungen', name: 'settings'},
    ];

    componentDidMount() {
        this.setLoading(true);
        this.store
            .init()
            .then(() => {
                this.setLoading(false);
                this.loadPage('report');
            });
    }

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

    setLoading(value, message = 'Loading') {
        let s = this.store;
        s.isLoading = value;
        s.loadingMessage = message;
    }
}