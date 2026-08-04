import { create } from "zustand"

type UIState = {
    loading: boolean
    sidebarCollapsed: boolean
    showLoader: () => void
    hideLoader: () => void
    toggleSidebar: () => void
    setSidebarCollapsed: (collapsed: boolean) => void
}

export const useUI = create<UIState>((set) => ({
    loading: false,
    sidebarCollapsed: JSON.parse(localStorage.getItem("sidebarCollapsed") || "false"),
    showLoader: () => set({ loading: true }),
    hideLoader: () => set({ loading: false }),
    toggleSidebar: () => set((state) => {
        const collapsed = !state.sidebarCollapsed
        localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed))
        return { sidebarCollapsed: collapsed }
    }),
    setSidebarCollapsed: (collapsed: boolean) => {
        localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed))
        set({ sidebarCollapsed: collapsed })
    }
}))