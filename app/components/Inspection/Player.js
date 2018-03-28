const Mavis = require('../Global/Global');

Mavis.Player = {

	interval: null,
	speed: 400,
	currentPosition: 0,
	maxPosition: 0,

	_render: () => {

		return new Promise(function(resolve, reject) {

			const container = document.getElementById('controlsPlayer'),
					content = [
						'<label for="playerPosition">Position: </label>',
						'<input type="number" id="playerPosition" value="0.00" min="0" />',
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
							'<option value="1600">&#188;</option>',
							'<option value="800">&#189; x</option>',
							'<option value="400" selected="selected">1 x</option>',
							'<option value="200">2 x</option>',
							'<option value="100">4 x</option>',
						'</select>'
					];

			let player = document.createElement('menu');
			player.setAttribute('id', 'player');
			player.setAttribute('class', 'paused');
			player.setAttribute('data-posititon', '0.00');
			player.innerHTML = content.join('');

			container.appendChild(player);
			resolve();
		});
	},

	_setMax: () => {

		return new Promise(function(resolve, reject) {

			let 	max = Number(Mavis.Data.CableData[Mavis.CableSelection.current].drivenLength),
					el = document.getElementById('playerPosition');

			// set input to max value so user can't enter a position higher than possible
			el.setAttribute('max', max);

			// also set this as a local var to access for player
			Mavis.Player.maxPosition = max;

			resolve();
		});
	},

	// play
	play: () => {

		// toggle player class to toggle playbutton icon
		let player = document.getElementById('player');
		player.setAttribute('class', 'playing');

		// run interval
		Mavis.Player.interval = setInterval(function() { Mavis.Player.run(); }, Mavis.Player.speed);
	},

	// pause
	pause: () => {

		// toggle player class to toggle playbutton icon
		let player = document.getElementById('player');
		player.setAttribute('class', 'paused');

		// clear interval
		clearInterval(Mavis.Player.interval);
	},

	// actions to run while on the move
	run: position => {

		// check if a specific position has been passed, if not, get the current position
		if(position === undefined) {

			position = Number(Mavis.Player.currentPosition);

			// calculate new position
			// would be so much easier, if += 0.01 didn't produce weird rounding errors...
			position = (position * 100);
			position++;
			position = (position / 100).toFixed(2);
		}

		// check if the new position isn't larger than the cable is long...
		if(position <= Mavis.Player.maxPosition) {

			// update position var
			Mavis.Player.currentPosition = position;

			// update position input in player
			document.getElementById('playerPosition').value = position;

			// update position input in comments
			///// document.getElementById('commentPosition').value = position;

			// run visual
			Mavis.Visual.run(position);

			// run plotLine
			Mavis.Graph.plotLine(position);

			// handle zoom on playing
			Mavis.Graph.zoom();

		// if the max position has been reached
		} else {

			// pause player;
			Mavis.Player.pause();
		}
	},

	reset: () => {

		Mavis.Player._setMax();
		Mavis.Player.run(0);
	},

	_events: () => {

		return new Promise(function(resolve, reject) {

			// elements that trigger events
			let 	player = document.getElementById('player'),
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
				let 	inputValue = this.value,
						position = Number(inputValue).toFixed(2);

				// check if position is within cable length
				if(position >= 0 && position <= Mavis.Player.maxPosition) {

					// set player position
					Mavis.Player.run(position);

					// set visual frame
					Mavis.Visual.jump(Mavis.Visual._findImageTrigger(position));

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
				Mavis.Player.run(0);

				// set images to first
				Mavis.Visual.jump(1);

			});

			// button one frame back
			btnPrevious.addEventListener('click', function(e) {

				e.preventDefault();

				// pause player
				Mavis.Player.pause();

				// get previous frame
				let prev = Mavis.Visual.arrPosition - 1;

				if(prev >= 0) {
					// set player to previous frame
					Mavis.Player.run(Mavis.Data.CableData[Mavis.Filter.Data.Cable].trigger[prev]);

					// set visual to previous frame
					Mavis.Visual.jump(prev);
				}
			});

			// btn to next frame
			btnNext.addEventListener('click', function(e) {

				e.preventDefault();

				// pause player
				Mavis.Player.pause();

				// get index for next image in the trigger array
				let next = Mavis.Visual.arrPosition+1;

				// if the visual hasen't reached its end
				if(next <= Mavis.Data.CableData[Mavis.Filter.Data.Cable].imageCount) {

					// set player to frame position
					Mavis.Player.run(Mavis.Data.CableData[Mavis.Filter.Data.Cable].trigger[next]);

					// set visual to frame
					Mavis.Visual.jump(next);
				}
			});

			// btn to end
			btnToEnd.addEventListener('click', function(e) {

				e.preventDefault();

				// pause player
				Mavis.Player.pause();

				// get last trigger in array and its position
				let 	last = Mavis.Data.CableData[Mavis.CableSelection.current].trigger.length - 1,
						position = Mavis.Data.CableData[Mavis.CableSelection.current].trigger[last];

				// set player position
				Mavis.Player.run(position);

				// set visual frame
				Mavis.Visual.jump(last);
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

	init: () => {

		return new Promise(function(resolve, reject) {

			Mavis.Player._render()
			.then(Mavis.Player._setMax())
			.then(Mavis.Player._events())
			.then(resolve());
		});
	}
};

module.exports = Mavis.Player;


