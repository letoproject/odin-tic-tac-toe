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

  const makeTurn = (row, column, player) => {
    console.log("board[row][column]", board[row][column].addToken(player));
    const markedCell = board[row][column];
    markedCell.addToken(player);
  };

  const printBoard = () => {};

  return { getBoard, printBoard, makeTurn };
}

function Cell() {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addToken, getValue };
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
    board.makeTurn(row, column, getActivePlayer().token);
    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return { playRound, getActivePlayer };
}

const game = GameController();
const board = Gameboard();

game.playRound(0, 0);
game.playRound(0, 1);

console.log(board.getBoard());
