import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { initializeDatabase } from './data-source.ts';
import userRoutes from './users';
import { HttpError } from 'http-errors';

const app: Express = express();
const router = express.Router();

app.use(cors()).use(express.json()).options('*', cors());

initializeDatabase()
  .then(() => {
    console.log('Database has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Database initialization:', err);
  });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (error: HttpError, request: Request, response: Response, next: NextFunction) => {
  const message = error.message || 'Internal Server Error';
  const status = error.status || 500;
  console.error(`error: ${message}`);
  response.status(status).send({
    status,
    message,
  });
};

router.use('/users', userRoutes);
app.use('/api', router);
app.get('', (req, res) => {
  res.send({ message: 'The service is up and running!' });
});
app.use(errorHandler);

const port = process.env.PORT || 3111;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
