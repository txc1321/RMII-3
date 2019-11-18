const models = require('../models');
const Ticket = models.Ticket;
const Board = models.Board;

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
    return res.render('app', { csrfToken: req.csrfToken(), priorities: priorityTickets, boardID });
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

  console.log(req.body.dueDate);
  // create new ticket
  const TicketData = {
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    boardID: req.body.boardID,
    owner: req.session.account._id,
  };

  const newTicket = new Ticket.TicketModel(TicketData);

  const ticketPromise = newTicket.save();
  ticketPromise.then(() => {
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
    boardPromise.then(() => {
      return false;
    });
    boardPromise.catch((err) => {
      console.log(err);

      return res.status(400).json({ error: 'An error occurred' });
    });
    // redirect to the right board url
    res.json({ redirect: `/tickets?id=${req.body.boardID}` });
  });
  ticketPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Ticket already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return ticketPromise;
};

// delete tickets from a board function
const deleteTicketFromBoard = (request, response) => {
  const req = request;
  const res = response;
  // holding variables for index and ticketID
  let thisTicketID;
  let index;
  // promise to find ticket by ID
  const ticketPromise = Ticket.TicketModel.find({ _id: req.body._id }, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }
    // set ticket ID variable
    thisTicketID = docs._id;
    return false;
  });
  ticketPromise.then(() => false);
  ticketPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occurred' });
  });

  // promise to find board holding all relevant tickets
  const boardPromise = Board.BoardModel.findOne({ _id: req.body._boardID }, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }

    // looks through all board tickets to find the matching id
    for (let i = 0; i < docs.tickets.length; i++) {
      if (docs.tickets[i]._id === thisTicketID) {
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
  return ticketPromise;
};

// resolve(delete) ticket function
const resolveTicket = (request, response) => {
  const req = request;
  const res = response;

  // removes ticket from board list as well as deleting it from mongo
  deleteTicketFromBoard(req, res);
  // delete promise
  const ticketPromise = Ticket.TicketModel.deleteOne({ _id: req.body._id }, (err) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }

    return false;
  });
  ticketPromise.then(() => {
    // redirects to specific page
    res.json({ redirect: `/tickets?id=${req.body._boardID}` });
  });
  ticketPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occurred' });
  });

  return ticketPromise;
};

// delete all board tickets function
const deleteBoardTickets = (request, response) => {
  const req = request;
  const res = response;
  // promise to delete all tickets with the matching board ID
  const ticketsPromise = Ticket.TicketModel.deleteMany({ boardID: req.body._id }, (err) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }

    return false;
  });
  ticketsPromise.then(() => {
    console.log('Tickets deleted');
  });
  ticketsPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occurred' });
  });

  return ticketsPromise;
};

module.exports.getTickets = getTickets;
module.exports.makeTicket = makeTicket;
module.exports.resolveTicket = resolveTicket;
module.exports.deleteBoardTickets = deleteBoardTickets;
module.exports.deleteTicketFromBoard = deleteTicketFromBoard;
