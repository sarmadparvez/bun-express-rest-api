import express, { Request, Response } from 'express';
import { createUsersRepository } from './users.repository.ts';
import { appDataSource } from '../data-source.ts';
import { UsersService } from './users.service.ts';
import { CreateUserDto } from './create-user.dto.ts';
import { validateRequestBody } from '../validation-middleware.ts';

const userRoutes = express.Router();

const usersRepository = createUsersRepository(appDataSource);
const usersService = new UsersService(usersRepository);

userRoutes.get('', (req: Request, res: Response) => {
  res.send([]).status(200);
});

userRoutes.post('', validateRequestBody(CreateUserDto), async (req: Request, res: Response) => {
  const userDTO: CreateUserDto = req.body;
  console.log('userDTO', userDTO);
  res.send({}).status(201);
});

export default userRoutes;
