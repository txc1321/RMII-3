const controllers = require('./controllers');
const mid = require('./middleware');
const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/changepass', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassPage);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/tickets', mid.requiresLogin, controllers.Ticket.ticketsPage);
  app.get('/getTickets', mid.requiresLogin, controllers.Ticket.getTickets);
  app.get('/boards', mid.requiresLogin, controllers.Board.boardsPage);
  app.get('/getBoards', mid.requiresLogin, controllers.Board.getBoards);
  app.get('/upgrade', mid.requiresLogin, controllers.Board.getUpgrade);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/changePassword',
      mid.requiresSecure,
      mid.requiresLogin,
      controllers.Account.changePassword);
  app.post('/makeTicket', mid.requiresLogin, controllers.Ticket.makeTicket);
  app.post('/makeBoard', mid.requiresLogin, controllers.Board.makeBoard);
  app.delete('/resolveTicket', mid.requiresLogin, controllers.Ticket.resolveTicket);
  app.delete('/deleteBoard', mid.requiresLogin, controllers.Board.deleteBoard);
};

module.exports = router;
