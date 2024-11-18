import 'reflect-metadata'; // Required for TypeORM
import { DataSource } from 'typeorm';
import { Admin } from './Entity/Admin';

export const AppDataSource = new DataSource({
  type: 'postgres', // Database type (PostgreSQL)
  host: 'localhost',
  port: 5432, // Default PostgreSQL port
  username: 'postgre', // Database username
  password: 'root0909', // Database password
  database: 'books', // Database name
  synchronize: true, // Automatically sync entities (useful in dev)
  logging: true, // Enable logging
  entities: [Admin], // List of entities
  migrations: [],
  subscribers: [],
});

