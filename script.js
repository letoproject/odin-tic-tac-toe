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
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.setAttribute("turn", "X");
    });
  };

  setBoard();

  const getBoard = () => board;

  const getCell = (index) => {
    return board[index];
  };

  const setToken = (row, column, playerToken) => {
    if (board[row][column].getToken() === "") {
      board[row][column].addToken(playerToken);
      gui.addTokenToCell(row, column, playerToken);
      return true;
    }
    return false;
  };

  const printBoard = (playerToken) => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getToken())
    );
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.setAttribute("turn", playerToken);
    });
    // console.log(boardWithCellValues);
    return boardWithCellValues;
  };

  return { getBoard, printBoard, setToken, setBoard, getCell };
}

function Cell() {
  let token = "";

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
    gui.showCurrentPlayer(activePlayer.token);
  };

  const getActivePlayer = () => activePlayer;
  gui.showCurrentPlayer(activePlayer);

  const printNewRound = () => {
    board.printBoard(activePlayer.token);
  };

  const winnerCheck = () => {
    const rows = board.getBoard().length;
    const columns = board.getBoard()[0].length;

    const rawBoard = board.printBoard();
    for (let i = 0; i < rows; i += 1) {
      if (
        rawBoard[i][0] === rawBoard[i][1] &&
        rawBoard[i][1] === rawBoard[i][2] &&
        rawBoard[i][0] !== ""
      ) {
        let winner = rawBoard[i][0] == "X" ? "X" : "0";
        return winner;
      } else if (
        rawBoard[0][i] === rawBoard[1][i] &&
        rawBoard[1][i] === rawBoard[2][i] &&
        rawBoard[0][i] !== ""
      ) {
        let winner = rawBoard[0][i] == "X" ? "X" : "0";
        return winner;
      }
    }
    //Check diagonals
    if (
      rawBoard[0][0] === rawBoard[1][1] &&
      rawBoard[1][1] === rawBoard[2][2] &&
      rawBoard[0][0] !== ""
    ) {
      let winner = rawBoard[0][0] == "X" ? "X" : "0";
      return winner;
    } else if (
      rawBoard[0][2] === rawBoard[1][1] &&
      rawBoard[1][1] === rawBoard[2][0] &&
      rawBoard[0][2] !== ""
    ) {
      let winner = rawBoard[0][2] == "X" ? "X" : "0";
      return winner;
      //If not win check if theres a tie
    } else if (rawBoard.every((row) => row.every((cell) => cell !== ""))) {
      return "tie";
    }
  };

  const playRound = (row, column) => {
    const cellClaimed = board.getBoard()[row][column].getToken() !== "";
    if (cellClaimed) {
      console.log("This cell is claimed");
      return;
    } else {
      board.setToken(row, column, getActivePlayer().token);
      let winner = winnerCheck();
      if (winner) {
        gui.showResultWindow(winner);
        gui.updateScore(winner);
        return;
      } else {
        switchPlayerTurn();
        printNewRound();
      }
    }
  };

  const restartGame = () => {
    board.setBoard();
    activePlayer = players[0];
    gui.showCurrentPlayer(activePlayer.token);
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.textContent = "";
      cell.setAttribute("token", "");
    });
  };

  gui.renderGameBoard();
  gui.showCurrentPlayer(activePlayer.token);

  return { playRound, getActivePlayer, winnerCheck, restartGame };
}

function screenController() {
  const gameBoard = document.querySelector(".main__gameBoard");
  const resultWindow = document.querySelector(".resultWindow");
  const resultMessage = document.querySelector(".resultMessage");
  const displayCurrentTurn = document.querySelector(
    ".main__player-turn-display"
  );
  const scoreDisplayElements = document.querySelectorAll(
    ".main__scoreInfo-score"
  );

  scoreDisplayElements.forEach((el) => (el.textContent = 0));

  const renderGameBoard = () => {
    const board = Gameboard();
    const rows = board.getBoard().length;
    const columns = board.getBoard()[0].length;

    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < columns; j += 1) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = " ";
        cell.setAttribute("turn", "X");
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
    cell.setAttribute("token", playerToken);
  };

  const showCurrentPlayer = (currentPlayer) => {
    displayCurrentTurn.textContent = `Now ${currentPlayer}'s turn`;
  };

  const showResultWindow = (winner) => {
    resultWindow.classList.remove("hidden");
    if (winner === "tie") {
      resultMessage.textContent = `Round result is TIE`;
    } else {
      resultMessage.textContent = `Player ${winner} win!`;
    }
    resultWindow.addEventListener("click", () => {
      game.restartGame();
      resultWindow.classList.add("hidden");
    });
  };

  const updateScore = (winner) => {
    if (winner === "X") {
      scoreDisplayElements[0].textContent += 1;
    } else if (winner === "O") {
      scoreDisplayElements[2].textContent += 1;
    } else if (winner === "tie") {
      scoreDisplayElements[1].textContent += 1;
    }
  };

  const setWinComboBgc = (board) => {
    let winArray = [];
    board.forEach((el) => winArray.push());
  };

  return {
    renderGameBoard,
    addTokenToCell,
    showResultWindow,
    showCurrentPlayer,
    updateScore,
  };
}

const game = GameController();

// Current year for footer
const currentYearSpan = document.querySelector(".current_year");
currentYearSpan.textContent = new Date().getFullYear();
