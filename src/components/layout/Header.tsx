import { useState } from "react";
import { useAuth } from "../../store/auth.store";
import { useMatches, useNavigate } from "react-router-dom";
import { useUI } from "../../store/ui.store";
import { toast } from "react-toastify";
import { useSavedPrompts } from "../../store/savedPrompts.store";
import ConfirmModal from "../../components/modal/ConfirmModal";
import { Menu, X } from "lucide-react"
import "./Header.scss"

type RouteHandle = {
    title?: string
}

export default function Header() {
    const matches = useMatches()
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const currentMatch = matches[matches.length - 1]
    const handle = currentMatch?.handle as RouteHandle
    const title = handle?.title || 'App'
    const { showLoader } = useUI()


    const toggleSidebar = useUI((state) => state.toggleSidebar)
    const sidebarCollapsed = useUI((state) => state.sidebarCollapsed)

    const confirmLogout = () => {
        logout()
        useSavedPrompts.getState().syncPrompts()
        toast.success("Logged out successfully")
        showLoader()
        navigate("/login", { replace: true })
    }

    return (
        <div className="HeaderContainer">
            <button className={`HeaderContainer__menu ${sidebarCollapsed ? "HeaderContainer__menu--collapsed" : ""}`} onClick={toggleSidebar} aria-label={sidebarCollapsed ? "Open Sidebar" : "Close Sidebar"} aria-expanded={!sidebarCollapsed}>
                {
                    sidebarCollapsed ? <Menu size={20} strokeWidth={2.2} /> : <X size={20} strokeWidth={2.2} />
                }
            </button>
            <div className="HeaderContainer__title">
                <h2>{title}</h2>
            </div>
            <div className="HeaderContainer__user-sec">
                <p>{`Welcome ${user?.name}`}</p>
                <img src="/mail.svg" alt="L" />
                <img src="/bell.svg" alt="L" />
                <button className="HeaderContainer__logout" onClick={() => setShowLogoutModal(true)}>
                    Logout
                </button>
            </div>
            <ConfirmModal
                open={showLogoutModal}
                onCancel={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
                title="Confirm Logout"
                message="Are you sure you want to logout?"
                type="default"
                confirmText="Logout"
                cancelText="Cancel"
            />
        </div>
    )
}