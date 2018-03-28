const Mavis = require('../Global/Global');
var Highcharts = require('highcharts');
require('highcharts/modules/xrange')(Highcharts);


Mavis.Graph = {

	currentZoom: 1,

	_render: () => {

		return new Promise(function(resolve, reject) {

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

		return new Promise(function(resolve, reject) {

			let 	data = Mavis.Filter.Data.Results,
					chartData = [],
					cases = [],
					categories = [],
					returnData = {};

			data.forEach(function(item, i) {

				let 	start = Number(item.position).toFixed(2),
						dur = Number(item.position + item.distance).toFixed(2);

				if(start === dur) {
					dur = Number(start) + 0.5;
				}

				var el = {};
				el.label = item.label,
				el.metric = item.metric;
				el.x = Number(start);
				el.x2 = Number(dur);
				el.y = item.case;
				el.partialFill = 1;
				el.color = item.color;

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

		return new Promise(function(resolve, reject) {

			// clear container
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

							let 	pos = (e.xAxis[0].value).toFixed(2),
									position = Number(pos);

							Mavis.Player.run(position);
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
						pointWidth: 15,
						dataLabels: {
							enabled: false
						},
						cursor: 'pointer',
						point: {

							events: {

								click: function () {

									let 	mod = this.y - 1,
											position = this.x;
/*
									all = MAVIS.DATA.RESULTS.CABLES[MAVIS.CONTROLS.FILTERS.cable].usergenerated[mod].all.length,
									comment;

									for(i=0;i<all;i++) {
										var n = Number(MAVIS.DATA.RESULTS.CABLES[MAVIS.CONTROLS.FILTERS.cable].usergenerated[mod].all[i].position);

										if(n === position) {
											comment = i;
										}
									}
*/
									Mavis.Player.pause();
									Mavis.Player.run(position);

									// MAVIS.COMMENTS.load(mod, comment);
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
					max: Mavis.Data.CableData[Mavis.CableSelection.current].drivenLength,
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

		var 	el = 'chartsmarker',
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

		let 	chartContainer = document.getElementById('chartsmarker'),
				chart = Highcharts.charts[Highcharts.attr(chartContainer, 'data-highcharts-chart')],
				position = Number(Mavis.Player.currentPosition),
				max = Number(Mavis.Data.CableData[Mavis.CableSelection.current].drivenLength),
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

	_events: () => {

		return new Promise(function(resolve,reject) {

			const zoomIn = document.getElementById('markerZoomIn'),
					zoomOut = document.getElementById('markerZoomOut'),
					zoomReset = document.getElementById('markerZoomReset');

			zoomIn.addEventListener('click', function(e) {
				if(Mavis.Graph.currentZoom < 100) {
					Mavis.Graph.currentZoom += 10;
					Mavis.Graph.zoom();
				}
			});

			zoomOut.addEventListener('click', function(e) {
				if(Mavis.Graph.currentZoom > 1) {
					Mavis.Graph.currentZoom -= 10;
					Mavis.Graph.zoom();
				}
			});

			zoomReset.addEventListener('click', function(e) {
				Mavis.Graph.currentZoom = 1;
				Mavis.Graph.zoom();
			});

			resolve();
		});
	},

	init: () => {

		return new Promise(function(resolve, reject) {

			let data = Mavis.Graph._getData()
			.then(function(data) {
				Mavis.Graph._render()
				.then(Mavis.Graph._renderGraph(data))
				.then(Mavis.Graph._events())
				.then(resolve());
			});
		});
	}
};

module.exports = Mavis.Graph;