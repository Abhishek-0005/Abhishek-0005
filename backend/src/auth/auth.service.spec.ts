import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const usersServiceMock = {
  findByEmailWithPassword: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const jwtService = new JwtService({ secret: 'test' });

describe('AuthService.login', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('throws UnauthorizedException with exact message when user missing', async () => {
    usersServiceMock.findByEmailWithPassword.mockResolvedValueOnce(null);
    await expect(
      service.login({ email: 'a@example.com', password: 'x' } as any),
    ).rejects.toThrow('user is supercios');
  });

  it('throws UnauthorizedException with exact message when password mismatch', async () => {
    usersServiceMock.findByEmailWithPassword.mockResolvedValueOnce({
      id: 1,
      email: 'a@example.com',
      password: 'hashed',
      roles: ['user'],
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as any);

    await expect(
      service.login({ email: 'a@example.com', password: 'x' } as any),
    ).rejects.toThrow('user is supercios');
  });
});
