# Expense Splitting

Web app to split shared expenses fairly among multiple participants and generate the minimum transactions needed to settle debts.

## Language

- English version (this file).
- Spanish version: [README.es.md](./README.es.md).
- App UI currently available in Spanish.

## Features

- Add and manage participants
- Register expenses (who paid and how much)
- Automatically calculate balances
- Generate minimum transactions to settle all debts

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- TypeScript
- ESLint + Prettier

## Requirements

- Node.js 18+ (recommended)
- npm 9+

## Quick Start

```bash
git clone <repository-url>
cd split-app
npm install
npm run dev
```

Then open the local URL shown in the terminal (usually `http://localhost:5173`).

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build production bundle
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint and auto-fix issues
npm run format       # Format files with Prettier
npm run format:check # Check formatting
```

## How to Use

1. Add participants.
2. Add each expense with:
   - payer
   - amount
   - description/date (if applicable)
3. Review calculated balances.
4. Use the suggested minimum transactions to settle debts efficiently.

## Screenshots

![Screenshot 1](./screenshots/screenshot1.png)
![Screenshot 2](./screenshots/screenshot2.png)

## License

This project is licensed under the [MIT License](./LICENSE).
