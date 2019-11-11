'use strict';

var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#domoMessage').animate({ width: 'toggle' }, 350);
};

// form top left
// optional columns for priority
// list by dateCreated
// sort by dateDue, priotity master list

// Implement sharing

var sendAjax = function sendAjax(action, data) {
  $.ajax({
    cache: false,
    type: 'POST',
    url: action,
    data: data,
    dataType: 'json',
    success: function success(result, status, xhr) {
      $('#domoMessage').animate({ width: 'hide' }, 350);

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

    $('#domoMessage').animate({ width: 'hide' }, 350);

    if ($('#user').val() === '' || $('#pass').val() === '' || $('#pass2').val() === '') {
      handleError('RAWR! All fields are required');
      return false;
    }

    if ($('#pass').val() !== $('#pass2').val()) {
      handleError('RAWR! Passwords do not match');
      return false;
    }

    sendAjax($('#signupForm').attr('action'), $('#signupForm').serialize());

    return false;
  });

  $('#loginForm').on('submit', function (e) {
    e.preventDefault();

    $('#domoMessage').animate({ width: 'hide' }, 350);

    if ($('#user').val() === '' || $('#pass').val() === '') {
      handleError('RAWR! Username or password is empty');
      return false;
    }

    sendAjax($('#loginForm').attr('action'), $('#loginForm').serialize());

    return false;
  });

  $('#ticketForm').on('submit', function (e) {
    e.preventDefault();

    $('#domoMessage').animate({ width: 'hide' }, 350);

    if ($('#ticketTitle').val() === '' || $('#ticketPriority').val() === '' || $('#ticketDueDate').val() === '') {
      handleError('RAWR! All fields are required');
      return false;
    }

    sendAjax($('#ticketForm').attr('action'), $('#ticketForm').serialize());

    return false;
  });
});
