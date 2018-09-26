const Mavis = require('../Global/Global');
var Highcharts = require('highcharts');
require('highcharts/modules/xrange')(Highcharts);


Mavis.Graph = {

	currentZoom: 1,

	_render: () => {
		return new Promise((resolve, reject) => {
			const container = document.getElementById('graph'),
					content = [
						'<div id="chart">',
							'<div id="markerZoom">',
								'<button id="markerZoomIn">+</button>',
								'<button id="markerZoomOut">-</button>',
								'<button id="markerZoomReset">',
									'<div class="icon iconRefresh"></div>',
								'</button>',
							'</div>',
							'<div id="chartsmarker"></div>',
						'</div>',
					];

			container.innerHTML = content.join('');
			resolve();
		});
	},

	_getData: () => {
		return new Promise((resolve, reject) => {
			let data = Mavis.Filter.Data,
					chartData = [],
					cases = [],
					categories = [],
					returnData = {};

			data.forEach(function(item, i) {
				let start = Number(item.position).toFixed(2),
						dur = Number(item.position + item.distance).toFixed(2);
				if(start === dur) {
					dur = Number(start) + 0.3;
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
				if(cases.indexOf(item.case) < 0) {
					cases.push(item.case);
				}
				if(categories.indexOf(item.label) < 0) {
					categories.push(item.label);
				}
				chartData.push(el);
			});
			chartData.forEach(function(element, index) {
				element.y = cases.indexOf(element.y);
			});
			returnData.data = chartData;
			returnData.categories = categories;
			resolve(returnData);
		});
	},

	_renderGraph: data => {
		return new Promise((resolve, reject) => {
			document.getElementById('chartsmarker').innerHTML = '';
			Highcharts.chart('chartsmarker', {
				chart: {
					type: 'xrange',
					height: 220,
					zoomType: 'none',
					backgroundColor: 'transparent',
					style: {"fontFamily":"\"din_light\"","fontSize":"15px"},
					panning: true,
					panKey: 'shift',
					events:{
						click: function(e) {
							Mavis.Player.pause();
							let pos = (e.xAxis[0].value).toFixed(2),
									position = Number(pos);
							Mavis.Player.playerSet(Mavis.Filter.Criteria.cable, position);
						},
						load: function () {
							Mavis.Graph.plotLine(0)
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
                  Mavis.Comment.load(commentData);
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
					headerFormat: '<p>Position: <b>{point.key}</b> m</p><br />',
					pointFormat: '<p>Merkmal: <b>{point.label}</b></p>',
					footerFormat: '',
					backgroundColor: 'rgba(255,255,255,0.95)',
					borderRadius: 0,
					borderWidth: 1,
					hideDelay: 0,
					padding: 15,
					shadow: false,
					style: {
						fontFamily:"\"din_light\""
					}
				},
				data: {
					decimalPoint: ','
				},
				xAxis: {
					type: 'linear',
					title: '',
					min: 0,
					max: Mavis.Data.CableData[Mavis.Filter.Criteria.cable].drivenLength,
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
			resolve();
		});
	},

	plotLine: n => {
		var el = 'chartsmarker',
				lineId = 'chartsmarkerPlotLine',
				chartContainer = document.getElementById(el),
				chart = Highcharts.charts[Highcharts.attr(chartContainer, 'data-highcharts-chart')];
		chart.xAxis[0].removePlotLine(lineId);
		chart.xAxis[0].addPlotLine({
			value: n,
			color: '#000000',
			width: 2,
			dashStyle: 'ShortDot',
			id: lineId
		});
	},

	zoom: () => {
		let chartContainer = document.getElementById('chartsmarker'),
				chart = Highcharts.charts[Highcharts.attr(chartContainer, 'data-highcharts-chart')],
				position = Number(Mavis.Player.currentPosition),
				max = Number(Mavis.Data.CableData[Mavis.Filter.Criteria.cable].drivenLength),
				r = (max/Mavis.Graph.currentZoom).toFixed(2),
				zoomRange = Number(r),
				h = (zoomRange / 2).toFixed(2),
				halfRange = Number(h),
				endBuffer = max - zoomRange,
				zoomStart, zoomEnd;
		if(position < halfRange) {
			zoomStart = 0;
			zoomEnd = zoomRange;
		} else if(position > endBuffer) {
			zoomStart = endBuffer;
			zoomEnd = max;
		} else {
			zoomStart = position - halfRange;
			zoomEnd = position + halfRange;
		}
		chart.xAxis[0].setExtremes(zoomStart, zoomEnd);
	},

  _zoomIn: e => {
    if(Mavis.Graph.currentZoom < 100) {
      Mavis.Graph.currentZoom += 10;
      Mavis.Graph.zoom();
    }
  },

  _zoomOut: e => {
    if(Mavis.Graph.currentZoom > 1) {
      Mavis.Graph.currentZoom -= 10;
      Mavis.Graph.zoom();
    }
  },

  _zoomReset: e => {
    Mavis.Graph.currentZoom = 1;
    Mavis.Graph.zoom();
  },

	_events: () => {
		return new Promise((resolve,reject) => {
      document.getElementById('markerZoomIn').addEventListener('click', Mavis.Graph._zoomIn);
      document.getElementById('markerZoomOut').addEventListener('click', Mavis.Graph._zoomOut);
      document.getElementById('markerZoomReset').addEventListener('click', Mavis.Graph._zoomReset);
			resolve();
		});
	},

  filter: () => {
    async function initialize() {
      let data = await Mavis.Graph._getData();
      await Mavis.Graph._renderGraph(data);
    }
    initialize();
  },

	init: () => {
		return new Promise((resolve, reject) => {
      async function initialize() {
        let data = await Mavis.Graph._getData();
        await Mavis.Graph._render();
        await Mavis.Graph._renderGraph(data);
        await Mavis.Graph._events();
        resolve();
      }
      initialize();
		});
	}
};

module.exports = Mavis.Graph;