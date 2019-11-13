'use strict';

var handleError = function handleError(message) {
  console.log(message);
};

var sendAjax = function sendAjax(type, action, data) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: function success(result, status, xhr) {

      window.location = result.redirect;
    },
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    }
  });
};

$(document).ready(function () {
  $('#signupForm').on('submit', function (e) {
    e.preventDefault();

    if ($('#user').val() === '' || $('#pass').val() === '' || $('#pass2').val() === '') {
      handleError('RAWR! All fields are required');
      return false;
    }

    if ($('#pass').val() !== $('#pass2').val()) {
      handleError('RAWR! Passwords do not match');
      return false;
    }

    sendAjax($('#signupForm').attr('method'), $('#signupForm').attr('action'), $('#signupForm').serialize());

    return false;
  });

  $('#loginForm').on('submit', function (e) {
    e.preventDefault();

    if ($('#user').val() === '' || $('#pass').val() === '') {
      handleError('RAWR! Username or password is empty');
      return false;
    }

    sendAjax($('#loginForm').attr('method'), $('#loginForm').attr('action'), $('#loginForm').serialize());

    return false;
  });

  $('#ticketForm').on('submit', function (e) {
    e.preventDefault();

    if ($('#ticketTitle').val() === '' || $('#ticketPriority').val() === '' || $('#ticketDueDate').val() === '') {
      handleError('RAWR! All fields are required');
      return false;
    }

    sendAjax($('#ticketForm').attr('method'), $('#ticketForm').attr('action'), $('#ticketForm').serialize());

    return false;
  });

  $('#boardForm').on('submit', function (e) {
    e.preventDefault();

    if ($('#boardName').val() === '') {
      handleError('RAWR! All fields are required');
      return false;
    }

    sendAjax($('#boardForm').attr('method'), $('#boardForm').attr('action'), $('#boardForm').serialize());

    return false;
  });

  $('#boardDeleteForm').on('submit', function (e) {
    e.preventDefault();
    sendAjax($('#boardDeleteForm').attr('method'), $('#boardDeleteForm').attr('action'), $('#boardDeleteForm').serialize());

    return false;
  });

  $('#boardNavigateForm').on('submit', function (e) {
    e.preventDefault();
    sendAjax($('#boardNavigateForm').attr('method'), $('#boardNavigateForm').attr('action'), $('#boardNavigateForm').serialize());

    return false;
  });
});
