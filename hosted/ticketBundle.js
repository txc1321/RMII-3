'use strict';

// Functions to handle making a new ticket and deleting one
var handleTicket = function handleTicket(e) {
  e.preventDefault();

  if ($('#ticketTitle').val() === '' || $('#ticketPriority').val() === '' || $('#ticketDueDate').val() === '') {
    handleError('Title, Priority, and Due Date are all required');
    return false;
  }

  sendAjax('POST', $('#ticketForm').attr('action'), $('#ticketForm').serialize(), function () {
    loadTicketsFromServer();
  });

  return false;
};

var handleDelete = function handleDelete(ID, boardID) {
  sendAjax('GET', '/getToken', null, function (result) {
    sendDelete(result.csrfToken);
  });

  var sendDelete = function sendDelete(token) {
    var data = "id=" + ID + "&_csrf=" + token + "&boardID=" + boardID;
    sendAjax('DELETE', '/resolveTicket', data, function () {
      loadTicketsFromServer();
    });
  };

  return false;
};

// Function to edit a ticket
var handleEdit = function handleEdit(e) {
  e.preventDefault();

  if ($('#ticketTitle').val() === '' && $('#ticketPriority').val() === '' && $('#ticketDueDate').val() === '' && $('#ticketDesc').val() === '') {
    handleError('You must make a change to edit');
    return false;
  }

  sendAjax('POST', $('#ticketForm').attr('action'), $('#ticketForm').serialize(), function () {
    loadTicketsFromServer();
  });

  return false;
};

// Function to load edit ticket form
var handleEditForm = function handleEditForm(ID, boardID) {
  sendAjax('GET', '/getToken', null, function (result) {
    createEditForm(result.csrfToken);
  });

  var createEditForm = function createEditForm(token) {
    ReactDOM.render(React.createElement(EditTicketForm, { csrf: token, id: ID, boardID: boardID }), document.querySelector("#makeTicket"));
  };
};

// Function to make a new comment
var handleComment = function handleComment(e) {
  e.preventDefault();
  var ID = e.currentTarget.parentElement.parentElement.id;
  if (document.querySelector('#comment' + ID).value == '') {
    handleError('You must make a comment');
    return false;
  } else {
    // Form is rendered post page load, must grab everything through dom, no jquery
    var form = e.currentTarget;
    var action = form.action;
    var comment = document.querySelector('#' + form.id + ' input[name=comment]').value;
    var ticketID = document.querySelector('#' + form.id + ' input[name=ticketID]').value;
    var boardID = document.querySelector('#' + form.id + ' input[name=boardID]').value;
    var csrf = document.querySelector('#' + form.id + ' input[name=_csrf]').value;
    var data = {
      comment: comment,
      ticketID: ticketID,
      boardID: boardID,
      _csrf: csrf
    };
    sendAjax('POST', action, data, function () {
      loadCommentsFromServer(ID);
    });
    loadCommentsFromServer(ID);
  }
};

// Function to delete comment
var handleDeleteComment = function handleDeleteComment(ID, ticketID) {
  sendAjax('GET', '/getToken', null, function (result) {
    sendDelete(result.csrfToken);
  });

  var sendDelete = function sendDelete(token) {
    var data = "id=" + ID + "&ticketID=" + ticketID + "&_csrf=" + token;
    sendAjax('DELETE', '/deleteComment', data, function () {
      loadCommentsFromServer(ticketID);
    });
  };

  return false;
};

// Function to load comment form
var handleCommentForm = function handleCommentForm(ID) {
  var toggle = true;
  if (document.querySelector('#commentForm' + ID)) {
    toggle = false;
  }

  if (toggle) {
    loadCommentsFromServer(ID);
  } else {
    // Render blank if not showing comments
    ReactDOM.render(React.createElement(CommentBlank, null), document.querySelector("#comments" + ID));
    ReactDOM.render(React.createElement(CommentBlank, null), document.querySelector("#commentsForm" + ID));
  }
};

