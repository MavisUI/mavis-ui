import React from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import Store from '../../Store';
import BarChart from '../../_ui/charts/BarChart';

@inject('store')
@observer
export default class MarkerCountChart extends React.Component {

    title = 'Schadensfälle nach Merkmal';

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            categories: []
        }
    }

    componentDidMount() {
        this.buildChartData();
    }

    componentDidUpdate(prevProps) {
        let hasChanged = prevProps.criteria !== this.props.criteria || prevProps.store.modules !== prevProps.store.modules;
        if (hasChanged) {
            this.buildChartData();
        }
    }

    render() {
        let {data, categories} = {...this.state};

        return (
            <BarChart name="markerCount" label={this.title} data={data} axisCategories={categories}/>
        );
    }

    buildChartData() {
        let {store, criteria} = {... this.props},
            c = criteria && criteria.label ? {label: criteria.label} : {};
        store.stores.modules
            .find(c)
            .then(modules => {
                let data = [],
                    categories,
                    results = this.props.data || [];
                modules.map((module, i) => {
                    let obj = {};
                    obj.label = module.label;
                    obj.color = store.paletteBlue[i];
                    obj.y = 0;
                    data.push(obj);
                });
                results.map(item => {
                    let module = data.find(i => i.label === item.label);
                    if (module) {
                        module.y += 1;
                    }
                });
                data = data.filter(d => d.y > 0);
                categories = data.map(obj => obj.label);
                this.setState({
                    data: data,
                    categories: categories
                });
            });
    }
}

MarkerCountChart.propTypes =  {
    store: PropTypes.instanceOf(Store),
    data: PropTypes.any,
    criteria: PropTypes.object
};