// Gameboard Module
const Gameboard = (() => {
    let board = Array(9).fill(null);
  
    const getBoard = () => board;
  
    const setMark = (index, mark) => {
      if (board[index] === null) {
        board[index] = mark;
        return true;
      }
      return false;
    };
  
    const resetBoard = () => {
      board = Array(9).fill(null);
    };
  
    return { getBoard, setMark, resetBoard };
  })();
  
  // Player Factory
  const Player = (name, mark) => ({ name, mark });
  
  // Game Controller
  const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;
  
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
  
    const startGame = (player1Name, player2Name) => {
      players = [
        Player(player1Name || "Player 1", "X"),
        Player(player2Name || "Player 2", "O")
      ];
      currentPlayerIndex = 0;
      gameOver = false;
      Gameboard.resetBoard();
      DisplayController.updateDisplay();
      DisplayController.showMessage(`${players[currentPlayerIndex].name}'s turn!`);
    };
  
    const playTurn = (index) => {
      if (gameOver || !Gameboard.setMark(index, players[currentPlayerIndex].mark)) {
        return;
      }
  
      if (checkWinner()) {
        gameOver = true;
        DisplayController.showMessage(`${players[currentPlayerIndex].name} wins!`);
        return;
      }
  
      if (Gameboard.getBoard().every(cell => cell !== null)) {
        gameOver = true;
        DisplayController.showMessage("It's a tie!");
        return;
      }
  
      currentPlayerIndex = 1 - currentPlayerIndex; // Switch player
      DisplayController.showMessage(`${players[currentPlayerIndex].name}'s turn!`);
      DisplayController.updateDisplay();
    };
  
    const checkWinner = () => {
      const board = Gameboard.getBoard();
      return winningCombinations.some(combo =>
        combo.every(index => board[index] === players[currentPlayerIndex].mark)
      );
    };
  
    return { startGame, playTurn };
  })();
  
  // Display Controller
  const DisplayController = (() => {
    const boardElement = document.getElementById("game");
    const messageElement = document.getElementById("message");
  
    const renderBoard = () => {
      const board = Gameboard.getBoard();
      boardElement.innerHTML = "";
      board.forEach((mark, index) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = mark || "";
        cell.addEventListener("click", () => {
          GameController.playTurn(index);
          updateDisplay();
        });
        boardElement.appendChild(cell);
      });
    };
  
    const updateDisplay = () => {
      renderBoard();
    };
  
    const showMessage = (message) => {
      messageElement.textContent = message;
    };
  
    return { renderBoard, updateDisplay, showMessage };
  })();
  
  // Event Listeners
  document.getElementById("start-btn").addEventListener("click", () => {
    const player1 = document.getElementById("player1").value;
    const player2 = document.getElementById("player2").value;
    GameController.startGame(player1, player2);
  });
  
  document.getElementById("restart-btn").addEventListener("click", () => {
    GameController.startGame("Player 1", "Player 2");
  });
  