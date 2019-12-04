"use strict";

// handle login function
var handleLogin = function handleLogin(e) {
  e.preventDefault();

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError('Username or password is empty');
    return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

// handle sign-up function
var handleSignup = function handleSignup(e) {
  e.preventDefault();

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError('All fields are required');
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError('Passwords do not match');
    return false;
  }
  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
};

// login form
var LoginWindow = function LoginWindow(props) {
  return React.createElement(
    "form",
    { id: "loginForm",
      name: "loginForm",
      onSubmit: handleLogin,
      action: "/login",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "div",
      { className: "row" },
      React.createElement("input", { className: "formInput", id: "user", type: "text", name: "username",
        placeholder: "username" }),
      React.createElement("input", { className: "formInput", id: "pass", type: "password", name: "pass",
        placeholder: "password" })
    ),
    React.createElement(
      "div",
      { className: "row" },
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign In" })
    )
  );
};

// sign-up form
var SignUpWindow = function SignUpWindow(props) {
  return React.createElement(
    "form",
    { id: "signupForm",
      name: "signupForm",
      onSubmit: handleSignup,
      action: "/signup",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "label",
      { htmlFor: "username" },
      "Username: "
    ),
    React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
    React.createElement(
      "label",
      { htmlFor: "pass" },
      "Password: "
    ),
    React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
    React.createElement(
      "label",
      { htmlFor: "pass2" },
      "Password: "
    ),
    React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign Up" })
  );
};

// render login form
var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

// render sign-up form
var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render(React.createElement(SignUpWindow, { csrf: csrf }), document.querySelector("#content"));
};

// function to send AJAX for form based on form ID
var setSubmit = function setSubmit(uID) {
  $(uID).on('submit', function (e) {
    e.preventDefault();
    sendAjax($(uID).attr('method'), $(uID).attr('action'), $(uID).serialize());

    return false;
  });
};

// initial set-up
var setup = function setup(csrf) {
  // set submit for non user input forms
  for (var i = 0; i < 5; i++) {
    setSubmit('#boardNavForm' + i);
    setSubmit('#boardDeleteForm' + i);
  }
  for (var _i = 0; _i < 25; _i++) {
    setSubmit('#ticketDeleteForm' + _i);
  }

  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");

  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });

  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  createLoginWindow(csrf);
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
