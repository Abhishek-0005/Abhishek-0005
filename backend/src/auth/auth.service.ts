import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateUser(username: string, password: string): Promise<boolean> {
    // Dummy validation: true if both fields are provided
    return Boolean(username && password);
  }

  async login(user: { username: string }) {
    return {
      access_token: 'dummy-token',
      user,
    };
  }
}
