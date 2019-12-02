const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

const convertID = mongoose.Types.ObjectId;
const setComment = (comment) => _.escape(comment).trim();

let CommentModel = {};
// define schema
const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
    time: true,
    set: setComment,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  ticketID: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});
// send ticket data to API
CommentSchema.statics.toAPI = (doc) => ({
  comment: doc.comment,
});

// find ticket by owner and board data
CommentSchema.statics.findByOwnerAndTicket = (ownerID, ticketID, callback) => {
  const search = {
    owner: convertID(ownerID),
    ticketID,
  };

  return CommentModel.find(search).select('comment').exec(callback);
};

CommentModel = mongoose.model('Ticket ticketID', CommentSchema);

module.exports.CommentModel = CommentModel;
module.exports.CommentSchema = CommentSchema;
