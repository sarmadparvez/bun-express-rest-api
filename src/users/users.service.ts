import { FindAllOptions, IUserRepository } from './users.repository.ts';
import { User } from './user.entity.ts';
import { CreateUserDto } from './create-user.dto.ts';
import createError, { BadRequest } from 'http-errors';
import { GetUsersDto } from './get-users.dto.ts';

export class UsersService {
  constructor(private readonly userRepository: IUserRepository) {}

  async findAll(dto: GetUsersDto): Promise<Array<User>> {
    const { skip, limit, created } = dto;

    const query: FindAllOptions = {
      skip,
      limit,
      orderBy: {
        createdAt: created,
      },
    };

    return this.userRepository.findAll(query);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const { name, email } = dto;
    try {
      return this.userRepository.create(name, email);
    } catch (error) {
      if (error instanceof BadRequest) {
        throw error;
      }
      throw createError.InternalServerError('Failed to create user.');
    }
  }
}
