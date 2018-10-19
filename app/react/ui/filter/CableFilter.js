import React from 'react';
import PropTypes from 'prop-types';
import Store from '../../Store';
import BaseFilter from './BaseFilter';
import {inject, observer} from 'mobx-react';

@inject('store')
@observer
export default class CableFilter extends React.Component {

    /**
     * Loads the items from the store and initializes the state.
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
        this.loadItems();
    }

    /**
     * Retrieves the items for the filter from the db
     */
    loadItems() {
        let {store} = {... this.props};
        store.stores.construction
            .find({})
            .sort({id: 1})
            .then(construction => {
                let items = [{name: 'Alle Seile', value: 'all'}]
                    .concat((construction[0].cables || []).map(cable => {
                        return {name: cable.name, value: cable.index};
                    }));
                this.setState({
                    items: items
                });
            });
    }

    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        return (<BaseFilter  id="cable" label="Seil" items={this.state.items} onChange={this.props.onChange}/> );
    }
}

CableFilter.propTypes = {
    store: PropTypes.instanceOf(Store),
    onChange: PropTypes.func
};