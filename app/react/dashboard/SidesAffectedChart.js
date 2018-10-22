import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import Store from '../Store';
import BarChart from '../ui/charts/BarChart';

@inject('store')
@observer
export default class SidesAffectedChart extends React.Component {

    title = 'Schadensfälle nach Seilseite';

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            categories: []
        }
    }

    /**
     * Builds the chart data
     * @inheritDoc
     */
    componentDidMount() {
        this.buildChartData();
    }

    /**
     * @inheritDoc
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        let hasChanged = prevProps.criteria !== this.props.criteria || prevProps.store.stores.construction !== this.props.store.stores.construction;
        if (hasChanged) {
            this.buildChartData();
        }
    }

    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        let {data, categories} = {...this.state};

        return (
            <BarChart name="sideAffected" label={this.title} data={data} axisCategories={categories} showNoResultsIfEveryEntryIsZero={true}/>
        );
    }

    /**
     * Builds the chart data and applies it to the state.
     */
    buildChartData() {
        let {store, criteria} = {... this.props};
        store.stores.construction
            .find()
            .then(docs => {
                let data = [],
                    categories,
                    results = this.props.data || [],
                    sideNames = docs[0].meta.cableSides,
                    chartData,
                    sides = {
                        0: 0,
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0
                    };
                results.map(item => {
                    item.sides.map((side, i) => {
                        let n = side - 1;
                        sides[n] = sides[n] + 1;
                    });
                });
                chartData = sideNames.map((name, i) => {
                    return {
                        name : name,
                        color : store.paletteBlue[i],
                        y : sides[i]
                    }
                });
                categories = ['OL', 'O', 'OR', 'UL', 'U', 'UR'];
                this.setState({
                    data: chartData,
                    categories: categories
                });
            })
    }
}

SidesAffectedChart.propTypes = {
    store: PropTypes.instanceOf(Store),
    data: PropTypes.any,
    criteria: PropTypes.object
};