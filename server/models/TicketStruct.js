const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let TicketStructModel = {};

const TicketStructSchema = new mongoose.Schema({
  tickets: {
    type: Array,
  },
});

TicketStructSchema.statics.toAPI = (doc) => ({
  tickets: doc.tickets,
});

TicketStructModel = mongoose.model('TicketStruct', TicketStructSchema);

module.exports.TicketStructModel = TicketStructModel;
module.exports.TicketStructSchema = TicketStructSchema;
