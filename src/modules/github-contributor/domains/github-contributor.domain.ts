export class GitHubContributor {
  constructor(
    public readonly id: string,
    public readonly currentUsername: string,
    public readonly currentEmail: string,
    public readonly currentName: string,
    public readonly historicalUsernames: readonly string[],
    public readonly historicalEmails: readonly string[],
    public readonly historicalNames: readonly string[],
    public readonly userId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static create(
    id: string,
    currentUsername: string,
    currentEmail: string,
    currentName: string,
    userId: string,
    historicalUsernames: string[] = [],
    historicalEmails: string[] = [],
    historicalNames: string[] = [],
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

    if (!userId.trim()) {
      throw new Error('User ID cannot be empty');
    }

    // Business rule: Validate historical emails format
    for (const email of historicalEmails) {
      if (!GitHubContributor.isValidEmail(email)) {
        throw new Error(`Invalid historical email format: ${email}`);
      }
    }

    // Business rule: Remove duplicates and empty values from historical data
    const cleanHistoricalUsernames = Array.from(
      new Set(
        historicalUsernames.filter(username => username.trim()).map(username => username.trim())
      )
    );

    const cleanHistoricalEmails = Array.from(
      new Set(
        historicalEmails.filter(email => email.trim()).map(email => email.toLowerCase().trim())
      )
    );

    const cleanHistoricalNames = Array.from(
      new Set(historicalNames.filter(name => name.trim()).map(name => name.trim()))
    );

    return new GitHubContributor(
      id,
      currentUsername.trim(),
      currentEmail.toLowerCase().trim(),
      currentName.trim(),
      cleanHistoricalUsernames,
      cleanHistoricalEmails,
      cleanHistoricalNames,
      userId,
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

    // Add current values to historical data if they're changing
    const newHistoricalUsernames =
      this.currentUsername !== username.trim()
        ? [...this.historicalUsernames, this.currentUsername]
        : [...this.historicalUsernames];

    const newHistoricalEmails =
      this.currentEmail !== email.toLowerCase().trim()
        ? [...this.historicalEmails, this.currentEmail]
        : [...this.historicalEmails];

    const newHistoricalNames =
      this.currentName !== name.trim()
        ? [...this.historicalNames, this.currentName]
        : [...this.historicalNames];

    return new GitHubContributor(
      this.id,
      username.trim(),
      email.toLowerCase().trim(),
      name.trim(),
      Array.from(new Set(newHistoricalUsernames)), // Remove duplicates
      Array.from(new Set(newHistoricalEmails)),
      Array.from(new Set(newHistoricalNames)),
      this.userId,
      this.createdAt,
      new Date() // Update timestamp
    );
  }

  public addHistoricalData(
    usernames: string[] = [],
    emails: string[] = [],
    names: string[] = []
  ): GitHubContributor {
    // Validate historical emails
    for (const email of emails) {
      if (email.trim() && !GitHubContributor.isValidEmail(email)) {
        throw new Error(`Invalid email format: ${email}`);
      }
    }

    // Merge and deduplicate historical data
    const mergedUsernames = Array.from(
      new Set([
        ...this.historicalUsernames,
        ...usernames.filter(username => username.trim()).map(username => username.trim()),
      ])
    );

    const mergedEmails = Array.from(
      new Set([
        ...this.historicalEmails,
        ...emails.filter(email => email.trim()).map(email => email.toLowerCase().trim()),
      ])
    );

    const mergedNames = Array.from(
      new Set([
        ...this.historicalNames,
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
      this.createdAt,
      new Date()
    );
  }

  public hasUsedUsername(username: string): boolean {
    const trimmedUsername = username.trim();
    return (
      this.currentUsername === trimmedUsername || this.historicalUsernames.includes(trimmedUsername)
    );
  }

  public hasUsedEmail(email: string): boolean {
    const normalizedEmail = email.toLowerCase().trim();
    return this.currentEmail === normalizedEmail || this.historicalEmails.includes(normalizedEmail);
  }

  public hasUsedName(name: string): boolean {
    const trimmedName = name.trim();
    return this.currentName === trimmedName || this.historicalNames.includes(trimmedName);
  }

  public getAllUsernames(): string[] {
    return [this.currentUsername, ...this.historicalUsernames];
  }

  public getAllEmails(): string[] {
    return [this.currentEmail, ...this.historicalEmails];
  }

  public getAllNames(): string[] {
    return [this.currentName, ...this.historicalNames];
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
