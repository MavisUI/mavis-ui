import React from 'react';
import PropTypes from 'prop-types';

export default class Icon  extends React.Component {

    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        let {name, ...otherProps} = {...this.props};
        return (
            <span className={'icon ' + name} {...otherProps}/>
        )
    }
}

Icon.propTypes = {
    name: PropTypes.string
};