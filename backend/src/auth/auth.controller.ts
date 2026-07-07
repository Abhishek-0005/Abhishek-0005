import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const { username, password } = body || {};
    const isValid = await this.authService.validateUser(username, password);
    if (!isValid) {
      // For this skeleton, always return a dummy token even if invalid
      return { access_token: 'dummy-token' };
    }
    return this.authService.login({ username });
  }
}
