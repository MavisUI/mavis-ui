import React from 'react';
import {inject, observer} from 'mobx-react';
import Store from '../../Store';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../../_ui/icon/Icon';

@inject("store")
@observer
export default class Header extends React.Component {
    render() {
        let {store} = {... this.props},
            iconCss = classNames('header__nav__icon', {open: store.showMainMenu}),
            pageTitleCss = classNames('header__pageTitle', {hidden:  store.showMainMenu}),
            menuTitleCss = classNames('header__pageTitle', {hidden:  !store.showMainMenu});
        return (
            <header className="header">
                <div className="header__left">
                    <nav className="header__nav" onClick={this.handleNavIconClick}>
                        <div className={iconCss}>
                            <span/>
                            <span/>
                            <span/>
                            <span/>
                        </div>
                        <div  className={pageTitleCss}>{store.pageTitle}</div>
                        <div  className={menuTitleCss}>Menü</div>
                    </nav>
                </div>
                <div className="header__center">
                    <Icon name="iconLogo"/>
                </div>
                {false &&
                    <div className="header__right">
                        <button id="getHelp" className="header__help"></button>
                    </div>
                }
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