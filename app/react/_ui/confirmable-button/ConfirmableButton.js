import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button';
import Tooltip from '../tooltip/Tooltip';
import TooltipContent from '../tooltip/TooltipContent';
import Icon from '../icon/Icon';
import {NotificationMessages} from '../notification/Notification';
import Notification from '../notification/Notification';

export default class ConfirmableButton extends React.Component {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.tooltipRef = null;
        this.state = {
            showNotification: false,
            message: NotificationMessages.WARNING_DATA_WILL_BE_DELETED
        };
    }

    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        //onClick is here to actually remove it from the given props, that are passed to the button
        let {onClick, children = null, disabled,  showDeleteWarning, ...otherProps} = {...this.props},
            {showNotification, message} = {...this.state};
        return (
            <Tooltip wrappedRef={(instance) => this.tooltipRef = instance} viewOnly={disabled}>
                <Button disabled={disabled} {...otherProps} onClick={(e) => this.onClickButton(e)}>{children}</Button>
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
                {showDeleteWarning &&
                    <Notification message={message} show={showNotification} onClick={() => this.onCloseNotification()}/>
                }
            </Tooltip>
        );
    }

    /**
     * Event handler when the user clicks the confirm button.
     */
    onConfirm() {
        let {onClick} = {...this.props};
        onClick();
        this.closeTooltip();
    }

    /**
     * Event handler when the user clicks the cancel button
     */
    onCancel() {
        this.closeTooltip();
    }

    /**
     * Event handler for the button click
     */
    onClickButton(e) {
        let {showDeleteWarning} = {...this.props};
        if (showDeleteWarning) {
            //we prevent the default behaviour of opening the tooltip and display the
            //notification instead. After the user closes the notification the tooltip with
            //the confirm and cancel buttons will be opened.
            e.stopPropagation();
            this.setState({
                showNotification: true
            });
        }
    }

    /**
     * Event handle when the user click the button in the notification.
     * open the tooltip afterwards.
     */
    onCloseNotification() {
        this.setState({
            showNotification: false
        }, () => {
            this.openTooltip();
        });
    }

    /**
     * Closes the tooltip
     */
    closeTooltip() {
        if (this.tooltipRef) {
            this.tooltipRef.close();
        }
    }

    /**
     * Opens the tooltip
     */
    openTooltip() {
        if (this.tooltipRef) {
            this.tooltipRef.open();
        }
    }
}

ConfirmableButton.propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    showDeleteWarning: PropTypes.bool
};

ConfirmableButton.defaultProps = {
    onClick: () => {
    },
    showDeleteWarning: false
};