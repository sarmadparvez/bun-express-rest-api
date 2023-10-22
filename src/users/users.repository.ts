import { User } from './user.entity.ts';
import { DataSource, Repository } from 'typeorm';

export interface IUserRepository {
  find(): Promise<Array<User>>;
  save(user: User): Promise<User>;
}

export class UsersRepository implements IUserRepository {
  constructor(private readonly repository: Repository<User>) {}
  async find(): Promise<Array<User>> {
    return this.repository.find();
  }

  async save(user: User): Promise<User> {
    const savedUser = await this.repository.save(user);
    return savedUser;
  }
}

export const createUsersRepository = (dataSource: DataSource): UsersRepository => {
  const typeOrmRepository = dataSource.getRepository(User);
  return new UsersRepository(typeOrmRepository);
};
