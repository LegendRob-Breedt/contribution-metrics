export enum GitHubContributorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class GitHubContributor {
  constructor(
    public readonly id: string,
    public readonly currentUsername: string,
    public readonly currentEmail: string,
    public readonly currentName: string,
    public readonly allKnownUsernames: readonly string[],
    public readonly allKnownEmails: readonly string[],
    public readonly allKnownNames: readonly string[],
    public readonly userId: string | null,
    public readonly lastActiveDate: Date | null,
    public readonly status: GitHubContributorStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static create(
    id: string,
    currentUsername: string,
    currentEmail: string,
    currentName: string,
    userId: string | null = null,
    allKnownUsernames: string[] = [],
    allKnownEmails: string[] = [],
    allKnownNames: string[] = [],
    lastActiveDate: Date | null = null,
    status: GitHubContributorStatus = GitHubContributorStatus.ACTIVE,
    createdAt = new Date(),
    updatedAt = new Date()
  ): GitHubContributor {
    // Business rule: Validate required fields
    if (!currentUsername.trim()) {
      throw new Error('Current username cannot be empty');
    }

    if (!currentEmail.trim()) {
      throw new Error('Current email cannot be empty');
    }

    if (!GitHubContributor.isValidEmail(currentEmail)) {
      throw new Error('Invalid email format');
    }

    if (!currentName.trim()) {
      throw new Error('Current name cannot be empty');
    }

    // Business rule: Validate all known emails format
    for (const email of allKnownEmails) {
      if (!GitHubContributor.isValidEmail(email)) {
        throw new Error(`Invalid historical email format: ${email}`);
      }
    }

    // Business rule: Remove duplicates and empty values from all known data
    const cleanAllKnownUsernames = Array.from(
      new Set(
        allKnownUsernames.filter(username => username.trim()).map(username => username.trim())
      )
    );

    const cleanAllKnownEmails = Array.from(
      new Set(
        allKnownEmails.filter(email => email.trim()).map(email => email.toLowerCase().trim())
      )
    );

    const cleanAllKnownNames = Array.from(
      new Set(allKnownNames.filter(name => name.trim()).map(name => name.trim()))
    );

    return new GitHubContributor(
      id,
      currentUsername.trim(),
      currentEmail.toLowerCase().trim(),
      currentName.trim(),
      cleanAllKnownUsernames,
      cleanAllKnownEmails,
      cleanAllKnownNames,
      userId,
      lastActiveDate,
      status,
      createdAt,
      updatedAt
    );
  }

  public updateCurrentInfo(username: string, email: string, name: string): GitHubContributor {
    // Validate new current info
    if (!username.trim()) {
      throw new Error('Username cannot be empty');
    }

    if (!email.trim()) {
      throw new Error('Email cannot be empty');
    }

    if (!GitHubContributor.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!name.trim()) {
      throw new Error('Name cannot be empty');
    }

    // Add current values to all known data if they're changing
    const newAllKnownUsernames =
      this.currentUsername !== username.trim()
        ? [...this.allKnownUsernames, this.currentUsername]
        : [...this.allKnownUsernames];

    const newAllKnownEmails =
      this.currentEmail !== email.toLowerCase().trim()
        ? [...this.allKnownEmails, this.currentEmail]
        : [...this.allKnownEmails];

    const newAllKnownNames =
      this.currentName !== name.trim()
        ? [...this.allKnownNames, this.currentName]
        : [...this.allKnownNames];

    return new GitHubContributor(
      this.id,
      username.trim(),
      email.toLowerCase().trim(),
      name.trim(),
      Array.from(new Set(newAllKnownUsernames)), // Remove duplicates
      Array.from(new Set(newAllKnownEmails)),
      Array.from(new Set(newAllKnownNames)),
      this.userId,
      this.lastActiveDate,
      this.status,
      this.createdAt,
      new Date() // Update timestamp
    );
  }

  public addAllKnownData(
    usernames: string[] = [],
    emails: string[] = [],
    names: string[] = []
  ): GitHubContributor {
    // Validate all known emails
    for (const email of emails) {
      if (email.trim() && !GitHubContributor.isValidEmail(email)) {
        throw new Error(`Invalid email format: ${email}`);
      }
    }

    // Merge and deduplicate all known data
    const mergedUsernames = Array.from(
      new Set([
        ...this.allKnownUsernames,
        ...usernames.filter(username => username.trim()).map(username => username.trim()),
      ])
    );

    const mergedEmails = Array.from(
      new Set([
        ...this.allKnownEmails,
        ...emails.filter(email => email.trim()).map(email => email.toLowerCase().trim()),
      ])
    );

    const mergedNames = Array.from(
      new Set([
        ...this.allKnownNames,
        ...names.filter(name => name.trim()).map(name => name.trim()),
      ])
    );

    return new GitHubContributor(
      this.id,
      this.currentUsername,
      this.currentEmail,
      this.currentName,
      mergedUsernames,
      mergedEmails,
      mergedNames,
      this.userId,
      this.lastActiveDate,
      this.status,
      this.createdAt,
      new Date()
    );
  }

  public updateStatus(status: GitHubContributorStatus): GitHubContributor {
    return new GitHubContributor(
      this.id,
      this.currentUsername,
      this.currentEmail,
      this.currentName,
      this.allKnownUsernames,
      this.allKnownEmails,
      this.allKnownNames,
      this.userId,
      this.lastActiveDate,
      status,
      this.createdAt,
      new Date()
    );
  }

  public updateLastActiveDate(lastActiveDate: Date): GitHubContributor {
    return new GitHubContributor(
      this.id,
      this.currentUsername,
      this.currentEmail,
      this.currentName,
      this.allKnownUsernames,
      this.allKnownEmails,
      this.allKnownNames,
      this.userId,
      lastActiveDate,
      this.status,
      this.createdAt,
      new Date()
    );
  }

  public linkToUser(userId: string): GitHubContributor {
    if (!userId?.trim()) {
      throw new Error('User ID cannot be empty');
    }

    return new GitHubContributor(
      this.id,
      this.currentUsername,
      this.currentEmail,
      this.currentName,
      this.allKnownUsernames,
      this.allKnownEmails,
      this.allKnownNames,
      userId.trim(),
      this.lastActiveDate,
      this.status,
      this.createdAt,
      new Date()
    );
  }

  public unlinkFromUser(): GitHubContributor {
    return new GitHubContributor(
      this.id,
      this.currentUsername,
      this.currentEmail,
      this.currentName,
      this.allKnownUsernames,
      this.allKnownEmails,
      this.allKnownNames,
      null,
      this.lastActiveDate,
      this.status,
      this.createdAt,
      new Date()
    );
  }

  public hasUsedUsername(username: string): boolean {
    const trimmedUsername = username.trim();
    return (
      this.currentUsername === trimmedUsername || this.allKnownUsernames.includes(trimmedUsername)
    );
  }

  public hasUsedEmail(email: string): boolean {
    const normalizedEmail = email.toLowerCase().trim();
    return this.currentEmail === normalizedEmail || this.allKnownEmails.includes(normalizedEmail);
  }

  public hasUsedName(name: string): boolean {
    const trimmedName = name.trim();
    return this.currentName === trimmedName || this.allKnownNames.includes(trimmedName);
  }

  public getAllUsernames(): string[] {
    return [this.currentUsername, ...this.allKnownUsernames];
  }

  public getAllEmails(): string[] {
    return [this.currentEmail, ...this.allKnownEmails];
  }

  public getAllNames(): string[] {
    return [this.currentName, ...this.allKnownNames];
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
