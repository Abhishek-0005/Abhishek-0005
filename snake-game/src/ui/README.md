# Snake Game (Vite + React)

Controls
- Arrow Left/Right: Turn
- Space: Pause/Resume
- R: Reset
- Mouse: Hold Left to speed up, hold Right to brake (context menu disabled on the board)

Settings
- Toggle AI snake (default on)
- Board size and speed sliders
- Light/Dark theme

AI
- Greedy Manhattan towards food when safe
- Avoids immediate collisions with walls or snakes; falls back to first safe alternative
- If AI dies (wall/self/player), it respawns after a short delay and does not affect player score

Run
- npm install
- npm run dev
- npm test (Vitest)

Build
- npm run build
- npm run preview
