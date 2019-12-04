const models = require('../models');
const Ticket = models.Ticket;
const Board = models.Board;

const ticketsPage = (req, res) => {
  // grabs board ID from url
  const boardID = req.query.id;
  // array for ticket manipulation
  let allTickets = [];
  // promise that finds tickets based on owner and board
  const ticketsPromise = Ticket.TicketModel.findByOwnerandBoard(req.session.account._id, boardID,
    (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error has occurred' });
      }
      allTickets = docs;
      return false;
    });

  ticketsPromise.then(() => {
    // creates data structures for passing data to view
    const priorityTickets = {
      tickets: [],
    };
    // creates a data structure for holding priority arrays
    const sortStruct = {
      tickets: [],
    };

    for (let i = 1; i < 6; i++) {
      const priorityArray = [];
      for (let j = 0; j < allTickets.length; j++) {
        // adds ticket to appropriate priority array if priority property matches
        if (allTickets[j].priority === i) {
          priorityArray.push(allTickets[j]);
        }
      }
      // adds arrays of tickets to sort structure
      sortStruct.tickets.push(priorityArray);
    }

    for (let i = 5; i > 0; i--) {
      // adds priority arrays with adjusted index
      priorityTickets.tickets.push(sortStruct.tickets[i - 1]);
    }
    return res.render('app', { csrfToken: req.csrfToken(), priorities: priorityTickets, boardID });
  });
};

// sort tickets by priority function
const groupTickets = (req, res) => {
  // grabs board ID from url
  const boardID = req.query.id;
  // array for ticket manipulation
  let allTickets = [];
  // promise that finds tickets based on owner and board
  const ticketsPromise = Ticket.TicketModel.findByOwnerandBoard(req.session.account._id, boardID,
    (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error has occurred' });
      }
      allTickets = docs;
      return false;
    });

  ticketsPromise.then(() => {
    // creates data structures for passing data to view
    const priorityTickets = {
      tickets: [],
    };
    // creates a data structure for holding priority arrays
    const sortStruct = {
      tickets: [],
    };

    for (let i = 1; i < 6; i++) {
      const priorityArray = [];
      for (let j = 0; j < allTickets.length; j++) {
        // adds ticket to appropriate priority array if priority property matches
        if (allTickets[j].priority === i) {
          priorityArray.push(allTickets[j]);
        }
      }
      // adds arrays of tickets to sort structure
      sortStruct.tickets.push(priorityArray);
    }

    for (let i = 5; i > 0; i--) {
      // adds priority arrays with adjusted index
      priorityTickets.tickets.push(sortStruct.tickets[i - 1]);
    }
    return res.json({ priorities: priorityTickets, boardID, csrfToken: req.csrfToken() });
  });
};

// wrapper method grouping tickets
const getTickets = (req, res, ID) => {
  groupTickets(req, res, ID);
};

// make new ticket function
const makeTicket = (req, res) => {
  // check for empty fields
  if (!req.body.title || !req.body.priority || !req.body.dueDate) {
    return res.status(400).json({ error: 'Title, Priority, and Due Date are all required' });
  }

  const date = new Date(req.body.dueDate);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const formattedDate = `${month + 1}/${day}/${year}`;

  // create new ticket
  const TicketData = {
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    dueDate: formattedDate,
    boardID: req.body.boardID,
    comments: [],
    owner: req.session.account._id,
  };

  const newTicket = new Ticket.TicketModel(TicketData);

  const ticketPromise = newTicket.save();
  ticketPromise.then(() => false);
  ticketPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Ticket already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  // grab board id from form and find the specific board
  const search = { _id: req.body.boardID };
  const boardPromise = Board.BoardModel.findOne(search, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }
    const newTickets = [];
    // add new ticket to board tickets list
    newTickets.push(ticketPromise);
    const allTickets = docs.tickets.concat(newTickets);
    docs.tickets.splice(0, docs.tickets.length, ...allTickets);
    docs.save();

    return false;
  });
  boardPromise.then(() => false);
  boardPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occurred' });
  });
  // redirect to the right board url
  res.json({ redirect: `/tickets?id=${req.body.boardID}` });

  return boardPromise;
};

// delete tickets from a board function
const deleteTicketFromBoard = (request, response) => {
  const req = request;
  const res = response;
  // holding variables for index and ticketID
  let index;

  // promise to find board holding all relevant tickets
  const boardPromise = Board.BoardModel.findOne({ _id: req.body.boardID }, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }

    // looks through all board tickets to find the matching id
    for (let i = 0; i < docs.tickets.length; i++) {
      if (docs.tickets[i]._id === req.body.id) {
        index = i;
      }
    }

    // removes ticket from board list
    docs.tickets.splice(index, 1);
    docs.save();

    return false;
  });
  boardPromise.then(() => false);
  boardPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occurred' });
  });
  return boardPromise;
};

// resolve(delete) ticket function
const resolveTicket = (request, response) => {
  const req = request;
  const res = response;

  // removes ticket from board list as well as deleting it from mongo
  deleteTicketFromBoard(req, res);
  // delete promise
  const ticketPromise = Ticket.TicketModel.deleteOne({ _id: req.body.id }, (err) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }

    return false;
  });
  ticketPromise.then(() => {
    // redirects to specific page
    res.json({ redirect: `/tickets?id=${req.body.boardID}` });
  });
  ticketPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occurred' });
  });

  return ticketPromise;
};

const editTicket = (request, response) => {
  const req = request;
  const res = response;

  const search = { _id: req.body.id };

  const TicketData = {};

  if (req.body.title && req.body.title !== '') {
    TicketData.title = req.body.title;
  }
  if (req.body.dueDate && req.body.dueDate !== '') {
    TicketData.dueDate = req.body.dueDate;
  }
  if (req.body.priority && req.body.priority !== '') {
    TicketData.priority = req.body.priority;
  }
  if (req.body.description && req.body.description !== '') {
    TicketData.description = req.body.description;
  }

  Ticket.TicketModel.findOneAndUpdate(
    search,
    TicketData,
    { new: true },
    (err) => {
      if (err) {
        return res.status(400).json({ error: 'An error occurred' });
      }
      return false;
    }
  );
  // redirect to the right board url

  return res.json({ redirect: `/tickets?id=${req.body.boardID}` });
};

module.exports.ticketsPage = ticketsPage;
module.exports.getTickets = getTickets;
module.exports.makeTicket = makeTicket;
module.exports.editTicket = editTicket;
module.exports.resolveTicket = resolveTicket;
module.exports.deleteTicketFromBoard = deleteTicketFromBoard;
