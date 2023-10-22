# Backend Engineer Work Sample

To install dependencies:

```bash
bun install
```

To run:

```bash
bun start
```

To test:

```bash
bun test
```

To test and generate code coverage:

```bash
bun test --coverage
```

This project was created using `bun init` in bun v1.0.7. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Goal

1. Adjust POST /users that it accepts a user and stores it in a database.
   - The user should have a unique id, a name, a unique email address and a creation date
2. Adjust GET /users that it returns (all) users from the database.
   - This endpoint should be able to receive a query parameter `created` which sorts users by creation date ascending or descending.

Feel free to add or change this project as you like.
