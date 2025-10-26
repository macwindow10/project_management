// Define as const arrays to maintain type safety
export const PROJECT_STATUS = [
    'Under_Development',
    'Developed_Not_Deployed',
    'Deployed',
    'Deployed_Enhancements',
    'Inactive',
] as const;

export const PERSON_ROLES = [
    'TeamLead',
    'Developer',
    'Tester',
] as const;

// Create types from the const arrays
export type ProjectStatus = typeof PROJECT_STATUS[number];
export type PersonRole = typeof PERSON_ROLES[number];

// Create functions to validate the status and role values
export function isValidProjectStatus(status: string): status is ProjectStatus {
    return PROJECT_STATUS.includes(status as ProjectStatus);
}

export function isValidPersonRole(role: string): role is PersonRole {
    return PERSON_ROLES.includes(role as PersonRole);
}

export interface Person {
    id: string;
    role: PersonRole;
    name: string;
    picture?: string;
    leadingProjects?: Project[];
    memberOfProjects?: Project[];
    assignedHardware?: Hardware[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectAttachment {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType?: string;
    fileSize?: number;
    projectId: string;
    uploadedAt: Date;
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    startDate: Date;
    status: ProjectStatus;
    teamLead: Person;
    teamLeadId: string;
    teamMembers: Person[];
    clientName: string;
    latestUpdate?: string;
    toolStack: string;
    database: string;
    deploymentDetails: string;
    usersCount: number;
    attachments: ProjectAttachment[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Task {
    id: string;
    projectId: string;
    personId?: string;
    title: string;
    startDate: Date;
    endDate: Date;
    status: string; // Created, InProgress, Completed
    createdAt: Date;
    updatedAt: Date;
}

export interface Hardware {
    id: string;
    dateOfPurchase: Date;
    name: string;
    description?: string;
    issuedTo?: Person;
    issuedToId?: string;
    createdAt: Date;
    updatedAt: Date;
}