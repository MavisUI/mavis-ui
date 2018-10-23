import React from 'react';
import PropTypes from 'prop-types';
import Store from '../../Store';
import CableFilter from './CableFilter';
import CableSidesFilter from './CableSidesFilter';
import RatingFilter from './RatingFilter';
import MarkerFilter from './MarkerFilter';
import SortFilter from './SortFilter';
import {inject, observer} from 'mobx-react';

@inject('store')
@observer
export default class Filter extends React.Component {

    /**
     * Initializes the state
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            criteria: {},
            order: {}
        };
    }

    /**
     * Filters the data
     * @inheritDoc
     */
    componentDidMount() {
        this.filterData();
    }

    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        let {hideCable, hideCableSides, hideRating, hideMarker, hideSort} = {...this.props};
        return (
            <div className="filterContainer">
                {hideSort ? null : <SortFilter onChange={(item) => this.updateOrder(item.value)}/>}
                {hideCable ? null : <CableFilter onChange={(item) => this.updateCriteria('cable', item.value)}/>}
                {hideCableSides ? null : <CableSidesFilter onChange={(item) => this.updateCriteria('sides', item.value)}/>}
                {hideRating ? null : <RatingFilter onChange={(item) => this.updateCriteria('rating', item.value)}/>}
                {hideMarker ? null : <MarkerFilter onChange={(item) => this.updateCriteria('label', item.value)}/>}

            </div>
        );
    }

    /**
     * Updates the criteria and filters the data.
     * @param {string} field
     * @param {string} value
     */
    updateCriteria(field, value) {

        let c = Object.assign({}, this.state.criteria);
        if (value === 'all') {
            delete c[field];
        } else {
            c[field] = value;
        }

        this.setState({ criteria: c}, () => this.filterData());

    }

    /**
     * Updates the order and filters the data.
     * @param {number} value
     */
    updateOrder(value) {
        let n = Number(value),
            order = {};
        switch (n) {
            case 0:
               order.cable = 1;
                break;
            case 1:
               order.cable = -1;
                break;
            case 2:
               order.label = 1;
                break;
            case 3:
               order.label = -1;
                break;
            case 4:
               order.position = 1;
                break;
            case 5:
               order.position = -1;
                break;
            case 6:
               order.rating = 1;
                break;
            case 7:
               order.rating = -1;
                break;
            case 8:
               order.value = 1;
                break;
            case 9:
               order.value = -1;
                break;
            default:
               order.cable = 1;
                break;
        }
        this.setState({order: order}, () =>  this.filterData());
    }

    /**
     * Filters the data result based on the criteria and sorts
     * them based on the order in the state. It triggers the onChange
     * handler given through the props.
     * @returns {Promise<any>}
     */
    filterData() {
        let {store, onChange, criteria} = {...this.props},
            s = this.state;
        store.stores.results
            .find({...criteria, ...s.criteria})
            .sort(s.order)
            .then(results => {
                if (onChange) {
                    onChange(results, s.criteria);
                }
            });
    }
}

Filter.propTypes = {
    store: PropTypes.instanceOf(Store),
    criteria: PropTypes.any,
    onChange: PropTypes.func,
    hideCable: PropTypes.bool,
    hideCableSides: PropTypes.bool,
    hideRating: PropTypes.bool,
    hideMarker: PropTypes.bool,
    hideSort: PropTypes.bool
};