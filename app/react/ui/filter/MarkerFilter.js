import React from 'react';
import PropTypes from 'prop-types';
import Store from '../../Store';
import BaseFilter from './BaseFilter';
import {inject, observer} from 'mobx-react';

@inject('store')
@observer
export default class MarkerFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
        this.loadItems();
    }

    loadItems() {
        let {store} = {... this.props};
        store.stores.modules
            .find({active: true})
            .sort({name: 1})
            .then(modules => {
                let items = [{name: 'Alle Schadensfälle', value: 'all'}]
                    .concat((modules || []).map((module) => {
                        return {name: module.label, value: module.label};
                    }));
                this.setState({
                    items: items
                });
            });
    }

    render() {

        return (<BaseFilter id="marker" label="Schadensfall" items={this.state.items} onChange={this.props.onChange}/> );
    }
}

MarkerFilter.propTypes = {
    store: PropTypes.instanceOf(Store),
    onChange: PropTypes.func
};