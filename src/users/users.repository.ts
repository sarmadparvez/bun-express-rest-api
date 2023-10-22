import { User } from './user.entity.ts';
import { DataSource, Repository } from 'typeorm';
import uuid from 'uuid-with-v6';
import createError from 'http-errors';
export interface IUserRepository {
  find(): Promise<Array<User>>;
  create(name: string, email: string): Promise<User>;
}

export class UsersRepository implements IUserRepository {
  constructor(private readonly repository: Repository<User>) {}
  async find(): Promise<Array<User>> {
    return this.repository.find();
  }

  async create(name: string, email: string): Promise<User> {
    const user = new User({
      id: uuid.v6(),
      name,
      email,
    });
    try {
      return await this.repository.save(user);
    } catch (error: any) {
      if (error.code === '23505') {
        throw createError.BadRequest('User already exists. Please use a different email address.');
      }
      throw error;
    }
  }
}

export const createUsersRepository = (dataSource: DataSource): UsersRepository => {
  const typeOrmRepository = dataSource.getRepository(User);
  return new UsersRepository(typeOrmRepository);
};
