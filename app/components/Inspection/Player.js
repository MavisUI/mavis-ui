const Mavis = require('../Global/Global');

Mavis.Player = {

  interval: null,
  speed: 400,
  maxPosition: 0,
  currentPosition: 0,
  currentFrame: null,

  _render: () => {

    return new Promise(function(resolve, reject) {

      const container = document.getElementById('controlsPlayer'),
        content = [
          '<label for="playerPosition">Position: </label>',
          '<input type="number" id="playerPosition" value="' + Mavis.Player.currentPosition + '" min="0" />',
          '<label > m</label>',
          '<button id="playerToStart" title="zum Anfang">',
          '<div class="icon iconToStart"></div>',
          '</button>',
          '<button id="playerPrevious" title="ein Frame zurück">',
          '<div class="icon iconSkipPrevious"></div>',
          '</button>',
          '<button id="playerPlayPause" title="Starten/Stoppen">',
          '<div class="icon iconPlay"></div>',
          '<div class="icon iconPause"></div>',
          '</button>',
          '<button id="playerNext" title="ein Frame weiter">',
          '<div class="icon iconSkipNext"></div>',
          '</button>',
          '<button id="playerToEnd" title="zum Ende">',
          '<div class="icon iconToEnd"></div>',
          '</button>',
          '<label for="playerSpeed">Geschwindigkeit: </label>',
          '<select id="playerSpeed" name="playerSpeed">',
          '<option value="1600">&#188; x</option>',
          '<option value="800">&#189; x</option>',
          '<option value="400" selected="selected">1 x</option>',
          '<option value="200">2 x</option>',
          '<option value="100">4 x</option>',
          '</select>'
        ];

      let player = document.createElement('menu');
      player.setAttribute('id', 'player');
      player.setAttribute('class', 'paused');
      player.setAttribute('data-posititon', Mavis.Player.currentPosition);
      player.innerHTML = content.join('');

      container.appendChild(player);
      resolve();
    });
  },

  // set maximum vales according to cable length
  _setMax: () => {

    return new Promise(function(resolve, reject) {

      let max = Number(Mavis.Data.CableData[Mavis.Data.Filter.Cable].drivenLength),
          el = document.getElementById('playerPosition');

      // set input to max value so user can't enter a position higher than possible
      el.setAttribute('max', max);

      // also set this as a local var to access for player
      Mavis.Player.maxPosition = max;

      resolve();
    });
  },

  // find trigger for image name
  _getFrame: position => {

    let _biggerElements = inArray => {
      return inArray < position;
    };

    let res = Mavis.Data.CableData[Mavis.Data.Filter.Cable].trigger.filter(_biggerElements),
        n = res.length;

    if(n < 0) n = 0;

    return(n);
  },

  // pause
  pause: () => {

    // toggle player class to toggle playbutton icon
    let player = document.getElementById('player');
    player.setAttribute('class', 'paused');

    // clear interval
    clearInterval(Mavis.Player.interval);
  },

  // play
  play: () => {

    // toggle player class to toggle playbutton icon
    let player = document.getElementById('player');
    player.setAttribute('class', 'playing');

    // run interval
    Mavis.Player.interval = setInterval(function() { Mavis.Player.playing(Number(Mavis.Player.currentPosition)); }, Mavis.Player.speed);
  },

  playing: position => {

    // calculate new position
    // would be so much easier, if += 0.01 didn't produce weird rounding errors...
    position = (position * 100);
    position++;
    position = (position / 100).toFixed(2);

    Mavis.Player.playerSet(position);
  },

  playerSet: position => {

    let n = Number(position).toFixed(2);

    if(n <= Mavis.Player.maxPosition) {

      Mavis.Player.currentPosition = n;
      document.getElementById('playerPosition').value = n;

      // check triggers for images
      let frame = Number(Mavis.Player._getFrame(n));

      if(frame != Mavis.Player.currentFrame) {
        Mavis.Player.currentFrame = Number(frame);
        Mavis.Visual.renderImages(frame);
      }

      // run graph
      Mavis.Graph.plotLine(position);
      Mavis.Graph.zoom();

      // update position input in comments
      // document.getElementById('commentPosition').value = position;

    // if the max position has been reached
    }  else {
      // pause player;
      Mavis.Player.pause();
    }
  },

  _events: () => {

    return new Promise(function(resolve, reject) {

      // elements that trigger events
      let player = document.getElementById('player'),
          inputPosition = document.getElementById('playerPosition'),
          btnToStart = document.getElementById('playerToStart'),
          btnPrevious = document.getElementById('playerPrevious'),
          btnPlay = document.getElementById('playerPlayPause'),
          btnNext = document.getElementById('playerNext'),
          btnToEnd = document.getElementById('playerToEnd'),
          selectSpeed = document.getElementById('playerSpeed');

      // play button
      btnPlay.addEventListener('click', function(e) {

        e.preventDefault();

        // toggle button and pause or play
        if(player.classList.contains('paused')) {
          Mavis.Player.play();
        } else {
          Mavis.Player.pause();
        }
      });

      // position input
      inputPosition.addEventListener('focusout', function(e) {

        // get input value
        let inputValue = this.value,
            position = Number(inputValue).toFixed(2);

        // check if position is within cable length
        if(position >= 0 && position <= Mavis.Player.maxPosition) {

          // set player position
          Mavis.Player.playerSet(position);

        } else {
          this.value = Number(Mavis.Player.currentPosition);
        }
      });

      // button to start
      btnToStart.addEventListener('click', function(e) {

        e.preventDefault();

        // pause player
        Mavis.Player.pause();

        // set position to 0
        Mavis.Player.playerSet(0);

      });

      // btn to end
      btnToEnd.addEventListener('click', function(e) {

        e.preventDefault();

        // pause player
        Mavis.Player.pause();

        Mavis.Player.playerSet(Mavis.Data.CableData[Mavis.Data.Filter.Cable].drivenLength);

      });

      // button one frame back
      btnPrevious.addEventListener('click', function(e) {

        e.preventDefault();

        // pause player
        Mavis.Player.pause();

        let previousFrame = Mavis.Player.currentFrame - 1;

        if(previousFrame >= 0) {
          let position = Number(Mavis.Data.CableData[Mavis.Data.Filter.Cable].trigger[previousFrame]);
          Mavis.Player.playerSet(position);
        }
      });

      // btn to next frame
      btnNext.addEventListener('click', function(e) {

        e.preventDefault();

        // pause player
        Mavis.Player.pause();

        let nextFrame = Mavis.Player.currentFrame + 1;

        if(nextFrame <= Mavis.Data.CableData[Mavis.Data.Filter.Cable].imageCount) {
          let position = Mavis.Data.CableData[Mavis.Data.Filter.Cable].trigger[nextFrame];
          Mavis.Player.playerSet(position);
        }
      });

      // change player speed
      selectSpeed.addEventListener('change', function(e) {

        // pause player
        Mavis.Player.pause();

        // set player speed var
        Mavis.Player.speed = Number(this.value);

      });

      resolve();

    });
  },

  init: data => {

    return new Promise(function(resolve, reject) {

      Mavis.Player.currentPosition = Number(data.position);
      Mavis.Player.currentFrame = Mavis.Player._getFrame(data.position);

      Mavis.Player._render()
        .then(Mavis.Player._setMax())
        .then(function() {
            Mavis.Player.playerSet(data.position)
        })
        .then(Mavis.Player._events())
        .then(resolve());
    });
  }
};

module.exports = Mavis.Player;