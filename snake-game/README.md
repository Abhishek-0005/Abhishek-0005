# Snake Game (Vite + React)

A classic Snake game implemented with React and Vite. Now fullscreen and nature-themed, with optional AI opponents.

## What’s new
- Fullscreen, responsive board that adapts rows/columns to your viewport. Logical tile size about 20px.
- Multiple computer-controlled snakes (0..5). Default 3. Shared food; player gains score only on player consumption.
- AI snakes greedily chase the nearest food using a safe-step heuristic that avoids immediate collisions and obeys the no‑reverse rule. When an AI hits a wall/body it dies and respawns after a short delay.
- Visual polish: animated, lightweight nature gradient background; rounded snakes with subtle shading and expressive heads; distinct colors per AI.
- Mouse mode preserved with Boost (LMB) and Brake (RMB). Toggle Mouse in the UI; context menu suppressed on the board.

## Features
- Keyboard: Arrow keys and WASD; Space/Enter to pause/resume; restart on game over
- Mouse control (default: enabled):
  - Move mouse to steer continuously toward the cursor
  - Left click and hold: Boost (temporary speed up)
  - Right click and hold: Brake (temporary slow down)
  - Context menu is disabled over the board while interacting
  - Toggle Mouse: On/Off button in the scoreboard
- On-screen mobile controls
- Score + High score (stored in localStorage)
- Growth on eat and speed increases every few foods
- Game over overlay for wall/self/any-body collisions (player)
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
- Slider: choose the number of AI snakes (0..5)

## AI rules
- AI snakes seek the nearest food.
- Immediate-collision avoidance: they prefer safe steps based on next-cell occupancy (walls, bodies) and won’t reverse.
- If an AI collides with a wall, itself, the player, or other AI, it dies and respawns at a safe random position and direction shortly after.
- Food is shared: any snake that reaches the food grows; new food appears. Only the player’s score increases when the player eats.

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
    ai.test.js
```

## Notes
- The board background uses lightweight CSS gradients and animations for a nature feel without image assets; it’s highly performant.
- The snake is rendered via CSS rounded cells with subtle shading and eye markers on the head for a more “alive” look. AI snakes have distinct colors.
- The board scales to fill your screen; rows/cols are computed from the viewport with a logical tile of ~20px.
