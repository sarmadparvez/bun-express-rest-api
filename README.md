# Bun Express

This project was created using `bun init` in bun v1.0.7. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Description

1. POST `/users` endpoint accepts a user and stores it in a database.
   - The user have a unique id, a name, a unique email address and a creation date.
   - Sample request body:
     ```json
     {
       "name": "John Doe",
       "email": "john-doe@example.com"
     }
     ```
2. GET `/users` endpoint that it returns (all) users from the database.
   - Query Parameters:
     - `created` Sort users by creation date ascending or descending.
       - possible values: `asc` or `desc`.
     - `skip` Skip the first `n` users.
       - possible values: any positive integer.
     - `limit` Limit the number of users returned to `n`.
       - possible values: any positive integer.
   - Sample request: `<base url>/api/users?created=desc&skip=2&limit=4`

## Running in docker

```bash
docker compose up
```

Access the API at http://localhost:4112/api/users

## Running locally

### Prerequisites

Install bun:

```bash
curl -fsSL https://bun.sh/install | bash
```

Start PostgreSQL database in docker:

```bash
docker compose up postgres -d
```

### Local development

Install dependencies:

```bash
bun install
```

To run:

```bash
bun start
```

To run in watch mode:

```bash
bun start:dev
```

Access the API at http://localhost:4111/api/users

## Run unit tests

To test:

```bash
bun test
```

To test and generate code coverage:

```bash
bun test --coverage
```
