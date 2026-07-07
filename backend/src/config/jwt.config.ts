import { ConfigFactory } from '@nestjs/config';

const jwtConfig: ConfigFactory = () => () => ({
  secret: process.env.JWT_SECRET || 'change-me',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
  },
});

export default jwtConfig;
