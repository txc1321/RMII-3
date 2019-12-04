// function to handle change password submit
const handleChangePass = (e) => {
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
const ChangePass = (props) => {
  return(
    <form id="changePasswordForm"
        name="changePasswordForm"
        onSubmit={handleChangePass}
        action="/changePassword"
        method="POST"
        className="mainForm">
        <input id="oldPass" className="formInput" type="password" name="oldPass"
               placeholder="Old Password"/>
        <input id="newPass" className="formInput" type="password" name="newPass"
               placeholder="New Password"/>
        <input id="newPass2" className="formInput" type="password" name="newPass2"
               placeholder="Retype New Password"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Change Password"/>
    </form>
  );
};

// function to launch form window
const createChangePassWindow = (csrf) => {
  ReactDOM.render(
    <ChangePass csrf={csrf} />,
    document.querySelector("#content")
  );
};

// initial set up
const setup = (csrf) => {
    createChangePassWindow(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

// on page load
$(document).ready(function() {
  $('#consoleMessage').hide();
  $('#loginConsoleMessage').hide();
  getToken();
});
