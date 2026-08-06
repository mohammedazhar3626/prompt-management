import React, { useEffect } from "react"
import { navigation } from "../../constants/navigation"
import { useAuth } from "../../store/auth.store"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { MessageSquareText, SquarePlus } from "lucide-react"
import { useUI } from "../../store/ui.store"
import { useSavedPrompts } from "../../store/savedPrompts.store"

import "./Sidebar.scss"

const iconMap: Record<string, any> = {
    SquarePlus
}

export default function Sidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { loading, showLoader, hideLoader } = useUI()
    const { user } = useAuth()
    const savedPrompts = useSavedPrompts((s) => s.savedPrompts)
    const syncPrompts = useSavedPrompts((s) => s.syncPrompts)

    const role = user?.role || ""
    const menu = navigation.filter(item => item.roles.includes(role))


    const sidebarCollapsed = useUI((state) => state.sidebarCollapsed)

    useEffect(() => {
        const handler = () => {
            syncPrompts()
        }
        window.addEventListener("savedPromptsUpdated", handler)
        return () => window.removeEventListener("savedPromptsUpdated", handler)
    }, [])

    useEffect(() => {
        if (loading) {
            hideLoader()
        }
    }, [location.key])

    return (
        <div className={`Sidebar-Container ${sidebarCollapsed ? "Sidebar-Container--collapsed" : ""}`}>
            <h2 className="Sidebar-Container__header" title={sidebarCollapsed ? "Prompt Management" : ""}>
                {!sidebarCollapsed && <span>Prompt Management</span>}
                {sidebarCollapsed && <MessageSquareText size={20} />}
            </h2>

            <div className="Sidebar-Container__innerContainer">

                {/* MAIN NAV */}
                {menu?.map(item => {
                    const Icon = item.icon
                    return (
                        <div key={item.path}>
                            {item.divider && (
                                <div className="Sidebar-Container__divider"></div>
                            )}

                            <NavLink
                                to={item.path}
                                onClick={(e) => {
                                    if (loading) {
                                        e.preventDefault()
                                        return
                                    }
                                    showLoader()
                                }}
                                className={({ isActive }) =>
                                    `Sidebar-Container__link ${isActive ? "Sidebar-Container__link--active" : ""
                                    }`
                                }
                            >
                                <Icon size={18} />
                                <span className={`Sidebar-Container__label ${sidebarCollapsed ? "Sidebar-Container__label--hidden" : ""}`}>
                                    {item.label}
                                </span>
                            </NavLink>
                        </div>
                    )
                })}
                {savedPrompts.length > 0 && (
                    <>
                        {!sidebarCollapsed && (
                            <p className="Sidebar-Container__title">
                                {"Saved Prompts"}
                            </p>
                        )}
                        {!sidebarCollapsed && (
                            <div className="Sidebar-Container__divider"></div>
                        )}
                    </>
                )}
                {React.Children.toArray(savedPrompts.map((item) => {
                    const Icon = iconMap[item.icon] || SquarePlus
                    const path = `/saved-prompts/${item.id}`

                    return (
                        <>
                            <NavLink
                                key={item.id}
                                to={path}
                                onClick={(e) => {
                                    if (loading) {
                                        e.preventDefault()
                                        return
                                    }
                                    showLoader()
                                }}
                                className={({ isActive }) =>
                                    `Sidebar-Container__link ${isActive ? "Sidebar-Container__link--active" : ""
                                    }`
                                }
                            >
                                <Icon size={18} className="saved-icon" />
                                {!sidebarCollapsed && (
                                    <span className="saved-label">
                                        {item.label}...
                                    </span>
                                )}
                            </NavLink>
                        </>
                    )
                }))}
            </div>
        </div>
    )
}