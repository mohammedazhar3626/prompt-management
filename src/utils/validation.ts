export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 50;

export const validateName = (value: string): string => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return "Name is required";
    }

    if (trimmedValue.length < NAME_MIN_LENGTH) {
        return `Name must be at least ${NAME_MIN_LENGTH} characters`;
    }

    if (trimmedValue.length > NAME_MAX_LENGTH) {
        return `Name must not exceed ${NAME_MAX_LENGTH} characters`;
    }

    // Only uppercase letters, lowercase letters and spaces
    if (!/^[A-Za-z ]+$/.test(trimmedValue)) {
        return "Name can contain only letters and spaces";
    }

    return "";
};

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


// -----------------------------

// Live password validation

// -----------------------------

export const PASSWORD_RULES = {
    minLength: {
        test: (password: string) => password.length >= 8,
        message: "At least 8 characters",
    },

    hasUppercase: {
        test: (password: string) => /[A-Z]/.test(password),
        message: "At least one uppercase letter",
    },

    hasLowercase: {
        test: (password: string) => /[a-z]/.test(password),
        message: "At least one lowercase letter",
    },

    hasNumber: {
        test: (password: string) => /\d/.test(password),
        message: "At least one number",
    },

    hasSpecialCharacter: {
        test: (password: string) => /[^A-Za-z0-9]/.test(password),
        message: "At least one special character",
    },
} as const;



export const validatePasswordRule = (password: string) => {
    return {
        minLength: PASSWORD_RULES.minLength.test(password),
        hasUppercase: PASSWORD_RULES.hasUppercase.test(password),
        hasLowercase: PASSWORD_RULES.hasLowercase.test(password),
        hasNumber: PASSWORD_RULES.hasNumber.test(password),
        hasSpecialCharacter: PASSWORD_RULES.hasSpecialCharacter.test(password),
    };
};

export const isPasswordValid = (password: string): boolean => {
    const validation = validatePassword(password);

    return Object.values(validation).every(Boolean);
};

export const isPasswordMatch = (
    password: string,
    confirmPassword: string
): boolean => {
    return (
        confirmPassword.length > 0 &&
        password === confirmPassword
    );
};

export const VALIDATION_MESSAGES = {
    passwordRequired: "Please enter a password.",
    confirmPasswordRequired: "Please confirm your password.",
    passwordMismatch: "Passwords do not match.",
    passwordInvalid: "Password does not meet the requirements.",
} as const;
