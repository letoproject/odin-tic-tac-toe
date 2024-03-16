const ROWS = 3;
const COLUMNS = 3;

function Gameboard() {
  const rows = ROWS;
  const columns = COLUMNS;
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
    const rawBoard = board.printBoard();

    for (let i = 0; i < rows; i += 1) {
      // Check rows
      if (rawBoard[i].every((cell) => cell === rawBoard[i][0] && cell !== "")) {
        return rawBoard[i][0];
      }

      // Check columns
      if (rawBoard.every((row) => row[i] === rawBoard[0][i] && row[i] !== "")) {
        return rawBoard[0][i];
      }
    }

    // Check diagonals
    let diag1 = [];
    let diag2 = [];
    for (let i = 0; i < rows; i++) {
      diag1.push(rawBoard[i][i]);
      diag2.push(rawBoard[i][rows - i - 1]);
    }
    if (diag1.every((cell) => cell === diag1[0] && cell !== "")) {
      return diag1[0];
    }
    if (diag2.every((cell) => cell === diag2[0] && cell !== "")) {
      return diag2[0];
    }

    // If no winner, check if there's a tie
    if (rawBoard.every((row) => row.every((cell) => cell !== ""))) {
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

  gui.updateScore();
  gui.renderGameBoard();
  gui.showCurrentPlayer(activePlayer.token);

  return { playRound, getActivePlayer, winnerCheck, restartGame };
}

function screenController() {
  const gameBoard = document.querySelector(".main__gameBoard");
  const resultWindow = document.querySelector(".resultWindow");
  const resultMessage = document.querySelector(".resultMessage");
  const resetBtn = document.querySelector(".main__reset");
  const displayCurrentTurn = document.querySelector(
    ".main__player-turn-display"
  );
  const scoreDisplayElements = document.querySelectorAll(
    ".main__scoreInfo-score"
  );

  gameBoard.style.setProperty("--rows", ROWS);
  gameBoard.style.setProperty("--columns", COLUMNS);

  let playerOneScore = 0,
    playerTwoScore = 0,
    tie = 0;

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
    displayCurrentTurn.setAttribute("token", currentPlayer);
    // displayCurrentTurn.textContent = `${currentPlayer}'s turn`;
  };

  const showResultWindow = (winner) => {
    resultWindow.classList.remove("hidden");
    if (winner === "tie") {
      resultMessage.textContent = `It's TIE`;
    } else {
      resultMessage.textContent = `Player ${winner} win!`;
    }
    resultWindow.addEventListener("click", () => {
      game.restartGame();
      resultWindow.classList.add("hidden");
    });
  };

  const updateScore = (winner) => {
    switch (winner) {
      case "X":
        scoreDisplayElements[0].textContent = playerOneScore += 1;
        break;
      case "O":
        scoreDisplayElements[2].textContent = playerTwoScore += 1;
        break;
      case "tie":
        scoreDisplayElements[1].textContent = tie += 1;
        break;
      default:
        scoreDisplayElements.forEach((el) => (el.textContent = 0));
        break;
    }
  };

  resetBtn.addEventListener("click", () => {
    game.restartGame();
    playerOneScore = 0;
    playerTwoScore = 0;
    tie = 0;
    updateScore();
  });

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
