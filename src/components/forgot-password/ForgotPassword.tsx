import { useMutation } from "@apollo/client/react";
import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    Mail,
    RefreshCw,
    ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePasswordReset } from "../../context/PasswordResetContext";
import "./ForgotPassword.scss";
import { REQUEST_PASSWORD_RESET, RequestPasswordResetData, RequestPasswordResetVariables, VERIFY_PASSWORD_RESET_OTP, VerifyPasswordResetOtpData, VerifyPasswordResetOtpVariables } from "../../graphql/auth/mutations";


const ForgotPassword = () => {
    const navigate = useNavigate();

    const {
        challengeId,
        expiresAt,
        resendAvailableAt,
        setChallenge,
        setResetToken,
        setOtpSuccessMessage,
        clearResetFlow,
    } = usePasswordReset();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const [otpSent, setOtpSent] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [otpSeconds, setOtpSeconds] = useState(0);
    const [resendSeconds, setResendSeconds] = useState(0);

    const [requestPasswordReset] = useMutation<RequestPasswordResetData, RequestPasswordResetVariables>(REQUEST_PASSWORD_RESET);

    const [verifyPasswordResetOtp] = useMutation<VerifyPasswordResetOtpData, VerifyPasswordResetOtpVariables>(VERIFY_PASSWORD_RESET_OTP);

    /*
    * Restore OTP state if the user refreshes/navigation
    * does not destroy the context.
    */
    useEffect(() => {
        if (challengeId) {
            setOtpSent(true);
        }
    }, [challengeId]);

    /*
    * OTP expiration timer
    */
    useEffect(() => {
        if (!expiresAt) {
            setOtpSeconds(0);
            return;
        }

        const updateTimer = () => {
            const remaining = Math.max(
                0,
                Math.floor(
                    (new Date(expiresAt).getTime() - Date.now()) / 1000
                )
            );

            setOtpSeconds(remaining);
        };

        updateTimer();

        const interval = window.setInterval(
            updateTimer,
            1000
        );

        return () => window.clearInterval(interval);
    }, [expiresAt]);

    /*
    * Resend timer
    */
    useEffect(() => {
        if (!resendAvailableAt) {
            setResendSeconds(0);
            return;
        }

        const updateTimer = () => {
            const remaining = Math.max(
                0,
                Math.floor(
                    (new Date(resendAvailableAt).getTime() -
                        Date.now()) /
                    1000
                )
            );

            setResendSeconds(remaining);
        };

        updateTimer();

        const interval = window.setInterval(
            updateTimer,
            1000
        );

        return () => window.clearInterval(interval);
    }, [resendAvailableAt]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    };

    const validateEmail = () => {
        if (!email.trim()) {
            setError("Email is required.");
            return false;
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email address.");
            return false;
        }

        return true;
    };

    const handleSendOtp = async () => {
        setError("");
        setSuccess("");

        if (!validateEmail()) {
            return;
        }

        try {
            setLoading(true);

            const { data } = await requestPasswordReset({
                variables: {
                    email: email.trim(),
                },
            });

            const result = data?.requestPasswordReset;

            if (!result?.success) {
                setError(
                    result?.message ||
                    "Unable to send verification code."
                );
                return;
            }

            if (!result.challengeId || !result?.expiresAt || !result.resendAvailableAt) {
                setError("Invalid password reset response. Please try again.");
                return;
            }

            setChallenge(
                email,
                result.challengeId,
                result.expiresAt,
                result.resendAvailableAt,
            );

            setOtpSent(true);
            setOtp("");
            setSuccess(
                "Verification code sent to your email."
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to send verification code."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setError("");
        setSuccess("");

        if (!challengeId) {
            setError(
                "Your verification session has expired. Please request a new code."
            );
            return;
        }

        if (!otp.trim()) {
            setError("Please enter the verification code.");
            return;
        }

        if (otp.length !== 6) {
            setError("Verification code must be 6 digits.");
            return;
        }

        if (otpSeconds <= 0) {
            setError(
                "Verification code has expired. Please request a new code."
            );
            return;
        }

        try {
            setLoading(true);

            const { data } = await verifyPasswordResetOtp({
                variables: {
                    challengeId,
                    otp: otp.trim(),
                },
            });

            const result =
                data?.verifyPasswordResetOtp;

            if (!result?.success) {
                setError(
                    result?.message ||
                    "Invalid verification code."
                );
                return;
            }

            if (!result?.resetToken) {
                setError("Unable to create password reset session");
                return;
            }

            setResetToken(result.resetToken);
            setOtpSuccessMessage("Email verified successfully. You can now create a new Password.")
            navigate("/reset-password", { replace: true });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to verify the code."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendSeconds > 0 || loading) {
            return;
        }

        await handleSendOtp();
    };

    const handleChangeEmail = () => {
        clearResetFlow();
        setOtpSent(false);
        setOtp("");
        setError("");
        setSuccess("");
    };

    return (
        <div className="forgot-password">
            <div className="forgot-password__card">

                <div className="forgot-password__header">
                    <div className="forgot-password__icon">
                        {otpSent ? (
                            <ShieldCheck size={28} />
                        ) : (
                            <Mail size={28} />
                        )}
                    </div>

                    <h1 className="forgot-password__title">
                        {otpSent
                            ? "Verify your email"
                            : "Forgot password?"}
                    </h1>

                    <p className="forgot-password__description">
                        {otpSent
                            ? `Enter the verification code sent to ${email}`
                            : "Enter your registered email address and we'll send you a verification code."}
                    </p>
                </div>

                <div className="forgot-password__form">

                    {/* Email */}
                    <div className="forgot-password__field">
                        <label
                            className="forgot-password__label"
                            htmlFor="forgot-email"
                        >
                            Email address
                        </label>

                        <div className="forgot-password__input-wrapper">
                            <Mail size={18} />

                            <input
                                id="forgot-email"
                                type="email"
                                value={email}
                                disabled={otpSent || loading}
                                placeholder="Enter your email"
                                autoComplete="email"
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                            />
                        </div>
                    </div>

                    {!otpSent ? (
                        <button
                            type="button"
                            className="forgot-password__button"
                            disabled={loading}
                            onClick={handleSendOtp}
                        >
                            {loading ? (
                                <span className="forgot-password__loader" />
                            ) : (
                                "Send OTP"
                            )}
                        </button>
                    ) : (
                        <>
                            {/* OTP */}
                            <div className="forgot-password__field">
                                <label
                                    className="forgot-password__label"
                                    htmlFor="forgot-otp"
                                >
                                    Verification code
                                </label>

                                <div
                                    className="forgot-password__input-wrapper forgot-password__input-wrapper--otp"
                                >
                                    <ShieldCheck size={18} />

                                    <input
                                        id="forgot-otp"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        value={otp}
                                        placeholder="Enter 6-digit code"
                                        autoComplete="one-time-code"
                                        onChange={(event) =>
                                            setOtp(
                                                event.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* OTP timer */}
                            <div className="forgot-password__otp-info">
                                <div className="forgot-password__timer">
                                    <Clock3 size={16} />

                                    <span>
                                        {otpSeconds > 0
                                            ? `Code expires in ${formatTime(
                                                otpSeconds
                                            )}`
                                            : "Code expired"}
                                    </span>
                                </div>
                            </div>

                            {/* Verify */}
                            <button
                                type="button"
                                className="forgot-password__button"
                                disabled={
                                    loading || otpSeconds <= 0
                                }
                                onClick={handleVerifyOtp}
                            >
                                {loading ? (
                                    <span className="forgot-password__loader" />
                                ) : (
                                    "Verify OTP"
                                )}
                            </button>

                            {/* Resend */}
                            <div className="forgot-password__resend">
                                <span>
                                    Didn't receive the code?
                                </span>

                                <button
                                    type="button"
                                    className="
                                                forgot-password__button
                                                forgot-password__button--resend
                                                "
                                    disabled={
                                        loading || resendSeconds > 0
                                    }
                                    onClick={handleResendOtp}
                                >
                                    <RefreshCw size={15} />

                                    {resendSeconds > 0
                                        ? `Resend in ${formatTime(
                                            resendSeconds
                                        )}`
                                        : "Resend OTP"}
                                </button>
                            </div>

                            {/* Change email */}
                            <button
                                type="button"
                                className="forgot-password__button forgot-password__button--change-email"
                                disabled={loading}
                                onClick={handleChangeEmail}
                            >
                                Change email
                            </button>
                        </>
                    )}

                    {/* Error */}
                    {error && (
                        <div
                            className="forgot-password__message forgot-password__message--error"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div
                            className="forgot-password__message forgot-password__message--success"
                            role="status"
                        >
                            <CheckCircle2 size={17} />
                            <span>{success}</span>
                        </div>
                    )}
                </div>

                {/* Back to Login */}
                <button
                    type="button"
                    className="forgot-password__button forgot-password__button--back-login"
                    disabled={loading}
                    onClick={() => {
                        clearResetFlow();
                        navigate("/login");
                    }}
                >
                    <ArrowLeft size={17} />
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default ForgotPassword;