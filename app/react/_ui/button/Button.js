import React from 'react';
import PropTypes from 'prop-types';

export default class Button extends React.Component {

    render() {
        let {type, onClick, children, className = ''} = {...this.props},

            css = ['button', type, className].join(' ');
        return (
            <button className={css} onClick={onClick}>{children}</button>
        )
    }
}

Button.propTypes = {
    id: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['confirm', 'reset', 'cancel', 'blue']),
    children: PropTypes.any,
    className : PropTypes.string
};

Button.defaultProps = {
    type: 'confirm'
};