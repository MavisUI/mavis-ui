import React from 'react';
import PropTypes from 'prop-types';

export default class Tab extends React.Component {
    render() {
        return (
            <div className="tab">
                {this.props.children}
            </div>
        )
    }
}

Tab.propTypes = {
    title: PropTypes.string
};