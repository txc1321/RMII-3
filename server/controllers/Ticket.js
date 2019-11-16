const models = require('../models');
const Ticket = models.Ticket;
const Board = models.Board;

const groupTickets = (req, res) => {
  const boardID = req.query.id;
  let allTickets = [];
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
    const priorityTickets = {
      tickets: [],
    };

    const sortStruct = {
      tickets: [],
    };

    for (let i = 1; i < 6; i++) {
      const priorityArray = [];
      for (let j = 0; j < allTickets.length; j++) {
        if (allTickets[j].priority === i) {
          priorityArray.push(allTickets[j]);
        }
      }
      sortStruct.tickets.push(priorityArray);
    }

    for (let i = 5; i > 0; i--) {
      priorityTickets.tickets.push(sortStruct.tickets[i - 1]);
    }
    return res.render('app', { csrfToken: req.csrfToken(), priorities: priorityTickets, boardID });
  });
};

const getTickets = (req, res, ID) => {
  groupTickets(req, res, ID);
};

const makeTicket = (req, res) => {
  if (!req.body.title || !req.body.priority || !req.body.dueDate) {
    return res.status(400).json({ error: 'Title, Priority, and Due Date are all required' });
  }

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
    const search = { _id: req.body.boardID };
    const boardPromise = Board.BoardModel.findOne(search, (err, docs) => {
      if (err) {
        return res.status(400).json({ error: 'An error occurred' });
      }
      const newTickets = [];
      newTickets.push(ticketPromise);
      const allTickets = docs.tickets.concat(newTickets);
      docs.tickets.splice(0, docs.tickets.length, ...allTickets);
      docs.save();

      return false;
    });
    boardPromise.then(() => {
      console.log(ticketPromise);
    });
    boardPromise.catch((err) => {
      console.log(err);

      return res.status(400).json({ error: 'An error occurred' });
    });

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

const resolveTicket = (request, response) => {
  const req = request;
  const res = response;

  const ticketPromise = Ticket.TicketModel.deleteOne({ _id: req.body._id }, (err) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }

    return false;
  });
  ticketPromise.then(() => res.json({ redirect: `/tickets?id=${req.body._boardID}` }));
  ticketPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occurred' });
  });

  return ticketPromise;
};

const deleteBoardTickets = (request, response) => {
  const req = request;
  const res = response;

  console.log(req.body._id);

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
