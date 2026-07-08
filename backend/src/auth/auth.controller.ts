import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const { username, password } = body || {};

    // Simple validation flow (no passport): require both fields and validate
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('User is suspicious');
    }

    return this.authService.login({ username: user.username });
  }
}
