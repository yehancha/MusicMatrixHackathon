var VIDEO_SRC = 'https://cdn3.wowza.com/1/aWtQYmE4K083cUh3/U1FqbUVK/hls/live/playlist.m3u8';
var AUDIO_SRC = 'https://cdn3.wowza.com/1/S2FaU00wdGFzKzJ0/RFRjWklS/hls/live/playlist.m3u8';

function copyVideoSrc() {
  copyToClipboard(VIDEO_SRC, 'copy-video');
}

function copyAudioSrc() {
  copyToClipboard(AUDIO_SRC, 'copy-audio');
}

function copyToClipboard(text, buttonClass) {
  var el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style = { position: 'absolute', left: '-9999px' };
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

  $('.copy').text('Copy');
  $('.' + buttonClass).text('Copied!');
}

function monitorUrlAvailability() {
  setAvailability(VIDEO_SRC, 'video-availability');
  setAvailability(AUDIO_SRC, 'audio-availability');
}

function setAvailability(src, tagId) {
  fetch(src).then(response => {
    var available = response.status === 200;
    setAvailable(tagId, available);
  });
}

function setAvailable(tagId, available) {
  if (available) {
    $('#' + tagId).removeClass('badge-danger');
    $('#' + tagId).addClass('badge-success');
    $('#' + tagId).text('Available');
  } else {
    $('#' + tagId).removeClass('badge-success');
    $('#' + tagId).addClass('badge-danger');
    $('#' + tagId).text('Not Available');
  }
}

monitorUrlAvailability();
setInterval(monitorUrlAvailability, 5000);

var player = videojs('hls-example');
function changeSource(src) {
  player.src({ type: "application/x-mpegURL", src: src });

  if (src === VIDEO_SRC) {
    $('#playing-title').text('Playing Video');
  } else {
    $('#playing-title').text('Playing Audio');
  }
}

changeSource(AUDIO_SRC);