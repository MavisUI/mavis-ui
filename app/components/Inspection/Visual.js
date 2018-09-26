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

  renderImages: (cable, n) => {

    let pictures = document.querySelectorAll('.picture'),
        preloadContainer = document.getElementById('preloadContainer');
    if(!cable) cable = 0;

    if(n < Mavis.Data.CableData[cable].imageCount) n++;
    let nextImage = n + 1;

    pictures.forEach(function (picture, index) {

      let backgroundImg = Mavis.Visual.imagePath + index + '/' + n + '.jpg';

      let placehold = document.createElement('p');
      placehold.innerText = backgroundImg;

      // picture.setAttribute('style', 'background-image: url(\'' + backgroundImg + '\')');
      picture.appendChild(placehold);

/*
            if(nextImage <= Mavis.Data.CableData[Mavis.Filter.Data.Cable].imageCount) {

              let preloadImg = Mavis.Visual.imagePath + index + '/' + nextImage + '.jpg',
                  img = new Image();

              img.src = preloadImg;

              preloadContainer.appendChild(img);

            }
      */
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




