'use strict';

(function () {

	var mainPage = jQuery('#page-main');
	var videoPage = jQuery('#page-video');
	var navigationMenuVideo = videoPage.find('.navigation-menu');
	var menu = jQuery('#channel-menu');
	var playerNode = jQuery('#player');
	var playerControlBar = playerNode.find('.vjs-control-bar');
	var player = videojs('#player');
	var menuItem = jQuery('<a class="channel"><img/><span class="subtitle"></span></a>');
	var channels = {};

	jQuery.getJSON('data/channels.json', function(json) {
		json.forEach(function (channel) {
			channel.name = channel.name.replace(/\u00ad/g, '');
			channel.logo_path = 'img/' + channel.logo_name + '.svg';
			channels[channel.id] = channel;
		});
		buildMenu();
		showMainPage();
		changeStateToHash();
	});

	player.on('useractive', function () {
		navigationMenuVideo.fadeTo(0, 1);
	});
	player.on('userinactive', function () {
		navigationMenuVideo.fadeTo(1000, 0);
	});

	jQuery(window).bind('hashchange', function () { //detect hash change
		changeStateToHash();
	});

	function changeStateToHash() {
		if (window.location.hash.length === 0) {
			showMainPage();
		} else {
			var channelId = window.location.hash.slice(1);
			if (channels[channelId]) {
				showVideoPage(channelId);
			} else {
				showMainPage();
			}
		}
	}

	function showMainPage() {
		player.pause();
		videoPage.hide();
		mainPage.show();
	}

	function showVideoPage(channelId) {
		console.log('show player for ' + channelId);
		var channel = channels[channelId];
		player.poster(channel.logo_path);
		player.src({ type: 'application/x-mpegURL', src: channel.stream_url });
		mainPage.hide();
		playerControlBar.css('background-color', channel.color);
		navigationMenuVideo.css('background-color', channel.color);
		videoPage.show();
		player.ready(function () {
			player.play();
		});
	}

	function buildMenu() {
		for (var id in channels) {
			var channel = channels[id];
			var item = menuItem.clone();
			var img = item.find('img');
			var subtitle = item.find('.subtitle');
			img.attr('alt', channel.name);
			img.attr('title', channel.name);
			img.attr('src', channel.logo_path);
			if (channel.subtitle) {
				subtitle.text(channel.subtitle);
				subtitle.show();
			} else {
				subtitle.hide();
			}
			item.attr('href', '#' + channel.id);
			menu.append(item);
		}
	}
})();
