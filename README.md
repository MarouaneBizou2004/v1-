# MasterMyCity Chatbot

MasterMyCity is a MERN-based platform that allows citizens to report issues in their city through a multilingual chatbot experience. This repository contains a monorepo with the frontend (React + Vite) and backend (Express + TypeScript) applications as well as infrastructure tooling.

## Project Structure

```
/app
  /backend      # Express API with MongoDB, JWT auth and Socket.io
  /frontend     # React client with chat & report flows, i18n support
/infra          # Deployment utilities (Docker compose, etc.)
```

## Features

- 🔐 JWT authentication with refresh tokens
- 💬 Chat-based incident reporting with multilingual support (EN/FR/AR)
- 🗺️ Guided report wizard with location and image uploads
- ⚙️ Socket.io real-time notifications for new reports
- 🧪 Automated tests with Jest (backend) and Vitest (frontend)
- 🐳 Docker-based local development

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm, npm or yarn
- Docker (for containerized setup)

### Environment Variables

Copy `.env.example` files from the frontend and backend directories and adjust values as needed.

```
cp app/backend/.env.example app/backend/.env
cp app/frontend/.env.example app/frontend/.env
```

### Install Dependencies

Run the following commands from the repository root:

```
cd app/backend && npm install
cd ../frontend && npm install
```

### Local Development

Start the backend API:

```
npm run dev
```

(in `app/backend` directory)

Start the frontend client:

```
npm run dev
```

(in `app/frontend` directory)

### Docker Compose

Use the provided Docker Compose file for an end-to-end environment:

```
cd infra
docker compose up --build
```

### Tests

Run backend tests:

```
cd app/backend
npm run test
```

Run frontend tests:

```
cd app/frontend
npm run test
```

## License

MIT
