FROM node:20-slim AS build
WORKDIR /app
COPY package*.json .
RUN npm install --frozen-lockfile --quiet
COPY . .
RUN DEBUG=vite:* TAILWIND_MODE=build npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]