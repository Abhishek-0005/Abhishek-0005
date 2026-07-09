# Snake Game (Vite + React)

A classic Snake game implemented with React and Vite. Keyboard controls (Arrow keys / WASD), mobile-friendly on-screen D‑pad, score with high score persistence, pause/resume, restart, and progressive speed increases.

## Features
- 20x20 grid with visible cells
- Arrow keys and WASD controls; Space/Enter to pause/resume or restart when game over
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

Build for production and preview:

```bash
npm run build
npm run preview
```

You can also host the built files from a sub-path thanks to `vite.config.js` setting `base: './'`.

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

## Screenshots

- Board, score, and controls (placeholder)
