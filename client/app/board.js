const handleBoard = (e) => {
  e.preventDefault();

  if ($('#boardName').val() === '') {
    handleError('Name is required');
    return false;
  }

  if ($('#boardCount').val() >= 5) {
    handleError('Maximum number of boards reached');
    return false;
  }

  sendAjax('POST', $('#boardForm').attr('action'), $('#boardForm').serialize(), function() {
    loadBoardsFromServer();
  });

  return false;
};

const handleDelete = (ID) => {
  sendAjax('GET', '/getToken', null, (result) => {
    sendDelete(result.csrfToken);
  });

  const sendDelete = (token) => {
    const data = "id=" + ID +"&_csrf=" + token;

    sendAjax('DELETE', '/deleteBoard', data, function() {
      loadBoardsFromServer();
    });
  };

  return false;
};

const BoardForm = (props) => {
  return(
    <div className="boardFormContainer">
      <form id="boardForm"
            name="boardForm"
            onSubmit={handleBoard}
            action="/makeBoard"
            method="POST"
            className="boardForm">
        <div className="row">
          <input id="boardName" className="formInput" className="form-control" type="text" name="name"
                 placeholder="Name"/>
          <input type="hidden" name="_csrf" value={props.csrf}/>
          <input type="hidden" id="boardCount" name="boardCount" value={props.count}/>
          <input className="formSubmit" type="submit" value="Make Board"/>
        </div>
      </form>
    </div>
  );
};

const BoardList = function(props) {
  if(props.boards.length === 0){
    return(
      <h3 className="emptyBoards">No Boards</h3>
    );
  }

  const boardNodes = props.boards.map(function(board, index){
    console.log();
    if (board.tickets) {
      return (
        <div key={board._id} className="board">
          <h4 className="boardLabel">Name: {board.name}</h4>
          <h4 className="boardLabel">Tickets: {board.tickets.length}</h4>
          <div class="boardInfo">
            <a href={"/tickets?id=" + board._id}>
              <button id={"boardNav" + index}
                    name={"boardNav" + index}
                    className="formSubmit">
                View
              </button>
            </a>
            <button id={"boardDelete" + index}
                  name={"boardDelete" + index}
                  onClick={() => handleDelete(board._id)}
                  className="formSubmit">
              X
            </button>
          </div>
        </div>
      );
    }
    else{
      return (
        <div key={board._id} className="board">
          <h4 className="boardLabel">Name: {board.name}</h4>
          <h4 className="boardLabel">Tickets: None</h4>
          <div class="boardInfo">
            <a href={"/tickets?id=" + board._id}>
              <button id={"boardNav" + index}
                      name={"boardNav" + index}
                      className="formSubmit">
                View
              </button>
            </a>
            <button id={"boardDelete" + index}
                    name={"boardDelete" + index}
                    onClick={() => handleDelete(board._id)}
                    className="formSubmit">
              X
            </button>
          </div>
        </div>
      );
    }
  });

  return(
    <div className="remainingBoards">
      <h3 className="boardsLeft">Free Boards Remaining: {5 - props.count}</h3>
      <div className="premium">
        <h6 className="premiumCTA">Want to upgrade?</h6>
        <button className="btn btn-link premiumButton"><a href="/upgrade">Upgrade</a></button>
      </div>
      {boardNodes}
    </div>
  );
};

const SharedBoardList = function(props) {
  if(props.boards.length === 0){
    return(
      <div></div>
    );
  }

  const sharedBoardNodes = props.boards.map(function(board, index){
    if (board.tickets) {
      return (
        <div key={board._id} className="board">
          <h4 className="boardLabel">Name: {board.name}</h4>
          <h4 className="boardLabel">Tickets: {board.tickets.length}</h4>
          <div class="boardInfo">
            <a href={"/tickets?id=" + board._id}>
              <button id={"boardNav" + index}
                    name={"boardNav" + index}
                    className="formSubmit">
                View
              </button>
            </a>
          </div>
        </div>
      );
    }
    else{
      return (
        <div key={board._id} className="board">
          <h4 className="boardLabel">Name: {board.name}</h4>
          <h4 className="boardLabel">Tickets: None</h4>
          <div class="boardInfo">
            <a href={"/tickets?id=" + board._id}>
              <button id={"boardNav" + index}
                      name={"boardNav" + index}
                      className="formSubmit">
                View
              </button>
            </a>
          </div>
        </div>
      );
    }
  });

  return(
    <div>
      {sharedBoardNodes}
    </div>
  );
};

const loadBoardsFromServer = () => {
  sendAjax('GET', '/getBoards', null, (data) => {
    ReactDOM.render(
      <BoardList boards={data.boards} count={data.count} />, document.querySelector("#boards")
    );
    ReactDOM.render(
      <SharedBoardList boards={data.sharedBoards}/>, document.querySelector("#sharedBoards")
    );
    ReactDOM.render(
      <BoardForm csrf={data.csrfToken} count={data.count} />, document.querySelector("#makeBoard")
    );
  });
};

const setup = function(csrf) {
  let count = 0;

  ReactDOM.render(
    <BoardForm csrf={csrf} count={count} />, document.querySelector("#makeBoard")
  );

  ReactDOM.render(
    <BoardList boards={[]} count={0}/>, document.querySelector("#boards")
  );

  loadBoardsFromServer();
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
