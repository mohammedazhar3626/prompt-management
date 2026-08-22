import { MessageSquareText, SquarePlus } from 'lucide-react';
import { ADMIN_DEVELOPER_ROLES, ADMIN_ROLES, ALL_ROLES } from './roles';

export const navigation = [
    {
        label: 'Prompt Playground',
        path: '/playground',
        roles: ALL_ROLES,
        icon: MessageSquareText
    },
    {
        label: 'Template Library',
        path: '/templates',
        roles: ALL_ROLES,
        icon: SquarePlus
    }, {
        label: 'Evaluation Reports',
        path: '/evaluation',
        roles: ADMIN_DEVELOPER_ROLES,
        icon: SquarePlus
    }, {
        label: 'Settings',
        path: '/settings',
        roles: ADMIN_ROLES,
        icon: SquarePlus,
        divider: true
    },
]