import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {observer} from 'mobx-react';

@observer
export default class Loader extends React.Component{
    render() {
        let loadingClass = classNames({hidden: !this.props.isLoading}),
            spinnerClass = classNames({spinning: this.props.isLoading});

        return (
            <aside id="loading" className={loadingClass}>
                <div id="logoLoading">
                    <div className="icon iconLogo" />
                </div>
                <h1>User Interface</h1>
                <h2>Software zur visuellen Brückeninspektion</h2>
                <p>Version 2.0</p>
                <div id="spinner">
                    <div className="spinner" role="spinner">
                        <div id="spinnerElement" className={spinnerClass} />
                    </div>
                </div>
                <p id="statusText">{this.props.message}</p>
                <p id="copyright">&copy; 2018, mavis cable-services GmbH Aachen</p>
            </aside>
        )
    }
}

Loader.propTypes = {
    isLoading: PropTypes.bool,
    message: PropTypes.string
};