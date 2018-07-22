const Mavis = require('../Global/Global');

Mavis.List = {

	_renderDom: () => {

		return new Promise(function(resolve, reject) {

			let 	container = document.getElementById('reportContainerList'),
					list = document.createElement('div'),
					listElements = [
						'<div id="listHeader">',
							'<label>Schadensfall</label>',
							'<label>Seil</label>',
							'<label>Position</label>',
							'<label>Seiten</label>',
							'<label>Schadensklasse</label>',
							'<label>Wert</label>',
							'<label>Links</label>',
						'</div>',
						'<ul id="listBody"></ul>',
						'<div id="reportDownload">',
							'<button id="downloadXls">als .XLS speichern</button>',
							'<button id="downloadCsv">als .CSV speichern</button>',
							'<button id="downloadImages">Bilder speichern</button>',
						'</div>'
					];

			list.setAttribute('id', 'list');
			list.innerHTML = listElements.join('');

			container.appendChild(list);
			resolve();
		});
	},

	_renderModel: (arr) => {

		let classes = 'model ',
				modelSVG = [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<svg viewBox="0 0 428 369" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
						'<circle fill="none" id="core1" class="core" cx="111" cy="122" r="36"></circle>',
						'<circle fill="none" id="core2" class="core" cx="183" cy="122" r="36"></circle>',
						'<circle fill="none" id="core3" class="core" cx="255" cy="122" r="36"></circle>',
						'<circle fill="none" id="core4" class="core" cx="327" cy="122" r="36"></circle>',
						'<circle fill="none" id="core5" class="core" cx="75" cy="185" r="36"></circle>',
						'<circle fill="none" id="core6" class="core" cx="147" cy="185" r="36"></circle>',
						'<circle fill="none" id="core7" class="core" cx="219" cy="185" r="36"></circle>',
						'<circle fill="none" id="core8" class="core" cx="291" cy="185" r="36"></circle>',
						'<circle fill="none" id="core9" class="core" cx="363" cy="185" r="36"></circle>',
						'<circle fill="none" id="core10" class="core" cx="111" cy="248" r="36"></circle>',
						'<circle fill="none" id="core11" class="core" cx="183" cy="248" r="36"></circle>',
						'<circle fill="none" id="core12" class="core" cx="255" cy="248" r="36"></circle>',
						'<circle fill="none" id="core13" class="core" cx="327" cy="248" r="36"></circle>',
						'<polygon id="label1" class="label" points="21.8 79.8 12 87.2 12 76.3 21.8 69 31.7 69 31.7 140.2 21.8 140.2"></polygon>',
						'<path d="M90.5,184.5 L32.5,84.5" id="line1" class="line" transform="translate(61.500000, 134.500000) scale(-1, 1) translate(-61.500000, -134.500000) "></path>',
						'<path id="label2" class="label" d="M197,62.2 L224,27.4 C225,26 225.8,24.7 226.1,23.5 C226.4,22.4 226.5,21.3 226.5,20.3 C226.5,17.6 225.7,15.3 224.1,13.3 C222.4,11.3 220.1,10.3 217,10.2 C214.3,10.2 212,11.1 210.2,12.9 C208.3,14.7 207.2,17.2 206.9,20.5 L197,20.5 C197.3,14.6 199.2,9.7 202.8,5.8 C206.4,2 210.9,0.1 216.2,0 C222.1,0.1 226.9,2 230.6,5.9 C234.4,9.7 236.3,14.6 236.3,20.4 C236.3,25.1 234.9,29.3 232.1,32.9 L209.9,61.6 L236.3,61.6 L236.3,71.8 L197,71.8 L197,62.2 L197,62.2 Z"></path>',
						'<path d="M90.5,85 L347.500486,85" id="line2" class="line"></path>',
						'<path id="label3" class="label" d="M402.7,98.7 L406.1,98.7 C409.5,98.7 412.1,97.7 414,95.8 C415.9,93.9 416.8,91.5 416.8,88.5 C416.7,85.5 415.8,83 413.9,81.1 C412,79.2 409.6,78.3 406.7,78.2 C404.6,78.2 402.7,78.9 400.9,80.3 C399.1,81.7 397.8,83.9 397.2,86.8 L387.3,86.8 C387.8,81.5 389.9,77.1 393.5,73.5 C397.1,69.9 401.3,68.1 406.3,68 C412.6,68.1 417.6,70.1 421.2,74.2 C424.7,78.2 426.5,82.9 426.6,88.3 C426.6,91 426.1,93.7 425.1,96.2 C424,98.7 421.9,101 419,103 C422,105 424.2,107.3 425.5,110 C426.8,112.7 427.4,115.6 427.4,118.6 C427.3,125.3 425.3,130.5 421.4,134.4 C417.5,138.3 412.5,140.3 406.5,140.4 C401.8,140.4 397.6,138.8 394,135.7 C390.4,132.6 388,128.1 387,122.2 L396.9,122.2 C397.8,124.6 399,126.5 400.6,128 C402.2,129.5 404.4,130.3 407.1,130.3 C410,130.3 412.4,129.3 414.4,127.2 C416.4,125.3 417.5,122.5 417.5,119 C417.4,115.4 416.4,112.6 414.4,110.6 C412.4,108.7 409.9,107.7 406.8,107.7 L402.6,107.7 L402.6,98.7 L402.7,98.7 Z"></path>',
						'<path d="M406.5,184.5 L348.5,84.5" id="line3" class="line"></path>',
						'<polygon id="label4" class="label" points="0 277 23 226 34 226 10.7 277 28.7 277 28.7 256.5 38.6 256.5 38.6 277 44.1 277 44.1 286.6 38.6 286.6 38.6 297.1 28.7 297.1 28.7 286.5 0 286.5"></polygon>',
						'<path d="M90.5,284.5 L32.5,184.5" id="line4" class="line" transform="translate(61.500000, 234.500000) scale(-1, -1) translate(-61.500000, -234.500000) "></path>',
						'<path id="label5" class="label" d="M201.2,297 L238,297 L238,307.2 L210.4,307.2 L210.4,323.4 C213.6,320.8 217.3,319.5 221.5,319.5 C224.2,319.6 226.6,320.1 228.8,321 C230.9,322 232.6,323.2 233.9,324.7 C235.8,326.7 237.2,328.9 238,331.5 C238.4,332.9 238.8,334.6 238.9,336.6 C239.1,338.6 239.2,341.2 239.2,344.2 C239.2,348.8 238.9,352.4 238.3,354.8 C237.6,357.2 236.5,359.4 235,361.3 C233.6,363.1 231.7,364.8 229.1,366.4 C226.6,368 223.6,368.8 220.1,368.9 C215.4,368.9 211.2,367.5 207.3,364.6 C203.4,361.7 200.9,356.9 200,350.4 L209.9,350.4 C211,355.9 214.3,358.7 219.8,358.7 C222.2,358.7 224.1,358.2 225.5,357.2 C226.9,356.3 227.8,355 228.3,353.5 C228.9,352 229.2,350.3 229.3,348.5 C229.4,346.7 229.4,345 229.4,343.4 C229.5,339.3 228.8,336 227.5,333.5 C226.8,332.3 225.8,331.3 224.4,330.6 C223,330 221.3,329.7 219.3,329.7 C217.5,329.7 215.8,330.1 214.4,331 C212.9,331.9 211.6,333.4 210.4,335.6 L201.2,335.6 L201.2,297 Z"></path>',
						'<path d="M90.5,285 L347.500486,285" id="line5" class="line"></path>',
						'<path id="label6" class="label" d="M388.2,246.5 C388.3,239.9 390.3,234.9 394.3,231.3 C398.1,227.8 402.5,226 407.7,226 C412.4,226 416.5,227.4 420.2,230.1 C423.7,232.9 426,236.9 427,242.1 L416.8,242.1 C415.3,238.2 412.2,236.2 407.7,236.1 C401.4,236.2 398.2,239.9 398,247 L398,253.7 C402.7,252.2 407.1,251.4 411.2,251.5 C415.8,251.5 419.6,253.1 422.8,256.2 C425.9,259.4 427.4,264.4 427.4,271.3 L427.4,277.8 C427.3,284.3 425.3,289.4 421.5,292.9 C417.7,296.4 413.2,298.2 407.8,298.3 C402.6,298.2 398.1,296.4 394.4,292.9 C390.4,289.4 388.4,284.3 388.3,277.8 L388.3,246.5 L388.2,246.5 Z M398,277.3 C398.1,284.5 401.4,288.1 407.7,288.2 C414,288.1 417.3,284.5 417.4,277.3 L417.4,271.5 C417.2,264.4 414,260.7 407.7,260.6 C401.4,260.7 398.1,264.4 398,271.5 L398,277.3 L398,277.3 Z"></path>',
						'<path d="M405.5,284.5 L347.5,184.5" id="line6" class="line" transform="translate(376.500000, 234.500000) scale(1, -1) translate(-376.500000, -234.500000) "></path>',
					'</svg>'
				];

		if(arr.indexOf(1) > -1) classes += 'one ';
		if(arr.indexOf(2) > -1) classes += 'two ';
		if(arr.indexOf(3) > -1) classes += 'three ';
		if(arr.indexOf(4) > -1) classes += 'four ';
		if(arr.indexOf(5) > -1) classes += 'five ';
		if(arr.indexOf(6) > -1) classes += 'six ';

		return('<div class=" ' + classes + '">' + modelSVG.join('') + '</div>');
	},

	_events: () => {

		return new Promise(function(resolve,reject) {

			let links = document.querySelectorAll('.loadVisual');

			links.forEach(function(link, i) {

				link.addEventListener('click', function() {

					let data = {};
					data.cable = this.getAttribute('data-cable');
					data.position = this.getAttribute('data-position');

					Mavis.Pages.loadPage('inspection', data);
				});
			});

			resolve();
		});
	},

	renderItems: (data) => {

    return new Promise(function (resolve, reject) {

      let container = document.getElementById('listBody'),
          list = [];

      container.innerHTML = '';

      data.forEach(function (item, i) {

        let itemLabel = '<div class="item itemLabel"><div class="colorBar" style="background-color: ' + item.color + ';"></div>' + item.label + '</div>',
            itemCable = '<div class="item itemCable">' + Mavis.Data.Construction.cables[item.cable].name + '</div>',
            itemPosition = '<div class="item itemPosition">' + item.position + ' m</div>',
            itemSides = '<div class="item itemSides">' + Mavis.List._renderModel(item.sides) + '</div>',
            itemRating = '<div class="item itemRating">SK ' + item.rating + '</div>',
            itemValue = '<div class="item itemValue">' + item.value + ' ' + item.metric + '</div>',
            itemLink = '<div class="item itemLink"><a class="loadVisual" data-cable="' + item.cable + '" data-position="' + item.position + '">Zur Seilprüfungsansicht</a></div>',
            li = '<li class="result">' + itemLabel + itemCable + itemPosition + itemSides + itemRating + itemValue + itemLink + '</li>';

        list.push(li);
      });

      container.innerHTML = list.join('');

      Mavis.List._events()
      .then(resolve());

    });
	},

	init: () => {

		return new Promise(function(resolve, reject) {
			Mavis.Filter.init('List', 'reportContainerList', ['sort','cables', 'sides', 'ratings', 'markers'])
			.then(Mavis.List._renderDom())
			.then(Mavis.List.renderItems(Mavis.Data.Filtered))
			.then(resolve());
		});
	},
};

module.exports = Mavis.List;