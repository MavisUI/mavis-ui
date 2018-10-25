import React from 'react';
import PropTypes from 'prop-types';
export default class TooltipContent extends React.Component{
    render() {
        let {children} = this.props;
        return children;
    }
}

TooltipContent.propTypes = {
    children: PropTypes.any
};