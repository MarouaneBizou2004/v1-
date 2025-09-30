# MasterMyCity Chatbot

This monorepo contains the **MasterMyCity** chatbot platform, built with a MERN architecture and TypeScript on both the frontend and backend. It enables residents to report city issues, chat with the municipal bot, and receive multilingual support in English, French, and Arabic.

## Repository Layout

```
/app
  /frontend    # React + Vite client
  /backend     # Express + MongoDB server
  /infra       # Docker and deployment assets
```

## Getting Started

Install dependencies with npm workspaces:

```bash
npm install
```

Useful commands:

- `npm run dev -w app/backend` – start the API locally.
- `npm run dev -w app/frontend` – start the React client.
- `npm run lint` – lint all packages.
- `npm run test` – run backend (Jest) and frontend (Vitest) unit tests.

Refer to the `README` files inside each package for detailed instructions on development, testing, and deployment.
