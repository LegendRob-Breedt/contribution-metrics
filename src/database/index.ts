import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from '../config/index.js';
import { GitHubOrganization, User, GitHubContributor } from '../entities/index.js';

let dataSource: DataSource | null = null;

export const createAppDataSource = async () => {
  if (dataSource) {
    return dataSource;
  }

  const appConfig = await config;

  dataSource = new DataSource({
    type: 'postgres',
    host: appConfig.DB_HOST,
    port: appConfig.DB_PORT,
    username: appConfig.DB_USERNAME,
    password: appConfig.DB_PASSWORD,
    database: appConfig.DB_DATABASE,
    synchronize: appConfig.NODE_ENV === 'development',
    logging: appConfig.NODE_ENV === 'development',
    entities: [GitHubOrganization, User, GitHubContributor],
    migrations: ['src/migrations/*.ts'],
    subscribers: ['src/subscribers/*.ts'],
  });

  return dataSource;
};

// For backward compatibility - but this should be initialized lazily
export let AppDataSource: DataSource;
