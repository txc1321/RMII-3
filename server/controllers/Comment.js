const models = require('../models');
const Comment = models.Comment;
const Ticket = models.Ticket;


// sort tickets by priority function
const getComments = (req, res) => {
  // grabs board ID from url
  const ticketID = req.query.id;
  // array for ticket manipulation
  let allComments = [];
  // promise that finds tickets based on owner and board
  const commentPromise = Comment.CommentModel.findByOwnerAndTicket(
    req.session.account._id,
    ticketID,
    (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error has occurred' });
      }
      allComments = docs;
      return false;
    });

  commentPromise.then(() => res.json({ comments: allComments, csrfToken: req.csrfToken }));
  commentPromise.catch((err) => {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  });
};


// make new ticket function
const makeComment = (req, res) => {
  // check for empty fields
  if (!req.body.comment) {
    return res.status(400).json({ error: 'You must make a comment' });
  }

  const CommentData = {
    comment: req.body.comment,
    ticketID: req.body.ticketID,
    owner: req.session.account._id,
  };
  
  const newComment = new Comment.CommentModel(CommentData);

  const commentPromise = newComment.save();
  commentPromise.then(() => false);
  commentPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Ticket already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  // grab board id from form and find the specific board
  const search = { _id: req.body.ticketID };
  const ticketPromise = Ticket.TicketModel.findOne(search, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }
    const newComments = [];
    // add new ticket to board tickets list
    newComments.push(commentPromise);
    const allComments = docs.comments.concat(newComments);
    docs.comments.splice(0, docs.comments.length, ...allComments);
    docs.save();

    return false;
  });
  ticketPromise.then(() => {
    res.redirect(`/tickets?id=${req.body.boardID}`);
  });
  ticketPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occurred' });
  });

  return ticketPromise;
};

// delete comment function
const deleteComment = (request, response) => {
  const req = request;
  const res = response;
  let index;

  // remove from ticket
  const ticketPromise = Ticket.TicketModel.findOne({ _id: req.body.ticketID }, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }

    // looks through all board tickets to find the matching id
    for (let i = 0; i < docs.comments.length; i++) {
      if (docs.comments[i]._id === req.body.id) {
        index = i;
      }
    }

    // removes ticket from board list
    docs.comments.splice(index, 1);
    docs.save();

    return false;
  });
  ticketPromise.then(() => false);
  ticketPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occurred' });
  });

  // delete promise
  const commentPromise = Comment.CommentModel.deleteOne({ _id: req.body.id }, (err) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }

    return false;
  });
  commentPromise.then(() => {
    // redirects to specific page
    res.json({ redirect: `/tickets?id=${req.body.boardID}` });
  });
  commentPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occurred' });
  });

  return commentPromise;
};

module.exports.getComments = getComments;
module.exports.makeComment = makeComment;
module.exports.deleteComment = deleteComment;
