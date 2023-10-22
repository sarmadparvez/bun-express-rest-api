import { User } from './entities/user.entity';
import { beforeEach, describe, expect, it, jest, spyOn } from 'bun:test';
import { createUsersRepository, DEFAULT_LIMIT, FindAllOptions, IUserRepository, UsersRepository } from './users.repository';
import { DataSource, Repository } from 'typeorm';
import { SortDirection } from './dto/get-users.dto';

class MockRepository {
  public find = jest.fn();
  public save = jest.fn();
}

describe('UsersRepository', () => {
  let repository: Repository<User>;
  let usersRepository: IUserRepository;

  beforeEach(() => {
    repository = new MockRepository() as unknown as Repository<User>;
    usersRepository = new UsersRepository(repository);
  });

  describe('findAll', () => {
    it('should find all users when no filter is passed', async () => {
      const findMock = spyOn(repository, 'find');

      await usersRepository.findAll();

      expect(findMock.mock.calls[0]).toEqual([
        {
          take: DEFAULT_LIMIT,
        },
      ]);
    });

    it('should find users based on skip and limit parameters', async () => {
      const options: FindAllOptions = { skip: 10, limit: 20 };
      const findMock = spyOn(repository, 'find');

      await usersRepository.findAll(options);

      expect(findMock.mock.calls[0]).toEqual([
        {
          skip: 10,
          take: 20,
        },
      ]);
    });

    it('should order by id when order by is createdAt', async () => {
      const options: FindAllOptions = { orderBy: { createdAt: SortDirection.DESC } };
      const findMock = spyOn(repository, 'find');

      await usersRepository.findAll(options);

      expect(findMock.mock.calls[0]).toEqual([
        {
          skip: undefined,
          take: DEFAULT_LIMIT,
          order: { id: SortDirection.DESC },
        },
      ]);
    });

    describe('create', () => {
      it('should call the save method and return the created user', async () => {
        const name = 'Max Mustermann';
        const email = 'maxmustermann@example.com';
        const user = new User({ id: 'uuid', name, email });

        const saveSpy = spyOn(repository, 'save').mockResolvedValue(user);

        const result = await usersRepository.create(name, email);

        expect(saveSpy).toHaveBeenCalled();
        expect(result.name).toEqual(name);
        expect(result.email).toEqual(email);
        expect(result.id).toBeString();
      });
    });
    it('should throw a BadRequest error for duplicate email', async () => {
      const name = 'Max Mustermann';
      const email = 'duplicate@gmail.com';

      spyOn(repository, 'save').mockRejectedValue({ code: '23505' });

      expect(async () => usersRepository.create(name, email)).toThrow('User already exists. Please use a different email address.');
    });
    it('should throw an error for other database errors', async () => {
      const name = 'John Doe';
      const email = 'johndoe@example.com';
      const errorMessage = 'Some database error';

      spyOn(repository, 'save').mockRejectedValue(new Error(errorMessage));

      expect(async () => usersRepository.create(name, email)).toThrow(errorMessage);
    });
  });
});

describe('createUserRepository', () => {
  it('should return a new instance of UsersRepository', () => {
    const result = createUsersRepository(new DataSource({ type: 'postgres' }));
    expect(result).toBeInstanceOf(UsersRepository);
  });
});
