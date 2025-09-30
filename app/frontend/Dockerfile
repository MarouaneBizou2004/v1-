FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm install || yarn install || pnpm install
COPY . .
RUN npm run build || yarn build || pnpm build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
