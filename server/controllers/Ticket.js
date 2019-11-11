const models = require('../models');
const Ticket = models.Ticket;
const TicketStruct = models.TicketStruct;

const getTickets = (req, res) => {
  const tickets = groupTickets(req, res);

  return res.render('app', { csrfToken: req.csrfToken(), priorities: tickets });
};

const groupTickets = (req, res) => {
  const allTickets = Ticket.TicketModel.findByOwner(req.session.account._id, 
    (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error has occurred' });
      }

      return docs;
      
  });

  const newTickets = [];

  allTickets.then(() => {
    for (let i = 5; i > 0; i--) {
      const priorityList = {
        number: i,
        tickets: [],
      };
      console.log(allTickets);
      allTickets.each(element => {
        if(element.priority === i){
          console.log("hey");
          priority.tickets.push(element);
        }
      });{
        console.log("help");
        
      }
      newTickets.push(priorityList);
    }
  });

 

  /* const tickets = [];

  const allTicketsData = {
    tickets: Ticket.TicketModel.findByOwner(req.session.account._id, 
      (err, docs) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ error: 'An error has occurred' });
        }
  
        return docs;
    }),
  };

  const newTicketStruct = new TicketStruct.TicketStructModel(allTicketsData);
  const ticketStructPromise = newTicketStruct.save();
  ticketStructPromise.then(() => {
    console.log(newTicketStruct.tickets);
    console.log(" - ");
    for (let i = 5; i > 0; i--) {
      const priorityList = {
        number: i,
        tickets: [],
      };
      for(let j = 0; j < newTicketStruct.tickets.count; j++){
        if(newTicketStruct.tickets[j]){
          priority.tickets.push(newTicketStruct.tickets[j]);
        }
      }
      tickets.push(priorityList);
    }

    return tickets;
  })
  ticketStructPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error has occurred' });
  }); */
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
