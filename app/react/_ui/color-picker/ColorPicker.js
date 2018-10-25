import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../tooltip/Tooltip';
import TooltipContent from '../tooltip/TooltipContent';
require('expose-loader?ColorPicker!flexi-color-picker');

export default class ColorPicker extends React.Component {

    constructor(props) {
        super(props);
        this.slideRef = React.createRef();
        this.pickerRef =React.createRef();
        this.state = {
            open: false
        }
    }

    componentDidMount() {
        let picker = this.pickerRef.current,
            slide = this.slideRef.current;
        if (picker && slide) {
            window.ColorPicker(slide, picker, (hex, hsv, rgb) => this.onColorPick(hex, hsv, rgb))
        }
    }

    render() {
        let  {color} = this.props;
        return (
            <div className="colorPicker">
                <Tooltip>
                    <span className="colorPicker__color" style={{backgroundColor: color}} />
                    <TooltipContent>
                        <div className="colorPicker__layer">
                            <div className="colorPicker__picker" ref={this.pickerRef}/>
                            <div className="colorPicker__slide" ref={this.slideRef}/>
                        </div>
                    </TooltipContent>
                </Tooltip>

            </div>
        );
    }

    onColorPick(hex, hsv, rgb) {
        console.log(hex, hsv, rgb);
    }
}

ColorPicker.propTypes = {
    color: PropTypes.string,
    onChange: PropTypes.func
};