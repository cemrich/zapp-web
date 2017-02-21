'use strict';

(function () {

	var menu = jQuery('#channel-menu');
	var playerNode = jQuery('#player');
	var player = videojs('#player');
	var menuItem = jQuery('<a class="channel"><img/></a>');
	var channels = {};

	jQuery.getJSON('data/channels.json', function(json) {
		json.forEach(function (channel) {
			channel.name = channel.name.replace(/\u00ad/g, '');
			channel.logo_path = 'img/' + channel.logo_name + '.svg';
			channels[channel.id] = channel;
		});
		buildMenu();
		changeStateToHash();
	});

	jQuery(window).bind('hashchange', function () { //detect hash change
		changeStateToHash();
	});

	function changeStateToHash() {
		if (window.location.hash.length === 0) {
			showMenu();
		} else {
			var channelId = window.location.hash.slice(1);
			showPlayer(channelId);
		}
	}

	function showMenu() {
		player.pause();
		playerNode.hide();
		menu.show();
	}

	function showPlayer(channelId) {
		console.log('show player for ' + channelId);
		var channel = channels[channelId];
		player.poster(channel.logo_path);
		player.src({ type: 'application/x-mpegURL', src: channel.stream_url });
		menu.hide();
		playerNode.show();
		player.ready(function () {
			player.play();
		});
	}

	function buildMenu() {
		for (var id in channels) {
			var channel = channels[id];
			var item = menuItem.clone();
			var img = item.find('img');
			img.attr('alt', channel.name);
			img.attr('title', channel.name);
			img.attr('src', channel.logo_path);
			item.attr('href', '#' + channel.id);
			menu.append(item);
		}
	}
})();
