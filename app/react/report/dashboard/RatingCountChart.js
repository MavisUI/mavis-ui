import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import Store from '../../Store';
import BarChart from '../../_ui/charts/BarChart';

@inject('store')
@observer
export default class RatingCountChart extends React.Component {

    title = 'Schadensfälle nach Schadensklasse';

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
        let hasChanged = prevProps.criteria !== this.props.criteria || prevProps.store.modules !== this.props.store.modules;
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
            <BarChart name="ratingCount" label={this.title} data={data} axisCategories={categories} showNoResultsIfEveryEntryIsZero={true}/>
        );
    }

    /**
     * Builds the chart data and applies it to the state.
     * @inheritDoc
     */
    buildChartData() {
        let {store, data} = {...this.props},
            chartData,
            categories,
            ratings = {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0
            };
        (data || []).map(item => {
            ratings[item.rating] = ratings[item.rating] + 1;
        });
        categories = ['SK0', 'SK1', 'SK2', 'SK3', 'SK4', 'SK5'];
        chartData = categories.map((c, i) => {
            return {
                name : c,
                color : store.paletteBlue[i],
                y : ratings[i]
            }
        });
        this.setState({
            data: chartData,
            categories: categories
        });

    }
}

RatingCountChart.propTypes = {
    store: PropTypes.instanceOf(Store),
    data: PropTypes.any,
    criteria: PropTypes.object
};