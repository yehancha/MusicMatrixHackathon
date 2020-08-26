async function checkStreamState() {
  var stateUrl = '/api/v1.3/live_streams/' + 'yrp6rrpn' + '/state';
  var wowzaHeaders = getHeaders(stateUrl);

  try {
    var stateResult = await fetch('https://api.cloud.wowza.com' + stateUrl, { method: 'GET', headers: wowzaHeaders }).then(response => response.json());
    if (stateResult.meta && stateResult.meta.status !== 200) {
      setError('Could not connect to the streaming server. Please wait.');
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
    }
  } catch (error) {
    return { error };
  }
}

function getHeaders(url) {
  const headers = {
    'Content-Type': 'application/json',
    'wsc-api-key': WOWZA_API_KEY,
    'wsc-access-key': WOWZA_ACCESS_KEY
  };

  return headers;
}

function setError(error, status = 'danger') {
  $("#wowzaError").html(error);
  $("#wowzaError").css("visibility", !!error ? 'visible' : 'hidden');
  $('#buttonGo').prop('disabled', !!error);
  
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