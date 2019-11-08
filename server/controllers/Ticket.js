const models = require('../models');
const Ticket = models.Ticket;

const mainPage = (req, res) => {
    Ticket.TicketModel.findByOwner(req.session.account._id, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error has occurred' });
      }
  
      return res.render('app', { csrfToken: req.csrfToken(), tickets: docs });
    });
};

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
    //delete by ID
  }
  
  module.exports.mainPage = mainPage;
  module.exports.make = makeTicket;
  module.exports.share = resolveTicket;