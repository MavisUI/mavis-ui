import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../_ui/icon/Icon';

var Highcharts = require('highcharts');
require('highcharts/modules/xrange')(Highcharts);

export default class PlayerGraph extends React.Component {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
        this.chartData = null;
        this.currentZoom = 1;
    }

    /**
     * Updates the chart data and/or line position based on the changed props.
     * @inheritDoc
     */
    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.chartData = null;
            this.applyChart();
        }
        if (this.props.position !== prevProps.position) {
            this.plotLine(this.props.position);
        }
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
            <div id="chart" className="playerGraph">
                <div id="markerZoom">
                    <button id="markerZoomIn" onClick={() => this.zoomIn()}>+</button>
                    <button id="markerZoomOut" onClick={() => this.zoomOut()}>-</button>
                    <button id="markerZoomReset" onClick={() => this.zoomReset()}>
                        <Icon name={'iconRefresh'}/>
                    </button>
                </div>
                <div id="chartsmarker" className="playerGraph__chart" ref={this.chartRef}/>
            </div>
        )
    }

    /**
     * Draws the line on the chart at the given position
     * @param {number} position
     */
    plotLine(position) {
        let lineId = 'chartsmarkerPlotLine',
            chart = this.getChartReference();
        chart.xAxis[0].removePlotLine(lineId);
        chart.xAxis[0].addPlotLine({
            value: position,
            color: '#000000',
            width: 2,
            dashStyle: 'ShortDot',
            id: lineId
        });
    }

    /**
     * Applies the zoom to the chart.
     */
    doZoom() {
        let {maxLength, position} = {...this.props},
            chart = this.getChartReference(),
            max = maxLength,
            r = (max / this.currentZoom).toFixed(2),
            zoomRange = Number(r),
            h = (zoomRange / 2).toFixed(2),
            halfRange = Number(h),
            endBuffer = max - zoomRange,
            zoomStart, zoomEnd;
        if (position < halfRange) {
            zoomStart = 0;
            zoomEnd = zoomRange;
        } else if (position > endBuffer) {
            zoomStart = endBuffer;
            zoomEnd = max;
        } else {
            zoomStart = position - halfRange;
            zoomEnd = position + halfRange;
        }
        chart.xAxis[0].setExtremes(zoomStart, zoomEnd);
    }

    /**
     * Zooms in, the amount is based on the props.
     */
    zoomIn() {
        let {maxZoom, zoomStep} = {...this.props};
        if (this.currentZoom < maxZoom) {
            this.currentZoom += zoomStep;
            this.doZoom();
        }
    }

    /**
     * Zooms out, the amount is based on the props.
     */
    zoomOut() {
        let {zoomStep} = {...this.props};
        if (this.currentZoom > 1) {
            this.currentZoom -= zoomStep;
            this.doZoom();
        }
    }

    /**
     * Resets the zoom
     */
    zoomReset() {
        this.currentZoom = 1;
        this.doZoom();
    }

    /**
     * Builds the cart data, that can be passed to highcarts.
     * @returns {object}
     */
    buildChartData() {
        let {data} = {...this.props},
            chartData,
            cases = [],
            categories = [],
            returnData = {};
        if (this.chartData) {
            return this.chartData;
        }


        chartData = (data || []).map((item, i) => {
            let start = Number(item.position).toFixed(2),
                dur = Number(item.position + item.distance).toFixed(2);
            if (start === dur) {
                dur = Number(start) + .4;
            }
            let el = {};
            el.id = item._id;
            el.cable = item.cable;
            el.caption = item.caption;
            el.case = item.case;
            el.color = item.color;
            el.distance = item.distance;
            el.images = item.images;
            el.label = item.label;
            el.metric = item.metric;
            el.rating = item.rating;
            el.sides = item.sides;
            el.value = item.value;
            el.x = Number(start);
            el.x2 = Number(dur);
            el.y = item.case;
            el.partialFill = 1;
            el.zdf = el.x;
            if (cases.indexOf(item.case) < 0) {
                cases.push(item.case);
            }
            if (categories.indexOf(item.label) < 0) {
                categories.push(item.label);
            }
            return el;
        });
        chartData.forEach((element, index) => {
            element.y = cases.indexOf(element.y);
        });
        returnData.data = chartData;
        returnData.categories = categories;
        return this.chartData = returnData;
    }

    /**
     * Applies highcharts to the DOM element with the current data.
     */
    applyChart() {
        let {maxLength, onChangePosition, onEditMarker, position} = {...this.props},
            data = this.buildChartData(),
            self = this;
        Highcharts.chart('chartsmarker', {
            chart: {
                type: 'xrange',
                height: 220,
                zoomType: 'none',
                backgroundColor: 'transparent',
                style: {'fontFamily': '"din_light"', 'fontSize': '15px'},
                panning: true,
                panKey: 'shift',
                events: {
                    click: (e) => {
                        let pos = (e.xAxis[0].value).toFixed(2),
                            position = Number(pos);
                        onChangePosition(position);
                        this.doZoom();
                    },
                    load: () => {
                        this.plotLine(position)
                    }
                }
            },
            series: [
                {
                    data: data.data,
                    xrange: {
                        label: {
                            enabled: false
                        }
                    },
                    pointWidth: 10,
                    dataLabels: {
                        enabled: false
                    },
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                let commentData = {};

                                commentData.id = this.id;
                                commentData.cable = this.cable;
                                commentData.caption = this.caption;
                                commentData.case = this.case;
                                commentData.color = this.color;
                                commentData.distance = this.distance;
                                commentData.label = this.label;
                                commentData.rating = this.rating;
                                commentData.metric = this.metric;
                                commentData.value = this.value;
                                commentData.position = this.x;
                                commentData.sides = this.sides;
                                onEditMarker(commentData);
                            }
                        }
                    }
                }
            ],
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            legend: {
                enabled: false,
                title: {
                    text: ''
                }
            },
            tooltip: {
                headerFormat: '<p>Position: <b>{point.point.x}</b> m</p><br />',
                pointFormat: '<p>Merkmal: <b>{point.label}</b></p>',
                footerFormat: '',
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderRadius: 0,
                borderWidth: 1,
                hideDelay: 0,
                padding: 15,
                shadow: false,
                style: {
                    fontFamily: '"din_light"'
                }
            },
            data: {
                decimalPoint: ','
            },
            xAxis: {
                type: 'linear',
                min: 0,
                max: maxLength,
                labels: {
                    enabled: true
                },
                title: {
                    text: ''
                }
            },
            yAxis: {
                categories: data.categories,
                reversed: true,
                gridLineWidth: 0,
                title: {
                    text: ''
                },
                labels: {
                    enabled: true
                }
            }
        });
    }

    /**
     * Returns a reference to the hightcarts chart reference.
     * @returns {Highcharts.Chart}
     */
    getChartReference() {
        let chartContainer = this.chartRef.current;
        return Highcharts.charts[Highcharts.attr(chartContainer, 'data-highcharts-chart')];
    }
}

PlayerGraph.propTypes = {
    data: PropTypes.any,
    position: PropTypes.number,
    maxLength: PropTypes.number,
    maxZoom: PropTypes.number,
    zoomStep: PropTypes.number,
    onChangePosition: PropTypes.func,
    onEditMarker: PropTypes.func
};

PlayerGraph.defaultProps = {
    onChangePosition: () => {
    },
    onEditMarker: () => {
    },
    maxZoom: 100,
    zoomStep: 10,
};