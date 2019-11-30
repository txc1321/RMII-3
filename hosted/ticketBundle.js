'use strict';

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

var handleDelete = function handleDelete(name) {
  sendAjax('GET', '/getToken', null, function (result) {
    sendDelete(result.csrfToken);
  });

  var sendDelete = function sendDelete(token) {
    var data = "name=" + name + "&_csrf=" + token;

    sendAjax('DELETE', '/resolveTicket', data, function () {
      loadTicketsFromServer();
    });
  };

  return false;
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
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Make Ticket' })
      )
    )
  );
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
    /*const ticketNodes = props.priorities.tickets.map(function (tickets, index) {
      return(
        <div className="ticket">
          <h3 className="ticketTitle">Title: {ticket.title}</h3>
          <h3 className="ticketPriority">Priority: {ticket.priority}</h3>
          <h3 className="ticketDueDate">Due Date: {ticket.dueDate}</h3>
          <h3 className="ticketDesc">Description: {ticket.description}</h3>
          <form id={"ticketDeleteForm" + index}
                name={"ticketDeleteForm" + index}
                onSubmit={handleDelete(ticket.name)}
                action="/resolveTicket"
                method="delete"
                className="ticketFunctionForm">
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input type="hidden" name="_id" value={ticket._id}/>
            <input type="hidden" name="_boardID" value={props.boardID}/>
            <input className="formSubmit" type="submit" value="X"/>
          </form>
        </div>
      )
    });*/

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
          tickets.forEach(function (ticket) {
            return React.createElement(
              'div',
              { className: 'ticket' },
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
                'form',
                { id: "ticketDeleteForm" + index,
                  name: "ticketDeleteForm" + index,
                  onSubmit: handleDelete(ticket.name),
                  action: '/resolveTicket',
                  method: 'delete',
                  className: 'ticketFunctionForm' },
                React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
                React.createElement('input', { type: 'hidden', name: '_id', value: ticket._id }),
                React.createElement('input', { type: 'hidden', name: '_boardID', value: props.boardID }),
                React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'X' })
              )
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
  sendAjax('GET', '/getTickets', null, function (data) {
    ReactDOM.render(React.createElement(TicketList, { priorities: data.priorities, boardID: data.boardID }), document.querySelector("#tickets"));
    ReactDOM.render(React.createElement(TicketForm, { csrf: data.csrfToken, boardID: data.boardID }), document.querySelector("#makeTicket"));
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
