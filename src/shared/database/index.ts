import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from '../config/index.js';
import { GitHubOrganizationEntity } from '../../adaptors/db/github-organization/entities/github-organization.entity.js';
import { UserEntity } from '../../adaptors/db/user/entities/user.entity.js';
import { GitHubContributorEntity } from '../../adaptors/db/github-contributor/entities/github-contributor.entity.js';

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
    entities: [GitHubOrganizationEntity, UserEntity, GitHubContributorEntity],
    migrations: ['src/migrations/*.ts'],
    subscribers: ['src/subscribers/*.ts'],
  });

  return dataSource;
};

// For backward compatibility - but this should be initialized lazily
export let AppDataSource: DataSource;
