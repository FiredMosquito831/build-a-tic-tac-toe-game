/*
 * app.js — DOM wiring for the Tic Tac Toe game.
 * Uses TTT (pure logic). Player picks X or O and a difficulty; the
 * computer is the other mark. The board resets automatically right after
 * a game ends (user story #2) and can also be reset by hand.
 */
(function () {
  "use strict";
  var T = window.TTT;
  var $ = function (id) { return document.getElementById(id); };

  var state = {
    board: T.emptyBoard(),
    human: "X",
    computer: "O",
    difficulty: "hard",
    over: false,
    resetTimer: null
  };

  function render() {
    var cells = $("cells");
    cells.innerHTML = "";
    for (var i = 0; i < 9; i++) {
      var btn = document.createElement("button");
      btn.className = "cell" + (state.board[i] ? " filled" : "");
      btn.textContent = state.board[i] || "";
      btn.dataset.index = String(i);
      btn.disabled = state.over || !!state.board[i];
      btn.addEventListener("click", onCell);
      cells.appendChild(btn);
    }
    $("you-label").textContent = "You play " + state.human +
      " · Computer plays " + state.computer;
  }

  function onCell(e) {
    var i = Number(e.currentTarget.dataset.index);
    if (state.over || state.board[i]) return;
    state.board[i] = state.human;
    var s = T.status(state.board, state.human);
    if (!s.over) {
      var m = T.aiMove(state.board, state.computer, state.human,
        state.difficulty);
      state.board[m] = state.computer;
      s = T.status(state.board, state.computer);
    }
    render();
    if (s.over) endGame(s);
  }

  function endGame(s) {
    state.over = true;
    $("status").textContent =
      s.winner === state.human ? "You win!" :
      s.winner === state.computer ? "Computer wins." :
      "It's a draw.";
    // "resets as soon as it's over": brief pause, then a fresh board.
    if (state.resetTimer) clearTimeout(state.resetTimer);
    state.resetTimer = setTimeout(newGame, 1200);
  }

  function newGame() {
    if (state.resetTimer) clearTimeout(state.resetTimer);
    state.board = T.emptyBoard();
    state.over = false;
    $("status").textContent = "Go — " + state.human + " moves.";
    render();
  }

  $("x-btn").addEventListener("click", function () { setMarks("X"); });
  $("o-btn").addEventListener("click", function () { setMarks("O"); });
  $("new-btn").addEventListener("click", newGame);
  $("difficulty").addEventListener("change", function () {
    state.difficulty = this.value;
    newGame();
  });

  function setMarks(human) {
    state.human = human;
    state.computer = T.other(human);
    newGame();
  }

  newGame();
})();
