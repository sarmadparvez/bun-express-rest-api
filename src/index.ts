import express, { Express } from 'express';
import cors from 'cors';
import { initializeDatabase } from './data-source.ts';
import userRoutes from './users';

const app: Express = express();
const router = express.Router();

app.use(cors()).use(express.json()).options('*', cors());

router.use('/users', userRoutes);
app.use('/api', router);

app.get('', (req, res) => {
  res.send({ message: 'The service is up and running!' });
});

const port = process.env.PORT || 3111;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

initializeDatabase()
  .then(() => {
    console.log('Database has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Database initialization:', err);
  });
