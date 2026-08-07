import { create } from "zustand"

type NavigationStore = {
    playgroundDirty: boolean
    setPlaygroundDirty: (dirty: boolean) => void
}

export const useNavigationStore = create<NavigationStore>((set) => ({
    playgroundDirty: false,
    setPlaygroundDirty: (dirty) => set({
        playgroundDirty: dirty
    })
}))