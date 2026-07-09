# Snake Game (Vite + React)

A classic Snake game implemented with React and Vite. Keyboard controls (Arrow keys / WASD), mouse steering with boost/brake, mobile-friendly on-screen D‑pad, score with high score persistence, pause/resume, restart, and progressive speed increases.

## Features
- 20x20 grid with visible cells
- Keyboard: Arrow keys and WASD; Space/Enter to pause/resume; restart on game over
- Mouse control (default: enabled):
  - Move mouse to steer continuously toward the cursor
  - Left click and hold: Boost (temporary speed up)
  - Right click and hold: Brake (temporary slow down)
  - Context menu is disabled over the board while interacting
  - Toggle Mouse: On/Off button in the scoreboard
- On-screen mobile controls
- Score + High score (stored in localStorage)
- Food spawns never on the snake body
- Growth on eat and speed increases every few foods
- Game over overlay for wall/self collisions
- Responsive layout, light/dark theme via prefers-color-scheme
- Accessible buttons with aria-labels and focus styles

## Getting started

Prereqs: Node 18+ and npm

Install and run dev server:

```bash
cd snake-game
npm install
npm run dev
```

Run unit tests (Vitest):

```bash
npm test
```

Build for production and preview:

```bash
npm run build
npm run preview
```

You can also host the built files from a sub-path thanks to `vite.config.js` setting `base: './'`.

## Controls
- Arrows/WASD: change direction (keyboard mode or as fallback)
- Mouse: steer toward cursor (default enabled)
- Left mouse: hold to Boost
- Right mouse: hold to Brake
- Toggle Mouse: On/Off in the scoreboard
- Space/Enter: pause/resume (or restart when game over)

## Project structure
```
snake-game/
  index.html
  vite.config.js
  package.json
  src/
    App.jsx
    main.jsx
    styles.css
    components/
      Board.jsx
      Controls.jsx
      Scoreboard.jsx
    hooks/
      useInterval.js
      useEventListener.js
    utils/
      game.js
  tests/
    game.test.js
```

## Notes
- The board background uses lightweight CSS gradients and patterns for a game-like feel without image assets.
- The snake is rendered via CSS rounded cells with subtle shading and eye markers on the head for a more “alive” look.
