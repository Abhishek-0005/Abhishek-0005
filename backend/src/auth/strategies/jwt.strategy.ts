import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy {
  // Placeholder implementation (no @nestjs/passport)
  validate(token: string): any {
    if (token === 'dummy-token') {
      return { userId: 1, username: 'dummy' };
    }
    return null;
  }
}
