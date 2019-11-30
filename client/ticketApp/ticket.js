const handleTicket = (e) => {
  e.preventDefault();

  if ($('#ticketTitle').val() === '' ||
    $('#ticketPriority').val() === '' ||
    $('#ticketDueDate').val() === '') {
    handleError('Title, Priority, and Due Date are all required');
    return false;
  }

  sendAjax('POST', $('#ticketForm').attr('action'), $('#ticketForm').serialize(), function() {
    loadTicketsFromServer();
  });

  return false;
};

const handleDelete = (ID, boardID) => {
  sendAjax('GET', '/getToken', null, (result) => {
    sendDelete(result.csrfToken);
  });

  const sendDelete = (token) => {
    const data = "id=" + ID +"&_csrf=" + token + "&boardID=" + boardID;
    sendAjax('DELETE', '/resolveTicket', data, function() {
      loadTicketsFromServer();
    });
  };

  return false;
};

const TicketForm = (props) => {
  return(
    <div className="ticketFormContainer">
      <form id="ticketForm"
            name="ticketForm"
            onSubmit={handleTicket}
            action="/makeTicket"
            method="POST"
            className="ticketForm">
        <div className="row">
          <input id="ticketTitle" className="formInput" type="text" name="title"
                 placeholder="Title"/>
          <input id="ticketPriority" className="formInput" type="text" name="priority"
                 placeholder="Priority"/>
          <input id="ticketDueDate" className="formInput" type="date" name="dueDate"
                 placeholder="Due Date"/>
        </div>
        <div className="row">
          <input id="ticketDesc" className="formInput" type="text" name="description"
                 placeholder="Description"/>
          <input type="hidden" name="boardID" value={props.boardID}/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Make Ticket"/>
        </div>
      </form>
    </div>
  );
};

const TicketList = function(props) {
  if(!props.priorities.tickets) {
    return(
      <div>
        <h3>No tickets here</h3>
      </div>
    );
  }
  else {
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

    const priorityNodes = props.priorities.tickets.map(function (tickets, index) {
      if(tickets.length > 0){
        return (
          <div className="ticketContainer">
            <h3>Priority: {5-index}</h3>
            {
              tickets.map((ticket, index) => {
                return(
                  <div className="ticket">
                    <h3 className="ticketTitle">Title: {ticket.title}</h3>
                    <h3 className="ticketPriority">Priority: {ticket.priority}</h3>
                    <h3 className="ticketDueDate">Due Date: {ticket.dueDate}</h3>
                    <h3 className="ticketDesc">Description: {ticket.description}</h3>
                    <button id={"ticketDelete" + index}
                            name={"ticketDelete" + index}
                            onClick={() => handleDelete(ticket._id, ticket.boardID)}
                            className="formSubmit">
                      X
                    </button>
                  </div>
                );
              })
            }
          </div>
        );
      }
      return (
        <div className="ticketContainer">
          <h3>Priority: {5-index}</h3>
          <h3 className="emptyTickets">No Tickets</h3>
        </div>
      );
    });

    return(
      <div>
        {priorityNodes}
      </div>
    );
  }
};

const loadTicketsFromServer = () => {
  let boardID = window.location.search.substring(4);
  sendAjax('GET', `/getTickets?id=${boardID}`, null, (data) => {
    ReactDOM.render(
      <TicketList priorities={data.priorities} boardID={data.boardID} />, document.querySelector("#tickets")
    );
    ReactDOM.render(
      <TicketForm csrf={data.csrfToken} boardID={data.boardID} />, document.querySelector("#makeTicket")
    );
  });
};

const setup = function(csrf) {
  ReactDOM.render(
    <TicketForm csrf={csrf} boardID={''} />, document.querySelector("#makeTicket")
  );

  ReactDOM.render(
    <TicketList priorities={[]} boardID={''} />, document.querySelector("#tickets")
  );

  loadTicketsFromServer();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
  $('#consoleMessage').hide();
  $('#loginConsoleMessage').hide();
});
