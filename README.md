# Build a Tic Tac Toe Game

**A freeCodeCamp Legacy Front-End certification project.**

## What it does

A static, no-build Tic Tac Toe game against a computer, built against the
published user stories:

1. I can play a game of Tic Tac Toe with the computer.
2. My game will reset as soon as it's over so I can play again
   (the board auto-resets ~1 s after the result, plus a manual "New game").
3. I can choose whether I want to play as X or O.

There are two computer difficulties: **Hard** (minimax, effectively
unbeatable) and **Easy** (random legal move, driven by a seeded PRNG so it
is deterministic under test).

## Tech stack

- Vanilla HTML / CSS / JavaScript — no build step.
- All game rules live in `logic.js`, a UMD module usable in the browser
  (`window.TTT`) and in Node (`require("./logic.js")`): winner/line
  detection, full-board, move generation, game status, a minimax engine,
  and a seeded PRNG. No DOM, no timers — fully unit-testable.

## How to run

Static app — open `index.html`, or:

```bash
python -m http.server 8000   # then open http://localhost:8000
```

## How to test

```bash
node test_local.js
```

17 assertions over the pure logic module: all eight winning lines, no-winner
and draw detection, move generation, game status, the minimax computer
(blocks the human's win, takes its own win, and never loses a solvable
line), deterministic seeded easy mode, and end-state handling. Exits `0`
and prints `PASS` when green; output committed as `local-test.log`.

## Files

| file | role |
|---|---|
| `index.html` | UI |
| `styles.css` | styling |
| `logic.js` | pure, testable game logic (UMD) |
| `app.js` | DOM wiring (grid, mark/difficulty choice, auto-reset) |
| `test_local.js` | Node test runner |

## Licence

MIT © 2026 FiredMosquito831. Written from scratch against the published
user stories; no freeCodeCamp starter or reference-solution code was used.


## Verification

Built and tested locally before publication: **17/17 assertions passing**
(`node test_local.js`). Captured output committed as [`local-test.log`](local-test.log).

Core logic lives in `logic.js (window.TTT)`; the test exercises it in Node without a browser.

## Source

Written from scratch against the project's published freeCodeCamp specification. No freeCodeCamp
starter or reference-solution code was used.
