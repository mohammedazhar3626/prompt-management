export const ROLES = {
    ADMIN: "ADMIN",
    DEVELOPER: "DEVELOPER",
    USER: "USER"
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];


export const ALL_ROLES: readonly Role[] = [
    ROLES.ADMIN,
    ROLES.DEVELOPER,
    ROLES.USER
]

export const ADMIN_ROLES: readonly Role[] = [
    ROLES.ADMIN
]

export const ADMIN_DEVELOPER_ROLES: readonly Role[] = [
    ROLES.ADMIN,
    ROLES.DEVELOPER
]