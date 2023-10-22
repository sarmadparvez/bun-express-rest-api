import { IUserRepository } from './users.repository.ts';
import { User } from './user.entity.ts';
import { CreateUserDto } from './create-user.dto.ts';
import createError, { BadRequest } from 'http-errors';

export class UsersService {
  private static instance: UsersService;

  constructor(private readonly userRepository: IUserRepository) {}

  async findAll(): Promise<Array<User>> {
    return this.userRepository.find();
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
