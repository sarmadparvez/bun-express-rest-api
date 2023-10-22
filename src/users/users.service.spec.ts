import { beforeEach, describe, expect, it, jest, spyOn } from 'bun:test';
import { UsersService } from './users.service.ts';
import { IUserRepository } from './users.repository.ts';
import { User } from './entities/user.entity.ts';
import { GetUsersDto, SortDirection } from './dto/get-users.dto.ts';
import createError from 'http-errors';

class MockUserRepository implements IUserRepository {
  public findAll = jest.fn();
  public create = jest.fn();
}

const createTestUser = (): User => {
  return new User({
    id: '123',
    name: 'test',
    email: 'maxmustermann@gmail.com',
    createdAt: new Date(),
  });
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: IUserRepository;

  beforeEach(() => {
    repository = new MockUserRepository();
    service = new UsersService(repository);
  });

  describe('findAll', () => {
    it('should find all users when no filter is passed', async () => {
      const user = createTestUser();

      const findMock = spyOn(repository, 'findAll').mockResolvedValue([user]);

      const users = await service.findAll();

      expect(findMock).toHaveBeenCalled();
      expect(users).toEqual([user]);
    });

    it('should find users based on skip and limit parameters', async () => {
      const user = createTestUser();

      const findMock = spyOn(repository, 'findAll').mockResolvedValue([user]);
      const query: GetUsersDto = {
        skip: 10,
        limit: 20,
      };

      const users = await service.findAll(query);

      expect(findMock.mock.calls[0]).toEqual([
        {
          skip: query.skip,
          limit: query.limit,
        },
      ]);
      expect(users).toEqual([user]);
    });

    it('should find users ordering by creation time', async () => {
      const user = createTestUser();

      const findMock = spyOn(repository, 'findAll').mockResolvedValue([user]);
      const query: GetUsersDto = {
        created: SortDirection.ASC,
      };

      const users = await service.findAll(query);

      expect(findMock.mock.calls[0]).toEqual([
        {
          skip: query.skip,
          limit: query.limit,
          orderBy: {
            createdAt: query.created,
          },
        },
      ]);
      expect(users).toEqual([user]);
    });

    it('should throw error when fetching users fail', async () => {
      spyOn(repository, 'findAll').mockRejectedValue(new Error());
      expect(async () => service.findAll()).toThrow(Error);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const user = createTestUser();
      const createMock = spyOn(repository, 'create').mockResolvedValue(user);
      const result = await service.create({ name: user.name, email: user.email });
      expect(createMock.mock.calls[0]).toEqual([user.name, user.email]);
      expect(result).toEqual(user);
    });

    it('should throw BadRequest exception when BadRequest exception is thrown by repository', async () => {
      spyOn(repository, 'create').mockRejectedValue(createError.BadRequest());

      expect(async () =>
        service.create({
          name: 'test',
          email: 'test@test.com',
        }),
      ).toThrow(createError.BadRequest());
    });

    it('should throw InternalServerError exception when another exception is thrown by repository', async () => {
      spyOn(repository, 'create').mockRejectedValue(new Error('Some database error'));

      expect(async () =>
        service.create({
          name: 'test',
          email: 'test@test.com',
        }),
      ).toThrow('Failed to create user.');
    });
  });
});
