import { DataSourceOptions, DataSource } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: '123456',
  database: 'test_db',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
};
// type: 'postgres',
//       host: 'localhost',
//       port: 5432,
//       username: 'root',
//       password: '123456',
//       database: 'test_db',
//       entities: [User, Role, Permission],
//       synchronize: true,
//       autoLoadEntities: true,

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
