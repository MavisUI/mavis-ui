import React from 'react';
import PropTypes from 'prop-types';
import Store from '../../Store';
import BaseFilter from './BaseFilter';
import {inject, observer} from 'mobx-react';

@inject('store')
@observer
export default class SortFilter extends React.Component {
    items = [
        {value: '0', name: 'Seil aufsteigend'},
        {value: '1', name: 'Seil absteigend'},
        {value: '2', name: 'Schadensfall A-Z'},
        {value: '3', name: 'Schadensfall Z-A'},
        {value: '4', name: 'Position aufsteigend'},
        {value: '5', name: 'Position absteigend'},
        {value: '6', name: 'Schadensklasse aufsteigend'},
        {value: '7', name: 'Schadensklasse absteigend'},
        {value: '8', name: 'Wert aufsteigend'},
        {value: '9', name: 'Wert absteigend'},
    ];


    render() {

        return (<BaseFilter id="sort" label="Sortierung" items={this.items} onChange={this.props.onChange}/>);
    }
}

SortFilter.propTypes = {
    store: PropTypes.instanceOf(Store),
    onChange: PropTypes.func
};