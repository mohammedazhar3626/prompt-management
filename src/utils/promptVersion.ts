import { SavedPrompt, PromptVersion } from "../types/prompt"

export const getCurrentVersion = (
    prompt: SavedPrompt
): PromptVersion | undefined => {
    return prompt.versions.find(
        version => version.version === prompt.currentVersion
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
    text: string
): boolean => {
    const current = getCurrentVersion(prompt)

    return (
        current?.text.trim() !== text.trim()
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