import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateUser(
    username: string,
    password: string,
  ): Promise<{ userId: number; username: string }> {
    // Centralized validation: throw 401 with message when invalid
    if (!username || !password) {
      throw new UnauthorizedException('User is suspicious');
    }
    return { userId: 1, username };
  }

  async login(user: { username: string }) {
    return {
      access_token: 'dummy-token',
      user,
    };
  }
}
