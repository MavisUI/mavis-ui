import React from 'react';
import PropTypes from 'prop-types';
import TooltipContent from './TooltipContent';
import classNames from 'classnames';
import clickOutside from 'react-click-outside';
export class Tooltip extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    handleClickOutside() {
        this.setState({open: false});
    }

    render() {
        let {children = []} = this.props,
            {open} = this.state,
            layerContent = children.find(child => child.type === TooltipContent) || null,
            otherContent = children.filter(child =>  child !== layerContent);
        return (
            <div className="tooltip">
                <div className="tooltip__content" onClick={() =>  this.setState({open: !open})}>{otherContent}</div>
                <div className={classNames({tooltip__layer: true, hidden: !open})}>
                    {layerContent}
                </div>
            </div>
        );

    }
}

Tooltip.propTypes = {
    children: PropTypes.any
};

export default clickOutside(Tooltip);