import express, { NextFunction, Request, Response } from 'express';
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

userRoutes.post('', validateRequestBody(CreateUserDto), async (req: Request, res: Response, next: NextFunction) => {
  const userDTO: CreateUserDto = req.body;
  try {
    const user = await usersService.create(userDTO);
    res.send(user).status(201);
  } catch (error) {
    next(error);
  }
});

export default userRoutes;
