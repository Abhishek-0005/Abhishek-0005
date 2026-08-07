import { LocalStrategy } from './local.strategy';

const authServiceMock: any = {
  validateUser: jest.fn(),
};

describe('LocalStrategy', () => {
  beforeEach(() => jest.clearAllMocks());

  it('throws UnauthorizedException with the exact message when validation fails', async () => {
    authServiceMock.validateUser.mockResolvedValueOnce(null);
    const strategy = new LocalStrategy(authServiceMock);

    await expect(strategy.validate('x@example.com', 'wrong')).rejects.toThrow(
      'Unauthorized',
    );
  });
});
