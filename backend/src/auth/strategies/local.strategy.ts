import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy {
  // Placeholder implementation (no @nestjs/passport)
  async validate(
    username: string,
    password: string,
  ): Promise<{ userId: number; username: string }> {
    if (username && password) {
      return { userId: 1, username };
    }
    throw new UnauthorizedException('User is suspicious');
  }
}
