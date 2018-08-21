const Mavis = require('../Global/Global');

Mavis.LoadingScreen = {

	toggle: state => {
    const loadingScreen = document.getElementById('loading'),
          spinner = document.getElementById('spinnerElement');

    if(state === 'show') {
      loadingScreen.classList.remove('hidden');
      spinner.classList.add('spinning');
    } else {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        spinner.classList.remove('spinning');
      }, 1000);
    }
	},

	message: txt => {
    setTimeout(() => {
      const statusText = document.getElementById('statusText');
      statusText.innerHTML = txt;
    }, 100);
	},

	init: () => {
	  return new Promise((resolve, reject) => {
	    console.log('init LoadingScreen');
      Mavis.LoadingScreen.message('Loading Application');
      resolve();
    });
	}
};

module.exports = Mavis.LoadingScreen;