export interface NavigationItem {
    id: string;
    label: string;
    path?: string | null;
    icon: string;
    children: NavigationItem[];
}

export interface NavigationQueryResponse {
    navigation: NavigationItem[];
}