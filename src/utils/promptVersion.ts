import { SavedPrompt, PromptVersion } from "../types/prompt"

export const getCurrentVersion = (
    prompt: SavedPrompt
): PromptVersion | undefined => {
    return prompt.versions.find(
        v => v.version === prompt.currentVersion
    )
}

export const getNextVersion = (
    prompt: SavedPrompt
): number => {
    return Math.max(
        ...prompt.versions.map(v => v.version)
    ) + 1
}

export const isPromptChanged = (
    prompt: SavedPrompt,
    version: Omit<PromptVersion, "id" | "version" | "createdAt">
): boolean => {
    const current = getCurrentVersion(prompt)
    if (!current) {
        return true
    }
    return (
        current.prompt !== version.prompt ||
        current.systemPrompt !== version.systemPrompt ||
        current.userPrompt !== version.userPrompt ||
        current.output !== version.output ||
        current.text !== version.text

    )
}

export const getVersionByNumber = (
    prompt: SavedPrompt,
    version: number
): PromptVersion | undefined => {
    return prompt.versions.find(
        v => v.version === version
    )
}

export const sortVersions = (
    prompt: SavedPrompt
): PromptVersion[] => {
    return [...prompt.versions].sort(
        (a, b) => b.version - a.version
    )
}