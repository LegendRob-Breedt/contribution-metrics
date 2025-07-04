export class GitHubOrganization {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly tokenExpiresAt: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static create(
    id: string,
    name: string,
    tokenExpiresAt: Date,
    createdAt = new Date(),
    updatedAt = new Date()
  ): GitHubOrganization {
    return new GitHubOrganization(
      id,
      name.toUpperCase(), // Business rule: organization names are always uppercase
      tokenExpiresAt,
      createdAt,
      updatedAt
    );
  }

  public isTokenExpired(): boolean {
    return this.tokenExpiresAt < new Date();
  }

  public updateToken(tokenExpiresAt: Date): GitHubOrganization {
    return new GitHubOrganization(
      this.id,
      this.name,
      tokenExpiresAt,
      this.createdAt,
      new Date() // updatedAt
    );
  }
}
