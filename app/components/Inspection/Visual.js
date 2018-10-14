const Mavis = require('../Global/Global');

Mavis.Visual = {

	sides: 0,
	imagePath: undefined,
	lastImage: null,

	_render: () => {
		return new Promise((resolve, reject) => {
			const container = document.getElementById('visual'),
					content = [
						'<div id="pictures">',
							'<div class="pictureRow">',
								'<div class="pictureWindow">',
                  '<div class="picture">',
                   '<div class="icon iconCableActive0"></div>',
                  '</div>',
								'</div>',
								'<div class="pictureWindow">',
                  '<div class="picture">',
                    '<div class="icon iconCableActive1"></div>',
                  '</div>',
								'</div>',
								'<div class="pictureWindow">',
                  '<div class="picture">',
                    '<div class="icon iconCableActive2"></div>',
                  '</div>',
								'</div>',
							'</div>',
							'<div class="pictureRow">',
								'<div class="pictureWindow">',
                  '<div class="picture">',
                    '<div class="icon iconCableActive3"></div>',
                  '</div>',
								'</div>',
								'<div class="pictureWindow">',
                  '<div class="picture">',
                    '<div class="icon iconCableActive4"></div>',
                  '</div>',
								'</div>',
								'<div class="pictureWindow">',
									'<div class="picture">',
                    '<div class="icon iconCableActive5"></div>',
                  '</div>',
								'</div>',
							'</div>',
						'</div>',
						'<div id="preloadContainer" style="display: none"></div>'

/*
						'<aside id="overlay" class="hidden">',
							'<button id="overlayClose">',
								'<div class="icon iconCancel"></div>',
							'</button>',
							'<div id="overlayContent"></div>',
						'</aside>',
*/
					];

			container.innerHTML = content.join('');

			resolve();
		});
	},

  _setSides: cable => {
    return new Promise((resolve, reject) => {
      Mavis.Visual.sides = Number(Mavis.Data.CableData[cable].sides);
      resolve();
    });
  },

  _setPath: cable => {
    return new Promise((resolve, reject) => {
      Mavis.Visual.imagePath = '/data/' + Mavis.Data.State.activeBridge + '/' + cable + '/';
      resolve();
    });
  },

  _setLastImage: cable => {
    return new Promise((resolve, reject) => {
      Mavis.Visual.lastImage = Mavis.Data.CableData[cable].trigger.length;
      resolve();
    });
  },

  _formatFileName: num => {
	  let filenumber = num.toString(),
        filenameLength = filenumber.length,
        filename;
    if(filenameLength === 4) {
      filename = filenumber + '.jpg';
    } else if(filenameLength === 3) {
      filename = '0' + filenumber + '.jpg';
    } else if(filenameLength === 2) {
      filename = '00' + filenumber + '.jpg';
    } else if(filenameLength === 1) {
      filename = '000' + filenumber + '.jpg';
    }
    return filename;
  },

  renderImages: (cable, n) => {

    let pictures = document.querySelectorAll('.picture'),
        preloadContainer = document.getElementById('preloadContainer');

    preloadContainer.innerHTML = '';

    if(!cable) cable = Mavis.Filter.Criteria.cable;

    if(n < Mavis.Data.CableData[cable].imageCount) n++;
    let nextImage = n + 1;

    let img = Mavis.Visual._formatFileName(n);
    let imgNext = Mavis.Visual._formatFileName(nextImage);

    pictures.forEach(function (picture, index) {
      let backgroundImg = Mavis.Visual.imagePath + index + '/' + img;
      picture.style.backgroundImage = 'url(' + backgroundImg + ')';

      if(nextImage <= Mavis.Data.CableData[Mavis.Filter.Criteria.cable].imageCount) {
        let preloadImg = Mavis.Visual.imagePath + index + '/' + imgNext,
            img = new Image();
        img.src = preloadImg;
        preloadContainer.appendChild(img);
      }
    });
  },

  filter: data => {
    let img = Mavis.Player._getFrame(data.cable, data.position);
    async function initialize() {
      await Mavis.Visual._setSides(data.cable);
      await Mavis.Visual._setPath(data.cable);
      await Mavis.Visual._setLastImage(data.cable);
      Mavis.Visual.renderImages(data.cable, img);
    }
    initialize();
  },

  init: data => {
    return new Promise((resolve, reject) => {
      let img = Mavis.Player._getFrame(data.cable, data.position);
      async function initialize() {
        await Mavis.Visual._render();
        await Mavis.Visual._setSides(data.cable);
        await Mavis.Visual._setPath(data.cable);
        await Mavis.Visual._setLastImage(data.cable);
        Mavis.Visual.renderImages(data.cable, img);
        resolve();
      }

      initialize();
    });
  }
};

module.exports = Mavis.Visual;




