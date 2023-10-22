FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 3111

CMD ["bun", "start:dev"]