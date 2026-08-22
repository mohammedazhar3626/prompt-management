import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
// import { login } from "../../services/auth.api"
import { useMutation } from "@apollo/client/react"
import { LOGIN_MUTATION, type LoginMutationsData, type LoginMutationVariables } from "../../graphql/auth/mutations"
import { useAuth } from "../../store/auth.store"
import { useUI } from "../../store/ui.store"
import { toast } from "react-toastify"
import { Eye, EyeOff } from "lucide-react"
import {
    validateEmail,
    validatePassword
} from "../../utils/validation"
import "./Login.scss"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false)

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

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
            console.log('result', result);


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
            const message = err?.message || "Login failed"
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

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
                    <button
                        type="submit"
                        disabled={isDisabled}
                        className="login__btn"
                    >
                        {loading ? "Logging in..." : "Login"}
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
        </div>
    )
}

export default Login