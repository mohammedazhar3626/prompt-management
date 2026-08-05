export type PromptVersion = {
    id: number
    version: number
    text: string
    createdAt: string
}


export type SavedPrompt = {
    id: number
    key: string
    label: string
    icon: string
    currentVersion: number
    versions: PromptVersion[]
}