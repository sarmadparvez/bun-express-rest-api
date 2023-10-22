import { FindAllOptions, IUserRepository } from './users.repository.ts';
import { User } from './entities/user.entity.ts';
import { CreateUserDto } from './dto/create-user.dto.ts';
import createError, { BadRequest } from 'http-errors';
import { GetUsersDto } from './dto/get-users.dto.ts';

export class UsersService {
  constructor(private readonly userRepository: IUserRepository) {}

  async findAll(dto?: GetUsersDto): Promise<Array<User>> {
    const { skip, limit, created } = dto || {};

    const query: FindAllOptions = {
      skip,
      limit,
    };

    if (created) {
      query.orderBy = {
        createdAt: created,
      };
    }
    try {
      return await this.userRepository.findAll(query);
    } catch (error) {
      throw createError.InternalServerError('Failed to get users.');
    }
  }

  async create(dto: CreateUserDto): Promise<User> {
    const { name, email } = dto;
    try {
      return await this.userRepository.create(name, email);
    } catch (error) {
      if (error instanceof BadRequest) {
        throw error;
      }
      throw createError.InternalServerError('Failed to create user.');
    }
  }
}
