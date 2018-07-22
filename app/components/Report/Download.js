const Mavis = require('../Global/Global');

Mavis.Download = {

	DataLabels: {
		"#":"Number",
		"Schadensfall": "String",
		"Beschreibung": "String",
		"Bewertung": "Number",
		"Seil": "String",
		"Position": "Number",
		"Verteilung": "Number",
		"Wert": "Number",
		"Bilder": "String"
	},

	DataTypes: {
		"id":"Number",
		"label": "String",
		"caption": "String",
		"rating": "Number",
		"cable": "String",
		"position": "Number",
		"distribution": "Number",
		"valur": "Number",
		"images": "String"
	},

	_xls: (obj) => {

		let _header = () => {

			let row =  '<ss:Row>\n';

			for (let col in Mavis.Download.DataLabels) {
				row += '<ss:Cell>\n';
				row += '<ss:Data ss:Type="String">';
				row += col + '</ss:Data>\n';
				row += '</ss:Cell>\n';
			}

			row += '</ss:Row>\n';

			let output = 	'<?xml version="1.0"?>\n' +
								'<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
								'<ss:Worksheet ss:Name="Sheet1">\n' +
								'<ss:Table>\n\n' +
								row;

			return output;
		};

		let _footer = () => {
			return '\n</ss:Table>\n</ss:Worksheet>\n</ss:Workbook>\n';
		};

		let 	row, col, xml,
				data = typeof obj != "object" ? JSON.parse(obj) : obj;

		xml = _header();

		for (row=0; row<data.length; row++) {

			xml += '<ss:Row>\n';

			for (col in data[row]) {
				xml += '<ss:Cell>\n';
				xml += '<ss:Data ss:Type="' + Mavis.Download.DataTypes[col]  + '">';
				xml += data[row][col] + '</ss:Data>\n';
				xml += '</ss:Cell>\n';
			}

			xml += '</ss:Row>\n';
		}

		xml += _footer();

		return xml;
	},

	_csv: (obj, title, labels) => {

		let 	row, index,
				objData = typeof obj != 'object' ? JSON.parse(obj) : obj,
				csv = '';

		csv += title + '\r\n\n';

		if(labels) {

			row = "";

			for (index in objData[0]) {
				row += index + ',';
			}

			row = row.slice(0, -1);
			csv += row + '\r\n';
		}

		for (let i = 0; i < objData.length; i++) {

			row = "";

			for (index in objData[i]) {
				row += '"' + objData[i][index] + '",';
			}

			row.slice(0, row.length - 1);

			csv += row + '\r\n';
		}

		return csv;
	},

	_data: () => {

		let data = [];

		Mavis.Data.Filtered.forEach(function(result, i) {

			let item = {};
			item.id = (i + 1);
			item.label = result.label;
			item.caption = result.caption;
			item.rating = 'SK' + result.rating;
			item.cable = Mavis.Data.Construction.cables[result.cable].name;
			item.position = result.position.toFixed(2) + 'm';
			item.distance = result.distance;
			item.value = result.value;

			let images = [],
					imageData = Mavis.Download._getImages(result, i);

			// console.log(imageData);


			data.push(item);
		});

		return data;

/*
		var 	data = [],
				i = 0,
				d = Mavis.Filter.Data.Results,
				l = Mavis.Filter.Data.Results.length;

		for(i=0;  i<l; i++) {

			var item = {};
			item.id = i;
			item.label = d[i].label;
			item.rating = d[i].rating;
			item.cable = MAVIS.DATA.OBJECT.BUILD.CABLES[d[i].cable].NAME;
			item.position = d[i].position.toFixed(2);
			item.message = d[i].value;

			var 	iarr = [],
				idata = MAVIS.DOWNLOAD.IMAGES.get(d[i],i),
				ilength = idata.length,
				n = 0;

			for(n=0; n<ilength;n++) {
				iarr.push(idata[n].filename);
			}

			item.images = iarr;

			data.push(item);
		}
*/

	},

	_images: () => {
/*
		document.getElementById('updating').style.display = 'inline-block';

		var 	__dirname = process.cwd(),
			output = Mavis.Global.fs.createWriteStream(__dirname + '/tmp/bilder.zip'),
			archive = Mavis.Global.archiver('zip'),
			data = [],
			i = 0,
			d = Mavis.Download._data(),
			l = d.length;

		for(i=0;  i<l; i++) {

			var 	imgs = MAVIS.DOWNLOAD.IMAGES.get(d[i],i),
					ilength = imgs.length,
					n = 0;

			for(n=0; n<ilength;n++) {
				data.push(imgs[n]);
			}
		}

		output.on('close', function() {
			document.getElementById('updating').style.display = 'none';

			link = document.createElement("a");
			link.href = 'tmp/bilder.zip';
			link.download = 'bilder.zip';
			link.style = "visibility:hidden";

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		});

		archive.on('error', function(err) {
			document.getElementById('updating').style.display = 'none';
			throw err;
		});

		archive.pipe(output);

		var fcount = data.length,
		f = 0;

		for(f=0; f<fcount; f++) {

			archive.append(MAVIS.GLOBAL.FS.createReadStream(data[f].file), { name: data[f].filename });
		}

		archive.finalize();
*/
	},


	_save: (content, filename, contentType) => {

		if (!contentType) contentType = 'application/octet-stream';

		let blob = new Blob([content], {
			'type': contentType
		});

		let link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = filename;
		link.style = "visibility:hidden";

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	},

	_getImages: (data, markerId) => {



		let 	__dirname = process.cwd(),
				images = [],
				i;

		for(i=0; i<6; i++) {

			let	item = {};
					item.file = __dirname + '/app/data/';
					item.filename = Mavis.Data.Construction.cables[data.cable].name + '_#' + markerId + '_Bild-' + (i + 1) + '.JPG';

			images.push(item);

		}

		console.log(images);


/*

		let 	__dirname = process.cwd(),
				images = [],
				i = 0;

		for(i=0; i<6; i++) {

			if(item.sides.length === 0 || item.sides.indexOf(i) > -1) {


				if(Mavis.Global.fs.existsSync(item.images[i])) {

					var item = {};
					item.file = __dirname + '/' + item.images[i];
					item.filename = Mavis.Data.Construction.cables[item.cable].name + '_#' + casenum + '_Bild-' + (i + 1) + '.JPG';

					images.push(item);
				}
			}
		}
*/
		return images;
	},

	_events: () => {

		return new Promise(function(resolve, reject) {

			let xlsButton = document.getElementById('downloadXls'),
					csvButton = document.getElementById('downloadCsv'),
					imgButton = document.getElementById('downloadImages');

			xlsButton.addEventListener('click', function() {
				Mavis.Download._save(Mavis.Download._xls(Mavis.Download._data()), 'mavis_report.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			});

			csvButton.addEventListener('click', function() {
				Mavis.Download._save(Mavis.Download._csv(Mavis.Download._data(), 'mavisReport', true), 'mavis_report.csv', 'text/csv');
			});

/*
			document.getElementById('download_images').addEventListener('click', function(e) {
				MAVIS.DOWNLOAD.IMAGES.archive();
			});

			document.getElementById('download_xls').addEventListener('click', function(e) {

			});
*/

			resolve();
		});
	},

	init: () => {

		return new Promise(function(resolve, reject) {

			Mavis.Download._events()
			.then(resolve());
		});
	}
};

module.exports = Mavis.Download;

/*

	IMAGES: {

		get: function(data,casenum) {

			var 	__dirname = process.cwd(),
				images = [],
				i = 0;

			for(i=0; i<6;i++) {

				if(data.sides.length === 0 || data.sides.indexOf(i) > -1) {

					if(MAVIS.GLOBAL.FS.existsSync(data.images[i])) {

						var item = {};
						item.file = __dirname + '/' + data.images[i];
						item.filename = MAVIS.DATA.OBJECT.BUILD.CABLES[data.cable].NAME + '_#' + casenum + '_Bild-' + (i + 1) + '.JPG';

						images.push(item);
					}
				}
			}

			return images;
		},


	},
};

*/