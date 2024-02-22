function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i += 1) {
    board[i] = [];
    for (let j = 0; j < columns; j += 1) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const setToken = (row, column, playerToken) => {
    if (board[row][column].getToken() === " ") {
      board[row][column].addToken(playerToken);
      return true;
    }
    return false;
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getToken())
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, printBoard, setToken };
}

function Cell() {
  let token = " ";

  const addToken = (playerToken) => {
    token = playerToken;
  };

  const getToken = () => token;

  return { addToken, getToken };
}

function GameController(playerOne = "X", playerTwo = "O") {
  const board = Gameboard();

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

  const playRound = (row, column) => {
    console.log(`Player ${getActivePlayer().name} marked ${row} ${column}`);
    board.setToken(row, column, getActivePlayer().token);
    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return { playRound, getActivePlayer };
}

const game = GameController();
const board = Gameboard();

game.playRound(0, 0); // X
game.playRound(0, 1); // O
game.playRound(1, 1); // X
game.playRound(1, 2); // O
game.playRound(2, 2); // X
game.playRound(2, 1); // O
