import React from 'react';
import PropTypes from 'prop-types';
import TooltipContent from './TooltipContent';
import classNames from 'classnames';
import clickOutside from 'react-click-outside';
class Tooltip extends React.Component {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        let {children = [], viewOnly} = {...this.props},
            {open} = {...this.state},
            layerContent = children.find(child => child.type === TooltipContent) || null,
            otherContent = children.filter(child =>  child !== layerContent),
            css = classNames({tooltip: true, viewOnly: viewOnly});
        return (
            <div className={css}>
                <div className="tooltip__content" onClick={() =>  this.toggle()}>{otherContent}</div>
                <div className={classNames({tooltip__layer: true, hidden: !open})}>
                    {layerContent}
                </div>
            </div>
        );
    }

    toggle() {
        let {open} = {...this.state};
        open ? this.close(): this.open();
    }

    /**
     * Opens the tooltip layer
     */
    open() {
        let {viewOnly} = {...this.props};
        if (viewOnly) {
            return;
        }
        console.log('tooltip open');

        this.setState({
            open: true
        });
    }

    /**
     * Closes the tooltip layer.
     */
    close() {
        this.setState({
            open: false
        });
    }

    /**
     * Event handler for the click outside event triggered by the higher order component.
     */
    handleClickOutside() {
        let {onClosedOutside} = {...this.props};
        if (this.state.open) {
            this.close();
            onClosedOutside();
        }
    }
}

Tooltip.propTypes = {
    children: PropTypes.any,
    viewOnly: PropTypes.bool,
    onClosedOutside: PropTypes.func,
    wrappedRef: PropTypes.func
};

Tooltip.defaultProps = {
    onClosedOutside: () => {}
};

export default clickOutside(Tooltip);