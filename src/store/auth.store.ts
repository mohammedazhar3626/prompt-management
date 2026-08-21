import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type User = {
    id: number
    name: string
    email: string;
    role: "USER" | "ADMIN";
}

type AuthState = {
    user: User | null
    token: string | null
    hasHydrated: boolean
    setAuth: (user: User, token: string) => void
    logout: () => void
    setHasHydrated: (state: boolean) => void
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            hasHydrated: false,
            setAuth: (user, token) => {
                set({ user, token })
            },
            logout: () => {
                set({ user: null, token: null })
                useAuth.persist.clearStorage();
                localStorage.removeItem("auth-storage")
            },
            setHasHydrated: (state) => set({ hasHydrated: state })
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true)
            }
        }
    )
)