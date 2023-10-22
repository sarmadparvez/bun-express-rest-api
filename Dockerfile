FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install

# ARG PORT

EXPOSE 3111

CMD ["bun", "start:dev"]