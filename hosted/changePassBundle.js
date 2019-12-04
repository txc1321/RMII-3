'use strict';

// function to handle change password submit
var handleChangePass = function handleChangePass(e) {
  e.preventDefault();

  if ($('#oldPass').val() == '' || $('#newPass').val() == '' || $('#newPass2').val() == '') {
    handleError('All fields are required');
    return false;
  }
  if ($('#newPass').val() !== $('#newPass2').val()) {
    handleError('Passwords do not match');
    return false;
  }
  if ($('#newPass').val() === $('#oldPass').val()) {
    handleError('New password cannot be old password');
    return false;
  }

  sendAjax('POST', $('#changePasswordForm').attr('action'), $('#changePasswordForm').serialize(), redirect);

  return false;
};

// change pass form
var ChangePass = function ChangePass(props) {
  return React.createElement(
    'form',
    { id: 'changePasswordForm',
      name: 'changePasswordForm',
      onSubmit: handleChangePass,
      action: '/changePassword',
      method: 'POST',
      className: 'mainForm' },
    React.createElement('input', { id: 'oldPass', className: 'formInput', type: 'password', name: 'oldPass',
      placeholder: 'Old Password' }),
    React.createElement('input', { id: 'newPass', className: 'formInput', type: 'password', name: 'newPass',
      placeholder: 'New Password' }),
    React.createElement('input', { id: 'newPass2', className: 'formInput', type: 'password', name: 'newPass2',
      placeholder: 'Retype New Password' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Change Password' })
  );
};

// function to launch form window
var createChangePassWindow = function createChangePassWindow(csrf) {
  ReactDOM.render(React.createElement(ChangePass, { csrf: csrf }), document.querySelector("#content"));
};

// initial set up
var setup = function setup(csrf) {
  createChangePassWindow(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

// on page load
$(document).ready(function () {
  $('#consoleMessage').hide();
  $('#loginConsoleMessage').hide();
  getToken();
});
'use strict';

// error function
var handleError = function handleError(message) {
  console.log(message);
  $('#consoleMessage').html(message);
  $('#loginConsoleMessage').html(message);
  $('#consoleMessage').show();
  $('#loginConsoleMessage').show();
};

// redirect function
var redirect = function redirect(response) {
  window.location = response.redirect;
};

// send ajax helper
var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
