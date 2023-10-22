import { IUserRepository } from './users.repository.ts';
import { User } from './user.entity.ts';
import { CreateUserDto } from './create-user.dto.ts';

export class UsersService {
  private static instance: UsersService;

  constructor(private readonly userRepository: IUserRepository) {}

  async findAll(): Promise<Array<User>> {
    return this.userRepository.find();
  }

  async create(dto: CreateUserDto): Promise<User> {
    const { name, email } = dto;
    const user = new User({ name, email });
    return this.userRepository.save(user);
  }
}
