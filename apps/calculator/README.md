# React Calculator

A lightweight calculator built with React + Vite.

Features:
- +, −, ×, ÷
- Parentheses and operator precedence
- Unary minus, decimals
- Keyboard support (0–9 . + - * / ( )  Enter  =  Backspace  Esc)
- Error messages (divide by zero, mismatched parentheses, invalid input)

## Scripts

From repo root (workspaces configured):
- npm run dev — start dev server for the calculator
- npm run build — build the app
- npm run preview — preview the build
- npm test — run unit tests (Vitest)

Or inside apps/calculator:
- npm run dev | build | preview | test

## Run locally

- npm install (on first run; CI prepares lockfile automatically)
- npm run dev
- Open http://localhost:5173

## Build

- npm run build
- Static files in apps/calculator/dist

## Tests

- npm test
