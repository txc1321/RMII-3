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

$(document).ready(() => {
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


  $('#boardNavForm0').on('submit', (e) => {
    e.preventDefault();
    sendAjax($('#boardNavForm0').attr('method'), $('#boardNavForm0').attr('action'), $('#boardNavForm0').serialize());

    return false;
  });


  $('#boardNavForm1').on('submit', (e) => {
    e.preventDefault();
    sendAjax($('#boardNavForm1').attr('method'), $('#boardNavForm1').attr('action'), $('#boardNavForm1').serialize());

    return false;
  });


  $('#boardNavForm2').on('submit', (e) => {
    e.preventDefault();
    sendAjax($('#boardNavForm2').attr('method'), $('#boardNavForm2').attr('action'), $('#boardNavForm2').serialize());

    return false;
  });


  $('#boardNavForm3').on('submit', (e) => {
    e.preventDefault();
    sendAjax($('#boardNavForm3').attr('method'), $('#boardNavForm3').attr('action'), $('#boardNavForm3').serialize());

    return false;
  });


  $('#boardNavForm4').on('submit', (e) => {
    e.preventDefault();
    sendAjax($('#boardNavForm4').attr('method'), $('#boardNavForm4').attr('action'), $('#boardNavForm4').serialize());

    return false;
  });

  $('#boardDeleteForm0').on('submit', (e) => {
    e.preventDefault();
    sendAjax($('#boardDeleteForm0').attr('method'), $('#boardDeleteForm0').attr('action'), $('#boardDeleteForm0').serialize());

    return false;
  });

  $('#boardDeleteForm1').on('submit', (e) => {
    e.preventDefault();
    sendAjax($('#boardDeleteForm1').attr('method'), $('#boardDeleteForm1').attr('action'), $('#boardDeleteForm1').serialize());

    return false;
  });

  $('#boardDeleteForm2').on('submit', (e) => {
    e.preventDefault();
    sendAjax($('#boardDeleteForm2').attr('method'), $('#boardDeleteForm2').attr('action'), $('#boardDeleteForm2').serialize());

    return false;
  });

  $('#boardDeleteForm3').on('submit', (e) => {
    e.preventDefault();
    sendAjax($('#boardDeleteForm3').attr('method'), $('#boardDeleteForm3').attr('action'), $('#boardDeleteForm3').serialize());

    return false;
  });


  $('#boardDeleteForm4').on('submit', (e) => {
    e.preventDefault();
    sendAjax($('#boardDeleteForm4').attr('method'), $('#boardDeleteForm4').attr('action'), $('#boardDeleteForm4').serialize());

    return false;
  });
});
