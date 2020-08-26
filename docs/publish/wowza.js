var STREAM_URL = '/api/v1.3/live_streams/' + 'yrp6rrpn';
var STOP_SERVERS = 'Stop Servers';
var START_SERVERS = 'Start Servers';

async function checkStreamState() {
  try {
    var stateResult = await callWowzaStreamApi('/state', 'GET');
    if (stateResult.meta && stateResult.meta.status !== 200) {
      setError('Could not connect to the streaming server. Please wait.');
      setButtonStatus();
    } else {
      switch (stateResult.live_stream.state) {
        case 'started':
          setError('');
          break;
        case 'stopped':
          setError('Streaming servers are stopped. Please start the servers.');
          break;
        case 'starting':
          setError('Streaming servers are starting.', 'warning');
          break;
        case 'stopping':
          setError('Streaming servers are stopping. Please wait to restart.', 'warning');
          break;
        case 'resetting':
        default:
          setError('Streaming servers are not ready. Please wait.', 'warning');
          break;
      }
      setButtonStatus(stateResult.live_stream.state);
    }
  } catch (error) {
    console.log(error);
    setError('Could not connect to the streaming server. Please wait.');
    setButtonStatus();
  }
}

function handleToggleStream() {
  var toggleText = $('#buttonToggleStream').prop('value');
  if (toggleText === START_SERVERS) {
    toggleStream('start');
    setButtonStatus('starting');
  } else {
    toggleStream('stop');
    setButtonStatus('stopping');
  }
}

async function toggleStream(action) {
  try {
    var stateResult = await callWowzaStreamApi('/' + action, 'PUT');
    if (stateResult.meta && stateResult.meta.status !== 200) {
      setError('Failed to ' + action + ' servers. Try again.');
    } else {
      setError('');
    }
  } catch (error) {
    setError('Failed to ' + action + ' servers. Try again.');
  }
}

async function callWowzaStreamApi(path, method) {
  var wowzaHeaders = getHeaders();
  var wowzaStreamResult = await fetch('https://api.cloud.wowza.com' + STREAM_URL + path, { method, headers: wowzaHeaders }).then(response => response.json());
  return wowzaStreamResult;
}

function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    'wsc-api-key': WOWZA_API_KEY,
    'wsc-access-key': WOWZA_ACCESS_KEY
  };

  return headers;
}

function setButtonStatus(serverStatus) {
  var enableGo = true;
  var enableToggle = true;
  var toggleText = $('#buttonToggleStream').prop('value');

  switch (serverStatus) {
    case 'started':
      toggleText = STOP_SERVERS;
      break;
    case 'stopped':
      enableGo = false;
      toggleText = START_SERVERS;
      break;
    case 'starting':
    case 'stopping':
    case 'resetting':
    default:
      enableGo = false;
      enableToggle = false;
      break;
  }
  
  $('#buttonGo').prop('disabled', !enableGo);
  $('#buttonToggleStream').prop('disabled', !enableToggle);
  $('#buttonToggleStream').prop('value', toggleText);
}

function setError(error, status = 'danger') {
  $("#wowzaError").html(error);
  $("#wowzaError").css("visibility", !!error ? 'visible' : 'hidden');
  
  var alertType;
  switch (status) {
    case 'danger':
      alertType = 'alert-danger';
      break;
    case 'warning':
    default:
      alertType = 'alert-warning';
      break;
  }

  $('#wowzaError').removeClass('alert-danger');
  $('#wowzaError').removeClass('alert-warning');
  $('#wowzaError').addClass(alertType);
}

checkStreamState();
setInterval(checkStreamState, 5000);