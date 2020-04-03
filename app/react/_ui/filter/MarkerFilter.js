import React from 'react';
import PropTypes from 'prop-types';
import Store from '../../Store';
import BaseFilter from './BaseFilter';
import {inject, observer} from 'mobx-react';

@inject('store')
@observer
export default class MarkerFilter extends React.Component {

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
        return (<BaseFilter id="marker" label="Schadensfall" items={this.state.items} onChange={this.props.onChange}/> );
    }

    /**
     * Loads the items from the store.
     */
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
}

MarkerFilter.propTypes = {
    store: PropTypes.instanceOf(Store),
    onChange: PropTypes.func
};