export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    lastLogin: string | null;
}

export interface UsersData {
    users: User[];
    total: number;
    page: number;
    limit: number;
}

export interface UsersResponse {
    users: UsersData
}