export type PromptVersion = {
    id: number
    version: number
    prompt: string
    systemPrompt: string
    userPrompt: string
    output: string
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