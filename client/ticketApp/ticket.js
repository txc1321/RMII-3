// Functions to handle making a new ticket and deleting one
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

// Function to edit a ticket
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

// Function to load edit ticket form
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

// Function to make a new comment
const handleComment = (e) => {
  e.preventDefault();
  const ID = e.currentTarget.parentElement.parentElement.id;
  if(document.querySelector('#comment' + ID).value == ''){
    handleError('You must make a comment');
    return false;
  }
  else{
    // Form is rendered post page load, must grab everything through dom
    // Jquery has been banished to the corner
    const form = e.currentTarget;
    const action = form.action;
    const comment = document.querySelector('#' + form.id + ' input[name=comment]').value;
    const ticketID = document.querySelector('#' + form.id + ' input[name=ticketID]').value;
    const boardID = document.querySelector('#' + form.id + ' input[name=boardID]').value;
    const csrf = document.querySelector('#' + form.id + ' input[name=_csrf]').value;
    const data = {
      comment,
      ticketID,
      boardID,
      _csrf: csrf,
    };
    sendAjax('POST', action, data, function() {
      loadCommentsFromServer(ID);
    });
    loadCommentsFromServer(ID);
  }
};

// Function to delete comment
const handleDeleteComment = (ID, ticketID) => {
  sendAjax('GET', '/getToken', null, (result) => {
    sendDelete(result.csrfToken);
  });

  const sendDelete = (token) => {
    const data = "id=" + ID + "&ticketID=" + ticketID + "&_csrf=" + token;
    sendAjax('DELETE', '/deleteComment', data, function() {
      loadCommentsFromServer(ticketID);
    });
  };

  return false;
};

// Function to load comment form
const handleCommentForm = (ID) => {
  let toggle = true;
  if(document.querySelector('#commentForm' + ID)){
    toggle = false;
  }

  if(toggle){
    loadCommentsFromServer(ID);
  }
  else{
    // Render blank if not showing comments
      ReactDOM.render(
        <CommentBlank />, document.querySelector("#comments" + ID)
      );
      ReactDOM.render(
        <CommentBlank />, document.querySelector("#commentsForm" + ID)
      );
  }
};

// Comment form
const CommentForm = (props) => {
  return(
    <form id={"commentForm" + props.id}
          name="commentForm"
          action="/addComment"
          method="POST"
          onSubmit={handleComment}
          className="commentForm">
      <div className="row">
        <input id={"comment"+props.id} className="commentFormInput" type="text" name="comment"
               placeholder="comment"/>
      </div>
      <div className="row">
        <input type="hidden" name="ticketID" value={props.id}/>
        <input type="hidden" name="boardID" value={props.boardID}/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="commentFormSubmit" type="submit" value="Comment"/>
      </div>
    </form>
  );
};

// Edit ticket form
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
          <input type="hidden" id="globalCSRF" name="_csrf" value={props.csrf}/>
          <input className="formSubmit" type="submit" value="Edit Ticket"/>
        </div>
      </form>
    </div>
  );
};

// Ticket form
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
            <input type="hidden" id="globalCSRF" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Make Ticket"/>
        </div>
      </form>
    </div>
  );
};

// Comment list
const CommentList = function(props) {
  if(!props.comments) {
    // Render if no comments
    return(
      <div>
        <h3>No comments</h3>
      </div>
    );
  }
  else {
    const commentNodes = props.comments.map(function (comment, index) {
      return (
        <li className="comment" id={"comment"+index}>{comment.comment}
          <button id={"commentDelete" + index}
                  name={"commentDelete" + index}
                  onClick={() => handleDeleteComment(comment._id, comment.ticketID)}
                  className="commentDelete">
            x
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

// Blank render
const CommentBlank = function() {
  return(
    <div></div>
  );
};

// Ticket list
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
              // date formatting
              tickets.map((ticket, index) => {
                const date = new Date(ticket.dueDate);
                const day = date.getDate();
                const month = date.getMonth();
                const year = date.getFullYear();

                const fullDate = `${month + 1}/${day + 1}/${year}`;
                return(
                  <div className="ticket" id={ticket._id}>
                    <h3 className="ticketTitle">Title: {ticket.title}</h3>
                    <h3 className="ticketPriority">Priority: {ticket.priority}</h3>
                    <h3 className="ticketDueDate">Due Date: {fullDate}</h3>
                    <h3 className="ticketDesc">Description: {ticket.description}</h3>
                    <button id={"ticketDelete" + index}
                                     name={"ticketDelete" + index}
                                     onClick={() => handleDelete(ticket._id, ticket.boardID)}
                                     className="commentFormSubmit">
                    X
                  </button>
                    <button id={"ticketEdit" + index}
                            name={"ticketEdit" + index}
                            onClick={() => handleEditForm(ticket._id, ticket.boardID)}
                            className="commentFormSubmit">
                      Edit
                    </button>
                    <button id={"ticketComments" + index}
                            name={"ticketComments" + index}
                            onClick={() => handleCommentForm(ticket._id)}
                            className="commentFormSubmit">
                      Comments
                    </button>
                    <section id={"comments" + ticket._id}></section>
                    <section id={"commentsForm" + ticket._id}></section>
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

// Grab tickets from server
const loadTicketsFromServer = () => {
  // extract id from url
  const boardID = window.location.search.substring(4);

  sendAjax('GET', `/getTickets?id=${boardID}`, null, (data) => {
    ReactDOM.render(
      <TicketList priorities={data.priorities} boardID={data.boardID} />, document.querySelector("#tickets")
    );
    ReactDOM.render(
      <TicketForm csrf={data.csrfToken} boardID={data.boardID} />, document.querySelector("#makeTicket")
    );
  });
};

// Grab comments from server
const loadCommentsFromServer = (ID) => {
  // extract id from url
  const token = document.querySelector('#globalCSRF').value;
  // extract csrf from global element
  const boardID = window.location.search.substring(4);

  sendAjax('GET', `/getComments?id=${ID}`, null, (data) => {
    ReactDOM.render(
      <CommentList comments={data.comments} />, document.querySelector("#comments" + ID)
    );
    ReactDOM.render(
      <CommentForm csrf={token} id={ID} boardID={boardID} />, document.querySelector("#commentsForm" + ID)
    );
  });
};

// initial set up
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

// on page load
$(document).ready(function() {
  getToken();
  $('#consoleMessage').hide();
  $('#loginConsoleMessage').hide();
});
