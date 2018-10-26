import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button';
import Tooltip from '../tooltip/Tooltip';
import TooltipContent from '../tooltip/TooltipContent';
import Icon from '../icon/Icon';

export default class ConfirmableButton extends React.Component {

    constructor(props) {
        super(props);
        this.tooltipRef = null;
    }

    render() {
        //onClick is here to actually remove it from the given props, that are passed to the button
        let {onClick, children = null, disabled, ...otherProps} = {...this.props};
        return (
            <Tooltip wrappedRef={(instance) => this.tooltipRef = instance} viewOnly={disabled}>
                <Button disabled={disabled} {...otherProps} >{children}</Button>
                <TooltipContent>
                    <div className="confirmableButton__buttons">
                        <Button onClick={() => this.onCancel()}
                                type="noStyle"
                                className="confirmableButton__cancel">
                            <Icon name="iconCancel"/>
                        </Button>
                        <Button onClick={() => this.onConfirm()}
                                type="noStyle"
                                className="confirmableButton__confirm">
                            <Icon name="iconConfirm"/>
                        </Button>
                    </div>
                </TooltipContent>
            </Tooltip>
        );
    }

    onConfirm() {
        let {onClick} = {...this.props};
        console.log('onConfirm', this.tooltipRef, this);
        onClick();
        this.closeTooltip();
    }

    onCancel() {
        console.log('onCancel', this.tooltipRef, this);
        this.closeTooltip();
    }

    closeTooltip() {
        if (this.tooltipRef) {
            this.tooltipRef.close();
        }
    }
}

ConfirmableButton.propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool
};

ConfirmableButton.defaultProps = {
    onClick: () => {
    },
};