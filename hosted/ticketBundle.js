'use strict';

var globalToken = {};

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

var handleEditForm = function handleEditForm(ID, boardID) {
  sendAjax('GET', '/getToken', null, function (result) {
    createEditForm(result.csrfToken);
  });

  var createEditForm = function createEditForm(token) {
    ReactDOM.render(React.createElement(EditTicketForm, { csrf: token, id: ID, boardID: boardID }), document.querySelector("#makeTicket"));
  };
};

var handleComment = function handleComment(e) {
  e.preventDefault();
  var ID = e.currentTarget.parentElement.parentElement.id;
  if (document.querySelector('#comment' + ID).value == '') {
    handleError('You must make a comment');
    return false;
  } else {
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

var handleCommentForm = function handleCommentForm(ID) {
  var toggle = true;
  if (document.querySelector('#commentForm' + ID)) {
    toggle = false;
  }

  if (toggle) {
    loadCommentsFromServer(ID);
  } else {
    ReactDOM.render(React.createElement(CommentBlank, null), document.querySelector("#comments" + ID));
    ReactDOM.render(React.createElement(CommentBlank, null), document.querySelector("#commentsForm" + ID));
  }
};

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

var CommentList = function CommentList(props) {
  if (!props.comments) {
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

var CommentBlank = function CommentBlank() {
  return React.createElement('div', null);
};

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
          tickets.map(function (ticket, index) {
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
                ticket.dueDate
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

var loadTicketsFromServer = function loadTicketsFromServer() {
  var boardID = window.location.search.substring(4);

  sendAjax('GET', '/getTickets?id=' + boardID, null, function (data) {
    ReactDOM.render(React.createElement(TicketList, { priorities: data.priorities, boardID: data.boardID }), document.querySelector("#tickets"));
    ReactDOM.render(React.createElement(TicketForm, { csrf: data.csrfToken, boardID: data.boardID }), document.querySelector("#makeTicket"));
  });
};

var loadCommentsFromServer = function loadCommentsFromServer(ID) {
  var token = document.querySelector('#globalCSRF').value;
  var boardID = window.location.search.substring(4);

  sendAjax('GET', '/getComments?id=' + ID, null, function (data) {
    ReactDOM.render(React.createElement(CommentList, { comments: data.comments }), document.querySelector("#comments" + ID));
    ReactDOM.render(React.createElement(CommentForm, { csrf: token, id: ID, boardID: boardID }), document.querySelector("#commentsForm" + ID));
  });
};

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

$(document).ready(function () {
  getToken();
  $('#consoleMessage').hide();
  $('#loginConsoleMessage').hide();
});
'use strict';

var handleError = function handleError(message) {
  console.log(message);
  $('#consoleMessage').html(message);
  $('#loginConsoleMessage').html(message);
  $('#consoleMessage').show();
  $('#loginConsoleMessage').show();
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

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
