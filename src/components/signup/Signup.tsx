import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";

import {
    REGISTER_USER,
    RegisterMutationData,
    RegisterMutationVariables,
} from "../../graphql/auth/mutations";

import {
    validateEmail,
    validatePassword,
} from "../../utils/validation";

import "./Signup.scss";
import { toast } from "react-toastify";
import { useUI } from "../../store/ui.store";

const Signup = () => {
    const navigate = useNavigate();
    const { showLoader } = useUI()

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [apiError, setApiError] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [registerMutation] = useMutation<
        RegisterMutationData,
        RegisterMutationVariables
    >(REGISTER_USER);

    const validate = () => {
        let hasError = false;

        // Name validation
        let nErr = "";

        if (!name.trim()) {
            nErr = "Name is required";
        } else if (name.trim().length < 2) {
            nErr = "Name must be at least 2 characters";
        }

        // Email validation
        const eErr = validateEmail(email);

        // Password validation
        const pErr = validatePassword(password);

        // Confirm password
        let cpErr = "";

        if (!confirmPassword) {
            cpErr = "Please confirm your password";
        } else if (password !== confirmPassword) {
            cpErr = "Passwords do not match";
        }

        setNameError(nErr);
        setEmailError(eErr);
        setPasswordError(pErr);
        setConfirmPasswordError(cpErr);

        hasError = Boolean(nErr || eErr || pErr || cpErr);

        return !hasError;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setApiError("");

        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            const { data } = await registerMutation({
                variables: {
                    name: name.trim(),
                    email: email.trim(),
                    password,
                },
            });

            if (data?.register) {
                toast.success("Account created successfully. Please login.");
                showLoader();
                navigate("/login", {
                    replace: true
                });
            }
        } catch (error: any) {
            const message =
                error?.graphQLErrors?.[0]?.message ||
                error?.message ||
                "Unable to create account. Please try again.";

            setApiError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginNavigation = () => {
        showLoader()
        setTimeout(() => {
            navigate("/login")
        }, 500)
    }

    const isDisabled =
        loading ||
        !name ||
        !email ||
        !password ||
        !confirmPassword;

    return (
        <div className="signup">
            <div className="signup__container">
                <h2 className="signup__title">Prompt Platform Signup</h2>

                <form
                    className="signup__form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    {/* Name */}
                    <div className="signup__field">
                        <label htmlFor="name">Name</label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                const value = e.target.value;

                                setName(value);
                                setNameError("");
                                setApiError("");
                            }}
                            onBlur={() => {
                                if (!name.trim()) {
                                    setNameError("Name is required");
                                } else if (name.trim().length < 2) {
                                    setNameError("Name must be at least 2 characters");
                                }
                            }}
                            placeholder="Enter name"
                            autoComplete="name"
                        />

                        <div className="signup__error">
                            {nameError || "\u00A0"}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="signup__field">
                        <label htmlFor="email">Email</label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                const value = e.target.value;

                                setEmail(value);
                                setEmailError("");
                                setApiError("");
                            }}
                            onBlur={() => {
                                setEmailError(validateEmail(email));
                            }}
                            placeholder="Enter email"
                            autoComplete="email"
                        />

                        <div className="signup__error">
                            {emailError || "\u00A0"}
                        </div>
                    </div>

                    {/* Password */}
                    <div className="signup__field">
                        <label htmlFor="password">Password</label>

                        <div className="signup__password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    setPassword(value);
                                    setPasswordError("");
                                    setConfirmPasswordError("");
                                    setApiError("");
                                }}
                                onBlur={() => {
                                    setPasswordError(validatePassword(password));
                                }}
                                placeholder="Enter password"
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="signup__password-toggle"
                                onClick={() =>
                                    setShowPassword((previous) => !previous)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        <div className="signup__error">
                            {passwordError || "\u00A0"}
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="signup__field">
                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <div className="signup__password-wrapper">
                            <input
                                id="confirmPassword"
                                type={
                                    showConfirmPassword ? "text" : "password"
                                }
                                value={confirmPassword}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    setConfirmPassword(value);
                                    setConfirmPasswordError("");
                                    setApiError("");
                                }}
                                onBlur={() => {
                                    if (!confirmPassword) {
                                        setConfirmPasswordError(
                                            "Please confirm your password"
                                        );
                                    } else if (password !== confirmPassword) {
                                        setConfirmPasswordError(
                                            "Passwords do not match"
                                        );
                                    }
                                }}
                                placeholder="Confirm password"
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="signup__password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (previous) => !previous
                                    )
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        <div className="signup__error">
                            {confirmPasswordError || "\u00A0"}
                        </div>
                    </div>

                    {/* API error */}
                    {apiError && (
                        <div
                            className="signup__error signup__error--api"
                            role="alert"
                        >
                            {apiError}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isDisabled}
                        className="signup__button"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>

                    {/* Login */}
                    <div className="signup__login">
                        <span>Already have an account?</span>

                        <button
                            type="button"
                            onClick={handleLoginNavigation}
                            className="signup__login-link"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;