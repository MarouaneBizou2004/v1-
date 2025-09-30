# MasterMyCity Backend

TypeScript Express API powering the MasterMyCity chatbot and issue reporting experience.

## Scripts

- `npm run dev` – start the development server with hot reload.
- `npm run build` – compile TypeScript to JavaScript.
- `npm test` – execute Jest tests.
- `npm run lint` – run ESLint.

## Environment

Create a `.env` file with:

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/mastermycity
JWT_SECRET=change-me-please-ensure-length
CLIENT_ORIGIN=http://localhost:5173
```

## API Overview

- `POST /api/auth/register` – register a citizen account.
- `POST /api/auth/login` – obtain access and refresh tokens.
- `POST /api/auth/refresh` – refresh tokens.
- `POST /api/chat/session` – create a chat session.
- `POST /api/chat/message` – send a chat message.
- `GET /api/chat/history/:sessionId` – fetch chat history.
- `POST /api/reports` – submit an issue (JWT required).
- `GET /api/reports` – list issues (JWT required).
- `PATCH /api/reports/:id` – update issue status (staff/admin).

Socket.io namespace `/reports` broadcasts `report:created` events.