// Comment form
var CommentForm = function CommentForm(props) {
  return React.createElement(
    'form',
    { id: "commentForm" + props.id,
      name: 'commentForm',
      action: '/addComment',
      method: 'POST',
      onSubmit: handleComment,
      className: 'commentForm' },
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement('input', { id: "comment" + props.id, className: 'commentFormInput', type: 'text', name: 'comment',
        placeholder: 'comment' })
    ),
    React.createElement(
      'div',
      { className: 'row' },
      React.createElement('input', { type: 'hidden', name: 'ticketID', value: props.id }),
      React.createElement('input', { type: 'hidden', name: 'boardID', value: props.boardID }),
      React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
      React.createElement('input', { className: 'commentFormSubmit', type: 'submit', value: 'Comment' })
    )
  );
};

// Edit ticket form
var EditTicketForm = function EditTicketForm(props) {
  return React.createElement(
    'div',
    { className: 'ticketFormContainer' },
    React.createElement(
      'form',
      { id: 'ticketForm',
        name: 'ticketForm',
        onSubmit: handleEdit,
        action: '/editTicket',
        method: 'POST',
        className: 'ticketForm' },
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement('input', { id: 'ticketTitle', className: 'formInput', type: 'text', name: 'title',
          placeholder: 'Title' }),
        React.createElement('input', { id: 'ticketPriority', className: 'formInput', type: 'text', name: 'priority',
          placeholder: 'Priority' }),
        React.createElement('input', { id: 'ticketDueDate', className: 'formInput', type: 'date', name: 'dueDate',
          placeholder: 'Due Date' })
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement('input', { id: 'ticketDesc', className: 'formInput', type: 'text', name: 'description',
          placeholder: 'Description' }),
        React.createElement('input', { type: 'hidden', name: 'id', value: props.id }),
        React.createElement('input', { type: 'hidden', name: 'boardID', value: props.boardID }),
        React.createElement('input', { type: 'hidden', id: 'globalCSRF', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Edit Ticket' })
      )
    )
  );
};

// Ticket form
var TicketForm = function TicketForm(props) {
  return React.createElement(
    'div',
    { className: 'ticketFormContainer' },
    React.createElement(
      'form',
      { id: 'ticketForm',
        name: 'ticketForm',
        onSubmit: handleTicket,
        action: '/makeTicket',
        method: 'POST',
        className: 'ticketForm' },
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement('input', { id: 'ticketTitle', className: 'formInput', type: 'text', name: 'title',
          placeholder: 'Title' }),
        React.createElement('input', { id: 'ticketPriority', className: 'formInput', type: 'text', name: 'priority',
          placeholder: 'Priority' }),
        React.createElement('input', { id: 'ticketDueDate', className: 'formInput', type: 'date', name: 'dueDate',
          placeholder: 'Due Date' })
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement('input', { id: 'ticketDesc', className: 'formInput', type: 'text', name: 'description',
          placeholder: 'Description' }),
        React.createElement('input', { type: 'hidden', name: 'boardID', value: props.boardID }),
        React.createElement('input', { type: 'hidden', id: 'globalCSRF', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Make Ticket' })
      )
    )
  );
};

// Comment list
var CommentList = function CommentList(props) {
  if (!props.comments) {
    // Render if no comments
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h3',
        null,
        'No comments'
      )
    );
  } else {
    var commentNodes = props.comments.map(function (comment, index) {
      return React.createElement(
        'li',
        { className: 'comment', id: "comment" + index },
        comment.comment,
        React.createElement(
          'button',
          { id: "commentDelete" + index,
            name: "commentDelete" + index,
            onClick: function onClick() {
              return handleDeleteComment(comment._id, comment.ticketID);
            },
            className: 'commentDelete' },
          'x'
        )
      );
    });

    return React.createElement(
      'ul',
      { id: "comments" },
      commentNodes
    );
  }
};

// Blank render
var CommentBlank = function CommentBlank() {
  return React.createElement('div', null);
};

