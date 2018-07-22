const Mavis = require('../Global/Global');

Mavis.Visual = {

	sides: 0,
	imagePath: undefined,
	lastImage: null,

	_render: () => {

		return new Promise(function(resolve, reject) {

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

  _setSides: () => {

    return new Promise(function(resolve, reject) {

      Mavis.Visual.sides = Number(Mavis.Data.Construction.meta.cableSides.length);

      resolve();
    });
  },

  setPath: cable => {

    return new Promise(function(resolve, reject) {

      Mavis.Visual.imagePath = "/static/" + Mavis.Data.State.currentObject + "/images/" + cable + '/';

      resolve();
    });
  },

  _setLastImage: () => {

    return new Promise(function(resolve, reject) {

      Mavis.Visual.lastImage = Mavis.Data.CableData[Mavis.Data.Filter.Cable].trigger.length;

      resolve();
    });
  },

  renderImages: n => {

    let pictures = document.querySelectorAll('.picture'),
        preloadContainer = document.getElementById('preloadContainer');

    if(n < Mavis.Data.CableData[Mavis.Data.Filter.Cable].imageCount) n++;
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

  init: data => {

    return new Promise(function(resolve, reject) {

      let img = Mavis.Player._getFrame(data.position);

      Mavis.Visual._render()
        .then(Mavis.Visual._setSides())
        .then(Mavis.Visual.setPath(data.cable))
        .then(Mavis.Visual._setLastImage())
        .then(function() {
          Mavis.Visual.renderImages(img)
        })
        .then(resolve());
    });
  }
};

module.exports = Mavis.Visual;




