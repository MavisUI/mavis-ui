import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../tooltip/Tooltip';
import TooltipContent from '../tooltip/TooltipContent';
import Icon from '../icon/Icon';
import Button from '../button/Button';
import classNames from 'classnames';

require('expose-loader?ColorPicker!flexi-color-picker');

export default class ColorPicker extends React.Component {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.slideRef = React.createRef();
        this.pickerRef = React.createRef();
        this.tooltipRef = null;
        this.state = {
            open: false,
            currentColor: props.color
        }
    }

    /**
     * Updates the state color if the given color has changed.
     * @inheritDoc
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        let {color} = {...this.props};
        if (color !== prevProps.color) {
            this.setState({
                currentColor: color
            });
        }
    }

    /**
     * Mounts the color picker if the dom element is present.
     * @inheritDoc
     */
    componentDidMount() {
        let picker = this.pickerRef.current,
            slide = this.slideRef.current;
        if (picker && slide) {
            window.ColorPicker(slide, picker, (hex, hsv, rgb) => this.onColorPick(hex, hsv, rgb))
        }
    }

    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        let {color, viewOnly} = {...this.props},
            {currentColor} = {...this.state},
            css = classNames({colorPicker: true, viewOnly: viewOnly});
        return (
            <div className={css}>
                <Tooltip viewOnly={viewOnly} wrappedRef={(instance) => this.tooltipRef = instance} onClosedOutside={() => this.onCancel()}>
                    <span className="colorPicker__color" style={{backgroundColor: currentColor}}/>
                    <TooltipContent>
                        <div className="colorPicker__layer">
                            <div className="colorPicker__pickerContainer">
                                <div className="colorPicker__picker" ref={this.pickerRef}/>
                                <div className="colorPicker__slide" ref={this.slideRef}/>
                            </div>
                            <div className="colorPicker__layer__buttons">
                                <Button onClick={() => this.onCancel()}
                                        type="noStyle"
                                        className="colorPicker__cancel">
                                    <Icon name="iconCancel"/>
                                </Button>
                                <Button onClick={() => this.onConfirm()}
                                        type="noStyle"
                                        className="colorPicker__confirm">
                                    <Icon name="iconConfirm"/>
                                </Button>
                            </div>
                        </div>
                    </TooltipContent>
                </Tooltip>

            </div>
        );
    }

    /**
     * Event handler that will be applied to the color picker.
     * @param hex
     * @param hsv
     * @param rgb
     */
    onColorPick(hex, hsv, rgb) {
        this.setState({
            currentColor: hex
        });
    }

    /**
     * Triggers the onChange prop when the user confirms his selection.
     */
    onConfirm() {
        let {onChange} = {...this.props};
        if (onChange) {
            onChange(this.state.currentColor);
        }
        this.closeTooltip();
    }

    /**
     * Resets the selected color and closes the color picker (that is in the tooltip).
     */
    onCancel() {
        this.setState({currentColor: this.props.color});
        this.closeTooltip();
    }

    /**
     * Closes the tooltip
     */
    closeTooltip() {
        if (this.tooltipRef) {
            this.tooltipRef.close();
        }
    }
}

ColorPicker.propTypes = {
    color: PropTypes.string,
    onChange: PropTypes.func,
    viewOnly: PropTypes.bool,
};

ColorPicker.defaultProps = {
    viewOnly: false,
    onChange: () => {}
};