import React from 'react';
import PropTypes from 'prop-types';
import * as Highcharts from 'highcharts';

export default class PieChart extends React.Component {

    /**
     * @inheritDoc
     */
    componentDidUpdate() {
        this.applyChart();
    }

    /**
     * @inheritDoc
     */
    componentDidMount() {
        this.applyChart();
    }

    /**
     * @inheritDoc
     * @returns {*}
     */
    render() {
        return (
            <div id={this.getChartName()}/>
        )
    }

    /**
     * Returns the chart name
     * @returns {string}
     */
    getChartName() {
        let {name} = {...this.props};
        return 'chart_' + name;
    }

    /**
     * Applies the chart to the dom node.
     */
    applyChart() {
        let {label, data, axisCategories} = {...this.props};
        Highcharts.chart(this.getChartName(), {
            chart: {
                type: 'pie'
            },

            plotOptions: {
                pie: {
                    shadow: false,
                    center: ['50%', '50%']
                }
            },

            series: [{
                name: 'Browsers',
                data: data,
                size: '60%',
                dataLabels: {
                    formatter: function () {
                        return this.y > 5 ? this.point.name : null;
                    },
                    color: '#ffffff',
                    distance: -30
                }
            }]
        });
    }
}


BarChart.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    data: PropTypes.any,
    axisCategories: PropTypes.any
};