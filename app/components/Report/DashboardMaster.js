const Mavis = require('../Global/Global');
const Highcharts = require('highcharts');

Mavis.DashboardMaster = {

	_renderDom: () => {

		return new Promise(function(resolve, reject) {

			let 	container = document.getElementById('reportDashboard'),
					content = [
						'<div id="masterChart" class="dashboardChart">',
							'<h2>MasterChart</h2>',
							'<div id="chartMaster"></div>',
						'</div>',
					];

			container.innerHTML = content.join('');
			resolve();
		});
	},

	_renderChart: () => {

		return new Promise(function(resolve, reject) {


			Highcharts.chart('chartMaster', {

				// chart definitions
				chart: {

					// set chat type
					type: 'column',

					// A CSS class name to apply to the charts container div, allowing unique CSS styling for each chart.
					className: 'dashboardChart',

					/*** styling ***/

					// change/invert data axis
					inverted: false,

					// style the whole thing
					width: null,
					height: null,
					margin: null, // [70, 70, 70, 70],
					backgroundColor: '#ffffff',
					borderColor: '#ffffff',
					borderRadius: 0,
					borderWidth: 0,
					shadow: false, //{ color:'#efefef', offsetX: 1, offsetY: 1, opacity: 1, width: 10},
					spacing: [10, 10, 10, 10], // The distance between the outer edge of the chart and the content, like title or legend, or axis title and labels if present. The numbers in the array designate top, right, bottom and left respectively. Use the options spacingTop, spacingRight, spacingBottom and spacingLeft options for shorthand setting of one option. Defaults to [10, 10, 15, 10].

					style: {
						"fontFamily": "\"din_light\"",
						"fontSize": "15px"
					},

					// style the plot area (only the graph itself)

					plotBackgroundColor: '#ffffff',
					//plotBackgroundImage: String
					plotBorderColor: '#ffffff',
					plotBorderWidth: 0,
					plotShadow: false, // {color: '#efefef', offsetX: 1, offsetY: 1, opacity: 1, width: 10}

					// Whether to show the axes initially. This only applies to empty charts where series are added dynamically, as axes are automatically added to cartesian series.
					showAxes: true,

					// Options to render charts in 3 dimensions.
					options3d: {

						// Wether to render the chart using the 3D functionality.
						enabled: false,

						// One of the two rotation angles for the chart.
						alpha: 50,

						// One of the two rotation angles for the chart.
						beta: 10,

						// The total depth of the chart.
						depth: 50,

						// Defines the distance the viewer is standing in front of the chart, this setting is important to calculate the perspective effect in column and scatter charts. It is not used for 3D pie charts.
						viewDistance: 100,

						// Set it to "auto" to automatically move the labels to the best edge.
						axisLabelPosition: 'auto',

						// Whether the 3d box should automatically adjust to the chart plot area.
						fitToPlot: true
					},

					// The background color of the marker square when selecting (zooming in on) an area of the chart.
					selectionMarkerFill: 'rgba(51,92,173,0.25)',

					// When using multiple axis, the ticks of two or more opposite axes will automatically be aligned by adding ticks to the axis or axes with the least ticks, as if tickAmount were specified. This can be prevented by setting alignTicks to false. If the grid lines look messy, it's a good idea to hide them for the secondary axis by setting gridLineWidth to 0.
					alignTicks: true,

					// If true, the axes will scale to the remaining visible series once one series is hidden. If false, hiding and showing a series will not affect the axes or the other series. For stacks, once one series within the stack is hidden, the rest of the stack will close in around it even if the axis is not affected.
					ignoreHiddenSeries: true,

					// Boolean, Object, Set the overall animation for all chart updating. Animation can be disabled throughout the chart by setting it to false here. It can be overridden for each individual API method as a function parameter. The only animation not affected by this option is the initial series animation, see plotOptions.series.animation. The animation can either be set as a boolean or a configuration object. If true, it will use the 'swing' jQuery easing and a duration of 500 ms. If used as a configuration object, the following properties are supported: duration: The duration of the animation in milliseconds. easing: A string reference to an easing function set on the Math object. See the easing demo.
					animation: true,

					/*** events ***/

					events: {
						// addSeries: function, Fires when a series is added to the chart after load time, using the addSeries method. One parameter, event, is passed to the function, containing common event information. Through event.options you can access the series options that was passed to the addSeries method. Returning false prevents the series from being added.
						// afterPrint: function, Fires after a chart is printed through the context menu item or the Chart.print method. Requires the exporting module.
						// beforePrint: function, Fires before a chart is printed through the context menu item or the Chart.print method. Requires the exporting module.
						// click: function, Fires when clicking on the plot background. One parameter, event, is passed to the function, containing common event information. See: http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/chart/events-click/
						// drilldown: function, Fires when a drilldown point is clicked, before the new series is added. This event is also utilized for async drilldown, where the seriesOptions are not added by option, but rather loaded async. Note that when clicking a category label to trigger multiple series drilldown, one drilldown event is triggered per point in the category. Event arguments: category - If a category label was clicked, which index; point - The originating point; originalEvent - The original browser event (usually click) that triggered the drilldown; points - If a category label was clicked, this array holds all points corresponing to the category; seriesOptions - Options for the new series
						// drillup: function
						// drillupall: function In a chart with multiple drilldown series, this event fires after all the series have been drilled up.
						// load: function, Fires when the chart is finished loading. Since v4.2.2, it also waits for images to be loaded, for example from point markers. One parameter, event, is passed to the function, containing common event information. There is also a second parameter to the chart constructor where a callback function can be passed to be executed on chart.load.
						// redraw: function, Fires when the chart is redrawn, either after a call to chart.redraw() or after an axis, series or point is modified with the redraw option set to true. One parameter, event, is passed to the function, containing common event information.
						// render: function, Fires after initial load of the chart (directly after the load event), and after each redraw (directly after the redraw event).
						// selection: function, Fires when an area of the chart has been selected. Selection is enabled by setting the chart's zoomType. One parameter, event, is passed to the function, containing common event information. The default action for the selection event is to zoom the chart to the selected area. It can be prevented by calling event.preventDefault(). see: http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/chart/events-selection-points/
					},

					/** handling ***/

					// Decides in what dimensions the user can zoom by dragging the mouse. Can be one of x, y or xy., Defaults to undefined, Try it, None by default, X, Y, Xy
					zoomType: 'x',

					// styling the zoom button
					resetZoomButton: {

						position: {
							align: 'right',
							verticalAlign: 'top',
							x: 0,
							y: 0
						},

						// What frame the button should be placed related to. Can be either plot or chart
						relativeTo: 'plot',

						// style the button and states
						theme: {
							fill: 'white',
							stroke: 'silver',
							r: 0,
							states: {
								hover: {
									fill: '#41739D',
									style: {
										color: 'white'
									}
								}
							}
						}
					},

					// Allows setting a key to switch between zooming and panning. Can be one of alt, ctrl, meta (the command key on Mac and Windows key on Windows) or shift. The keys are mapped directly to the key properties of the click event argument (event.altKey, event.ctrlKey, event.metaKey and event.shiftKey).
					panKey: undefined,

					// Allow panning in a chart. Best used with panKey to combine zooming and panning.
					panning: true,

					// Equivalent to zoomType, but for multitouch gestures only. By default, the pinchType is the same as the zoomType setting. However, pinching can be enabled separately in some cases, for example in stock charts where a mouse drag pans the chart, while pinching is enabled. When tooltip.followTouchMove is true, pinchType only applies to two-finger touches.
					// pinchType: String

					// Whether to reflow the chart to fit the width of the container div on resizing the window.
					reflow: true
				},

				// chart title on top
				title: {
					text: 'Monthly Average Rainfall',
					align: 'left',
					// The x and y position of the title relative to the alignment within chart. spacingLeft and chart.spacingRight.
					x: 0,
					y: 10,
					floating: false,
					margin: 20,
					style: {}
				},

				// chart subtitle on top
				subtitle: {
					text: 'Source: WorldClimate.com',
					align: 'left',
					x: 0,
					y: 30,
					floating: false,
					style: {}
				},

				legend: {

					enabled: true,

					/*** structure ***/

					labelFormatter: function () {
            		return this.name + ' (click to hide)';
        			},
        			reversed: false,
        			title: {
        				text: 'Die Legende',
        				style: {}
        			},

					/*** styling ***/

					align: 'left',
					layout: 'horizontal',
					itemDistance: 20,
					lineHeight: 20,
					margin: 20,
					padding: 10,
					backgroundColor: '#ffffff',
					borderColor: '#ffffff',
					borderRadius: 0,
					borderWidth: 0,
					shadow: false,
					squareSymbol: true,
					width: null,
					x: 0,
					y: 0,
					style: {},
					itemStyle: {}
				},

				tooltip: {

					enabled: true,

					/*** format ***/

					useHTML: true,
					headerFormat: 	'<span style="font-size:10px">{point.key}</span><table>',
					pointFormat: 	'<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
										'<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
					footerFormat: 	'</table>',
/*
					formatter: function () {
						return 'The value for <b>' + this.x +
						'</b> is <b>' + this.y + '</b>';
					},
					pointFormatter: function,
*/

					valuePrefix: '',
					valueSuffix: '',

					/*** styling ***/
					animation: true,
					padding: 10,
					backgroundColor: 'rgba(247,247,247,0.85)',
					borderColor: null,
					borderRadius: 0,
					borderWidth: 0,
					shadow: false,
					style: {},


					/*** behavior ***/

					followPointer: true,
					followTouchMove: true,
					shared: true, // When the tooltip is shared, the entire plot area will capture mouse movement or touch events. Tooltip texts for series types with ordered data (not pie, scatter, flags etc) will be shown in a single bubble. This is recommended for single series charts and for tablet/mobile optimized charts.
				},

				// credits
				credits: {
					enabled: false
					// there is more...
				},

				plotOptions: {

					column: {

						/*** structure ***/
						className: undefined,

						/*** behaviour ***/
						allowPointSelect: false,

						/*** styling ***/
						pointPadding: 0.2,
						color: undefined,

						borderColor: '#efefef',
						borderRadius: 0,
						borderWidth: 0
					}
				},

				// type column
				series: [{
					name: 'Tokyo',
					borderColor: undefined,
					borderWidth: 0,
					borderRadius: 0,
					className: undefined,
					color: undefined,
					dataLabels: {
						align: null,
						allowOverlap: false,
						backgroundColor: undefined,
						borderColor: undefined,
						borderWidth: 0,
						borderRadius: 0,
						className: undefined,
						color: undefined,
						enabled: true,
						overflow: 'justify',
						padding: 5,
						rotation: 0,
						shadow: false,
						style: {},
						verticalAlign: null,
						x: 0,
						y: null,
						zIndex: 6
					},
					events:{
						afterAnimate: undefined,
						checkboxClick: undefined,
						click: undefined,
						hide: undefined,
						legendItemClick: undefined,
						mouseOut: undefined,
						mouseOver: undefined,
						show: undefined
					},
					grouping: true,
					groupPadding: 0.2,
					pointPadding: 0,
					id: undefined,
					data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 0, 54.4]
				},{
					name: 'New York',
					data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 0, 92.3]
				},{
					name: 'London',
					data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 0, 51.2]

				},{
					name: 'Berlin',
					data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 0, 51.1]
				}],

				// x-axis definitions
				xAxis: {

					// define the category names to x-axis
					categories: [
						'Jan',
						'Feb',
						'Mar',
						'Apr',
						'May',
						'Jun',
						'Jul',
						'Aug',
						'Sep',
						'Oct',
						'Nov',
						'Dec'
					],
					crosshair: true
				},

				yAxis: {
					min: 0,
					title: {
						text: 'Rainfall (mm)'
					}
				},

				// accessibility features?
				accessibility:{

					// Whether or not to add series descriptions to charts with a single series.
					describeSingleSeries: true,

					// Enable accessibility features for the chart.
					enabled: true,

					// there are more options to check out...
				},

				// Options for configuring annotations, for example labels, arrows or shapes. Annotations can be tied to points, axis coordinates or chart pixel coordinates.
				annotations: [{

					// Options for annotation's labels. Each label inherits options from the labelOptions object. An option from the labelOptions can be overwritten by config for a specific label.
					labelOptions:{

						// The alignment of the annotation's label. If right, the right side of the label should be touching the point.
						align: 'left',

						// Whether to allow the annotation's labels to overlap. To make the labels less sensitive for overlapping, the can be set to 0.
						allowOverlap: 0,

						// The background color or gradient for the annotation's label.
						backgroundColor: 'rgba(255,255,255,0.7)'

						// more options
					},

					// more options
					visible: true

				}],

				// use WebGL
				boost: {

					// If set to true, the whole chart will be boosted if one of the series crosses its threshold, and all the series can be boosted.
					allowForce: true,

					// enabled
					enabled: true,

					// Set the series threshold for when the boost should kick in globally. Setting to e.g. 20 will cause the whole chart to enter boost mode if there are 20 or more series active. When the chart is in boost mode, every series in it will be rendered to a common canvas. This offers a significant speed improvment in charts with a very high amount of series.
					seriesThreshold: 10,

					// Enable or disable GPU translations. GPU translations are faster than doing the translation in JavaScript.
					useGPUTranslations: true

				}
			});

			resolve();
		});
	},

	init: () => {

		return new Promise(function(resolve, reject) {

			Mavis.DashboardMaster._renderDom()
			.then(Mavis.DashboardMaster._renderChart())
			.then(resolve());
		});
	}
};

module.exports = Mavis.DashboardMaster;