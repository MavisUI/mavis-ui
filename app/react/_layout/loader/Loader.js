import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {observer} from 'mobx-react';
import Icon from '../../_ui/icon/Icon';

@observer
export default class Loader extends React.Component{
    render() {
        let loadingClass = classNames('loader', {hidden: !this.props.isLoading}),
            spinnerClass = classNames('loader__spinner__element', {spinning: this.props.isLoading});

        return (
            <aside className={loadingClass}>
                <div className="loader__logo">
                    <Icon name="iconLogo" />
                </div>
                <h1 className="loader__headline">User Interface</h1>
                <h2 className="loader__subline">Software zur visuellen Brückeninspektion</h2>
                <p>Version 2.0</p>
                <div id="spinner" className="loader__spinnerWrapper">
                    <div className="loader__spinner" role="spinner">
                        <div className={spinnerClass} />
                    </div>
                </div>
                <p className="loader__statusText">{this.props.message}</p>
                <p className="loader__copyright">&copy; 2018, mavis cable-services GmbH Aachen</p>
            </aside>
        )
    }
}

Loader.propTypes = {
    isLoading: PropTypes.bool,
    message: PropTypes.string
};