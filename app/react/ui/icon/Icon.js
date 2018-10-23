import React from 'react';
import PropTypes from 'prop-types';

export default class Icon  extends React.Component {
    render() {
        let {name, ...otherProps} = {...this.props};
        return (
            <span className={'icon ' + name} {...otherProps}></span>
        )
    }
}

Icon.propTypes = {
    name: PropTypes.string
};