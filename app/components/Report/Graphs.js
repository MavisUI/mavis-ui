const Mavis = require('../Global/Global');
const Highcharts = require('highcharts');

Mavis.Graphs = {

	pieChart: (container, label, data, axisCategories) => {

		Highcharts.chart(container, {
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
	},

	barChart: (container, label, data, axisCategories) => {

		Highcharts.chart(container, {

			chart: {

				type: 'column',
				height: 300,
				spacing: [20, 0, 0, 0],
				style: {
					"fontFamily": "\"din_light\"",
					"fontSize": "15px"
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
					"fontFamily": "\"din_bold\"",
					"fontSize": "15px"
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
						"fontFamily": "\"din_light\"",
						"fontSize": "15px"
					}
				},
				groupPadding: 0,
				pointPadding: 0,
				data: data
			}]
		});
	}
};

module.exports = Mavis.Graphs;