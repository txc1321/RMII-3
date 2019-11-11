const models = require('../models');
const Ticket = models.Ticket;

const getTickets = (req, res) => {
  const tickets = [];

  for (let i = 5; i > 0; i--) {
    const priority = {
      tickets: groupTickets(req, res, i),
      number: i,
    };
    
    tickets.push(priority);
  }

  return res.render('app', { csrfToken: req.csrfToken(), priorities: tickets });
};

const groupTickets = (req, res, priority) => {
  const tickets = Ticket.TicketModel.findByPriority(req.session.account._id, priority,
    (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error has occurred' });
      }

      return docs;
    }) // move to getTickets, make a savepromise (loop in promise.then)
    //can do in this method
  
  console.log(tickets);
  return tickets;
}

const makeTicket = (req, res) => {
  if (!req.body.title || !req.body.priority || !req.body.dueDate) {
    return res.status(400).json({ error: 'are required' });
  }

  const TicketData = {
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    owner: req.session.account._id,
  };

  const newTicket = new Ticket.TicketModel(TicketData);

  const ticketPromise = newTicket.save();
  ticketPromise.then(() => res.json({ redirect: '/main' }));
  ticketPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Ticket already exists' });
    }

    return res.status(400).json({ error: 'An error has occurred' });
  });

  return ticketPromise;
};

const resolveTicket = (request, response) => {
    const req = request;
    const res = response;

    const ticketPromise = Ticket.TicketModel.deleteOne({ id: req.body._id }, (err) => {
      if (err) {
        return res.status(400).json({ error: 'An error occurred' });
      }

      return false;
    });
    ticketPromise.then(() => res.json({ redirect: '/main' }));
    ticketPromise.catch((err) => {
      console.log(err);

      return res.status(400).json({ error: 'An error has occured' });
    });

    return ticketPromise;
};

module.exports.getTickets = getTickets;
module.exports.makeTicket = makeTicket;
module.exports.resolveTicket = resolveTicket;
