import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigFactory } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/user.entity';

const databaseConfig: ConfigFactory<TypeOrmModuleOptions> = () => () => {
  const isProd = process.env.NODE_ENV === 'production';
  const ssl = (process.env.DB_SSL || 'false').toLowerCase() === 'true';
  const logging = (process.env.DB_LOGGING || 'false').toLowerCase() === 'true';

  const options: DataSourceOptions = {
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
  };
  return options as TypeOrmModuleOptions;
};

export default databaseConfig;

// Helper DataSource for CLI migrations (ts-node)
export const AppDataSource = new DataSource((databaseConfig()() as unknown) as DataSourceOptions);
