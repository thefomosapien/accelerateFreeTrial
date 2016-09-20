

$(document).ready(function () {

  // Fix Widows
  $('p').widowFix();


  // Smooth Scroll	
  $('ul.nav a').smoothScroll();

  $('.logo a').click(function (event) {
    event.preventDefault();
    var link = this;
    $.smoothScroll({
      scrollTarget: link.hash
    });
  });


  // Fancy Box
  $(".fancybox").fancybox();


  // Mosaic Fade
  $('.circle').mosaic({
    opacity: 0.8			//Opacity for overlay (0-1)
  });


  $('#first_countdown').ResponsiveCountdown({
				target_date: "2016/11/1 12:10:00",
				time_zone: -7,
				target_future: true,
				set_id: 0,
				pan_id: 2,
				day_digits: 3,
				fillStyleSymbol1: "rgba(255,255,255,1)",
				fillStyleSymbol2: "rgba(255,255,255,1)",
				fillStylesPanel_g1_1: "rgba(178, 210, 52, 1)",
				fillStylesPanel_g1_2: "rgba(178, 210, 52, 1)",
				fillStylesPanel_g2_1: "rgba(178, 210, 52, 1)",
				fillStylesPanel_g2_2: "rgba(178, 210, 52, 1)",
				text_color: "rgba(0, 0, 0, 1)",
				text_glow: "rgba(3, 3, 3, 1)",
				show_ss: true,
				show_mm: true,
				show_hh: true,
				show_dd: false,
				f_family: "Verdana",
				show_labels: true,
				type3d: "single",
				max_height: 300,
				days_long: "days",
				days_short: "dd",
				hours_long: "hours",
				hours_short: "hh",
				mins_long: "minutes",
				mins_short: "mm",
				secs_long: "seconds",
				secs_short: "ss",
				min_f_size: 9,
				max_f_size: 30,
				spacer: "none",
				groups_spacing: 0,
				text_blur: 0,
				font_to_digit_ratio: 0.125,
				labels_space: 1.2,
				complete: function(){alert('Please sign up today to receive your FREE TRIAL')}
  });


});







