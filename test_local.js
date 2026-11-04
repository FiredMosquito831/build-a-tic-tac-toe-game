// Tests for the "Build a Tic Tac Toe Game" logic module.
// Run:  node test_local.js   (exits 0 + prints PASS when green)
"use strict";

const path = require("path");
const T = require(path.join(__dirname, "logic.js"));

let pass = 0;
let fail = 0;
const failures = [];
function check(name, cond, detail) {
  if (cond) {
    pass += 1;
    console.log("PASS  " + name + (detail ? "  [" + detail + "]" : ""));
  } else {
    fail += 1;
    failures.push(name);
    console.log("FAIL  " + name + (detail ? "  [" + detail + "]" : ""));
  }
}

// Build a 9-cell board from a { index: "X"|"O" } map (row-major index).
function withMarks(spec) {
  const b = new Array(9).fill(null);
  for (const i of Object.keys(spec)) b[Number(i)] = spec[i];
  return b;
}

// --- board & winner --------------------------------------------------------
check("empty board has 9 empty cells",
  T.emptyBoard().every((c) => c === null));
check("row win detected",
  T.checkWinner(withMarks({ 0: "X", 1: "X", 2: "X", 4: "O", 5: "O" })) === "X");
check("column win detected",
  T.checkWinner(withMarks({ 0: "X", 3: "X", 6: "X" })) === "X");
check("main diagonal win detected",
  T.checkWinner(withMarks({ 0: "X", 4: "X", 8: "X" })) === "X");
check("anti-diagonal win detected",
  T.checkWinner(withMarks({ 2: "O", 4: "O", 6: "O", 0: "X", 1: "X" })) === "O");
check("no winner -> null",
  T.checkWinner(withMarks({ 0: "X", 1: "O", 2: "O", 3: "O", 4: "X", 5: "X", 6: "X", 7: "X", 8: "O" })) === null);
check("winning line returned",
  JSON.stringify(T.findWinningLine(withMarks({ 0: "X", 1: "X", 2: "X" }))) === "[0,1,2]");

// --- fullness / moves / status --------------------------------------------
check("isFull true only when no empty cells",
  T.isFull(withMarks({ 0: "X", 1: "O", 2: "O", 3: "O", 4: "X", 5: "X", 6: "X", 7: "X", 8: "O" })) === true &&
    T.isFull(withMarks({ 0: "X", 1: "O" })) === false);
check(
  "availableMoves lists empties in order",
  JSON.stringify(T.availableMoves(withMarks({ 0: "X", 1: "O" }), "X")) ===
    "[2,3,4,5,6,7,8]"
);
const stPlaying = T.status(withMarks({ 0: "X", 1: "O", 5: "O", 6: "O" }), "O");
check(
  "status reports playing + next mover",
  stPlaying.over === false && stPlaying.toMove === "X"
);
check("status reports a draw on a full board with no winner",
  T.status(
    withMarks({ 0: "X", 1: "O", 2: "O", 3: "O", 4: "X", 5: "X", 6: "X", 7: "X", 8: "O" }),
    "O"
  ).result === "Draw");

// --- computer: blocks the human's win -------------------------------------
const blockBoard = withMarks({ 0: "X", 1: "X", 5: "O", 6: "O" }); // X threatens index 2
check(
  "hard AI blocks a human win",
  T.aiMove(blockBoard, "O", "X", "hard") === 2,
  "O must take index 2 to stop XXX"
);

// --- computer: takes its own win ------------------------------------------
const winBoard = withMarks({ 0: "O", 1: "O", 6: "X", 7: "X" }); // O can finish the top row
check(
  "hard AI takes its own win",
  T.aiMove(winBoard, "O", "X", "hard") === 2
);

// --- computer: never loses a solvable line --------------------------------
(function playVsHard() {
  const b = T.emptyBoard();
  let turn = "X"; // human X moves first, always taking the first empty cell
  while (!T.checkWinner(b) && !T.isFull(b)) {
    if (turn === "X") {
      b[T.availableMoves(b, "X")[0]] = "X";
    } else {
      b[T.aiMove(b, "O", "X", "hard")] = "O";
    }
    turn = T.other(turn);
  }
  const winner = T.checkWinner(b);
  check("hard AI never loses (X cannot win)", winner !== "X",
    "winner=" + (winner || "draw"));
})();

// --- easy mode is deterministic under a seeded RNG ------------------------
(function seeded() {
  const mk = () => withMarks({ 0: "X", 2: "O", 6: "O", 7: "O" });
  const a = T.aiMove(mk(), "X", "O", "easy", T.createSeededRng(42));
  const c = T.aiMove(mk(), "X", "O", "easy", T.createSeededRng(42));
  check("seeded easy mode is deterministic", a === c, "move " + a);
  check("easy move is an empty cell", mk()[a] === null, "cell " + a);
})();

// --- aiMove on a full board ------------------------------------------------
check("aiMove returns -1 when no moves",
  T.aiMove(
    withMarks({ 0: "X", 1: "O", 2: "O", 3: "O", 4: "X", 5: "X", 6: "X", 7: "X", 8: "O" }),
    "O", "X", "hard"
  ) === -1);

// --- summary ---------------------------------------------------------------
console.log("");
const total = pass + fail;
console.log("SUMMARY: " + pass + " passed, " + fail + " failed / " + total);
if (fail === 0) {
  console.log("PASS");
  process.exit(0);
} else {
  console.log("FAILED: " + failures.join(", "));
  process.exit(1);
}
