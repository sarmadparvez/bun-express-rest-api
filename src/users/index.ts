import express, { NextFunction, Request, Response } from 'express';
import { createUsersRepository } from './users.repository.ts';
import { appDataSource } from '../data-source.ts';
import { UsersService } from './users.service.ts';
import { CreateUserDto } from './dto/create-user.dto.ts';
import { validateQueryParams, validateRequestBody } from '../validation-middleware.ts';
import { GetUsersDto } from './dto/get-users.dto.ts';
const userRoutes = express.Router();

const usersRepository = createUsersRepository(appDataSource);
const usersService = new UsersService(usersRepository);

userRoutes.get('', validateQueryParams(GetUsersDto), async (req: Request, res: Response, next: NextFunction) => {
  const getUsersDto: GetUsersDto = req.query;
  try {
    const user = await usersService.findAll(getUsersDto);
    res.send(user).status(200);
  } catch (error) {
    next(error);
  }
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
