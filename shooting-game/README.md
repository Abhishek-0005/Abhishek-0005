# Shooting Game (MVP)

A lightweight 2D battle-royale-like shooter inspired by PUBG, built with Vite + React + Canvas.

Features (MVP):
- Responsive fullscreen canvas with DPR scaling; pause on blur, resume on focus
- Player: WASD/Arrow movement with inertia and sprint, mouse aim/shoot, R reload, Space dash
- Bots: wander/pursue/shoot, simple obstacle avoidance; drops medkit on death
- World: square map, rectangular obstacles, shrinking safe zone; random loot (ammo/medkit)
- Combat: raycast bullets, simple hit detection, small knockback
- UI: Start screen (Play), HUD (health, ammo, kills, remaining bots), Pause (P), Restart (Enter when dead)
- Settings: bot count, bot accuracy, audio on/off (WebAudio beeps)
- Performance: fixed timestep with interpolation and offscreen culling

Getting started:
- cd shooting-game
- npm install
- npm run dev

Controls:
- WASD/Arrows: Move
- Shift: Sprint
- Mouse: Aim
- Left mouse: Shoot
- R: Reload
- Space: Dash
- P: Pause/Resume
- Enter: Restart when dead

Tests:
- npm test

Notes:
- Keep assets lightweight (no large binaries). All sfx generated via WebAudio.
