(function($) {
    $.fn.ResponsiveCountdown = function(options) {
    	var defaults = {
				new_custom_state: "",//new custom state
				custom_state: "",//current custom state
				use_custom_update: false,//if true dont follow timer but wait for update event
				set_id: 0,//digits font 0..1
				pan_id: 0,//panel 0..2
				day_digits: 3,//number of day digits
				fillStyleSymbol1: "rgba(255,255,255,1)",//color of digits
				fillStyleSymbol2: "rgba(255,255,255,1)",//color of digits
				fillStylesPanel_g1_1: "rgba(100,100,100,1)",//color of most right group 1
				fillStylesPanel_g1_2: "rgba(30,30,30,1)",//color of most right group 2
				fillStylesPanel_g2_1: "rgba(80,80,130,1)",//color of next group 1
				fillStylesPanel_g2_2: "rgba(20,20,60,1)",//color of next group 2
				text_color: "white",//captions color
				text_glow: "black",//captions glow
				text_blur: 0,//blur text label - 0 for none
				show_ss: true,//show/hide seconds
				show_mm: true,//show/hide minutes
				show_hh: true,//show/hide hours
				show_dd: true,//show/hide days
				f_family: "Verdana",//captions font
				f_weight: "normal",//normal or bold
				server_now_date: "",
				target_date: "2020/1/1 00:00:00",
				target_future: true,//future or past target date
				time_zone: 0,//-12..12
				show_labels: true,//show/hide labels
				paused: false,//flag for pause play handling
				type3d: "single",//perspective type single/group
				max_height: 300,//maximum height of the countdown
				days_long: "days",
				days_short: "dd",
				hours_long: "hours",
				hours_short: "hh",
				mins_long: "minutes",
				mins_short: "mm",
				secs_long: "seconds",
				secs_short: "ss",
				min_f_size: 9,//minimum font size
				max_f_size: 30,//maximum font size
				font_to_digit_ratio: 0.125,//font size set as percentage of digit height
				groups_spacing: 0,//space between groups = N * space between digits
				spacer: "none",//"none", "squares" or "circles"
				labels_space: 1.2,//f_size multiplier to define space between labels and digits. 1, 1.1, 1.5
				counter_width: 0,
				complete: null//function to execute on complete event
    	},
    	settings = $.extend({}, defaults, options);
    	var change_it = false;//flag for set options event
			var paused = settings.paused;
			var text_color = settings.text_color;
			var text_glow = settings.text_glow;
			var destroy_it = false;//flag for destroy event
			var panel_width_arr = [90, 140, 150];//panels width
			var panel_svg = [];
			//panels drawings in SVG format
			panel_svg[0] = ["M30,75V15.042C30,6.734,34.825,0,40.777,0h68.445C115.175,0,120,6.734,120,15.042V75z", "M120,75v59.958c0,8.308-4.825,15.043-10.777,15.043H40.777C34.825,150,30,143.265,30,134.957V75z"];
			panel_svg[1] = ["M5,0h140v75h-140v-75z", "M5,75h140v75h-140v-75z"];
			panel_svg[2] = ["M0,75V15.042C0,6.734,4.825,0,10.777,0h128.446C145.175,0,150,6.734,150,15.042V75z", "M150,75v59.958c0,8.308-4.825,15.043-10.777,15.043H10.777C4.825,150,0,143.266,0,134.957V75z"];
			//digits drawings in SVG format Oswald and Federation
			var svg = [];
			svg[0] = [];svg[1] = [];
			//0
			svg[0][0] = "path|M60.937,75V46.75c0-11.938,2.051-23.438,14.063-23.438c12.012,0,14.063,11.499,14.063,23.438V75h18.75V46.75c0-23.145-10.328-38.818-32.813-38.818c-22.632,0-32.813,15.601-32.813,38.818V75H60.937z";
			svg[0][1] = "path|M89.063,75v28c0,11.353-2.564,23.438-14.063,23.438c-11.353,0-14.063-12.085-14.063-23.438V75h-18.75v28c0,22.559,10.84,38.818,32.813,38.818c22.12,0,32.813-16.113,32.813-38.818V75H89.063z";
			svg[1][0] = "path|M25.201,75v-3.881c0-16.86,2.37-27.271,7.113-31.237c4.744-3.963,17.051-5.946,36.921-5.946h12.431c19.669,0,31.9,2.009,36.693,6.023c4.793,4.016,7.19,14.402,7.19,31.16V75h11.4v-3.864c0-19.898-3.478-32.873-10.427-38.925c-6.951-6.049-21.823-9.075-44.625-9.075h-12.6c-23.1,0-38.126,3.026-45.075,9.075c-6.952,6.052-10.425,19.026-10.425,38.925V75H25.201z";
			svg[1][1] = "path|M125.551,75v5.152c0,16.662-2.372,26.975-7.115,30.938c-4.744,3.966-17,5.946-36.77,5.946H69.235c-19.771,0-32.053-2.007-36.846-6.021s-7.188-14.302-7.188-30.862V75h-11.4v5.136c0,19.8,3.499,32.7,10.5,38.7c6.999,6,21.999,9,45,9h12.6c22.801,0,37.674-3.023,44.625-9.075c6.949-6.049,10.426-18.923,10.426-38.625V75H125.551z";
			//1
			svg[0][2] = "path|M70.312,75h18.75V9.25H75c-3.662,7.104-10.986,11.279-18.75,14.063v14.063h14.063L70.312,75L70.312,75z";
			svg[0][3] = "rect|70.312 75 18.75 65.5";
			svg[1][2] = "polygon|77.551,34.369 77.551,75 89.701,75 89.701,23.586 72.301,23.586 39.903,54.938 47.844,62.279";
			svg[1][3] = "rect|77.551 75 12.15 52.836";
			//2
			svg[0][4] = "path|M61.669,46.75c0-11.426,2.856-23.438,14.063-23.438c9.668,0,14.063,9.082,14.063,18.75c0,14.648-7.105,22.925-14.063,32.813L75.645,75h21.979c5.959-8.902,10.922-18.439,10.922-32.938c0-21.313-11.207-34.131-32.813-34.131c-23.511,0-32.813,15.308-32.813,38.818v4.688h18.75V46.75z";
			svg[0][5] = "path|M94.482,79.563c1.064-1.516,2.115-3.031,3.141-4.563H75.645l-32.798,46.75v18.75h65.699v-18.75H61.669L94.482,79.563z";
			svg[1][4] = "path|M35.989,38.436c5.691-3,16.772-4.5,33.249-4.5h12.879c17.07,0,28.402,1.852,33.996,5.551c4.789,3.201,7.188,9.449,7.188,18.75c0,8.001-2.672,13.45-8.014,16.35c-0.264,0.143-0.551,0.278-0.84,0.414h17.035c2.14-4.323,3.219-9.93,3.219-16.844c0-13.369-3.352-22.446-10.051-27.236c-7.199-5.189-21.353-7.784-42.449-7.784h-12.9c-19.5,0-33.3,2.351-41.4,7.05C20.3,34.588,16.5,41.938,16.5,52.236h12.3C28.801,45.537,31.196,40.937,35.989,38.436z";
			svg[1][5] = "path|M27,109.796c0-7.139,2.25-12.114,6.75-14.932c5.499-3.417,15.9-5.128,31.2-5.128H82.5c21.398,0,35.75-2.543,43.051-7.635c2.487-1.75,4.459-4.123,5.934-7.103h-17.037c-5.614,2.623-16.389,3.937-32.34,3.937H63.833c-17.576,0-30.009,2.451-37.298,7.351s-10.934,12.802-10.934,23.7v17.85H134.25v-10.8H27V109.796z";
			//3
			svg[0][6] = "path|M75.916,23.313c11.205,0,14.063,7.324,14.063,18.75c0,13.77-5.055,18.75-18.75,18.75V75h27.26c-2.424-2.101-5.256-3.728-8.51-4.813c11.352-3.516,18.75-12.891,18.75-28.125c0-21.313-11.207-34.131-32.813-34.131c-21.46,0-32.813,12.891-32.813,34.131v4.688h18.75C61.853,33.713,63.318,23.313,75.916,23.313z";
			svg[0][7] = "path|M98.488,75h-27.26v4.563c14.063,0,18.75,9.375,18.75,23.438c0,13.037-1.465,23.438-14.063,23.438c-12.598,0-14.063-10.4-14.063-23.438h-18.75v4.688c0,21.313,11.206,34.131,32.813,34.131c23.51,0,32.813-15.308,32.813-38.818C108.729,90.448,105.229,80.843,98.488,75z";
			svg[1][6] = "path|M36.889,39.071c5.191-3.122,14.875-4.686,29.053-4.686h16.324c16.473,0,27.453,1.357,32.947,4.069c4.49,2.21,6.738,6.478,6.738,12.804c0,7.031-2.051,11.803-6.15,14.313c-3.4,2.109-9.352,3.164-17.85,3.164H63.75V75h58.803c-1.354-0.56-2.85-1.05-4.503-1.464c5.3-1.805,8.897-3.76,10.8-5.869c3-3.31,4.5-8.774,4.5-16.399c0-10.729-3.25-18.025-9.75-21.888c-6.5-3.862-19.5-5.794-39-5.794H62.85c-17.7,0-29.901,2.916-36.6,8.742c-5.1,4.423-7.65,11.608-7.65,21.558H30C30,46.831,32.295,41.893,36.889,39.071z";
			svg[1][7] = "path|M122.553,75H63.75v4.536h34.201c9.199,0,15.248,0.849,18.148,2.54c3.899,2.293,5.852,7.371,5.852,15.238c0,7.871-2.521,13.123-7.564,15.763c-5.041,2.64-15.648,3.959-31.822,3.959H64.595c-13.58,0-22.739-1.313-27.48-3.942C32.37,110.464,30,105.58,30,98.436H18.6c0,11.201,3.023,18.9,9.075,23.102c6.049,4.199,17.874,6.3,35.475,6.3H84.6c19.6,0,32.799-2.349,39.602-7.05c6.098-4.2,9.148-12.051,9.148-23.551c0-6.601-0.951-11.799-2.851-15.601C129.091,78.818,126.438,76.607,122.553,75z";
			//4
			svg[0][8] = "polygon|64.704,75 78.771,32.688 78.771,75 97.521,75 97.521,9.177 74.084,9.177 45.946,75";
			svg[0][9] = "polygon|97.521,75 78.771,75 78.771,89.084 60.022,89.084 64.704,75 45.946,75 41.272,85.936 41.272,106.809 78.771,106.809 78.771,140.5 97.521,140.5 97.521,106.809 112.023,106.809 112.023,89.084 97.521,89.084";
			svg[1][8] = "polygon|59.145,75 108.75,35.961 108.75,75 120.15,75 120.15,23.586 108,23.586 42.459,75";
			svg[1][9] = "polygon|120.15,75 108.75,75 108.75,94.536 34.32,94.536 59.145,75 42.459,75 17.553,94.538 17.551,105.336 108.75,105.336 108.75,127.836 120.15,127.836 120.15,105.336 135,105.336 135,94.536 120.15,94.536";
			//5
			svg[0][10] = "path|M64.63,75c2.55-3.498,6.453-6.372,11.542-6.372c6.338,0,9.814,2.41,11.719,6.372h18.989c-3.288-12.291-10.992-20.435-26.094-20.435c-7.983,0-13.916,1.831-18.75,4.688l1.172-31.787h41.016V8.716H46.216V75H64.63z";
			svg[0][11] = "path|M64.63,75H46.216v4.468h15.967C62.758,77.976,63.583,76.437,64.63,75zM87.891,75c2.015,4.188,2.271,10.11,2.271,16.772c0,16.699,0.879,34.57-15.454,34.57c-11.133,0-12.671-9.888-12.671-20.947v-2.93h-18.75c0,24.097,8.057,38.818,32.446,38.818c26.66,0,33.179-21.68,33.179-48.193c0-6.601-0.599-12.737-2.031-18.091H87.891z";
			
			svg[1][10] = "path|M37.59,68.361c4.556-1.148,10.441-1.726,17.653-1.726h37.86c12.088,0,20.483,2.792,25.203,8.364h13.739c-1.794-4.632-4.68-8.399-8.671-11.289c-7.251-5.25-18.674-7.875-34.273-7.875H57.75c-8.801,0-15.501,0.626-20.1,1.875c-4.601,1.252-7.702,2.925-9.3,5.025V34.386H131.4v-10.8H16.951v49.95h11.4C29.954,71.236,33.034,69.512,37.59,68.361z";
			svg[1][11] = "path|M118.307,75c3.024,3.57,4.545,8.277,4.545,14.136v5.101c0,8.5-2.427,14.427-7.274,17.774c-4.853,3.353-14.527,5.025-29.025,5.025h-24.9c-13.5,0-22.901-1.55-28.2-4.65c-4.702-2.7-7.05-7.399-7.05-14.1H15c0,10.2,3.525,17.677,10.575,22.425c7.05,4.751,18.375,7.125,33.975,7.125H90c15.999,0,27.375-2.572,34.125-7.725c6.75-5.149,10.125-13.774,10.125-25.875v-6.15c0-4.943-0.738-9.303-2.204-13.086H118.307z";
			//6
			svg[0][12] = "path|M103.752,75c-4.029-8.696-11.462-14.063-24.064-14.063c-9.302,0-15.454,3.662-18.75,9.375v-18.75c0-18.75,4.688-28.125,14.063-28.125c11.279,0,14.063,7.251,14.063,18.75h18.75C107.813,20.801,96.24,8.057,75,8.057c-25.415,0-32.813,22.485-32.813,48.193V75H103.752z";
			svg[0][13] = "path|M75,75c14.063,0,14.063,14.063,14.063,28.125c0,11.426-2.856,23.438-14.063,23.438c-11.133,0-14.063-11.938-14.063-23.438v-18.75C63.428,79.688,67.822,75,75,75H42.188v23.438c0,23.584,9.814,43.506,32.813,43.506c23.73,0,32.813-19.702,32.813-43.506c0-9.058-1.135-17.124-4.061-23.438H75z";
			svg[1][12] = "path|M95.102,66.186H55.801c-9.6,0-16.552,1.051-20.85,3.15c-2.462,1.232-4.459,3.121-5.993,5.664h99.083c-0.553-0.509-1.127-1.001-1.74-1.464C119.701,68.638,109.299,66.186,95.102,66.186zM28.351,75V58.986c0-9.699,2.021-16.374,6.066-20.025c4.043-3.649,11.655-5.475,22.837-5.475H91.85c11.683,0,19.967,1.649,24.86,4.949c4.294,2.902,6.44,7.5,6.44,13.801h11.399c0-10.299-3.728-17.799-11.176-22.5c-7.45-4.699-19.875-7.051-37.274-7.051H62.7c-17.302,0-29.351,2.752-36.15,8.25c-6.802,5.501-10.2,15-10.2,28.5V75H28.351z";
			svg[1][13] = "path|M128.041,75H28.958c-0.211,0.35-0.414,0.711-0.607,1.086V75h-12v15.636c0,14.501,3,24.401,9,29.7c5.599,5.002,16.05,7.5,31.35,7.5h38.4c14.797,0,25.398-2.4,31.799-7.2c5.701-4.298,8.552-11.1,8.552-20.399v-6.149C135.451,85.902,132.975,79.545,128.041,75z M123.15,99.336c0,5.801-1.926,10.2-5.775,13.2s-10.225,4.5-19.125,4.5H52.201c-8.501,0-14.602-1.522-18.3-4.575c-3.701-3.049-5.55-7.425-5.55-13.125v-4.5c0-5.4,1.849-9.648,5.55-12.75c4.099-3.398,10.298-5.1,18.6-5.1h46.05c8.498,0,14.85,1.75,19.051,5.25c3.697,3.101,5.549,7.301,5.549,12.6V99.336L123.15,99.336z";
			//7
			svg[0][14] = "polygon|72.272,75 89.479,75 100.561,18.259 100.561,9.25 48.046,9.25 48.046,24.851 82.689,24.851";
			svg[0][15] = "polygon|72.272,75 58.667,140.5 76.684,140.5 89.479,75";
			svg[1][14] = "polygon|81.6,75 97.572,75 141,33.486 141,23.586 10.651,23.586 10.651,34.386 123.992,34.386";
			svg[1][15] = "polygon|81.6,75 26.424,127.861 42.301,127.836 97.572,75";
			//8
			svg[0][16] = "path|M56.397,71.213c-1.818,1.158-3.444,2.412-4.893,3.787h46.943c-1.422-1.37-3.008-2.625-4.77-3.787c8.274-6.226,12.229-14.941,12.229-29.15c0-21.021-9.814-34.131-30.834-34.131c-21.094,0-30.981,13.037-30.981,34.131C44.092,56.271,48.121,64.987,56.397,71.213z M75.074,23.313c9.521,0,11.719,9.229,11.719,18.75c0,10.254-1.465,20.581-11.719,20.581c-10.327,0-11.865-10.327-11.865-20.581C63.208,32.395,65.406,23.313,75.074,23.313z";
			svg[0][17] = "path|M98.447,75H51.504c-6.434,6.104-9.316,14.623-9.316,28.073c0,23.877,8.936,38.745,32.886,38.745c23.877,0,32.738-14.868,32.738-38.745C107.813,89.658,104.82,81.145,98.447,75z M75.074,126.438c-12.671,0-14.136-10.84-14.136-23.363c0-11.499,2.49-22.485,14.136-22.485c11.572,0,13.988,11.06,13.988,22.485C89.063,115.451,87.672,126.438,75.074,126.438z";
			svg[1][16] = "path|M23.401,69.704c3.698,3.206,8.648,4.807,14.85,4.807c-1.878,0-3.634,0.176-5.295,0.489h88.216c-1.797-0.366-3.729-0.564-5.82-0.564c6.099,0,11.047-1.649,14.851-4.949c4.198-3.699,6.299-9.15,6.299-16.351v-3.75c0-8.7-2.899-15.248-8.698-19.649c-6.103-4.699-15.503-7.051-28.201-7.051h-46.5c-12.3,0-21.501,2.354-27.6,7.06c-5.7,4.406-8.55,10.967-8.55,19.679v3.757C16.951,60.49,19.1,65.998,23.401,69.704z M29.25,49.836c0-5.6,1.749-9.649,5.25-12.15c3.9-2.798,10.549-4.199,19.95-4.199H99c9.5,0,16.201,1.401,20.102,4.199c3.397,2.501,5.101,6.551,5.101,12.15v2.55c0,6-1.978,10.401-5.927,13.2c-3.95,2.801-11.174,4.2-21.674,4.2H56.551c-10.301,0-17.55-1.5-21.75-4.5c-3.701-2.6-5.55-6.9-5.55-12.9L29.25,49.836L29.25,49.836z";
			svg[1][17] = "path|M130.051,79.25c-2.385-2.126-5.354-3.532-8.879-4.25H32.956c-3.731,0.704-6.926,2.182-9.555,4.468c-4.301,3.808-6.45,9.314-6.45,16.523v5.106c0,8.613,2.974,15.223,8.925,19.828c5.949,4.607,15.023,6.909,27.225,6.909h46.5c12.697,0,22.023-2.28,27.976-6.844c5.946-4.562,8.924-11.205,8.924-19.933v-5.113C136.5,88.627,134.35,83.061,130.051,79.25zM124.201,100.62c0,5.623-1.852,9.765-5.551,12.425c-3.701,2.662-10.252,3.991-19.65,3.991H54.451c-9.501,0-16.076-1.329-19.725-3.991c-3.651-2.66-5.475-6.802-5.475-12.425v-3.914c0-6.022,1.974-10.44,5.925-13.254c3.949-2.81,11.074-4.216,21.375-4.216h40.051c10.398,0,17.748,1.507,22.049,4.519c3.699,2.61,5.552,6.929,5.552,12.951L124.201,100.62L124.201,100.62z";
			//9
			svg[0][18] = "path|M107.703,75V51.438c0-23.584-9.814-43.506-32.813-43.506c-23.73,0-32.813,19.702-32.813,43.506c0,9.118,1.15,17.23,4.119,23.563L107.703,75L107.703,75z M74.89,23.313c11.133,0,14.063,11.938,14.063,23.438V65.5c-2.564,4.688-6.813,9.375-14.063,9.375c-14.063,0-14.063-14.063-14.063-28.125C60.828,35.324,63.684,23.313,74.89,23.313z";
			svg[0][19] = "path|M46.196,75c4.042,8.622,11.464,13.938,24.006,13.938c9.301,0,15.381-3.734,18.75-9.375v18.75c0,18.75-4.688,28.125-14.063,28.125c-11.279,0-14.063-7.25-14.063-18.75h-18.75c0,21.388,11.572,34.131,32.813,34.131c25.416,0,32.813-22.484,32.813-48.192V75H46.196z";
			svg[1][18] = "path|M123.206,75c0.081-0.139,0.167-0.271,0.245-0.414V75h12V59.982c0-14.478-2.902-24.289-8.701-29.431c-5.801-5.143-16.35-7.716-31.648-7.716h-38.4c-14.801,0-25.401,2.4-31.8,7.2c-5.7,4.301-8.55,11.1-8.55,20.399v6.15c0,7.696,2.262,13.83,6.767,18.414h100.088V75z M28.5,51.336c0-5.799,1.927-10.2,5.785-13.2c3.855-3,10.24-4.5,19.155-4.5h45.973c8.612,0,14.874,1.601,18.778,4.8c3.506,2.902,5.26,7.2,5.26,12.9v4.5c0,5.4-1.955,9.727-5.859,12.975c-3.908,3.251-10.066,4.875-18.479,4.875H53.141c-8.515,0-14.876-1.748-19.081-5.25c-3.708-3.098-5.56-7.298-5.56-12.6V51.336z";
			svg[1][19] = "path|M25.801,77.361c6.3,4.75,16.598,7.125,30.9,7.125h39.15c9.601,0,16.549-1.051,20.851-3.15c2.669-1.335,4.833-3.453,6.505-6.336H23.117C23.94,75.837,24.828,76.628,25.801,77.361zM123.451,75v16.652c0,9.656-2.025,16.302-6.076,19.935c-4.049,3.633-11.676,5.449-22.875,5.449H59.851c-11.7,0-20.001-1.636-24.9-4.91c-4.301-2.876-6.45-7.438-6.45-13.69h-11.4c0,10.25,3.724,17.713,11.175,22.389c7.448,4.676,19.924,7.013,37.425,7.013h23.4c17.299,0,29.349-2.744,36.148-8.237c6.8-5.492,10.201-14.979,10.201-28.461V75H123.451z";
			var fillStyleSymbolLighter = "rgba(255, 255, 255, 1)";//color used for digits in light
			var fillStyleSymbolDarker = "rgba(0, 0, 0, 1)";//color used for digits in shadow
			var fillStylesPanelLighter = "rgba(255, 255, 255, 1)";//color used for panel in light
			var fillStylesPanelDarker = "rgba(0, 0, 0, 1)";//color used for panel in shadow
			var strokeStyleSymbol = "rgba(100, 100, 200, 1)";//not used
			var strokeStylePanel = "rgba(30, 30, 60, 1)";//not used
			//-------------------------------------------------------------------------------------------------	
			//shift and scale coordinate
			function norm_coord(coord, shift_factor, scale_factor, round_type){
				if(round_type == "round"){
					return Math.round((coord-shift_factor)*scale_factor);
				}
				else{
					return (coord-shift_factor)*scale_factor;
				}
			}
			//-------------------------------------------------------------------------------------------------
			//converts polygon SVG script to canvas commands
			function polygon_to_canvas_commands(poly){
					var myfigure = [],p=[],couples = poly.split(" "),parts = couples[0].split(",");
					p.push("M");p.push(parts[0]);p.push(parts[1]);
					myfigure.push(p);p=[];
					for(var i=1;i<couples.length;i++){
						parts = couples[i].split(",");
						p.push("L");p.push(parts[0]);p.push(parts[1]);
						myfigure.push(p);p=[];
					}
					parts = couples[0].split(",");
					p.push("L");p.push(parts[0]);p.push(parts[1]);
					myfigure.push(p);p=[];
					return myfigure;
			}
			//-------------------------------------------------------------------------------------------------
			//converts rectangle SVG script to canvas commands
			function rect_to_canvas_commands(rect){
					var myfigure = [],p=[],parts = rect.split(" ");
					p.push("M");p.push(parts[0]);p.push(parts[1]);
					myfigure.push(p);p=[];
					p.push("L");p.push(parseFloat(parts[0])+parseFloat(parts[2]));p.push(parts[1]);
					myfigure.push(p);p=[];			
					p.push("L");p.push(parseFloat(parts[0])+parseFloat(parts[2]));p.push(parseFloat(parts[1])+parseFloat(parts[3]));
					myfigure.push(p);p=[];
					p.push("L");
					p.push(parseFloat(parts[0]));
					p.push(parseFloat(parts[1])+parseFloat(parts[3]));
					myfigure.push(p);p=[];
					p.push("L");p.push(parseFloat(parts[0]));p.push(parseFloat(parts[1]));
					myfigure.push(p);p=[];
					return myfigure;
			}
			//-------------------------------------------------------------------------------------------------
			//converts path SVG script to canvas commands
			function path_to_canvas_commands(path){
					var myfigure = [],buffer = "",p=[],firstx,firsty,lastx,lasty,pushbuffer,lastcx, lastcy;
					for(i=0;i<path.length;i++){
						if(isNaN(parseInt(path.charAt(i))) && path.charAt(i)!="." && path.charAt(i)!="-"){
							if(path.charAt(i) == "M" || path.charAt(i) == "m" || path.charAt(i) == "C" || path.charAt(i) == "c" || path.charAt(i) == "V" || path.charAt(i) == "v" || path.charAt(i) == "H" || path.charAt(i) == "h" || path.charAt(i) == "Z" || path.charAt(i) == "z" || path.charAt(i) == "L" || path.charAt(i) == "l" || path.charAt(i) == "S" || path.charAt(i) == "s"){
								if(p.length){
									if(p[0]=="v" || p[0]=="V") p.push(lastx);
									if(buffer!=""){
										pushbuffer = parseFloat(buffer);
										if(p[0]=="v" || p[0]=="m" || p[0]=="h" || p[0]=="z" || p[0]=="c" || p[0]=="l" || p[0]=="s"){
											if(p.length%2==0) pushbuffer = pushbuffer+lasty;
											else pushbuffer = pushbuffer+lastx;
										}
										p.push(pushbuffer);
									}
									if(p[0]=="h" || p[0]=="H") p.push(lasty);
									if(p[0]=="s" || p[0]=="S"){
										p.splice(1,0,2*lastx-lastcx, 2*lasty-lastcy);
									}
									lastx = p[p.length-2];lasty = p[p.length-1];
									if(p.length>6){
										lastcx = p[p.length-4];lastcy = p[p.length-3];
									}
									if(p[0]=="m" || p[0]=="M"){
										firstx = lastx;firsty = lasty;
									}
									myfigure.push(p);
								}
								buffer = "";p = [];
								p.push(path.charAt(i));
								if(path.charAt(i) == "Z" || path.charAt(i) == "z"){
									p.push(firstx);p.push(firsty);
								}
							}
							else{
								if(buffer!=""){
									pushbuffer = parseFloat(buffer);
									if(p[0]=="v" || p[0]=="m" || p[0]=="h" || p[0]=="z" || p[0]=="c" || p[0]=="l" || p[0]=="s"){
										if(p.length%2==0) pushbuffer = pushbuffer+lasty;
										else pushbuffer = pushbuffer+lastx;
									}
									p.push(pushbuffer);
								}
								buffer="";
							}
						}
						else{
							if(path.charAt(i)=="-"){
								if(buffer!=""){
									pushbuffer = parseFloat(buffer);
									if(p[0]=="v" || p[0]=="m" || p[0]=="h" || p[0]=="z" || p[0]=="c" || p[0]=="l" || p[0]=="s"){
										if(p.length%2==0) pushbuffer = pushbuffer+lasty;
										else pushbuffer = pushbuffer+lastx;
									}
									p.push(pushbuffer);
								}
								buffer="";
							}
							buffer=buffer+path.charAt(i);
						}
					}
					return 	myfigure;
			}
			//-------------------------------------------------------------------------------------------------			
			function svg_to_canvas(svg_commands){
				var parts = svg_commands.split("|");
				if(parts[0]=="path") return path_to_canvas_commands(parts[1]);
				if(parts[0]=="rect") return rect_to_canvas_commands(parts[1]);
				if(parts[0]=="polygon") return polygon_to_canvas_commands(parts[1]);
			}
			//-------------------------------------------------------------------------------------------------
			//calculates color between two colors and percentage
			function per_color(to_color, from_color, per){
				var colorString0 = from_color;
		    colorsOnly0 = colorString0.substring(colorString0.indexOf('(') + 1, colorString0.lastIndexOf(')')).split(/,\s*/);
				var colorString1 = to_color;
		    colorsOnly1 = colorString1.substring(colorString1.indexOf('(') + 1, colorString1.lastIndexOf(')')).split(/,\s*/);
		    red0 = parseFloat(colorsOnly0[0]);
		    green0 = parseFloat(colorsOnly0[1]);
		    blue0 = parseFloat(colorsOnly0[2]);
		    opacity = colorsOnly0[3];
		    red1 = parseFloat(colorsOnly1[0]);
		    green1 = parseFloat(colorsOnly1[1]);
		    blue1 = parseFloat(colorsOnly1[2]);
		    new_red = Math.floor(per*(red1-red0)+red0);
		    new_green = Math.floor(per*(green1-green0)+green0);
		    new_blue = Math.floor(per*(blue1-blue0)+blue0);
				return "rgba("+new_red+","+new_green+","+new_blue+","+opacity+")";
			}
			//-------------------------------------------------------------------------------------------
			//some public functions
			this.pause_anim = function(){paused = true;}
			this.play_anim = function(){paused = false;}
			this.destroy_countdown = function(){destroy_it = true;}
			this.set_options = function(opt_names_values){
				change_it = true;
				for(var i=0; i<opt_names_values.length; i+=2){
					settings[opt_names_values[i]] = opt_names_values[i+1];
				}
			}
			this.get_option = function(opt_name){
				return settings[opt_name];
			}
			this.set_custom_state = function(new_state){
				settings.new_custom_state = new_state;
			}
			//-------------------------------------------------------------------------------------------
			return this.each(function() {
				//variables for each countdown
				var ch,cw,old_cw, old_ch;//canvas width height
				var day_digits,digits_n;
				var fillStyleSymbol1,fillStyleSymbol2;
				var fillStylesPanel_g1_1,fillStylesPanel_g2_1;
				var fillStylesPanel_g1_2,fillStylesPanel_g2_2;
				var fillStylesPanel1,fillStylesPanel2,fillStylesSymbol;
				var visible_digits_n;
				var show_ss,show_mm,show_hh,show_dd;
				var myscale, single_digit_width, padding, to_add, padding_groups, groups;
				var xPosAll = [];//coordinates for 3d effect
				var yPosAll = [];//coordinates for 3d effect
				var centerXX = [];//center points for each digit
				var centerYY = [];//center points for each digit
				var ii,initial_animation,animate_it, old_digits, new_digits,old_all_ss;
				var centerX,centerY;	
				var shift_right,shift_bottom;
				var upper_states = [],lower_states = [];
				var frame_id,anim_int;
				var fillStylePanelFromLighter,fillStylePanelFromLighter2;
				var fillStylePanelToDarker,fillStylePanelToDarker2;
				var allow_draw_darker = true;
				var top_min_y, bottom_max_y;
				var set_id,pan_id;
				var myfigures = [],panel_figs = [],panel_width;
				var f_family,target_date, target_future, server_now_date,f_weight;
				var t1;//stores target date object
				var show_labels;
				var text_blur;
				var groups_spacing, spacer;
				var ending = false,type3d,max_height,use_gradient = false;
				var days_long,days_short,hours_long,hours_short,mins_long,mins_short,secs_long,secs_short;
				var min_f_size,max_f_size,time_zone,labels_space,font_to_digit_ratio;
				var f_size;
				var server_dif = 0;
				
				if(settings.server_now_date!=""){
					var server_now = new Date(settings.server_now_date);
					var js_now = new Date();
					server_dif = server_now.getTime() - js_now.getTime();
				}
				
				var obj = $(this);
				
				//add three canvas objects				
				obj.append('<canvas id="panel_labels" style="position: absolute;"></canvas>');
				var canvas_labels = obj.children("#panel_labels").get(0);
				var ctx_labels = canvas_labels.getContext("2d");

				obj.append('<canvas id="panel_static" style="position: absolute;"></canvas>');
				var canvas_static = obj.children("#panel_static").get(0);
				var ctx_static = canvas_static.getContext("2d");

				obj.append('<canvas id="animation" style="position: absolute;"></canvas>');
				var canvas_anim = obj.children("#animation").get(0);
				var ctx_animate = canvas_anim.getContext("2d");

				var new_custom_state;
				var custom_state;
				var use_custom_update;
				//-------------------------------------------------------------------------------------------------
				obj.init = function(){
					//set variables
					new_custom_state = settings.new_custom_state;
					custom_state = settings.custom_state;
					use_custom_update = settings.use_custom_update;
					type3d = settings.type3d;max_height = settings.max_height;
					show_labels = settings.show_labels;target_date = settings.target_date;server_now_date = settings.server_now_date;
					target_future = settings.target_future;t1 = new Date(target_date);
					show_ss = settings.show_ss;show_mm = settings.show_mm;
					show_hh = settings.show_hh;show_dd = settings.show_dd;
					fillStyleSymbol1 = settings.fillStyleSymbol1;fillStyleSymbol2 = settings.fillStyleSymbol2;
					fillStylesPanel_g1_1 = settings.fillStylesPanel_g1_1;
					fillStylesPanel_g2_1 = settings.fillStylesPanel_g2_1;
					fillStylesPanel_g1_2 = settings.fillStylesPanel_g1_2;
					fillStylesPanel_g2_2 = settings.fillStylesPanel_g2_2;
					text_blur = settings.text_blur;labels_space = settings.labels_space;
					groups_spacing = settings.groups_spacing;spacer = settings.spacer;
					use_gradient = false;day_digits = settings.day_digits;
					set_id = settings.set_id;pan_id = settings.pan_id;
					days_long = settings.days_long;days_short = settings.days_short;
					hours_long = settings.hours_long;hours_short = settings.hours_short;
					mins_long = settings.mins_long;mins_short = settings.mins_short;
					secs_long = settings.secs_long;secs_short = settings.secs_short;
					f_family = settings.f_family;font_to_digit_ratio = settings.font_to_digit_ratio;f_weigth = settings.f_weight;
					min_f_size = settings.min_f_size;max_f_size = settings.max_f_size;
					text_color = settings.text_color;text_glow = settings.text_glow;
					time_zone = settings.time_zone;panel_width = panel_width_arr[pan_id];
					ending = false;
					//set arrays holding the drawing commands					
					panel_figs[0] = path_to_canvas_commands(panel_svg[pan_id][0]);
					panel_figs[1] = path_to_canvas_commands(panel_svg[pan_id][1]);	
					for(var i=0;i<20;i++){
						myfigures[i] =  svg_to_canvas(svg[set_id][i]);
					}
					if(use_custom_update){
						show_ss = false;show_mm = false; show_hh = false; show_dd = true;
					}
					//init canvas
					ctx_animate.clearRect(0,0,canvas_anim.width,canvas_anim.height);
					ctx_static.clearRect(0,0,ctx_static.width,ctx_static.height);
					ctx_labels.clearRect(0,0,ctx_labels.width,ctx_labels.height);
					ch = obj.height();cw = obj.width();old_cw = cw;old_ch = ch;
					digits_n = day_digits+6;
					animate_it = new Array(digits_n);
					for(i=0;i<digits_n;i++) animate_it[i]=1;
					old_digits =  new Array(digits_n);
					for(i=0;i<digits_n;i++) old_digits[i]=0;
					new_digits =  new Array(digits_n);
					for(i=0;i<digits_n;i++) old_digits[i]=0;
					fillStylesPanel1 = new Array(digits_n);
					fillStylesPanel2 = new Array(digits_n);
					fillStylesSymbol = new Array(digits_n);
					//set colors for each digit
					var dr = 0;
					if(show_ss) dr+=2; if(show_mm) dr+=2; if(show_hh) dr+=2;
					for(i=0;i<digits_n;i++){
						if(i==0 || i==1 || i==4 || i==5){
							fillStylesPanel1[i]=fillStylesPanel_g1_1;
							fillStylesPanel2[i]=fillStylesPanel_g1_2;
							fillStylesSymbol[i]=fillStyleSymbol1;
						}
						else{
							fillStylesPanel1[i]=fillStylesPanel_g2_1;
							fillStylesPanel2[i]=fillStylesPanel_g2_2;
							fillStylesSymbol[i]=fillStyleSymbol2;
						}
						if(i>=dr){
							if(dr==2 || dr==6){
								fillStylesPanel1[i]=fillStylesPanel_g2_1;
								fillStylesPanel2[i]=fillStylesPanel_g2_2;
								fillStylesSymbol[i]=fillStyleSymbol2;
							}
							if(dr==0 || dr==4){
								fillStylesPanel1[i]=fillStylesPanel_g1_1;
								fillStylesPanel2[i]=fillStylesPanel_g1_2;
								fillStylesSymbol[i]=fillStyleSymbol1;
							}
						}
					}
					visible_digits_n = digits_n;
					groups = 0;
					if(!show_ss) visible_digits_n-=2; else groups++;
					if(!show_mm) visible_digits_n-=2; else groups++;
					if(!show_hh) visible_digits_n-=2; else groups++;
					if(!show_dd) visible_digits_n-=day_digits; else groups++;
					if(use_custom_update){groups = (Math.ceil(day_digits/3));}
					//--------------------------------------------
					//define the scale parameter, width of one digit, padding
					if(!show_labels){
						labels_space = 0;
					}
					//--------------------------------------------
					//calculating scale
					var caption_offset = 0;f_size = 0;
					var dg_h = max_height;
					
					
					if(labels_space!=0){
						dg_h = max_height/(font_to_digit_ratio*labels_space+1);
						//caption_offset = (max_height/(1/font_to_digit_ratio+1));
						//caption_offset = max_height*font_to_digit_ratio;
					}
					//myscale = (max_height-caption_offset)/(150);
					myscale = dg_h/(150);
					single_digit_width = panel_width*myscale;
					padding = single_digit_width/10;
					padding_groups = groups_spacing*padding;
					temp_w = (visible_digits_n*(single_digit_width+padding)+3*padding)+padding_groups*(groups-1);
					if(temp_w>cw){
						myscale = myscale*(cw/temp_w);
						single_digit_width = panel_width*myscale;
						padding = single_digit_width/10;
						padding_groups = groups_spacing*padding;
						temp_w = (visible_digits_n*(single_digit_width+padding)+3*padding)+padding_groups*(groups-1);
					}
					
					if(labels_space!=0){
						caption_offset = myscale*150*font_to_digit_ratio*labels_space;
						f_size = Math.floor((myscale*150*font_to_digit_ratio)/1.3);
						if(f_size>max_f_size) f_size = max_f_size;
						if(f_size<min_f_size) f_size = min_f_size;
						caption_offset = f_size*1.3*labels_space;
					}
					ch = (myscale*150+2*caption_offset);
					//will have only padding bottom for labels. no padding top anymore. also padding bottom does not exceed font*1.3+offset
					obj.height(ch-2*caption_offset+1.3*f_size*labels_space);
					$(canvas_static).attr("width", cw);$(canvas_anim).attr("width", cw);$(canvas_labels).attr("width", cw);
					$(canvas_static).attr("height", ch);$(canvas_anim).attr("height", ch);$(canvas_labels).attr("height", ch);
					//will have only padding bottom for labels. no padding top anymore
					$(canvas_static).css("top", -caption_offset);$(canvas_anim).css("top", -caption_offset);$(canvas_labels).css("top", -caption_offset);
					//--------------------------------------------

					if(temp_w>cw){
						to_add = (temp_w-cw)/2;
					}
					else{
						to_add = (cw-temp_w)/2;
					}
					//--------------------------------------------
					settings.counter_width = temp_w;
					//define the coordinates used for the 3d effects
					radiusX = ch*0.5;
					radiusY = (temp_w*0.5*0.5)/visible_digits_n;
					xPosAll = [];
					yPosAll = [];
					ii=0;
					for (var i = 1.5 * Math.PI; i >= 0.5*Math.PI; i -= 0.2) {
						xPosAll[ii] = (radiusY * Math.cos(i));
						yPosAll[ii] = (radiusX * Math.sin(i));
						ii++;
					}
					//define center points for each digit
					centerXX = [];centerYY = [];
					var add_padding_groups = 0;
					for(var i=0; i<visible_digits_n; i++){
						if(i>visible_digits_n - day_digits -1 && show_dd) add_padding_groups = 0;
						else if(i==0 || i==1) add_padding_groups = (groups-1)*padding_groups;
						else if(i==2 || i==3) add_padding_groups = (groups-2)*padding_groups;
						else if(i==4 || i==5) add_padding_groups = (groups-3)*padding_groups;
						if(use_custom_update){add_padding_groups = (groups-(Math.floor(i/3)+1))*padding_groups;}						
						centerXX[i] = Math.round((visible_digits_n-1-i)*padding+(visible_digits_n-1-i+0.5)*(single_digit_width)+to_add+2*padding+add_padding_groups);
						centerYY[i] = Math.round(ch/2);
					}
					//draw all panels and digits once before animation starts
					old_all_ss = -1;
					initial_animation = true;
					if(use_custom_update){
						set_custom_state(new_custom_state);
					}
					else{
						set_new_digits(0,0);
					}
					for(var i=0; i<visible_digits_n; i++){
						color_id = i;
						centerX = centerXX[i];centerY = centerYY[i];	
						shift_right = centerX;shift_bottom = centerY;
						new_digit = new_digits[i];
						if(!ending){
							draw_static(myfigures[new_digit*2], 0, fillStylesPanel1[color_id], fillStylesPanel2[color_id], fillStylesSymbol[color_id]);
							draw_static(myfigures[new_digit*2+1], 1, fillStylesPanel1[color_id], fillStylesPanel2[color_id], fillStylesSymbol[color_id]);
						}
						old_digits[i] = new_digits[i];
						upper_states[i] = new_digit;
						lower_states[i] = new_digit;
					}
					//set label canvas
					if(text_blur>0){
						ctx_labels.shadowColor = text_glow;
						ctx_labels.shadowOffsetX = 0;
						ctx_labels.shadowOffsetY = 0;
						ctx_labels.shadowBlur = text_blur;
					}
					else{
						ctx_labels.shadowColor = null;
						ctx_labels.shadowBlur = null;
					}
					ctx_labels.fillStyle = text_color;
					var dd_w = 0,hh_w = 0,mm_w = 0,ss_w = 0;
					var vert_offset = 20*myscale;
					//draw group spacers
					if(spacer!="none"){
						if(show_dd && (show_hh || show_mm || show_ss)){
							dd_w = (digits_n-6)*(single_digit_width+padding)-padding;
							if(spacer=="squares"){
								ctx_labels.rect((cw-temp_w)/2+2*padding+dd_w+((padding_groups+padding-1.2*padding)/2),(ch-padding*1.2)/2-vert_offset,1.2*padding,1.2*padding);
								ctx_labels.rect((cw-temp_w)/2+2*padding+dd_w+((padding_groups+padding-1.2*padding)/2),(ch-padding*1.2)/2+vert_offset,1.2*padding,1.2*padding);
							}
							else{
								ctx_labels.beginPath();
								ctx_labels.arc((cw-temp_w)/2+2*padding+dd_w+((padding_groups+padding)/2), ch/2-vert_offset, 0.7*padding, 0, 2 * Math.PI, false);
								ctx_labels.arc((cw-temp_w)/2+2*padding+dd_w+((padding_groups+padding)/2), ch/2+vert_offset, 0.7*padding, 0, 2 * Math.PI, false);
							}
							ctx_labels.fill();
							dd_w+=(padding+padding_groups);
						}
						if(show_hh && (show_mm || show_ss)){
							hh_w = 2*(single_digit_width+padding)-padding;
							if(spacer=="squares"){
								ctx_labels.rect((cw-temp_w)/2+2*padding+dd_w+hh_w+((padding_groups+padding-1.2*padding)/2),(ch-padding*1.2)/2-vert_offset,1.2*padding,1.2*padding);
								ctx_labels.rect((cw-temp_w)/2+2*padding+dd_w+hh_w+((padding_groups+padding-1.2*padding)/2),(ch-padding*1.2)/2+vert_offset,1.2*padding,1.2*padding);
							}
							else{
								ctx_labels.beginPath();
								ctx_labels.arc((cw-temp_w)/2+2*padding+dd_w+hh_w+((padding_groups+padding)/2), ch/2-vert_offset, 0.7*padding, 0, 2 * Math.PI, false);
								ctx_labels.arc((cw-temp_w)/2+2*padding+dd_w+hh_w+((padding_groups+padding)/2), ch/2+vert_offset, 0.7*padding, 0, 2 * Math.PI, false);
							}
							ctx_labels.fill();
							hh_w+=(padding+padding_groups);
						}
						if(show_mm && (show_ss)){
							mm_w = 2*(single_digit_width+padding)-padding;
							if(spacer=="squares"){
								ctx_labels.rect((cw-temp_w)/2+2*padding+dd_w+hh_w+mm_w+((padding_groups+padding-1.2*padding)/2),(ch-padding*1.2)/2-vert_offset,1.2*padding,1.2*padding);
								ctx_labels.rect((cw-temp_w)/2+2*padding+dd_w+hh_w+mm_w+((padding_groups+padding-1.2*padding)/2),(ch-padding*1.2)/2+vert_offset,1.2*padding,1.2*padding);
							}
							else{
								ctx_labels.beginPath();
								ctx_labels.arc((cw-temp_w)/2+2*padding+dd_w+hh_w+mm_w+((padding_groups+padding)/2), ch/2-vert_offset, 0.7*padding, 0, 2 * Math.PI, false);
								ctx_labels.arc((cw-temp_w)/2+2*padding+dd_w+hh_w+mm_w+((padding_groups+padding)/2), ch/2+vert_offset, 0.7*padding, 0, 2 * Math.PI, false);
							}
							ctx_labels.fill();
						}
						if(use_custom_update){
							for(var i=1; i<visible_digits_n; i++){
								if(i%3==0){
									x_pos = cw-Math.ceil((cw-temp_w)*0.5+2*padding+i*(single_digit_width+padding)+(Math.floor(i/3))*padding_groups)+(padding_groups+padding-0.5*padding)/2;
									ctx_labels.rect(x_pos,(ch-padding*2)/2+3*vert_offset,0.5*padding,2*padding);
								}
							}
							ctx_labels.fill();
						}						
					}
					//show labels for active groups					
					if(show_labels && !ending || !target_future){
						ctx_labels.font = f_weigth+" "+f_size+"px "+f_family;
						dd_w = 0,hh_w = 0,mm_w = 0,ss_w = 0;
						var metrics, t_w;
						var cap_y = ch-(ch-myscale*150)/2+f_size*labels_space;
						if(use_custom_update){
							metrics = ctx_labels.measureText(days_long);
							dd_w = (day_digits)*(single_digit_width+padding)+Math.ceil(day_digits/3)*padding_groups;
							t_w = metrics.width;
							if(t_w>dd_w){
								metrics = ctx_labels.measureText(days_short);
								t_w = metrics.width;
								ctx_labels.fillText(days_short, (cw-temp_w)/2+2*padding+(dd_w-padding-t_w)/2, cap_y);
							}
							else{
								ctx_labels.fillText(days_long, (cw-temp_w)/2+2*padding+(dd_w-padding-t_w)/2, cap_y);
							}
						}
						else{
							if(show_dd){
								metrics = ctx_labels.measureText(days_long);
								dd_w = (digits_n-6)*(single_digit_width+padding);
								t_w = metrics.width;
								//calculate center position
								//check which caption should be used
								if(t_w>dd_w){
									metrics = ctx_labels.measureText(days_short);
									t_w = metrics.width;
									ctx_labels.fillText(days_short, (cw-temp_w)/2+2*padding+(dd_w-padding-t_w)/2, cap_y);
								}
								else{
									ctx_labels.fillText(days_long, (cw-temp_w)/2+2*padding+(dd_w-padding-t_w)/2, cap_y);
								}
								dd_w+=padding_groups;
							}
							//other captions calculate based on previous captions
							if(show_hh){
								metrics = ctx_labels.measureText(hours_long);
								hh_w = 2*(single_digit_width+padding);
								t_w = metrics.width;
								if(t_w>hh_w){
									metrics = ctx_labels.measureText(hours_short);
									t_w = metrics.width;
									ctx_labels.fillText(hours_short, (cw-temp_w)/2+2*padding+dd_w+(hh_w-padding-t_w)/2, cap_y);			
								}
								else{
									ctx_labels.fillText(hours_long, (cw-temp_w)/2+2*padding+dd_w+(hh_w-padding-t_w)/2, cap_y);			
								}
								hh_w+=padding_groups;
							}
							if(show_mm){
								metrics = ctx_labels.measureText(mins_long);
								mm_w = 2*(single_digit_width+padding);
								t_w = metrics.width;
								if(t_w>mm_w){
									metrics = ctx_labels.measureText(mins_short);
									t_w = metrics.width;
									ctx_labels.fillText(mins_short, (cw-temp_w)/2+2*padding+dd_w+hh_w+(mm_w-padding-t_w)/2, cap_y);
								}
								else{
									ctx_labels.fillText(mins_long, (cw-temp_w)/2+2*padding+dd_w+hh_w+(mm_w-padding-t_w)/2, cap_y);
								}
								mm_w+=padding_groups;
							}
							if(show_ss){
								metrics = ctx_labels.measureText(secs_long);
								ss_w = 2*(single_digit_width+padding);;
								t_w = metrics.width;
								if(t_w>ss_w){
									metrics = ctx_labels.measureText(secs_short);
									t_w = metrics.width;
									ctx_labels.fillText(secs_short, (cw-temp_w)/2+2*padding+dd_w+hh_w+mm_w+(ss_w-padding-t_w)/2, cap_y);			
								}
								else{
									ctx_labels.fillText(secs_long, (cw-temp_w)/2+2*padding+dd_w+hh_w+mm_w+(ss_w-padding-t_w)/2, cap_y);			
								}
							}
						}
					}
					//start the sequence
					frame_id = 0;set_animate_it();		
					clearInterval(anim_int);
					anim_int = setInterval(animate_digits, 33);//animation tries to play at 30 frames per second
				}
				//-------------------------------------------------------------------------------------------------
				obj.destroy = function(){
					clearInterval(anim_int);//stop animation
					canvas_static.remove();//remove canvas
					canvas_anim.remove();
					canvas_labels.remove();
				}
				//-------------------------------------------------------------------------------------------------
				function animate_digits(){
					var old_digit,new_digit,color_id;
					if(destroy_it){
						obj.destroy();
					}
					//trying to clear only areas that need clearing
					if(frame_id > 0 && frame_id <= xPosAll.length/2+1){
						ctx_animate.clearRect(0,top_min_y,cw,(ch/2)+1);
					}
					else if(frame_id <= xPosAll.length){
						ctx_animate.clearRect(0,ch/2-1,cw,bottom_max_y - ch/2+1);
					}
					if(frame_id <= xPosAll.length){
						//draw digits and panels
						for(var i=0; i<visible_digits_n; i++){
							color_id = i;
							centerX = centerXX[i];centerY = centerYY[i];
							shift_right = centerX;shift_bottom = centerY;
							if(animate_it[i] || initial_animation){
								//calculate shade colors
								fillStylePanelToDarker  = per_color(fillStylesPanelDarker, fillStylesPanel1[color_id], frame_id/(xPosAll.length-1));
								fillStylePanelToDarker2 = per_color(fillStylesPanelDarker, fillStylesPanel2[color_id], frame_id/(xPosAll.length-1));
								fillStylePanelFromLighter  = per_color(fillStylesPanel1[color_id], fillStylesPanelLighter, frame_id/(xPosAll.length-1));
								fillStylePanelFromLighter2 = per_color(fillStylesPanel2[color_id], fillStylesPanelLighter, frame_id/(xPosAll.length-1));
								fillStyleSymbolFromLighter = per_color(fillStylesSymbol[color_id], fillStyleSymbolLighter, frame_id/(xPosAll.length-1));
								fillStyleSymbolToDarker = per_color(fillStyleSymbolDarker, fillStylesSymbol[color_id], frame_id/(xPosAll.length-1));
								old_digit = old_digits[i];
								new_digit = new_digits[i];
								if(frame_id == 0){
									upper_states[i] = old_digit;
									lower_states[i] = old_digit;
									//first frame draws old top and bottom parts
									draw_static(myfigures[old_digit*2+1], 1, fillStylesPanel1[color_id], fillStylesPanel2[color_id], fillStylesSymbol[color_id]);
									draw_static(myfigures[old_digit*2], 0, fillStylesPanel1[color_id], fillStylesPanel2[color_id], fillStylesSymbol[color_id]);
								}
								else if(frame_id == 1){
									upper_states[i] = new_digit;
									//top part gets updated once
									draw_static(myfigures[new_digit*2], 0, fillStylesPanel1[color_id], fillStylesPanel2[color_id], fillStylesSymbol[color_id]);
								}
								
								else if(frame_id > 0 && frame_id < xPosAll.length-1 && allow_draw_darker){
									//bottom part gradually darkens
									draw_darker(1);
								}
								else if(frame_id == xPosAll.length-1 && allow_draw_darker){
									//on last animation frame bottom part gets updated once more
									draw_static(myfigures[old_digit*2+1], 1, fillStylePanelToDarker, fillStylePanelToDarker2, fillStyleSymbolToDarker);
								}
								else if(frame_id >= xPosAll.length){
									lower_states[i] = new_digit;
									//after end of animation bottom part gets updated
									draw_static(myfigures[new_digit*2+1], 1, fillStylesPanel1[color_id], fillStylesPanel2[color_id], fillStylesSymbol[color_id]);
								}
								if(frame_id > 0 && frame_id <= xPosAll.length/2){
									//during half of animation top part gets animated
									draw_animated(frame_id, myfigures[old_digit*2], 0, color_id);
								}
								else if(frame_id!=0 && frame_id < xPosAll.length){
									//and now bottom part gets animated
									old_digits[i] = new_digits[i];
									draw_animated(frame_id, myfigures[new_digit*2+1], 1, color_id);
								}
							}
							else if(!animate_it[i] && use_custom_update && frame_id == 0){
								//THE FIX FOR THE STUCK EFFECT IN CUSTOM MODE
								old_digit = old_digits[i];
								new_digit = new_digits[i];
								upper_states[i] = old_digit;
								lower_states[i] = old_digit;
								draw_static(myfigures[old_digit*2+1], 1, fillStylesPanel1[color_id], fillStylesPanel2[color_id], fillStylesSymbol[color_id]);
								draw_static(myfigures[old_digit*2], 0, fillStylesPanel1[color_id], fillStylesPanel2[color_id], fillStylesSymbol[color_id]);
							}
						}
					}
					frame_id+=1;
					if(initial_animation) initial_animation = false;
					//LISTEN FOR CHANGES
					if(obj.width() != old_cw || obj.height() != old_ch){
						//width or height changed
						obj.init();
					}
					if(change_it){
						//a value changed
						change_it = false;obj.init();
					}					
					if(frame_id>50)frame_id=xPosAll.length+1;
					if(use_custom_update){
						new_custom_state = settings.new_custom_state;
						if(set_custom_state(settings.new_custom_state)){
							frame_id = 0;
							set_animate_it();
						}
					}
					else{	
						if(set_new_digits(frame_id,paused)){
							//when you change tabs or when browser cannot complete the animation
							//the countdown needs to update
							var fixes = false;
							for(var i=0; i<visible_digits_n; i++){
								color_id = i;
								centerX = centerXX[i];
								centerY = centerYY[i];
								shift_right = centerX;
								shift_bottom = centerY;
								if(upper_states[i]!=old_digits[i]){
									draw_static(myfigures[old_digits[i]*2], 0, fillStylesPanel1[color_id], fillStylesPanel2[color_id], fillStylesSymbol[color_id]);	
									upper_states[i] = old_digits[i];
									fixes = true;
								}
								if(lower_states[i]!=old_digits[i]){
									draw_static(myfigures[old_digits[i]*2+1], 1, fillStylesPanel1[color_id], fillStylesPanel2[color_id], fillStylesSymbol[color_id]);					
									lower_states[i] = old_digits[i];
									fixes = true;
								}
								if(fixes) allow_draw_darker = false;
								else allow_draw_darker = true;
							}
							frame_id = 0;
							set_animate_it();
						}
					}
				}
				//-------------------------------------------------------------------------------------------------
				function set_custom_state(new_state){
					if(new_state!=custom_state){
						for(i=0;i<digits_n-6;i++){
							new_digits[i] = Number(new_state.charAt(digits_n-6-i-1));
						}
						custom_state = new_state;
						return true;
					}
					else{
						return false;
					}
				}
				//-------------------------------------------------------------------------------------------------
				//sets each digit according to timer and returns whether change is needed
				function set_new_digits(frame_id,paused){
					var ddd = [];
					var t2 = new Date();
					var t1time;
					var t2time;
					var dif;
					if(server_dif!=0){
						t1time = t1.getTime()-server_dif;
					}
					else t1time = t1.getTime()-(t1.getTimezoneOffset()/60+time_zone)*3600000;
					t2time = t2.getTime();
					dif = Math.abs(t1time - t2time);
					if(ending && t1time - t2time<0 && target_future){
						if ( $.isFunction( settings.complete) && !paused ) {
							settings.complete.call( this );//call complete handler
						}
						if(!paused) obj.destroy();
						return;
					}
					if(t1time - t2time < 1000){
						ending = true;
					}
					if(paused) return false;
					var all_ss = Math.floor(dif/1000);
					if(all_ss!=old_all_ss){
						old_all_ss = all_ss;
						var all_mm = Math.floor(all_ss/60);
						var all_hh = Math.floor(all_mm/60);
						//numbers
						var dd = Math.floor(all_hh/24);
						var hh = all_hh - dd*24;
						var mm = all_mm - dd*24*60 - hh*60;
						var ss = all_ss - dd*24*60*60 - hh*60*60 - mm*60;
						//digits
						var dd0 = dd%10;			
						var dd1 = Math.floor(dd/10)%10;
						var dd2 = Math.floor(dd/100)%10;
						for(i=0;i<digits_n-6;i++){
							ddd[i] = Math.floor(dd/Math.pow(10,i))%10;
						}
						var hh0 = hh%10;var hh1 = Math.floor(hh/10)%10;
						var mm0 = mm%10;var mm1 = Math.floor(mm/10)%10;
						var ss0 = ss%10;var ss1 = Math.floor(ss/10)%10;
						if(frame_id < xPosAll.length-1){
							for(var i=0; i<visible_digits_n; i++){
								old_digits[i] = new_digits[i];
							}
						}
						var nd_ii = 0;
						if(show_ss){
							new_digits[nd_ii++] = ss0;new_digits[nd_ii++] = ss1;
						}
						if(show_mm){
							new_digits[nd_ii++] = mm0;new_digits[nd_ii++] = mm1;
						}
						if(show_hh){
							new_digits[nd_ii++] = hh0;new_digits[nd_ii++] = hh1;
						}
						if(show_dd){
							for(i=0;i<digits_n-6;i++){
								new_digits[nd_ii++] = ddd[i];
							}
						}
						return true;
					}
					else{
						return false;
					}
				}
				//-------------------------------------------------------------------------------------------------
				//draws into the static canvas where already animated digits and panels stay.
				function draw_static(myfigure, part, fsPanel, fsPanel2, fsSymbol){
					var ctx = ctx_static,x0,y0,x1,y1,x2,y2;
					var lineWidth = Math.floor(single_digit_width/30);
					ctx.lineWidth = lineWidth;
					var panel_fig = panel_figs[part];
					min_x = -1;min_y = -1;max_x = -1;max_y = -1;
					//draws panel
					ctx.beginPath();
					for(j=0;j<panel_fig.length;j++){
						if (panel_fig[j][0] == 'M' || panel_fig[j][0] == 'm') {
							x0 = norm_coord(panel_fig[j][1], 75, myscale, "round");
							y0 = norm_coord(panel_fig[j][2], 75, myscale, "round");
							x0+=shift_right;y0+=shift_bottom;
							if(min_x == -1 || x0<min_x) min_x = x0;
							if(min_y == -1 || y0<min_y) min_y = y0;
							if(max_x == -1 || x0>max_x) max_x = x0;
							if(max_y == -1 || y0>max_y) max_y = y0;
							ctx.moveTo(x0, y0);
						} else if(panel_fig[j][0] == 'L' || panel_fig[j][0] == 'l' || panel_fig[j][0] == 'V' || panel_fig[j][0] == 'v' || panel_fig[j][0] == 'H' || panel_fig[j][0] == 'h' || panel_fig[j][0] == 'Z' || panel_fig[j][0] == 'z') {
							x0 = norm_coord(panel_fig[j][1], 75, myscale, "round");
							y0 = norm_coord(panel_fig[j][2], 75, myscale, "round");
							x0+=shift_right;y0+=shift_bottom;
							if(min_x == -1 || x0<min_x) min_x = x0;
							if(min_y == -1 || y0<min_y) min_y = y0;
							if(max_x == -1 || x0>max_x) max_x = x0;
							if(max_y == -1 || y0>max_y) max_y = y0;
							ctx.lineTo(x0, y0);
						} else if(panel_fig[j][0] == 'C' || panel_fig[j][0] == 'c' || myfigure[j][0] == 'S' || myfigure[j][0] == 's') {
							x0 = norm_coord(panel_fig[j][1], 75, myscale, "round");
							y0 = norm_coord(panel_fig[j][2], 75, myscale, "round");
							x0+=shift_right;y0+=shift_bottom;
							x1 = norm_coord(panel_fig[j][3], 75, myscale, "round");
							y1 = norm_coord(panel_fig[j][4], 75, myscale, "round");
							x1+=shift_right;y1+=shift_bottom;
							x2 = norm_coord(panel_fig[j][5], 75, myscale, "round");
							y2 = norm_coord(panel_fig[j][6], 75, myscale, "round");
							x2+=shift_right;y2+=shift_bottom;
							ctx.bezierCurveTo(x0,y0,x1,y1,x2,y2);
						}
					}
					ctx.clearRect(min_x, min_y, max_x-min_x, max_y-min_y);
					if(part==0) top_min_y = min_y;
					else bottom_max_y = max_y;
					//ctx.strokeStyle = strokeStylePanel;
					ctx.fillStyle = fsPanel;
					var my_gradient;
					if(fsPanel2!=fsPanel){
						//use gradient if needed
						my_gradient = ctx.createLinearGradient(0, min_y, 0, max_y);
						if(min_y<(ch/2) && max_y<=Math.round(ch/2)){
							my_gradient.addColorStop(0, "#aaa");
							my_gradient.addColorStop(0.05, fsPanel2);
							my_gradient.addColorStop(0.95, fsPanel);
							my_gradient.addColorStop(1, "#000");
						}
						else{
							my_gradient.addColorStop(1, fsPanel2);
							my_gradient.addColorStop(0.05, fsPanel);
							my_gradient.addColorStop(0, "#aaa");
						}
						ctx.fillStyle = my_gradient;
						use_gradient = true;
					}
					ctx.fill();
					//if(lineWidth) ctx.stroke();
					//draw digit
					ctx.beginPath();
					for(j=0;j<myfigure.length;j++){
						if (myfigure[j][0] == 'M' || myfigure[j][0] == 'm') {
							x0 = norm_coord(myfigure[j][1], 75, myscale, "raw");
							y0 = norm_coord(myfigure[j][2], 75, myscale, "raw");
							x0+=shift_right;y0+=shift_bottom;
							ctx.moveTo(x0, y0);
						} else if(myfigure[j][0] == 'L' || myfigure[j][0] == 'l' || myfigure[j][0] == 'V' || myfigure[j][0] == 'v' || myfigure[j][0] == 'H' || myfigure[j][0] == 'h' || myfigure[j][0] == 'Z' || myfigure[j][0] == 'z') {
							x0 = norm_coord(myfigure[j][1], 75, myscale, "raw");
							y0 = norm_coord(myfigure[j][2], 75, myscale, "raw");
							x0+=shift_right;y0+=shift_bottom;
							ctx.lineTo(x0, y0);
						} else if(myfigure[j][0] == 'C' || myfigure[j][0] == 'c' || myfigure[j][0] == 'S' || myfigure[j][0] == 's') {
							x0 = norm_coord(myfigure[j][1], 75, myscale, "raw");
							y0 = norm_coord(myfigure[j][2], 75, myscale, "raw");
							x0+=shift_right;y0+=shift_bottom;
							x1 = norm_coord(myfigure[j][3], 75, myscale, "raw");
							y1 = norm_coord(myfigure[j][4], 75, myscale, "raw");
							x1+=shift_right;y1+=shift_bottom;
							x2 = norm_coord(myfigure[j][5], 75, myscale, "raw");
							y2 = norm_coord(myfigure[j][6], 75, myscale, "raw");
							x2+=shift_right;y2+=shift_bottom;
							ctx.bezierCurveTo(x0,y0,x1,y1,x2,y2);
						}
					}
					//ctx.strokeStyle = strokeStyleSymbol;
					ctx.fillStyle = fsSymbol;
					if(use_gradient){
						my_gradient = ctx.createLinearGradient(0, min_y, 0, max_y);
						if(min_y<(ch/2) && max_y<=Math.round(ch/2)){
							my_gradient.addColorStop(0.95, fsSymbol);
							my_gradient.addColorStop(1, "#000");
						}
						else{
							my_gradient.addColorStop(0.05, fsSymbol);
							my_gradient.addColorStop(0, "#aaa");
						}
						ctx.fillStyle = my_gradient;		
					}
					
					ctx.fill();
					//if(lineWidth) ctx.stroke();
				}
				//-------------------------------------------------------------------------------------------------
				function set_animate_it(){
					for(var i=0; i<visible_digits_n;i++){
						animate_it[i] = old_digits[i] != new_digits[i];
					}
				}
				//-------------------------------------------------------------------------------------------------				
				//draws dark panel with transparency over the already drawn panel to darken it
				function draw_darker(part){
					var ctx = ctx_static;
					var x0,y0,x1,y1,x2,y2;
					var panel_fig = panel_figs[part];
					ctx.beginPath();
					for(j=0;j<panel_fig.length;j++){
						if (panel_fig[j][0] == 'M' || panel_fig[j][0] == 'm') {
							x0 = norm_coord(panel_fig[j][1], 75, myscale, "round");
							y0 = norm_coord(panel_fig[j][2], 75, myscale, "round");
							x0+=shift_right;y0+=shift_bottom;
							ctx.moveTo(x0, y0);
						} else if(panel_fig[j][0] == 'L' || panel_fig[j][0] == 'l' || panel_fig[j][0] == 'V' || panel_fig[j][0] == 'v' || panel_fig[j][0] == 'H' || panel_fig[j][0] == 'h' || panel_fig[j][0] == 'Z' || panel_fig[j][0] == 'z') {
							x0 = norm_coord(panel_fig[j][1], 75, myscale, "round");
							y0 = norm_coord(panel_fig[j][2], 75, myscale, "round");
							x0+=shift_right;y0+=shift_bottom;
							ctx.lineTo(x0, y0);
						} else if(panel_fig[j][0] == 'C' || panel_fig[j][0] == 'c' || panel_fig[j][0] == 'S' || panel_fig[j][0] == 's') {
							x0 = norm_coord(panel_fig[j][1], 75, myscale, "round");
							y0 = norm_coord(panel_fig[j][2], 75, myscale, "round");
							x0+=shift_right;y0+=shift_bottom;
							x1 = norm_coord(panel_fig[j][3], 75, myscale, "round");
							y1 = norm_coord(panel_fig[j][4], 75, myscale, "round");
							x1+=shift_right;y1+=shift_bottom;
							x2 = norm_coord(panel_fig[j][5], 75, myscale, "round");
							y2 = norm_coord(panel_fig[j][6], 75, myscale, "round");
							x2+=shift_right;y2+=shift_bottom;
							ctx.bezierCurveTo(x0,y0,x1,y1,x2,y2);
						}
					}
					ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
					ctx.fill();
				}
				//-------------------------------------------------------------------------------------------------
				//draw panel and digit in animation canvas
				function draw_animated(frame, myfigure, part, color_id){
					var xPos = xPosAll[frame];
					var yPos = yPosAll[frame];
					var panel_fig = panel_figs[part];
					draw_figure(part, xPos, yPos, panel_fig, 0, panel_fig.length, fillStylePanelToDarker, fillStylePanelFromLighter, fillStylePanelToDarker2, fillStylePanelFromLighter2, strokeStylePanel, Math.floor(single_digit_width/30), "round")
					draw_figure(part, xPos, yPos, myfigure, 0, myfigure.length, fillStyleSymbolToDarker, fillStyleSymbolFromLighter, fillStyleSymbolToDarker, fillStyleSymbolFromLighter, strokeStyleSymbol, Math.floor(single_digit_width/30), "raw");
				}
				//-------------------------------------------------------------------------------------------------
				function draw_figure(part, xPos, yPos, myfigure, sj, ej, fillStyle1, fillStyle2, fillStyle12, fillStyle22, strokeStyle, lineWidth, round_type){
					var ctx = ctx_animate;
					ctx.lineWidth = lineWidth;
					ctx.beginPath();
					if(round_type == "round"){
						min_x = -1;min_y = -1;max_x = -1;max_y = -1;
					}
					for(j=sj;j<ej;j++){
						var xx=[],yy=[];
						for(k=1;k<myfigure[j].length;k+=2){
							//take coordinates from drawing
							xx.push(myfigure[j][k]);
							yy.push(myfigure[j][k+1]);
						}
						for(k=0;k<xx.length;k++){
							//scale and translate
							xx[k] = norm_coord(xx[k], 75, myscale, round_type);
							//change coordinates to achieve 3d effect
							if(type3d == "single")xx[k]+=single_digit_width/2;//perspective for each digit
							else xx[k]+=shift_right;//prespective for all digits
							yy[k] = norm_coord(yy[k], 75, myscale, round_type);yy[k]+=shift_bottom;
							var x0 = xx[k],y0 = yy[k],w0;
							if(type3d == "single") w0 = single_digit_width;//perspective for each digit
							else w0 = cw;//prespective for all digits
							var h0 = ch,w0_5=w0/2,h0_5=h0/2;
							var xoff = xPos,yoff = yPos,x1,y1;
							px = (w0_5-x0)/w0_5;
							if(yoff<=0){//above middle
								if(y0<=h0_5){//only above middle will change
									py = (h0_5-y0)/h0_5;
								}
								else{
									py = 0;//below middle will not change
								}
								y1 = h0_5+yoff*py;
								ctx.fillStyle = fillStyle1;
							}
							else{//below middle
								if(y0<=h0_5){
									py = 0;//above middle no change
								}
								else{//only below middle will change
									py = (y0-h0_5)/h0_5;
								}
								y1 = h0_5+yoff*py;
								ctx.fillStyle = fillStyle2;
							}
							if(type3d == "single") x1 = x0+px*py*xoff-single_digit_width/2+shift_right;//perspective for each digit
							else x1 = x0+px*py*xoff;//prespective for all digits
							//to calculate position i remove the shift for percent calc and add shift for position calc
							if(round_type=="round"){
								xx[k] = Math.round(x1);
							}
							else{
								xx[k] = x1;
							}
							yy[k] = Math.round(y1);
						}
						//draw it
						if (myfigure[j][0] == 'M' || myfigure[j][0] == 'm') {
							ctx.moveTo(xx[0], yy[0]);
						} else if(myfigure[j][0] == 'L' || myfigure[j][0] == 'l' || myfigure[j][0] == 'V' || myfigure[j][0] == 'v' || myfigure[j][0] == 'H' || myfigure[j][0] == 'h' || myfigure[j][0] == 'Z' || myfigure[j][0] == 'z') {
							ctx.lineTo(xx[0], yy[0]);
						} else if(myfigure[j][0] == 'C' || myfigure[j][0] == 'c' || myfigure[j][0] == 'S' || myfigure[j][0] == 's') {
							ctx.bezierCurveTo(xx[0],yy[0],xx[1],yy[1],xx[2],yy[2]);
						}
						if(round_type == "round"){
							if(min_y == -1 || yy[0]<min_y) min_y = yy[0];
							if(max_y == -1 || yy[0]>max_y) max_y = yy[0];
						}
					}
					var my_gradient;
					if(round_type == "round"){
						if(min_y<(ch/2) && max_y<=Math.round(ch/2)){
							if(fillStyle12!=fillStyle1){
								my_gradient = ctx.createLinearGradient(0, min_y, 0, max_y);
								my_gradient.addColorStop(0, "#aaa");
								my_gradient.addColorStop(0.1, fillStyle12);
								my_gradient.addColorStop(0.95, fillStyle1);
								my_gradient.addColorStop(1, "#000");
								ctx.fillStyle = my_gradient;
							}
						}
						else{
							if(fillStyle22!=fillStyle2){
								my_gradient = ctx.createLinearGradient(0, min_y, 0, max_y);
								my_gradient.addColorStop(1, fillStyle22);
								my_gradient.addColorStop(0.05, fillStyle2);
								my_gradient.addColorStop(0, "#aaa");
								ctx.fillStyle = my_gradient;
							}
						}
					}
					else{
						if(use_gradient){
							my_gradient = ctx.createLinearGradient(0, min_y, 0, max_y);
							if(min_y<(ch/2) && max_y<=Math.round(ch/2)){
								my_gradient.addColorStop(0.95, fillStyle1);
								my_gradient.addColorStop(1, "#000");
							}
							else{
								my_gradient.addColorStop(0.05, fillStyle2);
								my_gradient.addColorStop(0, "#aaa");
							}
							ctx.fillStyle = my_gradient;
						}
					}
					ctx.fill();
					//ctx.strokeStyle = strokeStyle;
					//if(round_type == "round" && lineWidth) ctx.stroke();
				}
				//-------------------------------------------------------------------------------------------------
				obj.init();
			});
    };
})(jQuery);