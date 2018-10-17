import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import Store from '../Store';
import App from '../App';

@inject("store", "app")
@observer
export default class MainMenu extends React.Component {

    render() {
        let css = classNames({hidden : !this.props.store.showMainMenu}),
            items = this.props.items;
        return (
            <menu id="mainMenu" className={css}>
                <div className="inner">
                    <button id="mainMenuClose" onClick={() => this.onMenuClose()}>
                        <div className="icon iconCancel" />
                        <span>Menü schließen</span>
                    </button>
                    <div id="mainMenuLinks">
                        {items.map((item, i) => <a key={i} onClick={() => this.onPageChange(item)}>{item.title}</a>)}
                    </div>
                </div>
            </menu>
        );
    }

    onMenuClose() {
        let {store} =  {...this.props};
        store.showMainMenu = false;
    };

    onPageChange(page) {
        let {app} =  {...this.props};
        app.loadPage(page.name);
    };
}

MainMenu.propTypes = {
    store: PropTypes.instanceOf(Store),
    app: PropTypes.instanceOf(App),
    items: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        name: PropTypes.string
    }))
};