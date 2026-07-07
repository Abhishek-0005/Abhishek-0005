import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';

const isProd = process.env.NODE_ENV === 'production';
const ssl = (process.env.DB_SSL || 'false').toLowerCase() === 'true';
const logging = (process.env.DB_LOGGING || 'false').toLowerCase() === 'true';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: false,
  logging,
  ssl: ssl ? { rejectUnauthorized: false } : false,
  migrations: ['src/database/migrations/*{.ts,.js}'],
});
