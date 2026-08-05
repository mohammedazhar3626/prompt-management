import { toast } from "react-toastify"
import { create } from "zustand"
import { SavedPrompt } from "../types/prompt"
import { getCurrentVersion, getNextVersion, isPromptChanged } from "../utils/promptVersion"

type Prompt = {
    id: number
    key: string
    text: string
    label: string
    icon: string
}

type Store = {
    savedPrompts: SavedPrompt[]
    addPrompt: (prompt: Omit<SavedPrompt, "currentVersion" | "versions"> & { text: string }) => void
    createVersion: (promptId: number, text: string) => void
    removePrompt: (id: number) => void
    syncPrompts: () => void
}

const store = create<Store>((set) => ({
    savedPrompts: JSON.parse(localStorage.getItem("savedPrompts") || "[]"),

    addPrompt: (prompt) =>
        set((state) => {
            const newPrompt: SavedPrompt = {
                id: prompt.id,
                key: prompt.key,
                label: prompt.label,
                icon: prompt.icon,
                currentVersion: 1,
                versions: [
                    {
                        id: Date.now(),
                        version: 1,
                        text: prompt.text,
                        createdAt: new Date().toISOString()
                    }
                ]
            }
            const updated = [newPrompt, ...state.savedPrompts].slice(0, 10)

            localStorage.setItem("savedPrompts", JSON.stringify(updated))
            toast.success("Prompt saved successfully")
            return { savedPrompts: updated }
        }),
    createVersion: (promptId, text) =>
        set((state) => {
            let versionCreated = false
            const updated = state.savedPrompts.map(prompt => {
                if (prompt.id !== promptId) {
                    return prompt
                }

                if (!isPromptChanged(prompt, text)) {
                    toast.info("Prompt is already up to date")
                    return prompt
                }

                versionCreated = true

                const nextVersion = getNextVersion(prompt)
                return {
                    ...prompt,
                    currentVersion: nextVersion,
                    versions: [...prompt.versions, {
                        id: Date.now(),
                        version: nextVersion,
                        text: text,
                        createdAt: new Date().toISOString()
                    }]
                }
            })
            localStorage.setItem("savedPrompts", JSON.stringify(updated))
            if (versionCreated) toast.success("Prompt new version created")
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
