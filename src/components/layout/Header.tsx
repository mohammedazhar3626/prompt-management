import { useAuth } from "../../store/auth.store";
import { useMatches, useNavigate } from "react-router-dom";
import { useUI } from "../../store/ui.store";
import "./Header.scss"

type RouteHandle = {
    title?: string
}

export default function Header() {
    const matches = useMatches()
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const currentMatch = matches[matches.length - 1]
    const handle = currentMatch?.handle as RouteHandle
    const title = handle?.title || 'App'
    const { showLoader } = useUI()

    const handleLogout = () => {
        logout()
        showLoader()
        navigate("/login", { replace: true })
    }

    return (
        <div className="HeaderContainer">
            <div className="HeaderContainer__title">
                <h2>{title}</h2>
            </div>
            <div className="HeaderContainer__user-sec">
                <p>{`Welcome ${user?.name}`}</p>
                <img src="/mail.svg" alt="L" />
                <img src="/bell.svg" alt="L" />
                <button className="HeaderContainer__logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    )
}