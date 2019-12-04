'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var handleBoard = function handleBoard(e) {
  e.preventDefault();

  if ($('#boardName').val() === '') {
    handleError('Name is required');
    return false;
  }

  if ($('#boardCount').val() >= 5) {
    handleError('Maximum number of boards reached');
    return false;
  }

  sendAjax('POST', $('#boardForm').attr('action'), $('#boardForm').serialize(), function () {
    loadBoardsFromServer();
  });

  return false;
};

var handleDelete = function handleDelete(ID) {
  sendAjax('GET', '/getToken', null, function (result) {
    sendDelete(result.csrfToken);
  });

  var sendDelete = function sendDelete(token) {
    var data = "id=" + ID + "&_csrf=" + token;

    sendAjax('DELETE', '/deleteBoard', data, function () {
      loadBoardsFromServer();
    });
  };

  return false;
};

var BoardForm = function BoardForm(props) {
  var _React$createElement;

  return React.createElement(
    'div',
    { className: 'boardFormContainer' },
    React.createElement(
      'form',
      { id: 'boardForm',
        name: 'boardForm',
        onSubmit: handleBoard,
        action: '/makeBoard',
        method: 'POST',
        className: 'boardForm' },
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement('input', (_React$createElement = { id: 'boardName', className: 'formInput' }, _defineProperty(_React$createElement, 'className', 'form-control'), _defineProperty(_React$createElement, 'type', 'text'), _defineProperty(_React$createElement, 'name', 'name'), _defineProperty(_React$createElement, 'placeholder', 'Name'), _React$createElement)),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { type: 'hidden', id: 'boardCount', name: 'boardCount', value: props.count }),
        React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Make Board' })
      )
    )
  );
};

var BoardList = function BoardList(props) {
  if (props.boards.length === 0) {
    return React.createElement(
      'h3',
      { className: 'emptyBoards' },
      'No Boards'
    );
  }

  var boardNodes = props.boards.map(function (board, index) {
    console.log();
    if (board.tickets) {
      return React.createElement(
        'div',
        { key: board._id, className: 'board' },
        React.createElement(
          'h4',
          { className: 'boardLabel' },
          'Name: ',
          board.name
        ),
        React.createElement(
          'h4',
          { className: 'boardLabel' },
          'Tickets: ',
          board.tickets.length
        ),
        React.createElement(
          'div',
          { 'class': 'boardInfo' },
          React.createElement(
            'a',
            { href: "/tickets?id=" + board._id },
            React.createElement(
              'button',
              { id: "boardNav" + index,
                name: "boardNav" + index,
                className: 'formSubmit' },
              'View'
            )
          ),
          React.createElement(
            'button',
            { id: "boardDelete" + index,
              name: "boardDelete" + index,
              onClick: function onClick() {
                return handleDelete(board._id);
              },
              className: 'formSubmit' },
            'X'
          )
        )
      );
    } else {
      return React.createElement(
        'div',
        { key: board._id, className: 'board' },
        React.createElement(
          'h4',
          { className: 'boardLabel' },
          'Name: ',
          board.name
        ),
        React.createElement(
          'h4',
          { className: 'boardLabel' },
          'Tickets: None'
        ),
        React.createElement(
          'div',
          { 'class': 'boardInfo' },
          React.createElement(
            'a',
            { href: "/tickets?id=" + board._id },
            React.createElement(
              'button',
              { id: "boardNav" + index,
                name: "boardNav" + index,
                className: 'formSubmit' },
              'View'
            )
          ),
          React.createElement(
            'button',
            { id: "boardDelete" + index,
              name: "boardDelete" + index,
              onClick: function onClick() {
                return handleDelete(board._id);
              },
              className: 'formSubmit' },
            'X'
          )
        )
      );
    }
  });

  return React.createElement(
    'div',
    { className: 'remainingBoards' },
    React.createElement(
      'h3',
      { className: 'boardsLeft' },
      'Free Boards Remaining: ',
      5 - props.count
    ),
    React.createElement(
      'div',
      { className: 'premium' },
      React.createElement(
        'h6',
        { className: 'premiumCTA' },
        'Want to upgrade?'
      ),
      React.createElement(
        'button',
        { className: 'btn btn-link premiumButton' },
        React.createElement(
          'a',
          { href: '/upgrade' },
          'Upgrade'
        )
      )
    ),
    boardNodes
  );
};

var loadBoardsFromServer = function loadBoardsFromServer() {
  sendAjax('GET', '/getBoards', null, function (data) {
    ReactDOM.render(React.createElement(BoardList, { boards: data.boards, count: data.count }), document.querySelector("#boards"));
    ReactDOM.render(React.createElement(BoardForm, { csrf: data.csrfToken, count: data.count }), document.querySelector("#makeBoard"));
  });
};

var setup = function setup(csrf) {
  var count = 0;

  ReactDOM.render(React.createElement(BoardForm, { csrf: csrf, count: count }), document.querySelector("#makeBoard"));

  ReactDOM.render(React.createElement(BoardList, { boards: [], count: 0 }), document.querySelector("#boards"));

  loadBoardsFromServer();
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
