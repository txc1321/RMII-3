const models = require('../models');
const Board = models.Board;
const Ticket = models.Ticket;

// get boards function
const getBoards = (req, res) => {
  // find all boards under the account
  Board.BoardModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occurred' });
    }

    // get number of total boards
    const number = docs.length;

    return res.render('appBoards', { csrfToken: req.csrfToken(), boards: docs, count: number });
  });
};

// make new board function
const makeBoard = (req, res) => {
  // check for empty fields
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  // check if user has passed free number of boards
  if (req.body.boardCount >= 5) {
    return res.status(400).json({ error: 'Maximum number of boards reached' });
  }

  // create new board and save it then redirect
  const BoardData = {
    name: req.body.name,
    tickets: [],
    owner: req.session.account._id,
  };

  const newBoard = new Board.BoardModel(BoardData);

  const boardPromise = newBoard.save();
  boardPromise.then(() => res.json({ redirect: '/boards' }));
  boardPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Board already exists' });
    }

    return res.status(400).json({ error: 'An error has occurred' });
  });

  return boardPromise;
};

// delete board function
const deleteBoard = (request, response) => {
  const req = request;
  const res = response;

  // promise to delete all tickets belonging to the board
  const ticketPromise = Ticket.TicketModel.deleteMany({ boardID: req.body._id }, (err) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }

    return false;
  });
  ticketPromise.then(() => false);
  ticketPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occurred' });
  });


  // promise to delete board
  const boardPromise = Board.BoardModel.deleteOne({ _id: req.body._id }, (err) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }
    return false;
  });
  boardPromise.then(() => {
    // redirect
    res.json({ redirect: '/boards' });
  });
  boardPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error has occurred' });
  });

  return boardPromise;
};

// board navigation function
const goToBoard = (request, response) => {
  const req = request;
  const res = response;

  const ID = req.body._id;
  // redirect to board url with ID
  res.json({ redirect: `/tickets?id=${ID}` });
};

// upgrade page navigation funtion
const getUpgrade = (req, res) => {
  res.render('upgrade', { csrfToken: req.csrfToken() });
};

module.exports.getBoards = getBoards;
module.exports.makeBoard = makeBoard;
module.exports.deleteBoard = deleteBoard;
module.exports.goToBoard = goToBoard;
module.exports.getUpgrade = getUpgrade;
