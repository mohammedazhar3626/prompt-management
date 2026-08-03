import { toast } from "react-toastify"
import { create } from "zustand"

type Prompt = {
    id: number
    key: string
    text: string
    label: string
    icon: string
}

type Store = {
    savedPrompts: Prompt[]
    addPrompt: (prompt: Prompt) => void
    removePrompt: (id: number) => void
    syncPrompts: () => void
}

const store = create<Store>((set) => ({
    savedPrompts: JSON.parse(localStorage.getItem("savedPrompts") || "[]"),

    addPrompt: (prompt) =>
        set((state) => {
            const exists = state.savedPrompts.some(p => p.key === prompt.key)
            if (exists) {
                toast.info("Prompt already saved")
                return state
            }
            const updated = [prompt, ...state.savedPrompts].slice(0, 10)

            localStorage.setItem("savedPrompts", JSON.stringify(updated))
            toast.success("Prompt saved successfully")
            return { savedPrompts: updated }
        }),
    removePrompt: (id) =>
        set((state) => {
            const updated = state.savedPrompts.filter(p => p.id !== id)
            localStorage.setItem("savedPrompts", JSON.stringify(updated))
            toast.success("Prompt deleted successfully")
            return { savedPrompts: updated }
        }),

    syncPrompts: () =>
        set({
            savedPrompts: JSON.parse(localStorage.getItem("savedPrompts") || "[]")
        })
}))

export const useSavedPrompts = store
export default store
