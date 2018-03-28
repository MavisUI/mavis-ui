

/*

MAVIS.MODELFILTER = {

	active: [],
	ratings: [],

	MARKER: {

		render: function() {

			return new Promise(function(resolve, reject) {

				$('#modelfilter_marker').empty();

				$(MAVIS.DATA.CONFIG.MODULES).each(function(i) {

					var 	n, label, selection,
						check = '',
						mod = MAVIS.DATA.CONFIG.MODULES[i].label.toLowerCase();

					if(i <= 3) {
						n = i;
						label = MAVIS.DATA.CONFIG.MODULES[i].name;
					} else {
						n = i -4;
						label = 'user' + n;
					}

					if(MAVIS.MODELFILTER.active.indexOf(mod) > -1) {
						check = ' checked';
					}


					selection = '<input type="checkbox" name="' + label + '" data-id="' + mod + '" ' + check + '/><label for="' + label + '"><div class="mod_color" style="background-color: ' + this.color + '"></div>' + MAVIS.DATA.CONFIG.MODULES[i].label + '</label>';

					if(MAVIS.DATA.CONFIG.MODULES[i].active === true) {

						$('#modelfilter_marker').append(selection);
					}
				});

				resolve();
			});
		},

		events: function() {

			return new Promise(function(resolve, reject) {

				$('#modelfilter_marker input').on('change', function() {

					var 	n = $(this).data('id'),
						check = $(this)[0].checked;

					MAVIS.UPDATING.show().then(function() {

						if(check === true) {
							MAVIS.MODELFILTER.active.push(n);
						} else {
							var x = MAVIS.MODELFILTER.active.indexOf(n);
							MAVIS.MODELFILTER.active.splice(x, 1);
						}

						MAVIS.MODEL.OBJECT._update_scene();
					});

				});

				resolve();
			});
		},

		init: function() {

			return new Promise(function(resolve, reject) {

				MAVIS.MODELFILTER.MARKER.render()
				.then(MAVIS.MODELFILTER.MARKER.events())
				.then(resolve());
			});
		}
	},

	RATING: {

		render: function() {

			return new Promise(function(resolve, reject) {

				if(MAVIS.MODELFILTER.ratings.length > 0) {

					$(MAVIS.MODELFILTER.ratings).each(function(i) {

						$('#modelfilter_rating_selection input').eq(this).attr('checked','checked');

					});
				}

				resolve();
			});
		},

		events: function() {

			return new Promise(function(resolve, reject) {

				$('#modelfilter_rating_selection input').on('change', function() {

					var 	n = $(this).data('id'),
						check = $(this)[0].checked;

					MAVIS.UPDATING.show().then(function() {

						if(check === true) {
							MAVIS.MODELFILTER.ratings.push(n);
						} else {
							var x = MAVIS.MODELFILTER.ratings.indexOf(n);
							MAVIS.MODELFILTER.ratings.splice(x, 1);
						}

						MAVIS.MODEL.OBJECT._update_scene();
					});
				});

				resolve();
			});
		},

		init: function() {

			return new Promise(function(resolve, reject) {

				MAVIS.MODELFILTER.RATING.render()
				.then(MAVIS.MODELFILTER.RATING.events())
				.then(resolve());

			});
		}
	},

	resize: function() {

		return new Promise(function(resolve, reject) {

			var content_height = Math.ceil($(window).innerHeight() - $('header').height() + 5);
			$('#modelfilter').height(content_height + 'px');

			resolve();
		});
	},

	events: function() {

		return new Promise(function(resolve, reject) {

			$('#modelfilter_toggle').on('click', function(e) {

				$('#modelfilter').toggleClass('hidden');
				$('#cable_info').removeClass('show');
				MAVIS.MODEL.CONTROLS.intersect = 0;

			});

			resolve();
		});
	},

	init: function() {

		return new Promise(function(resolve, reject) {

			MAVIS.MODELFILTER.resize()
			.then(MAVIS.MODELFILTER.MARKER.init())
			.then(MAVIS.MODELFILTER.RATING.init())
			.then(MAVIS.MODELFILTER.events())
			.then(resolve());
		});
	}
};

*/