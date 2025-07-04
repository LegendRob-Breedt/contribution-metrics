import { asClass, asValue, createContainer, InjectionMode } from 'awilix';
import type { DataSource } from 'typeorm';
import { GitHubOrganizationServiceImpl } from '../../modules/github-organization/application/github-organization.service.js';
import { GitHubOrganizationRepositoryImpl } from '../../adaptors/db/github-organization/repositories/github-organization.repository.js';
import { GitHubOrganizationEntity } from '../../adaptors/db/github-organization/entities/github-organization.entity.js';
import { UserServiceImpl } from '../../modules/user/application/user.service.js';
import { UserRepositoryImpl } from '../../adaptors/db/user/repositories/user.repository.js';
import { UserEntity } from '../../adaptors/db/user/entities/user.entity.js';
import { GitHubContributorServiceImpl } from '../../modules/github-contributor/application/github-contributor.service.js';
import { GitHubContributorRepositoryImpl } from '../../adaptors/db/github-contributor/repositories/github-contributor.repository.js';
import { GitHubContributorEntity } from '../../adaptors/db/github-contributor/entities/github-contributor.entity.js';

export interface Container {
  dataSource: DataSource;
  gitHubOrganizationService: GitHubOrganizationServiceImpl;
  gitHubOrganizationRepository: GitHubOrganizationRepositoryImpl;
  userService: UserServiceImpl;
  userRepository: UserRepositoryImpl;
  gitHubContributorService: GitHubContributorServiceImpl;
  gitHubContributorRepository: GitHubContributorRepositoryImpl;
}

export function createAppContainer(dataSource: DataSource) {
  const container = createContainer<Container>({
    injectionMode: InjectionMode.CLASSIC,
  });

  // Register shared dependencies
  container.register({
    dataSource: asValue(dataSource),
  });

  // Register modules
  registerGitHubOrganizationModule(container, dataSource);
  registerUserModule(container, dataSource);
  registerGitHubContributorModule(container, dataSource);

  return container;
}

export function registerGitHubOrganizationModule(
  container: ReturnType<typeof createContainer<Container>>,
  dataSource: DataSource
) {
  const gitHubOrganizationRepository = dataSource.getRepository(GitHubOrganizationEntity);

  container.register({
    gitHubOrganizationRepository: asValue(
      new GitHubOrganizationRepositoryImpl(gitHubOrganizationRepository)
    ),
    gitHubOrganizationService: asClass(GitHubOrganizationServiceImpl).classic(),
  });

  return container;
}

export function registerUserModule(
  container: ReturnType<typeof createContainer<Container>>,
  dataSource: DataSource
) {
  const userRepository = dataSource.getRepository(UserEntity);

  container.register({
    userRepository: asValue(new UserRepositoryImpl(userRepository)),
    userService: asClass(UserServiceImpl).classic(),
  });

  return container;
}

export function registerGitHubContributorModule(
  container: ReturnType<typeof createContainer<Container>>,
  dataSource: DataSource
) {
  const gitHubContributorRepository = dataSource.getRepository(GitHubContributorEntity);

  container.register({
    gitHubContributorRepository: asValue(
      new GitHubContributorRepositoryImpl(gitHubContributorRepository)
    ),
    gitHubContributorService: asClass(GitHubContributorServiceImpl).classic(),
  });

  return container;
}
