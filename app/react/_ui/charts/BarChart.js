import React from 'react';
import PropTypes from 'prop-types';
import * as Highcharts from 'highcharts';

export default class BarChart extends React.Component {

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
        let {data, label} = {...this.props},
            hasData = this.hasData();
        return (
            <div className="barCart">
                {hasData ?
                    <div id={this.getChartName()}/>
                    :
                    <section className="barCart__noResults">
                        <div className="barCart__noResults__row">
                            <h5 className="barCart__noResults__headline">{label}</h5>
                        </div>
                        <div className="barCart__noResults__row">
                            <div className="barCart__noResults__row__text">
                                Zu diesen Filtereinstellungen <br/> liegen keine Schadensfälle vor.
                            </div>
                        </div>
                    </section>
                }

            </div>
        );
    }

    hasData() {
        let {data, showNoResultsIfEveryEntryIsZero} = {...this.props};
        if (!data) {
            return false;
        }
        if (data.length === 0) {
            return false;
        }
        if (showNoResultsIfEveryEntryIsZero && data.filter(item => item.y === 0).length === data.length) {
            return false;
        }
        return true;
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
        let {label, data, axisCategories} = {...this.props},
            hasData = this.hasData();
        if (!hasData) {
            return;
        }
        Highcharts.chart(this.getChartName(), {

            chart: {

                type: 'column',
                height: 300,
                spacing: [20, 0, 0, 0],
                style: {
                    'fontFamily': '"din_light"',
                    'fontSize': '15px'
                }
            },

            credits: {
                enabled: false
            },

            title: {
                text: label,
                align: 'left',
                x: 0,
                y: 0,
                floating: false,
                margin: 20,
                style: {
                    'fontFamily': '"din_bold"',
                    'fontSize': '15px'
                }
            },

            xAxis: {
                categories: axisCategories
            },

            yAxis: {
                title: {
                    text: ''
                }
            },

            legend: {
                enabled: false
            },

            tooltip: {
                pointFormat: ''
            },

            series: [{
                dataLabels: {
                    enabled: true,
                    style: {
                        'fontFamily': '"din_light"',
                        'fontSize': '15px'
                    }
                },
                groupPadding: 0,
                pointPadding: 0,
                data: data
            }]
        });
    }
}


BarChart.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    data: PropTypes.any,
    axisCategories: PropTypes.any,
    showNoResultsIfEveryEntryIsZero: PropTypes.bool
};