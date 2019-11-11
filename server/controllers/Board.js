const models = require('../models');
const Board = models.Board;

const getBoards = (req, res) => {
    Board.BoardModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), boards: docs });
  });
};

const makeBoard = (req, res) => {
    if (!req.body.name) {
      return res.status(400).json({ error: 'are required' });
    }
  
    const BoardData = {
      name: req.body.name,
      tickets: [],
    };
  
    const newBoard = new Board.BoardModel(BoardData);
  
    const boardPromise = newBoard.save();
    boardPromise.then(() => res.json({ redirect: '/main' }));
    boardPromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Board already exists' });
      }
  
      return res.status(400).json({ error: 'An error has occurred' });
    });
  
    return boardPromise;
  };
  
module.exports.getBoards = getBoards;
module.exports.makeBoard = makeBoard;