import { MessageSquareText, LayoutPanelTop, ChartCandlestick, Users, Cog } from 'lucide-react';
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
        icon: LayoutPanelTop
    },
    {
        label: 'Evaluation Reports',
        path: '/evaluation',
        roles: ADMIN_DEVELOPER_ROLES,
        icon: ChartCandlestick
    },
    {
        label: 'Users Management',
        path: '/manage-users',
        roles: ADMIN_ROLES,
        icon: Users,
    },
    {
        label: 'Settings',
        path: '/settings',
        roles: ADMIN_ROLES,
        icon: Cog,
        divider: true
    }
]