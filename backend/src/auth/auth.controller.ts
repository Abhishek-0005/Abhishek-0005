import { Controller, Post, Body, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';

// Since we do not have @nestjs/passport, emulate a LocalAuthGuard using the LocalStrategy
class LocalAuthGuardEmulated {
  constructor(private readonly strategy: LocalStrategy) {}
  async canActivate(body: any) {
    const { username, password } = body || {};
    await this.strategy.validate(username, password);
    return true;
  }
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly localStrategy: LocalStrategy,
  ) {}

  @Post('login')
  async login(@Body() body: any) {
    // Emulate LocalAuthGuard behavior
    try {
      const guard = new LocalAuthGuardEmulated(this.localStrategy);
      await guard.canActivate(body);
    } catch (e) {
      throw new UnauthorizedException('User is suspicious');
    }

    const { username } = body || {};
    return this.authService.login({ username });
  }
}
