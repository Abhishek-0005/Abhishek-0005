import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateUser(
    username: string,
    password: string,
  ): Promise<{ userId: number; username: string } | null> {
    // Dummy validation: returns a user object if both fields are provided, otherwise null
    if (username && password) {
      return { userId: 1, username };
    }
    return null;
  }

  async login(user: { username: string }) {
    return {
      access_token: 'dummy-token',
      user,
    };
  }
}
