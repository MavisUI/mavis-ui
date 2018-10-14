const Mavis = require('../Global/Global');
import exportFromJSON from 'export-from-json';

Mavis.Download = {

  Data: [],

  _render: () => {
    return new Promise((resolve, reject) => {
      let container = document.getElementById('reportDownload'),
          content = [
            '<button id="downloadXls" class="downloadButton" data-format="xls">als .XLS speichern</button>',
            '<button id="downloadCsv" class="downloadButton" data-format="csv">als .CSV speichern</button>',
            '<button id="downloadJson" class="downloadButton" data-format="json">als .JSON speichern</button>',
            '<button id="downloadTxt" class="downloadButton" data-format="txt">als .TXT speichern</button>',
            '<button id="downloadImages">Bilder speichern</button>',
          ];
      container.innerHTML = content.join('');
      resolve();
    });
  },

  _data: () => {
    Mavis.Filter.Data.forEach(function(result, i) {
      let item = {};
      item.id = (i + 1);
      item.label = result.label;
      item.caption = result.caption;
      item.rating = 'SK' + result.rating;
      item.cable = Mavis.List.Cables[result.cable];
      item.position = result.position.toFixed(2) + ' m';
      item.distance = result.distance;
      item.value = result.value;
      item.sides = result.sides;
      item.images = result.images;
      Mavis.Download.Data.push(item);
    });
  },

  _saveDocument: e => {
    Mavis.Download._data();
    const data = Mavis.Download.Data,
          fileName = 'mavis',
          exportType = e.target.getAttribute('data-format');
    exportFromJSON({data, fileName, exportType});
  },

  _saveImages: e => {

    Mavis.LoadingScreen.toggle('show');
    Mavis.Download._data();
    Mavis.LoadingScreen.toggle('hide');
  },

  _events: () => {
    return new Promise((resolve, reject) => {

      let documentDownloads = document.querySelectorAll('.downloadButton');
      for (const button of documentDownloads) {
        button.addEventListener('click', Mavis.Download._saveDocument);
      }
      document.getElementById('downloadImages').addEventListener('click', Mavis.Download._saveImages);
      resolve();
    });
  },

  init: () => {
    return new Promise((resolve, reject) => {

      async function initialize() {
        await Mavis.Download._render();
        await Mavis.Download._events();
        resolve();
      }
      initialize();
    });
  }
};

module.exports = Mavis.Download;

/*
  _updateImg: (id, img) => {
    Mavis.Data.Stores['results']
      .update({_id: id}, {$set: {images: img}});
  },

  _fixImages: () => {
    Mavis.Data.Stores['results']
      .find({})
      .then(results => {
        results.forEach(result => {
          let images = [];
          result.sides.forEach(side => {
            let x = Number(side) -1;
            let n = Mavis.Player._getFrame(result.cable, result.position);
            n++;
            let img = Mavis.Visual._formatFileName(n),
                path = '/data/' + Mavis.Data.State.activeBridge + '/' + result.cable + '/' + x + '/' + img;
                images.push(path);
          });
          Mavis.Download._updateImg(result._id, images);
        });
      });
  },
*/

/*

  CableData: [],

  _getTrigger: (cable, position) => {

    let _biggerElements = inArray => {
      return inArray < position;
    };

    let res = Mavis.Download.CableData[cable].trigger.filter(_biggerElements),
        n = res.length;
    if(n < 0) n = 0;
    return(n);
  },

writeImages: () => {


let bridge = Mavis.Data.State.activeBridge,
  cable = Mavis.Data.State.activeCable,
  images = new Array();

Mavis.Data.Stores['construction']
.find({})
.then(results => {
  Mavis.Download.CableData = results[0].cables;

  for(const data of Mavis.Filter.Data) {

    let img = Mavis.Download._getTrigger(data.cable, data.position);

    let obj = {};
    obj.id = data._id;
    obj.images = [];

    for(const side of data.sides) {
      let image = '/' + bridge + '/' + data.cable + '/' + side + '/' + img + '.jpg';
      obj.images.push(image);
    }

    // images.push(obj);

    Mavis.Data.Stores['results']
      .update({ _id: obj.id }, { $set: { images: obj.images } })
      .then(results => {
        console.log(results);
      });
  }

//         console.log(images);
});



},



  _getImages: item => {

    console.log(Mavis.Data.State);

    const images = new Array(),
          __dirname = process.cwd() + '/../app/data/' + Mavis.Data.State.activeBridge + "/images/" + Mavis.Data.State.activeCable + '/',
          activeSides = item.sides;

    for(const side of activeSides) {
      let filename = __dirname + side + '/1.jpg';
      images.push(filename);
    }

    return images;


    let
        images = [],
        i;

    for(i=0; i<6; i++) {
      if(item.sides.length === 0 || item.sides.indexOf(i) > -1) {
        // if(Mavis.Global.fs.existsSync(item.images[i])) {
          var item = {};
          item.file = __dirname + '/' + item.images[i];

          // item.filename = Mavis.Data.Construction.cables[item.cable].name + '_#' + casenum + '_Bild-' + (i + 1) + '.JPG';
          images.push(item);
        // }
      }
    }

    console.log(images);
    return null;

},



*/