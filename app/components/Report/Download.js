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
/*
    Mavis.LoadingScreen.toggle('show');
    Mavis.Download._data();

    // require modules
    let fs = require('fs');
    let archiver = require('archiver');

    // create a file to stream archive data to.
    let output = fs.createWriteStream(Mavis.AppPath + '/example.zip');
    let archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function() {
      Mavis.LoadingScreen.toggle('hide');

      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', function() {
      Mavis.LoadingScreen.toggle('hide');
      console.log('Data has been drained');
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function(err) {
      Mavis.LoadingScreen.toggle('hide');
      if (err.code === 'ENOENT') {
        // log warning
      } else {
        // throw error
        throw err;
      }
    });

    // good practice to catch this error explicitly
    archive.on('error', function(err) {
      Mavis.LoadingScreen.toggle('hide');
      throw err;
    });

    // pipe archive data to the file
    archive.pipe(output);

    // append a file from stream
    console.log(Mavis.AppPath + '/data/rheinknie/0/0/0001.jpg');
    let file1 = Mavis.AppPath + '/data/rheinknie/0/0/0001.jpg';
    archive.append(fs.createReadStream(file1), { name: 'image.jpg' });

    // append a file from string
//    archive.append('string cheese!', { name: 'file2.txt' });

    // append a file from buffer
//    var buffer3 = Buffer.from('buff it!');
//    archive.append(buffer3, { name: 'file3.txt' });

    // append a file
//    archive.file(file1, { name: 'iamge.jpg' });

    // append files from a sub-directory and naming it `new-subdir` within the archive
//    archive.directory('subdir/', 'new-subdir');

// append files from a sub-directory, putting its contents at the root of archive
//    archive.directory('subdir/', false);

// append files from a glob pattern
//    archive.glob('subdir/*.txt');

// finalize the archive (ie we are done appending files but streams have to finish yet)
// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize();
    Mavis.LoadingScreen.toggle('hide');



    let __dirname = process.cwd();
    const archive = Mavis.Global.archiver('zip');
    const output = Mavis.Global.fs.createWriteStream(__dirname + '/tmp/bilder.zip');

    output.on('close', function() {
//      document.getElementById('updating').style.display = 'none';
      Mavis.LoadingScreen.toggle('hide');
      link = document.createElement("a");
      link.href = 'tmp/bilder.zip';
      link.download = 'bilder.zip';
      link.style = "visibility:hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    archive.on('error', function(err) {
      Mavis.LoadingScreen.toggle('hide');
      console.log(err);
      throw err;
    });

    archive.pipe(output);

    for(const result of Mavis.Download.Data) {
      for(const image of result.images) {
        // data.push(Mavis.AppPath + '/data' + image);
        let file = Mavis.AppPath + '/data' + image;
        archive.append(Mavis.Global.fs.createReadStream(file), { name: file});
        console.log(file);
      }
    }

    archive.finalize();

*/
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