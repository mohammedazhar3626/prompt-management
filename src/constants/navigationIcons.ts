import type { LucideIcon } from "lucide-react";

import {
    BarChart3,
    ChartCandlestick,
    CircleHelp,
    Cog,
    FileText,
    GitBranch,
    LayoutPanelTop,
    MessageSquareText,
    Play,
    Settings,
    Users,
} from "lucide-react";

export const NAVIGATION_ICONS: Record<
    string,
    LucideIcon
> = {
    Play,
    FileText,
    BarChart3,
    MessageSquareText,
    LayoutPanelTop,
    ChartCandlestick,
    GitBranch,
    Cog,
    Settings,
    Users,
};

export function getNavigationIcon(
    iconName: string,
): LucideIcon {
    return (
        NAVIGATION_ICONS[iconName] ??
        CircleHelp
    );
}