// error function
const handleError = (message) => {
  console.log(message);
  $('#consoleMessage').html(message);
  $('#loginConsoleMessage').html(message);
  $('#consoleMessage').show();
  $('#loginConsoleMessage').show();
};

// redirect function
const redirect = (response) => {
  window.location = response.redirect;
};

// send ajax helper
const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type,
    url: action,
    data,
    dataType: 'json',
    success,
    error(xhr, status, error){
      const messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    },
  });
};
