// Domain enums
export enum Role {
  PRODUCT_ENGINEER = 'Product Engineer',
  WORDPRESS_PRODUCT_ENGINEER = 'Wordpress Product Engineer',
  ARCHITECT_PRINCIPLE = 'Architect/Principle',
  CONTENT_EDITOR = 'Content Editor',
  DATA_ENGINEER = 'Data Engineer',
  DATA_ANALYTICS = 'Data Analytics',
  DWP_ENGINEER = 'DWP Engineer',
  MANAGER = 'Manager',
  SRE_ENGINEER = 'SRE Engineer',
}

export enum RoleType {
  IC = 'IC', // Individual Contributor
  MG = 'MG', // Manager
}

export enum OrgFunction {
  ENGINEERING = 'Engineering',
  CONTENT = 'Content',
  DESIGN = 'Design',
  DATA = 'Data',
}

export enum AppAccessRole {
  ADMINISTRATOR = 'administrator',
  HO = 'HO',
  EM = 'EM',
  IC = 'IC',
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly company: string | null,
    public readonly role: Role,
    public readonly roleType: RoleType,
    public readonly growthLevel: string | null,
    public readonly orgFunction: OrgFunction | null,
    public readonly pillar: string | null,
    public readonly tribe: string | null,
    public readonly squad: string | null,
    public readonly jobTitle: string | null,
    public readonly managerId: string | null,
    public readonly appAccessRole: AppAccessRole,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static create(
    id: string,
    email: string,
    name: string,
    company: string | null = null,
    role: Role = Role.PRODUCT_ENGINEER,
    roleType: RoleType = RoleType.IC,
    growthLevel: string | null = null,
    orgFunction: OrgFunction | null = null,
    pillar: string | null = null,
    tribe: string | null = null,
    squad: string | null = null,
    jobTitle: string | null = null,
    managerId: string | null = null,
    appAccessRole: AppAccessRole = AppAccessRole.IC,
    createdAt = new Date(),
    updatedAt = new Date()
  ): User {
    // Business rule: Validate email format
    if (!User.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Business rule: Name cannot be empty
    if (!name.trim()) {
      throw new Error('Name cannot be empty');
    }

    // Business rule: Manager cannot be self
    if (managerId === id) {
      throw new Error('User cannot be their own manager');
    }

    return new User(
      id,
      email.toLowerCase(), // Business rule: emails are always lowercase
      name.trim(),
      company?.trim() || null,
      role,
      roleType,
      growthLevel?.trim() || null,
      orgFunction,
      pillar?.trim() || null,
      tribe?.trim() || null,
      squad?.trim() || null,
      jobTitle?.trim() || null,
      managerId,
      appAccessRole,
      createdAt,
      updatedAt
    );
  }

  public updateProfile(updates: {
    name?: string;
    company?: string | null;
    role?: Role;
    roleType?: RoleType;
    growthLevel?: string | null;
    orgFunction?: OrgFunction | null;
    pillar?: string | null;
    tribe?: string | null;
    squad?: string | null;
    jobTitle?: string | null;
    managerId?: string | null;
    appAccessRole?: AppAccessRole;
  }): User {
    // Validate name if provided
    if (updates.name !== undefined && !updates.name.trim()) {
      throw new Error('Name cannot be empty');
    }

    // Validate manager ID
    if (updates.managerId === this.id) {
      throw new Error('User cannot be their own manager');
    }

    return new User(
      this.id,
      this.email, // Email cannot be updated through profile update
      updates.name?.trim() ?? this.name,
      updates.company !== undefined ? updates.company?.trim() || null : this.company,
      updates.role ?? this.role,
      updates.roleType ?? this.roleType,
      updates.growthLevel !== undefined ? updates.growthLevel?.trim() || null : this.growthLevel,
      updates.orgFunction !== undefined ? updates.orgFunction : this.orgFunction,
      updates.pillar !== undefined ? updates.pillar?.trim() || null : this.pillar,
      updates.tribe !== undefined ? updates.tribe?.trim() || null : this.tribe,
      updates.squad !== undefined ? updates.squad?.trim() || null : this.squad,
      updates.jobTitle !== undefined ? updates.jobTitle?.trim() || null : this.jobTitle,
      updates.managerId !== undefined ? updates.managerId : this.managerId,
      updates.appAccessRole ?? this.appAccessRole,
      this.createdAt,
      new Date() // Update timestamp
    );
  }

  public updateEmail(newEmail: string): User {
    if (!User.isValidEmail(newEmail)) {
      throw new Error('Invalid email format');
    }

    return new User(
      this.id,
      newEmail.toLowerCase(),
      this.name,
      this.company,
      this.role,
      this.roleType,
      this.growthLevel,
      this.orgFunction,
      this.pillar,
      this.tribe,
      this.squad,
      this.jobTitle,
      this.managerId,
      this.appAccessRole,
      this.createdAt,
      new Date()
    );
  }

  public isManager(): boolean {
    return this.roleType === RoleType.MG;
  }

  public isIndividualContributor(): boolean {
    return this.roleType === RoleType.IC;
  }

  public hasAdminAccess(): boolean {
    return this.appAccessRole === AppAccessRole.ADMINISTRATOR;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
