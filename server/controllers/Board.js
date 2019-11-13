const models = require('../models');
const Board = models.Board;

const getBoards = (req, res) => {
  Board.BoardModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occurred' });
    }

    const number = docs.length;

    return res.render('appBoards', { csrfToken: req.csrfToken(), boards: docs, count: number });
  });
};

const makeBoard = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'are required' });
  }

  if (req.body.boardCount >= 5) {
    return res.status(400).json({ error: 'Maximum boards reached' });
  }

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

const deleteBoard = (request, response) => {
  const req = request;
  const res = response;

  const boardPromise = Board.BoardModel.deleteOne({ id: req.body._id }, (err) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }

    return false;
  });
  boardPromise.then(() => res.json({ redirect: '/boards' }));
  boardPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error has occured' });
  });

  return boardPromise;
};

const goToBoard = (request, response, ID) => {
  const req = request;
  const res = response;
  const boardID = ID;


  return res.json({ redirect: '/tickets', boardID });
};

module.exports.getBoards = getBoards;
module.exports.makeBoard = makeBoard;
module.exports.deleteBoard = deleteBoard;
module.exports.goToBoard = goToBoard;
