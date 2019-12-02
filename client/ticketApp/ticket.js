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

const handleEdit = (e) => {
  e.preventDefault();

  if ($('#ticketTitle').val() === '' &&
    $('#ticketPriority').val() === '' &&
    $('#ticketDueDate').val() === ''  &&
    $('#ticketDesc').val() === '' ) {
    handleError('You must make a change to edit');
    return false;
  }

  sendAjax('POST', $('#ticketForm').attr('action'), $('#ticketForm').serialize(), function() {
    loadTicketsFromServer();
  });

  return false;
};

const handleEditForm = (ID, boardID) => {
  sendAjax('GET', '/getToken', null, (result) => {
    createEditForm(result.csrfToken);
  });

  const createEditForm = (token) => {
    ReactDOM.render(
      <EditTicketForm csrf={token} id={ID} boardID={boardID} />, document.querySelector("#makeTicket")
    );
  };
};

const handleComment = (e) => {
  e.preventDefault();

  const ID = e.currentTarget.id.value;

  if ($('#comment').val() === '') {
    handleError('You must make a comment');
    return false;
  }

  sendAjax('POST', $(`#commentform${ID}`).attr('action'), $(`#commentform${ID}`).serialize(), function() {
    loadCommentsFromServer(ID);
  });

  return false;
};

const handleDeleteComment = (ID) => {
  sendAjax('GET', '/getToken', null, (result) => {
    sendDelete(result.csrfToken);
  });

  const sendDelete = (token) => {
    const data = "ticketID=" + ID +"&_csrf=" + token;
    sendAjax('DELETE', '/removeComment', data, function() {
      loadCommentsFromServer(ID);
    });
  };

  return false;
};

const handleCommentForm = (ID) => {
  let toggle = true;
  if(document.querySelector('#commentForm' + ID)){
    toggle = false;
  }

  if(toggle){
    loadCommentsFromServer(ID);
  }
  else{
      ReactDOM.render(
        <CommentBlank />, document.querySelector("#comments" + ID)
      );
  }
};

const CommentForm = (props) => {
  return(
    <form id={"commentForm" + props.id}
          name="commentForm"
          onSubmit={handleComment}
          action="/addComment"
          method="POST"
          className="ticketForm">
      <div className="row">
        <input id="comment" className="formInput" type="text" name="comment"
               placeholder="comment"/>
      </div>
      <div className="row">
        <input type="hidden" name="id" value={props.id}/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Comment"/>
      </div>
    </form>
  );
};

const EditTicketForm = (props) => {
  return(
    <div className="ticketFormContainer">
      <form id="ticketForm"
            name="ticketForm"
            onSubmit={handleEdit}
            action="/editTicket"
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
          <input type="hidden" name="id" value={props.id}/>
          <input type="hidden" name="boardID" value={props.boardID}/>
          <input type="hidden" name="_csrf" value={props.csrf}/>
          <input className="formSubmit" type="submit" value="Edit Ticket"/>
        </div>
      </form>
    </div>
  );
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

const CommentList = function(props) {
  if(!props.comments) {
    return(
      <div>
        <h3>No comments</h3>
      </div>
    );
  }
  else {
    const commentNodes = props.comments.map(function (comment, index) {
      return (
        <li id={comment.comment}>{comment.comment}
          <button id={"commentDelete" + index}
                  name={"commentDelete" + index}
                  onClick={() => handleDeleteComment(comment._id, comment.ticketID)}
                  className="formSubmit">
            X
          </button>
        </li>
      );
    });

    return(
      <ul id={"comments"}>
        {commentNodes}
      </ul>
    );
  }
};

const CommentBlank = function() {
  return(
    <div></div>
  );
}

const TicketList = function(props) {
  if(!props.priorities.tickets) {
    return(
      <div>
        <h3>No tickets here</h3>
      </div>
    );
  }
  else {
    const priorityNodes = props.priorities.tickets.map(function (tickets, index) {
      if(tickets.length > 0){
        return (
          <div className="ticketContainer">
            <h3>Priority: {5-index}</h3>
            {
              tickets.map((ticket, index) => {
                return(
                  <div className="ticket" id={ticket._id}>
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
                    <button id={"ticketEdit" + index}
                            name={"ticketEdit" + index}
                            onClick={() => handleEditForm(ticket._id, ticket.boardID)}
                            className="formSubmit">
                      Edit
                    </button>
                    <button id={"ticketComments" + index}
                            name={"ticketComments" + index}
                            onClick={() => handleCommentForm(ticket._id)}
                            className="formSubmit">
                      Comments
                    </button>
                    <section id={"comments" + ticket._id}></section>
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

const loadCommentsFromServer = (ID) => {
  sendAjax('GET', '/getComments', null, (data) => {
    ReactDOM.render(
      <CommentList comments={data.comments} />, document.querySelector("#comments" + ID)
    );
    ReactDOM.render(
      <CommentForm csrf={data.csrfToken} id={ID} />, document.querySelector("#comments" + ID)
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
