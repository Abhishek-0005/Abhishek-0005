import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

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

  it('should throw 401 with "Unauthorized" when user not found', async () => {
    usersServiceMock.findByEmailWithPassword.mockResolvedValueOnce(null);

    await expect(
      service.login({ email: 'x@example.com', password: 'bad' } as any),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw 401 with "Unauthorized" when password invalid', async () => {
    usersServiceMock.findByEmailWithPassword.mockResolvedValueOnce({
      id: 1,
      email: 'x@example.com',
      password: 'hashed',
      roles: ['user'],
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as any);

    await expect(
      service.login({ email: 'x@example.com', password: 'bad' } as any),
    ).rejects.toThrow('Unauthorized');
  });
});
