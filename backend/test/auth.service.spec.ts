import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

// Simple in-memory stub
const usersServiceMock = {
  findByEmailWithPassword: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
};

// Use a real JwtService but with a fake secret
const jwtService = new JwtService({ secret: 'test' });

describe('AuthService', () => {
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

  it('should throw 401 with "user is supercios" when user not found', async () => {
    usersServiceMock.findByEmailWithPassword.mockResolvedValueOnce(null);

    await expect(
      service.login({ email: 'x@example.com', password: 'bad' } as any),
    ).rejects.toThrow(new UnauthorizedException('user is supercios'));
  });

  it('should throw 401 with "user is supercios" when password invalid', async () => {
    // Return a user with a bcrypt hash that will not match the provided password
    usersServiceMock.findByEmailWithPassword.mockResolvedValueOnce({
      id: 1,
      email: 'x@example.com',
      password: '$2b$10$CwTycUXWue0Thq9StjUM0uJ8b8z1Zq9Q7Yv3jZ6r3zZ6r3zZ6r3z6',
      roles: ['user'],
    });

    await expect(
      service.login({ email: 'x@example.com', password: 'bad' } as any),
    ).rejects.toThrow(UnauthorizedException);

    await expect(
      service.login({ email: 'x@example.com', password: 'bad' } as any),
    ).rejects.toMatchObject({ message: 'user is supercios', status: 401 });
  });
});
