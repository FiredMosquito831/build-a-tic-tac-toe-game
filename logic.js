/*
 * logic.js (TTT) — pure game logic for "Build a Tic Tac Toe Game".
 *
 * UMD: window.TTT in the browser, require()-able in Node. No DOM, no
 * timers. Board is a 9-length array of null | "X" | "O" (index 0 = top
 * left, row-major). The computer opponent is a minimax "hard" player or a
 * random "easy" player. A seeded RNG is exported so behaviour is
 * deterministic under test.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.TTT = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  function emptyBoard() {
    return new Array(9).fill(null);
  }

  function other(player) {
    return player === "X" ? "O" : "X";
  }

  function findWinningLine(board) {
    for (var i = 0; i < LINES.length; i++) {
      var l = LINES[i];
      if (
        board[l[0]] &&
        board[l[0]] === board[l[1]] &&
        board[l[1]] === board[l[2]]
      ) {
        return l.slice();
      }
    }
    return null;
  }

  function checkWinner(board) {
    var line = findWinningLine(board);
    return line ? board[line[0]] : null;
  }

  function isFull(board) {
    for (var i = 0; i < 9; i++) if (!board[i]) return false;
    return true;
  }

  // Empty cells a given player may still play.
  function availableMoves(board, player) {
    var out = [];
    for (var i = 0; i < 9; i++) if (!board[i]) out.push(i);
    return out;
  }

  // Terminal state helper for the UI.
  function status(board, lastPlayer) {
    var w = checkWinner(board);
    if (w) return { over: true, winner: w, result: w + " wins" };
    if (isFull(board)) return { over: true, winner: null, result: "Draw" };
    return { over: false, winner: null, result: "playing", toMove: other(lastPlayer) };
  }

  // ---- deterministic PRNG (mulberry32) -----------------------------------
  function createSeededRng(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---- minimax ("hard" computer) -----------------------------------------
  function minimax(board, player, ai, human, depth) {
    var w = checkWinner(board);
    if (w === ai) return { score: 10 - depth, index: -1 };
    if (w === human) return { score: depth - 10, index: -1 };
    if (isFull(board)) return { score: 0, index: -1 };

    var moves = availableMoves(board, player);
    var best = null;
    for (var i = 0; i < moves.length; i++) {
      var m = moves[i];
      board[m] = player;
      var res = minimax(board, other(player), ai, human, depth + 1);
      board[m] = null;
      if (player === ai) {
        if (!best || res.score > best.score) best = { score: res.score, index: m };
      } else {
        if (!best || res.score < best.score) best = { score: res.score, index: m };
      }
    }
    return best;
  }

  // Returns the cell index the computer should play.
  //   mode "hard": minimax (unbeatable).
  //   mode "easy": random among empty cells, using the supplied rng.
  function aiMove(board, ai, human, mode, rng) {
    var moves = availableMoves(board, ai);
    if (moves.length === 0) return -1;
    if (mode === "easy") {
      var r = rng || Math.random;
      return moves[Math.floor(r() * moves.length)];
    }
    // hard
    var copy = board.slice();
    var res = minimax(copy, ai, ai, human, 0);
    return res.index;
  }

  return {
    LINES: LINES,
    emptyBoard: emptyBoard,
    other: other,
    checkWinner: checkWinner,
    findWinningLine: findWinningLine,
    isFull: isFull,
    availableMoves: availableMoves,
    status: status,
    aiMove: aiMove,
    createSeededRng: createSeededRng
  };
});
