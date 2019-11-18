// handle error message
const handleError = (message) => {
  console.log(message);
  $('#consoleMessage').html(message);
  $('#consoleMessage').show();
};

// send AJAX data through XHR from form
const sendAjax = (type, action, data) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data,
    dataType: 'json',
    success: (result, status, xhr) => {
      window.location = result.redirect;
    },
    error: (xhr, status, error) => {
      console.log(xhr.responseText);
      const messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    },
  });
};

// function to send AJAX for form based on form ID
const setSubmit = (uID) => {
  $(uID).on('submit', (e) => {
    e.preventDefault();
    sendAjax($(uID).attr('method'), $(uID).attr('action'), $(uID).serialize());

    return false;
  });
};

// call on page ready
$(document).ready(() => {
  $('#consoleMessage').hide();

  // set submit for non user input forms
  for (let i = 0; i < 5; i++) {
    setSubmit('#boardNavForm' + i);
    setSubmit('#boardDeleteForm' + i);
  }
  for (let i = 0; i < 25; i++) {
    setSubmit('#ticketDeleteForm' + i);
  }

  // sign up form handler
  $('#signupForm').on('submit', (e) => {
    e.preventDefault();

    if ($('#user').val() === '' || $('#pass').val() === '' || $('#pass2').val() === '') {
      handleError('All fields are required');
      return false;
    }

    if ($('#pass').val() !== $('#pass2').val()) {
      handleError('Passwords do not match');
      return false;
    }

    sendAjax($('#signupForm').attr('method'), $('#signupForm').attr('action'), $('#signupForm').serialize());

    return false;
  });

  // login form handler
  $('#loginForm').on('submit', (e) => {
    e.preventDefault();

    if ($('#user').val() === '' || $('#pass').val() === '') {
      handleError('Username or password is empty');
      return false;
    }

    sendAjax($('#loginForm').attr('method'), $('#loginForm').attr('action'), $('#loginForm').serialize());

    return false;
  });

  // change password form handler
  $('#changePasswordForm').on('submit', (e) => {
    e.preventDefault();

    if ($('#oldPass').val() === '' || $('#newPass').val() === '' || $('#newPass2').val() === '') {
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

    sendAjax($('#changePasswordForm').attr('method'), $('#changePasswordForm').attr('action'), $('#changePasswordForm').serialize());

    return false;
  });

  // ticket form handler
  $('#ticketForm').on('submit', (e) => {
    e.preventDefault();

    if ($('#ticketTitle').val() === '' ||
        $('#ticketPriority').val() === '' ||
        $('#ticketDueDate').val() === '') {
      handleError('Title, Priority, and Due Date are all required');
      return false;
    }

    sendAjax($('#ticketForm').attr('method'), $('#ticketForm').attr('action'), $('#ticketForm').serialize());

    return false;
  });

  // board form handler
  $('#boardForm').on('submit', (e) => {
    e.preventDefault();

    if ($('#boardName').val() === '') {
      handleError('Name is required');
      return false;
    }

    sendAjax($('#boardForm').attr('method'), $('#boardForm').attr('action'), $('#boardForm').serialize());

    return false;
  });
});
