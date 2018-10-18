import React from 'react';
import {inject, observer} from 'mobx-react';
import Store from '../Store';
import PropTypes from 'prop-types';
import classNames from 'classnames';

@inject("store")
@observer
export default class Header extends React.Component {
    render() {
        let {store} = {... this.props},
            iconCss = classNames({open: store.showMainMenu}),
            pageTitleCss = classNames({hidden:  store.showMainMenu}),
            menuTitleCss = classNames({hidden:  !store.showMainMenu});
        return (
            <header>
                <div className="inner">
                    <div className="left">
                        <nav id="mainMenuToggle" onClick={this.handleNavIconClick}>
                            <div id="navIcon" className={iconCss}>
                                <span/>
                                <span/>
                                <span/>
                                <span/>
                            </div>
                            <div id="pageTitle" className={pageTitleCss}>{store.pageTitle}</div>
                            <div id="menuTitle" className={menuTitleCss}>Menü</div>
                        </nav>
                    </div>
                    <div className="center">
                        <div className="icon iconLogo"/>
                        </div>
                        <div className="right">
                        <button id="getHelp">? Hilfe</button>
                    </div>
                </div>
            </header>
        )
    }

    handleNavIconClick = () => {
        let {store} = {...this.props};
        return store.showMainMenu = !store.showMainMenu;

    }
}

Header.propTypes =  {
    store: PropTypes.instanceOf(Store)
};