import { User } from './user.entity.ts';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import uuid from 'uuid-with-v6';
import createError from 'http-errors';
import { SortDirection } from './get-users.dto.ts';
export interface IUserRepository {
  findAll(options: FindAllOptions): Promise<Array<User>>;
  create(name: string, email: string): Promise<User>;
}

export interface FindAllOptions {
  skip?: number;
  limit?: number;
  orderBy?: {
    createdAt?: SortDirection;
  };
}

const DEFAULT_LIMIT = 100;

export class UsersRepository implements IUserRepository {
  constructor(private readonly repository: Repository<User>) {}
  async findAll(options: FindAllOptions): Promise<Array<User>> {
    const { skip, limit: inputLimit, orderBy } = options;

    const limit: number = inputLimit === undefined ? DEFAULT_LIMIT : inputLimit;

    const findOptions: FindManyOptions<User> = {
      skip,
      take: limit,
    };
    const createdAt = orderBy?.createdAt;
    if (createdAt) {
      // uuid v6 is timestamp based. Ordering on it is faster as the data is already sorted in index.
      findOptions.order = {
        id: createdAt,
      };
    }

    return this.repository.find(findOptions);
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
