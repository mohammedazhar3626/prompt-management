import { useState } from "react"
import { useNavigate } from "react-router-dom"
// import { login } from "../../services/auth.api"
import { useMutation } from "@apollo/client/react"
import { LOGIN_MUTATION, type LoginMutationsData, type LoginMutationVariables } from "../../graphql/auth/mutations"
import { useAuth } from "../../store/auth.store"
import { useUI } from "../../store/ui.store"
import { toast } from "react-toastify"
import {
    validateUsername,
    validatePassword
} from "../../utils/validation"
import "./Login.scss"

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [apiError, setApiError] = useState("")

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const { setAuth } = useAuth()
    const { showLoader } = useUI()
    const [loginMutation] = useMutation<LoginMutationsData, LoginMutationVariables>(LOGIN_MUTATION)

    const validate = () => {
        const uErr = validateUsername(username)
        const pErr = validatePassword(password)

        setUsernameError(uErr)
        setPasswordError(pErr)

        return !uErr && !pErr
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) return

        setLoading(true)
        setApiError("")

        try {
            const { data } = await loginMutation({
                variables: {
                    email: username,
                    password
                }
            })
            const result = data?.login

            if (!result) {
                throw new Error("Invalid login response")
            }

            setAuth(result.user, result.token)
            toast.success("Login successful")
            showLoader()
            navigate("/playground", { replace: true })
        } catch (err: any) {
            const message = err?.message || "Login failed"
            toast.error(message)
            setApiError(message)
        } finally {
            setLoading(false)
        }
    }

    const isDisabled =
        loading ||
        !username ||
        !password ||
        !!usernameError ||
        !!passwordError

    return (
        <div className="login">
            <div className="login__card">
                <h2 className="login__title">Prompt Platform Login</h2>
                <form className="login__fields-sec" onSubmit={handleSubmit}>
                    <div className="login__field">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value)
                                setUsernameError(validateUsername(e.target.value))
                            }}
                            placeholder="Enter username"
                        />
                        <div className="login__error">{usernameError || "\u00A0"}</div>
                    </div>
                    <div className="login__field">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setPasswordError(validatePassword(e.target.value))
                            }}
                            placeholder="Enter password"
                        />
                        <div className="login__error">{passwordError || "\u00A0"}</div>
                    </div>
                    <div className="login__error login__error--api">{apiError || "\u00A0"}</div>
                    <button
                        type="submit"
                        disabled={isDisabled}
                        className="login__btn"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login