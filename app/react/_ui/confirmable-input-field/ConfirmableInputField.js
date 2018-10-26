import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button';
import Icon from '../icon/Icon';

export default class ConfirmableInputField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        }
    }

    componentDidUpdate(prevProps) {
        let {value} = {...this.props};
        if (value !== prevProps.value) {
            this.setState({
                value: value
            });
        }
    }

    render() {
        let {onChange, ...otherProps} = {...this.props},
            {value} = {...this.state};
        return (
            <div className="confirmableInputField">
                <input onChange={(e) => this.onChange(e.target.value)} {...otherProps} value={value} />
                {this.isDirty &&
                    <div className="confirmableInputField__buttons">
                        <Button onClick={() => this.onCancel()}
                                type="noStyle"
                                className="confirmableInputField__cancel">
                            <Icon name="iconCancel"/>
                        </Button>
                        <Button onClick={() => this.onConfirm()}
                                type="noStyle"
                                className="confirmableInputField__confirm">
                            <Icon name="iconConfirm"/>
                        </Button>
                    </div>
                }
            </div>
            )

    }

    onChange(value) {
        this.setState({
            value: value
        });
    }

    onConfirm() {
        let {onChange} = {...this.props};
        onChange(this.state.value);
    }

    onCancel() {
        this.setState({
            value: this.props.value
        });
    }

    get isDirty() {
        return this.state.value !== this.props.value;
    }
}

ConfirmableInputField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
};
ConfirmableInputField.defaultProps = {
    onChange: () => {
    },
};