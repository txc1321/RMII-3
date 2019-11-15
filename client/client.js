const handleError = (message) => {
  console.log(message);
};

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

const setSubmit = (uID) => {
  $(uID).on('submit', (e) => {
    e.preventDefault();
    sendAjax($(uID).attr('method'), $(uID).attr('action'), $(uID).serialize());

    return false;
  });
};


$(document).ready(() => {
  for(let i = 0; i < 5; i++){
    setSubmit("#boardNavForm" + i);
    setSubmit("#boardDeleteForm" + i);
  }
  for(let i = 0; i < 25; i++){
    setSubmit("#ticketDeleteForm" + i);
  }

  $('#signupForm').on('submit', (e) => {
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

  $('#loginForm').on('submit', (e) => {
    e.preventDefault();

    if ($('#user').val() === '' || $('#pass').val() === '') {
      handleError('RAWR! Username or password is empty');
      return false;
    }

    sendAjax($('#loginForm').attr('method'), $('#loginForm').attr('action'), $('#loginForm').serialize());

    return false;
  });

  $('#ticketForm').on('submit', (e) => {
    e.preventDefault();

    if ($('#ticketTitle').val() === '' ||
        $('#ticketPriority').val() === '' ||
        $('#ticketDueDate').val() === '') {
      handleError('RAWR! All fields are required');
      return false;
    }

    sendAjax($('#ticketForm').attr('method'), $('#ticketForm').attr('action'), $('#ticketForm').serialize());

    return false;
  });

  $('#boardForm').on('submit', (e) => {
    e.preventDefault();

    if ($('#boardName').val() === '') {
      handleError('RAWR! All fields are required');
      return false;
    }

    sendAjax($('#boardForm').attr('method'), $('#boardForm').attr('action'), $('#boardForm').serialize());

    return false;
  });
});
