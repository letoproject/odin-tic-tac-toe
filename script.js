function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  const gui = screenController();

  const setBoard = () => {
    for (let i = 0; i < rows; i += 1) {
      board[i] = [];
      for (let j = 0; j < columns; j += 1) {
        board[i].push(Cell());
      }
    }
  };

  setBoard();

  const getBoard = () => board;

  const setToken = (row, column, playerToken) => {
    if (board[row][column].getToken() === " ") {
      board[row][column].addToken(playerToken);
      gui.addTokenToCell(row, column, playerToken);
      return true;
    }
    return false;
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getToken())
    );
    // console.log(boardWithCellValues);
    return boardWithCellValues;
  };

  return { getBoard, printBoard, setToken, setBoard };
}

function Cell() {
  let token = " ";

  const addToken = (playerToken) => (token = playerToken);
  const getToken = () => token;

  return { addToken, getToken };
}

function GameController(playerOne = "X", playerTwo = "O") {
  const board = Gameboard();
  const gui = screenController();

  const players = [
    {
      name: playerOne,
      token: "X",
    },
    {
      name: playerTwo,
      token: "O",
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn`);
  };

  const winnerCheck = () => {
    const rows = board.getBoard().length;
    const columns = board.getBoard()[0].length;

    const rawBoard = board.printBoard();
    for (let i = 0; i < rows; i += 1) {
      if (
        rawBoard[i][0] === rawBoard[i][1] &&
        rawBoard[i][1] === rawBoard[i][2] &&
        rawBoard[i][0] !== " "
      ) {
        let winner = rawBoard[i][0] == "X" ? "X" : "0";
        return winner;
      } else if (
        rawBoard[0][i] === rawBoard[1][i] &&
        rawBoard[1][i] === rawBoard[2][i] &&
        rawBoard[0][i] !== " "
      ) {
        let winner = rawBoard[0][i] == "X" ? "X" : "0";
        return winner;
      }
    }
    //Check diagonals
    if (
      rawBoard[0][0] === rawBoard[1][1] &&
      rawBoard[1][1] === rawBoard[2][2] &&
      rawBoard[0][0] !== " "
    ) {
      let winner = rawBoard[0][0] == "X" ? "X" : "0";
      return winner;
    } else if (
      rawBoard[0][2] === rawBoard[1][1] &&
      rawBoard[1][1] === rawBoard[2][0] &&
      rawBoard[0][2] !== " "
    ) {
      let winner = rawBoard[0][2] == "X" ? "X" : "0";
      return winner;
      //If not win check if theres a tie
    } else if (rawBoard.every((row) => row.every((cell) => cell != " "))) {
      return "tie";
    }
  };

  const playRound = (row, column) => {
    const cellClaimed = board.getBoard()[row][column].getToken() != " ";
    if (!cellClaimed) {
      console.log(`Player ${getActivePlayer().name} marked ${row} ${column}`);
      board.setToken(row, column, getActivePlayer().token);
      let winner = winnerCheck();
      if (winner) {
        console.log("winner", `player ${winner}`);
        console.log(board.printBoard());
        restartGame();
      } else {
        switchPlayerTurn();
        printNewRound();
      }
    } else {
      console.log("This cell is claimed");
    }
  };

  const restartGame = () => {
    board.setBoard();
    activePlayer = players[0];
  };

  gui.renderGameBoard();

  return { playRound, getActivePlayer, winnerCheck, restartGame };
}

function screenController() {
  const gameBoard = document.querySelector(".gameBoard");

  const renderGameBoard = () => {
    const board = Gameboard();
    const rows = board.getBoard().length;
    const columns = board.getBoard()[0].length;

    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < columns; j += 1) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = " ";
        cell.setAttribute("row", i);
        cell.setAttribute("column", j);
        cell.addEventListener("click", () => {
          const row = cell.getAttribute("row");
          const column = cell.getAttribute("column");
          game.playRound(parseInt(row), parseInt(column));
        });
        gameBoard.appendChild(cell);
      }
    }
  };

  const addTokenToCell = (row, column, playerToken) => {
    let cell = document.querySelector(`[row="${row}"][column="${column}"]`);
    cell.textContent = playerToken;
  };

  return { renderGameBoard, addTokenToCell };
}

const game = GameController();

// game.playRound(0, 0); // X
// game.playRound(0, 0); // O
// game.playRound(1, 1); // X
// game.playRound(1, 2); // O
// game.playRound(2, 2); // X

const currentYearSpan = document.querySelector(".current_year");
currentYearSpan.textContent = new Date().getFullYear();
