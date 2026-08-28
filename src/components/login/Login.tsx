import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@apollo/client/react"
import { LOGIN_MUTATION, type LoginMutationsData, type LoginMutationVariables } from "../../graphql/auth/mutations"
import { useAuth } from "../../store/auth.store"
import { useUI } from "../../store/ui.store"
import { toast } from "react-toastify"
import { Eye, EyeOff } from "lucide-react"
import { usePasswordReset } from "../../context/PasswordResetContext"
import {
    validateEmail,
    validatePassword
} from "../../utils/validation"
import "./Login.scss"


const formatRetryTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
        return `${minutes} minute${minutes === 1 ? "" : "s"} ${String(
            remainingSeconds
        ).padStart(2, "0")} seconds`;
    }

    return `${remainingSeconds} second${remainingSeconds === 1 ? "" : "s"
        }`;
};

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false)
    const [retryAfterSeconds, setRetryAfterSeconds] = useState(0)
    const [rateLimitCode, setRateLimitCode] = useState<"LOGIN_TEMPORARILY_BLOCKED" | "LOGIN_IP_RATE_LIMITED" | "">("")

    const { clearResetFlow } = usePasswordReset();

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const { setAuth } = useAuth()
    const { showLoader } = useUI()
    const [loginMutation] = useMutation<LoginMutationsData, LoginMutationVariables>(LOGIN_MUTATION)

    const validate = () => {
        const uErr = validateEmail(email)
        const pErr = validatePassword(password)

        setEmailError(uErr)
        setPasswordError(pErr)

        return !uErr && !pErr
    }

    useEffect(() => {
        if (retryAfterSeconds <= 0) {
            return;
        }

        const timer = window.setInterval(() => {
            setRetryAfterSeconds((previous) => {
                if (previous <= 1) {
                    window.clearInterval(timer);
                    setRateLimitCode("");
                    return 0;
                }

                return previous - 1;
            })
        }, 1000);
        return () => window.clearInterval(timer);
    }, [retryAfterSeconds])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (retryAfterSeconds > 0) {
            return
        }

        if (!validate()) return

        setLoading(true)

        try {
            const { data } = await loginMutation({
                variables: {
                    email: email,
                    password
                }
            })
            const result = data?.login

            if (!result) {
                throw new Error("Invalid login response")
            }

            setAuth(result.user, result.token)
            if (rememberMe) {
                localStorage.setItem("remembered-email", email.trim());
            } else {
                localStorage.removeItem("remembered-email")
            }
            toast.success("Login successful")
            setTimeout(() => {
                showLoader()
                navigate("/playground", { replace: true })
            }, 300)
        } catch (err: any) {

            const graphQLError =
                err?.graphQLErrors?.[0] ??
                err?.errors?.[0];

            const extensions = graphQLError?.extensions;

            const code = extensions?.code;
            const retrySeconds = Number(
                extensions?.retryAfterSeconds ?? 0
            );

            if (
                code === "LOGIN_TEMPORARILY_BLOCKED" ||
                code === "LOGIN_IP_RATE_LIMITED"
            ) {
                setRateLimitCode(code);
                setRetryAfterSeconds(retrySeconds);

                return;
            }

            const message = graphQLError?.message ||
                err?.message || "Login failed";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        clearResetFlow();
    }, [clearResetFlow])

    useEffect(() => {
        const rememberedEmail = localStorage.getItem("remembered-email");

        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true)
        }
    }, [])

    const handleSignupNavigation = () => {
        showLoader();
        setTimeout(() => {
            navigate("/signup")
        }, 500);
    }

    const isDisabled =
        loading ||
        retryAfterSeconds > 0 ||
        !email ||
        !password ||
        !!emailError ||
        !!passwordError

    return (
        <div className="login">
            <div className="login__card">
                <h2 className="login__title">Prompt Platform Login</h2>
                <form className="login__fields-sec" onSubmit={handleSubmit}>
                    <div className="login__field">
                        <label>Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setEmailError(validateEmail(e.target.value))
                            }}
                            placeholder="Enter Email"
                            autoComplete="false"
                        />
                        <div className="login__error">{emailError || "\u00A0"}</div>
                    </div>
                    <div className="login__field">
                        <label>Password</label>
                        <div className="login__password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setPasswordError(validatePassword(e.target.value))
                                }}
                                placeholder="Enter password"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="login__password-toggle"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
                            </button>
                            <div className="login__error">{passwordError || "\u00A0"}</div>
                        </div>

                    </div>
                    <div className="login__options-wrapper">
                        <div className="login__options">
                            <label className="login__remember">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span>Remember me</span>
                            </label>
                        </div>
                        <div className="login__forgot-password">
                            <button
                                type="button"
                                onClick={() => navigate("/forgot-password")}
                            >
                                Forgot password?
                            </button>
                        </div>
                    </div>
                    {retryAfterSeconds > 0 && (
                        <div
                            className={`login__rate-limit ${rateLimitCode === "LOGIN_IP_RATE_LIMITED"
                                ? "login__rate-limit--network"
                                : "login__rate-limit--account"
                                }`}
                            role="alert"
                            aria-live="polite"
                        >
                            <div className="login__rate-limit-icon">
                                {rateLimitCode === "LOGIN_IP_RATE_LIMITED" ? "🌐" : "🔒"}
                            </div>

                            <div className="login__rate-limit-content">
                                <div className="login__rate-limit-title">
                                    {rateLimitCode === "LOGIN_IP_RATE_LIMITED"
                                        ? "Too many login attempts from this network"
                                        : "Too many login attempts"}
                                </div>

                                <div className="login__rate-limit-message">
                                    {rateLimitCode === "LOGIN_IP_RATE_LIMITED"
                                        ? "For security, login from this network is temporarily restricted."
                                        : "For security, this account is temporarily restricted."}
                                </div>

                                <div className="login__rate-limit-countdown">
                                    Please try again in{" "}
                                    <strong>{formatRetryTime(retryAfterSeconds)}</strong>
                                </div>
                            </div>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isDisabled}
                        className="login__btn"
                    >
                        {loading ? "Logging in..." : retryAfterSeconds > 0 ? `Try again in ${Math.floor(retryAfterSeconds / 60)} : ${String(retryAfterSeconds % 60).padStart(2, "0")}` : "Login"}
                    </button>
                </form>
                <div className="login__signup">
                    <span>Don't have an account?</span>

                    <button
                        type="button"
                        onClick={handleSignupNavigation}
                        className="login__signup-link"
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </div >
    )
}

export default Login