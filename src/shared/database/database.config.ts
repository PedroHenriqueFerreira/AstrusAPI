import { DataSource, DataSourceOptions } from 'typeorm';
import { resolve } from 'path';
import { config } from 'dotenv';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [resolve(__dirname, '..', '..', '**', '*.entity.{ts,js}')],
  migrations: [resolve(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: process.env.DATABASE_SYNC === 'true',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
