const models = require('../models');
const Account = models.Account;

// login redirect function
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// signup redirect function
const signupPage = (req, res) => {
  res.render('signup', { csrfToken: req.csrfToken() });
};

// password change redirect function
const changePassPage = (req, res) => {
  res.render('changePass', { csrfToken: req.csrfToken() });
};

// logout session destroy function
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// login function
const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  // check for field errors
  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // check for authentication
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/boards' });
  });
};

// signup function
const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast strings for security
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // check for empty fields
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // check is passwords match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // generate hash for password data
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    // create new account, save, and redirect
    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();
    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/boards' });
    });
    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

// change password function
const changePassword = (request, response) => {
  const req = request;
  const res = response;

  // cast strings for security
  req.body.oldPass = `${req.body.oldPass}`;
  req.body.newPass = `${req.body.newPass}`;
  req.body.newPass2 = `${req.body.newPass2}`;

  const oldPass = req.body.oldPass;
  const newPass = req.body.newPass;

  // check for empty fields
  if (!req.body.oldPass || !req.body.newPass || !req.body.newPass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // check if passwords match
  if (req.body.newPass !== req.body.newPass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // call model function to change password
  return Account.AccountModel.changePassword(req.session.account.username, oldPass, newPass,
      (err, doc) => {
        if (err || !doc) {
          return res.status(401).json({ error: 'Incorrect password' });
        }

        // generate hash for new password
        return Account.AccountModel.generateHash(req.body.newPass, (salt, hash) => {
          const filter = {
            username: req.session.account.username,
          };
          const update = {
            salt,
            password: hash,
          };

          // update account based on username
          Account.AccountModel.findOneAndUpdate(filter, update,
          (updateErr) => {
            if (updateErr) {
              return res.status(400).json({ error: 'An error occurred' });
            }

            return res.redirect('/changepass');
          });
        });
      });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;
module.exports.changePassPage = changePassPage;
module.exports.changePassword = changePassword;

