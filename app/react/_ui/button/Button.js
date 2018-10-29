import React from 'react';
import PropTypes from 'prop-types';

export default class Button extends React.Component {

    render() {
        let {type, onClick, children, className = '', disabled = false, ...otherProps} = {...this.props},

            css = ['button', type, className].join(' ');
        return (
            <button className={css} onClick={onClick} disabled={disabled} {...otherProps}>{children}</button>
        )
    }
}

Button.propTypes = {
    id: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['confirm', 'reset', 'cancel', 'blue', 'grey', 'transparent', 'noStyle']),
    children: PropTypes.any,
    className : PropTypes.string,
    disabled: PropTypes.bool
};

Button.defaultProps = {
    type: 'confirm'
};