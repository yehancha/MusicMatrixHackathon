var video = document.getElementById('video');
var VIDEO_SRC = 'https://cdn3.wowza.com/1/aWtQYmE4K083cUh3/U1FqbUVK/hls/live/playlist.m3u8';
var AUDIO_SRC = 'https://cdn3.wowza.com/1/S2FaU00wdGFzKzJ0/RFRjWklS/hls/live/playlist.m3u8';

var videoSrc = 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8';

if (Hls.isSupported()) {
  var hls = new Hls();
  hls.loadSource(videoSrc);
  hls.attachMedia(video);
  hls.on(Hls.Events.MANIFEST_PARSED, function () {
    document.getElementById('play').removeAttribute('disabled');
  });
}
// hls.js is not supported on platforms that do not have Media Source
// Extensions (MSE) enabled.
// 
// When the browser has built-in HLS support (check using `canPlayType`),
// we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video
// element through the `src` property. This is using the built-in support
// of the plain video element, without using hls.js.
// 
// Note: it would be more normal to wait on the 'canplay' event below however
// on Safari (where you are most likely to find built-in HLS support) the
// video.src URL must be on the user-driven white-list before a 'canplay'
// event will be emitted; the last video event that can be reliably
// listened-for when the URL is not on the white-list is 'loadedmetadata'.
else if (video.canPlayType('application/vnd.apple.mpegurl')) {
  video.src = videoSrc;
  video.addEventListener('loadedmetadata', function () {
    video.play();
  });
}

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
    setAvailable(tagId, response.status === 200);
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