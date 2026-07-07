import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy {
  // Placeholder implementation (no @nestjs/passport)
  validate(username: string, password: string): any {
    if (username && password) {
      return { userId: 1, username };
    }
    return null;
  }
}
