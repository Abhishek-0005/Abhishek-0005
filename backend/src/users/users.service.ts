import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: 1, email: 'alice@example.com', name: 'Alice', password: 'secret' },
    { id: 2, email: 'bob@example.com', name: 'Bob', password: 'secret' },
  ];

  findAll(): Omit<User, 'password'>[] {
    return this.users.map(({ password, ...rest }) => rest);
  }
}