// Ticket list
var TicketList = function TicketList(props) {
  if (!props.priorities.tickets) {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h3',
        null,
        'No tickets here'
      )
    );
  } else {
    var priorityNodes = props.priorities.tickets.map(function (tickets, index) {
      if (tickets.length > 0) {
        return React.createElement(
          'div',
          { className: 'ticketContainer' },
          React.createElement(
            'h3',
            null,
            'Priority: ',
            5 - index
          ),

          // date formatting
          tickets.map(function (ticket, index) {
            var date = new Date(ticket.dueDate);
            var day = date.getDate();
            var month = date.getMonth();
            var year = date.getFullYear();

            var fullDate = month + 1 + '/' + (day + 1) + '/' + year;
            return React.createElement(
              'div',
              { className: 'ticket', id: ticket._id },
              React.createElement(
                'h3',
                { className: 'ticketTitle' },
                'Title: ',
                ticket.title
              ),
              React.createElement(
                'h3',
                { className: 'ticketPriority' },
                'Priority: ',
                ticket.priority
              ),
              React.createElement(
                'h3',
                { className: 'ticketDueDate' },
                'Due Date: ',
                fullDate
              ),
              React.createElement(
                'h3',
                { className: 'ticketDesc' },
                'Description: ',
                ticket.description
              ),
              React.createElement(
                'button',
                { id: "ticketDelete" + index,
                  name: "ticketDelete" + index,
                  onClick: function onClick() {
                    return handleDelete(ticket._id, ticket.boardID);
                  },
                  className: 'commentFormSubmit' },
                'X'
              ),
              React.createElement(
                'button',
                { id: "ticketEdit" + index,
                  name: "ticketEdit" + index,
                  onClick: function onClick() {
                    return handleEditForm(ticket._id, ticket.boardID);
                  },
                  className: 'commentFormSubmit' },
                'Edit'
              ),
              React.createElement(
                'button',
                { id: "ticketComments" + index,
                  name: "ticketComments" + index,
                  onClick: function onClick() {
                    return handleCommentForm(ticket._id);
                  },
                  className: 'commentFormSubmit' },
                'Comments'
              ),
              React.createElement('section', { id: "comments" + ticket._id }),
              React.createElement('section', { id: "commentsForm" + ticket._id })
            );
          })
        );
      }
      return React.createElement(
        'div',
        { className: 'ticketContainer' },
        React.createElement(
          'h3',
          null,
          'Priority: ',
          5 - index
        ),
        React.createElement(
          'h3',
          { className: 'emptyTickets' },
          'No Tickets'
        )
      );
    });

    return React.createElement(
      'div',
      null,
      priorityNodes
    );
  }
};

// Grab tickets from server
var loadTicketsFromServer = function loadTicketsFromServer() {
  // extract id from url
  var boardID = window.location.search.substring(4);

  sendAjax('GET', '/getTickets?id=' + boardID, null, function (data) {
    ReactDOM.render(React.createElement(TicketList, { priorities: data.priorities, boardID: data.boardID }), document.querySelector("#tickets"));
    ReactDOM.render(React.createElement(TicketForm, { csrf: data.csrfToken, boardID: data.boardID }), document.querySelector("#makeTicket"));
  });
};

// Grab comments from server
var loadCommentsFromServer = function loadCommentsFromServer(ID) {
  // extract id from url
  var token = document.querySelector('#globalCSRF').value;
  // extract csrf from global element
  var boardID = window.location.search.substring(4);

  sendAjax('GET', '/getComments?id=' + ID, null, function (data) {
    ReactDOM.render(React.createElement(CommentList, { comments: data.comments }), document.querySelector("#comments" + ID));
    ReactDOM.render(React.createElement(CommentForm, { csrf: token, id: ID, boardID: boardID }), document.querySelector("#commentsForm" + ID));
  });
};

// initial set up
var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(TicketForm, { csrf: csrf, boardID: '' }), document.querySelector("#makeTicket"));

  ReactDOM.render(React.createElement(TicketList, { priorities: [], boardID: '' }), document.querySelector("#tickets"));

  loadTicketsFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

// on page load
$(document).ready(function () {
  getToken();
  $('#consoleMessage').hide();
  $('#loginConsoleMessage').hide();
});
'use strict';

// error function
var handleError = function handleError(message) {
  console.log(message);
  $('#consoleMessage').html(message);
  $('#loginConsoleMessage').html(message);
  $('#consoleMessage').show();
  $('#loginConsoleMessage').show();
};

// redirect function
var redirect = function redirect(response) {
  window.location = response.redirect;
};

// send ajax helper
var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
