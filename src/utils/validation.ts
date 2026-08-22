export const validateEmail = (email: string) => {
    if (!email) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Enter a valid email address"
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