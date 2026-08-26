import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { Eye, EyeOff, Check, X, ArrowLeft, CircleAlert } from "lucide-react"

import { RESET_PASSWORD, ResetPasswordData, ResetPasswordVariables } from "../../graphql/auth/mutations";
import { usePasswordReset } from "../../context/PasswordResetContext";
import { PASSWORD_RULES, validatePasswordRule, isPasswordValid, isPasswordMatch, VALIDATION_MESSAGES } from "../../utils/validation";

import "./ResetPassword.scss";
import { toast } from "react-toastify";

const ValidationRule = ({
    valid,
    children,
}: {
    valid: boolean;
    children: React.ReactNode;
}) => {
    return (
        <li
            className={`reset-password__rule ${valid
                ? "reset-password__rule--valid"
                : "reset-password__rule--invalid"
                }`}
        >
            {valid ? (
                <Check
                    size={15}
                    aria-hidden="true"
                />
            ) : (
                <X
                    size={15}
                    aria-hidden="true"
                />
            )}

            <span>{children}</span>
        </li>
    );
};

const ResetPassword = () => {
    const navigate = useNavigate();

    const {
        email,
        resetToken,
        otpSuccessMessage,
        clearResetFlow
    } = usePasswordReset();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const passwordIsValid = isPasswordValid(password);

    const confirmPasswordIsValid = isPasswordMatch(
        password,
        confirmPassword
    );


    const [resetPassword, { loading }] = useMutation<ResetPasswordData, ResetPasswordVariables>(RESET_PASSWORD);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!password) {
            setError(VALIDATION_MESSAGES.passwordRequired);
            return;
        }

        if (!confirmPassword) {
            setError(VALIDATION_MESSAGES.confirmPasswordRequired);
            return;
        }

        if (password !== confirmPassword) {
            setError(VALIDATION_MESSAGES.passwordMismatch);
            return;
        }

        if (!isPasswordValid(password)) {
            setError(VALIDATION_MESSAGES.passwordInvalid);
            return;
        }

        if (!resetToken) {
            return;
        }

        try {
            const { data } = await resetPassword({
                variables: {
                    resetToken,
                    password,
                },
            });

            const result = data?.resetPassword;

            if (!result?.success) {
                setError(
                    result?.message || ""
                );
                return;
            }
            /*
            * IMPORTANT:
            * replace prevents Reset Password from remaining
            * as a forward-history entry.
            */
            navigate("/login", { replace: true });
            toast.success(result.message || "Password reset Successfully")
            /*
            * Clear the OTP/reset context after successful reset.
            * This also prevents the user from revisiting the reset flow.
            */
            // clearResetFlow();
        } catch (error) {
            console.error("Reset password failed:", error);
            setError(
                error instanceof Error ? error.message : "Unable to process your request."
            );
        }
    };

    /*
    * Protect the route if the user reaches this page directly
    * without successfully completing the OTP flow.
    */

    useEffect(() => {
        if (!resetToken) {
            navigate("/forgot-password", { replace: true });
        }
    }, [resetToken, navigate])

    const canSubmit =
        passwordIsValid &&
        confirmPasswordIsValid &&
        !!resetToken &&
        !loading;

    return (
        <main className="reset-password">
            <section className="reset-password__card">
                <div className="reset-password__icon">
                    <span className="reset-password__icon-symbol">✓</span>
                </div>

                <header className="reset-password__header">
                    <h1 className="reset-password__title">
                        Reset your password
                    </h1>

                    <p className="reset-password__description">
                        Create a new password for your account.
                    </p>

                    {email && (
                        <p className="reset-password__email">
                            {email}
                        </p>
                    )}
                </header>
                {otpSuccessMessage && (
                    <div className="reset-password__success" role="status">
                        <span>✓</span>
                        {otpSuccessMessage}
                    </div>
                )}
                <form
                    className="reset-password__form"
                    onSubmit={handleSubmit}
                >
                    <div className="reset-password__field">
                        <label
                            htmlFor="password"
                            className="reset-password__label"
                        >
                            New password
                        </label>

                        <div className="reset-password__input-wrapper">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    setError("");
                                    setSuccess("");
                                }}
                                className="reset-password__input"
                                autoComplete="new-password"
                                aria-describedby="password-requirements"
                            />

                            <button
                                type="button"
                                className="reset-password__password-toggle"
                                onClick={() =>
                                    setShowPassword((previous) => !previous)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                aria-pressed={showPassword}
                            >
                                {showPassword ? (
                                    <EyeOff size={18} aria-hidden="true" />
                                ) : (
                                    <Eye size={18} aria-hidden="true" />
                                )}
                            </button>
                        </div>

                        {password.length > 0 && (
                            <ul
                                id="password-requirements"
                                className="reset-password__rules"
                            >
                                <ValidationRule
                                    valid={PASSWORD_RULES.minLength.test(password)}
                                >
                                    {PASSWORD_RULES.minLength.message}
                                </ValidationRule>

                                <ValidationRule
                                    valid={PASSWORD_RULES.hasUppercase.test(password)}
                                >
                                    {PASSWORD_RULES.hasUppercase.message}
                                </ValidationRule>

                                <ValidationRule
                                    valid={PASSWORD_RULES.hasLowercase.test(password)}
                                >
                                    {PASSWORD_RULES.hasLowercase.message}
                                </ValidationRule>

                                <ValidationRule
                                    valid={PASSWORD_RULES.hasNumber.test(password)}
                                >
                                    {PASSWORD_RULES.hasNumber.message}
                                </ValidationRule>

                                <ValidationRule
                                    valid={PASSWORD_RULES.hasSpecialCharacter.test(password)}
                                >
                                    {PASSWORD_RULES.hasSpecialCharacter.message}
                                </ValidationRule>
                            </ul>
                        )}
                    </div>

                    <div className="reset-password__field">
                        <label
                            htmlFor="confirm-password"
                            className="reset-password__label"
                        >
                            Confirm password
                        </label>
                        <div className="reset-password__input-wrapper">
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                onChange={(event) => {
                                    setConfirmPassword(event.target.value);
                                    setError("");
                                    setSuccess("");
                                }}
                                className={`reset-password__input ${confirmPassword.length > 0
                                    ? confirmPasswordIsValid
                                        ? "reset-password__input--valid"
                                        : "reset-password__input--invalid"
                                    : ""
                                    }`}
                                autoComplete="new-password"
                                aria-describedby="confirm-password-status"
                            />

                            <button
                                type="button"
                                className="reset-password__password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (previous) => !previous
                                    )
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide confirm password"
                                        : "Show confirm password"
                                }
                                aria-pressed={showConfirmPassword}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={18} aria-hidden="true" />
                                ) : (
                                    <Eye size={18} aria-hidden="true" />
                                )}
                            </button>
                        </div>

                        {confirmPassword.length > 0 && (
                            <div
                                id="confirm-password-status"
                                className={`reset-password__match ${confirmPasswordIsValid
                                    ? "reset-password__match--valid"
                                    : "reset-password__match--invalid"
                                    }`}
                            >
                                {confirmPasswordIsValid ? (
                                    <>
                                        <Check size={15} aria-hidden="true" />
                                        <span>Passwords match</span>
                                    </>
                                ) : (
                                    <>
                                        <X size={15} aria-hidden="true" />
                                        <span>Passwords do not match</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div
                            className="reset-password__message reset-password__message--error"
                            role="alert"
                        >
                            <CircleAlert size={15} />
                            <span>
                                {error}
                            </span>
                        </div>
                    )}

                    {success && (
                        <div
                            className="reset-password__message reset-password__message--success"
                            role="status"
                        >
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="reset-password__submit"
                        disabled={!canSubmit}
                    >
                        {loading
                            ? "Resetting password..."
                            : "Reset password"}
                    </button>
                </form>
                <button
                    type="button"
                    className="reset-password__back-login-button"
                    disabled={loading}
                    onClick={() => {
                        clearResetFlow();
                        navigate("/login");
                    }}
                >
                    <ArrowLeft size={17} />
                    Back to Login
                </button>
            </section>
        </main>
    );
};

export default ResetPassword;