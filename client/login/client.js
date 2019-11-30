const handleLogin = (e) => {
  e.preventDefault();

  if($("#user").val() == '' || $("#pass").val() == ''){
    handleError('Username or password is empty');
    return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

const handleSignup = (e) => {
  e.preventDefault();

  if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == ''){
    handleError('All fields are required');
    return false;
  }

  if($("#pass").val() !== $("#pass2").val()){
    handleError('Passwords do not match');
    return false;
  }
  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
};

const LoginWindow = (props) => {
    return(
    <form id="loginForm"
      name="loginForm"
      onSubmit={handleLogin}
      action="/login"
      method="POST"
      className="mainForm"
    >
      <div className="row">
        <input className="formInput" id="user" type="text" name="username"
               placeholder="username"/>
        <input className="formInput" id="pass" type="password" name="pass"
               placeholder="password"/>
      </div>
      <div className="row">
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Sign In"/>
      </div>
    </form>
  );
};

const SignUpWindow = (props) => {
    return(
      <form id="signupForm"
    name="signupForm"
    onSubmit={handleSignup}
    action="/signup"
    method="POST"
    className="mainForm"
      >

      <label htmlFor="username">Username: </label>
    <input id="user" type="text" name="username" placeholder="username" />
      <label htmlFor="pass">Password: </label>
    <input id="pass" type="password" name="pass" placeholder="password" />
      <label htmlFor="pass2">Password: </label>
    <input id="pass2" type="password" name="pass2" placeholder="retype password" />
      <input type="hidden" name="_csrf" value={props.csrf} />
    <input className="formSubmit" type="submit" value="Sign Up" />
      </form>
  );
};

const createLoginWindow = (csrf) => {
    ReactDOM.render(
    <LoginWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
    <SignUpWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

// function to send AJAX for form based on form ID
const setSubmit = (uID) => {
  $(uID).on('submit', (e) => {
    e.preventDefault();
    sendAjax($(uID).attr('method'), $(uID).attr('action'), $(uID).serialize());

    return false;
  });
};

const setup = (csrf) => {
  // set submit for non user input forms
  for (let i = 0; i < 5; i++) {
    setSubmit('#boardNavForm' + i);
    setSubmit('#boardDeleteForm' + i);
  }
  for (let i = 0; i < 25; i++) {
    setSubmit('#ticketDeleteForm' + i);
  }

  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");

  signupButton.addEventListener("click", (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });

  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  createLoginWindow(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  $('#consoleMessage').hide();
  $('#loginConsoleMessage').hide();
  getToken();
});
