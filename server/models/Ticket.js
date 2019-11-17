const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

const convertID = mongoose.Types.ObjectId;
const setTitle = (title) => _.escape(title).trim();

let TicketModel = {};
// define schema
const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    time: true,
    set: setTitle,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  boardID: {
    type: String,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});
// send ticket data to API
TicketSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  priority: doc.priority,
  dueDate: doc.dueDate,
  description: doc.description,
  boardID: doc.boardID,
});

// find ticket by owner and board data
TicketSchema.statics.findByOwnerandBoard = (ownerID, boardID, callback) => {
  const search = {
    owner: convertID(ownerID),
    boardID,
  };

  return TicketModel.find(search).select('title description priority dueDate').exec(callback);
};

TicketModel = mongoose.model('Ticket', TicketSchema);

module.exports.TicketModel = TicketModel;
module.exports.TicketSchema = TicketSchema;
