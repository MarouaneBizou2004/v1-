# Infrastructure

This directory contains Docker assets for local development and deployment of the MasterMyCity platform.

## Services

- **frontend** – React/Vite application served with `npm run preview`.
- **backend** – Express API with Socket.io.
- **mongo** – MongoDB with GridFS storage for media uploads.

## Getting Started

```bash
docker compose up --build
```

Environment variables are loaded from the `.env` files in the respective services. Review `docker-compose.yml` for port mappings and overrides.
