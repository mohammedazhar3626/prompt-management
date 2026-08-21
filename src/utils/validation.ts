export const validateUsername = (username: string) => {
    if (!username) return "Username is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
        return "Min 3 chars, no spaces"
    }
    return ""
}

export const validatePassword = (password: string) => {
    if (!password) return "Password is required"
    if (password.length < 4) {
        return "Password must be at least 4 characters"
    }
    return ""
}