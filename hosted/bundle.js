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
      console.log(xhr.responseText);
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

  $('#boardNavForm0').on('submit', function (e) {
    e.preventDefault();
    sendAjax($('#boardNavForm0').attr('method'), $('#boardNavForm0').attr('action'), $('#boardNavForm0').serialize());

    return false;
  });

  $('#boardNavForm1').on('submit', function (e) {
    e.preventDefault();
    sendAjax($('#boardNavForm1').attr('method'), $('#boardNavForm1').attr('action'), $('#boardNavForm1').serialize());

    return false;
  });

  $('#boardNavForm2').on('submit', function (e) {
    e.preventDefault();
    sendAjax($('#boardNavForm2').attr('method'), $('#boardNavForm2').attr('action'), $('#boardNavForm2').serialize());

    return false;
  });

  $('#boardNavForm3').on('submit', function (e) {
    e.preventDefault();
    sendAjax($('#boardNavForm3').attr('method'), $('#boardNavForm3').attr('action'), $('#boardNavForm3').serialize());

    return false;
  });

  $('#boardNavForm4').on('submit', function (e) {
    e.preventDefault();
    sendAjax($('#boardNavForm4').attr('method'), $('#boardNavForm4').attr('action'), $('#boardNavForm4').serialize());

    return false;
  });

  $('#boardDeleteForm0').on('submit', function (e) {
    e.preventDefault();
    sendAjax($('#boardDeleteForm0').attr('method'), $('#boardDeleteForm0').attr('action'), $('#boardDeleteForm0').serialize());

    return false;
  });

  $('#boardDeleteForm1').on('submit', function (e) {
    e.preventDefault();
    sendAjax($('#boardDeleteForm1').attr('method'), $('#boardDeleteForm1').attr('action'), $('#boardDeleteForm1').serialize());

    return false;
  });

  $('#boardDeleteForm2').on('submit', function (e) {
    e.preventDefault();
    sendAjax($('#boardDeleteForm2').attr('method'), $('#boardDeleteForm2').attr('action'), $('#boardDeleteForm2').serialize());

    return false;
  });

  $('#boardDeleteForm3').on('submit', function (e) {
    e.preventDefault();
    sendAjax($('#boardDeleteForm3').attr('method'), $('#boardDeleteForm3').attr('action'), $('#boardDeleteForm3').serialize());

    return false;
  });

  $('#boardDeleteForm4').on('submit', function (e) {
    e.preventDefault();
    sendAjax($('#boardDeleteForm4').attr('method'), $('#boardDeleteForm4').attr('action'), $('#boardDeleteForm4').serialize());

    return false;
  });

  $('#ticketDeleteForm0').on('submit', function (e) {
    e.preventDefault();
    sendAjax($('#ticketDeleteForm0').attr('method'), $('#ticketDeleteForm0').attr('action'), $('#ticketDeleteForm0').serialize());

    return false;
  });

  $('#ticketDeleteForm1').on('submit', function (e) {
    e.preventDefault();
    sendAjax($('#ticketDeleteForm1').attr('method'), $('#ticketDeleteForm1').attr('action'), $('#ticketDeleteForm1').serialize());

    return false;
  });

  $('#ticketDeleteForm2').on('submit', function (e) {
    e.preventDefault();
    sendAjax($('#ticketDeleteForm2').attr('method'), $('#ticketDeleteForm2').attr('action'), $('#ticketDeleteForm2').serialize());

    return false;
  });

  $('#ticketDeleteForm3').on('submit', function (e) {
    e.preventDefault();
    sendAjax($('#ticketDeleteForm3').attr('method'), $('#ticketDeleteForm3').attr('action'), $('#ticketDeleteForm3').serialize());

    return false;
  });

  $('#ticketDeleteForm4').on('submit', function (e) {
    e.preventDefault();
    sendAjax($('#ticketDeleteForm4').attr('method'), $('#ticketDeleteForm4').attr('action'), $('#ticketDeleteForm4').serialize());

    return false;
  });
});
