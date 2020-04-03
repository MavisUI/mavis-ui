import React from 'react';
import PropTypes from 'prop-types';
import Store from '../../Store';
import BaseFilter from './BaseFilter';
import {inject, observer} from 'mobx-react';

@inject('store')
@observer
export default class RatingFilter extends React.Component {

    /**
     * Constructor
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
     * @inheritDoc
     * @returns {*}
     */
    render() {
        return (<BaseFilter id="rating" label="Schadensklasse" items={this.state.items} onChange={this.props.onChange}/> );
    }

    /**
     * Loads the items from the store.
     */
    loadItems() {
        let {store} = {... this.props};
        store.stores.classes
            .find({})
            .sort({id: 1})
            .then(classes => {
                let items = [{name: 'Alle Schadensklassen', value: 'all'}]
                    .concat((classes || []).map((c) => {
                        return {name: c.name, value: c.id};
                    }));
                this.setState({
                    items: items
                });
            });
    }
}

RatingFilter.propTypes = {
    store: PropTypes.instanceOf(Store),
    onChange: PropTypes.func
};