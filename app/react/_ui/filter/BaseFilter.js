import React from 'react';
import PropTypes from 'prop-types';

export default class BaseFilter extends React.Component {

    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        let {id, label, items, selectedValue} = {...this.props};
        return (
            <div className="filter">
                <label htmlFor={id}>{label}: </label>
                <select id={id} onChange={(event) => this.onChange(event)} value={selectedValue}>
                    {items.map((item, i) => <option key={item.value}
                                                    value={item.value}>{item.name}</option>)}
                </select>
            </div>
        );
    }

    /**
     * Change event handler for the drop down.
     * @param event
     */
    onChange(event) {
        let changeHandler = this.props.onChange,
            value = event.target.value,
            item = (this.props.items || []).find(item => ('' + item.value) === value); // cast item value as string because the select returns a string
        if (changeHandler) {
            changeHandler(item);
        }
    }

}

BaseFilter.propTypes = {
    id: PropTypes.string,
    selectedValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    label: PropTypes.string,
    onChange: PropTypes.func,
    items: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    }))
};