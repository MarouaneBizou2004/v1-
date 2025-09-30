# Infrastructure

This folder contains container orchestration resources for MasterMyCity.

## Docker Compose

The `docker-compose.yml` file spins up the following services:

- **mongo** – MongoDB database with persistent volume
- **backend** – Express API configured for hot reload during development
- **frontend** – React client served via Vite dev server

### Usage

```
docker compose up --build
```

The frontend is available at `http://localhost:5173` and the backend API at `http://localhost:4000`.
