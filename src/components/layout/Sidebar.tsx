import React, { useState, useEffect, useMemo } from "react"
import { navigation } from "../../constants/navigation"
import { useAuth } from "../../store/auth.store"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { ChevronDown, ChevronRight, MessageSquareText, SquarePlus } from "lucide-react"
import { useUI } from "../../store/ui.store"
import { useQuery } from "@apollo/client/react"
import { GET_NAVIGATION } from "../../graphql/navigation/queries"
import { getNavigationIcon } from "../../constants/navigationIcons"
import { NavigationItem } from "../../types/navigation"
import { useSavedPrompts } from "../../store/savedPrompts.store"
import ConfirmModal from "../modal/ConfirmModal"

import "./Sidebar.scss"
import { useNavigationStore } from "../../store/navigation.store"

const iconMap: Record<string, any> = {
    SquarePlus
}

export default function Sidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { loading, showLoader, hideLoader } = useUI()
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
    const { user } = useAuth()
    const { data: navigationData, loading: navigationLoading, error: navigationError } = useQuery<{ navigation: NavigationItem[] }>(GET_NAVIGATION, { fetchPolicy: "cache-first" });
    const savedPrompts = useSavedPrompts((s) => s.savedPrompts)
    const syncPrompts = useSavedPrompts((s) => s.syncPrompts)

    const role = user?.role || ""
    // const menu = role ? navigation.filter(item => item.roles.includes(role)) : []
    const menu = useMemo(() => navigationData?.navigation ?? [], [navigationData])



    const sidebarCollapsed = useUI((state) => state.sidebarCollapsed)

    //discradChangesNavigation
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
    const { playgroundDirty, setPlaygroundDirty } = useNavigationStore()

    const handleNavigation = (e: React.MouseEvent, path: string) => {
        if (loading) {
            e.preventDefault()
            return
        }
        if (!playgroundDirty) {
            showLoader()
            return
        }

        e.preventDefault()

        setPendingNavigation(path)
        setShowConfirmModal(true)
    }

    const handleDiscard = () => {
        setPlaygroundDirty(false)
        setShowConfirmModal(false)
        if (!pendingNavigation) return
        const path = pendingNavigation
        setPendingNavigation(null)
        showLoader()
        navigate(path)
    }

    const toggleNavigationItem = (id: string) => {
        setExpandedItems((prev) => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    const handleCancel = () => {
        setPendingNavigation(null)
        setShowConfirmModal(false)
    }


    useEffect(() => {
        const parentItems = menu.filter(
            (item) =>
                item.children &&
                item.children.length > 0,
        );

        const activeParent = parentItems.find(
            (item) =>
                item.children.some(
                    (child) =>
                        child.path &&
                        location.pathname.startsWith(
                            child.path,
                        ),
                ),
        );

        if (!activeParent) {
            return;
        }

        setExpandedItems((previous) => {
            const next = new Set(previous);
            next.add(activeParent.id);
            return next;
        });
    }, [
        location.pathname,
        menu,
    ]);


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
                {menu.map((item) => {
                    const Icon = getNavigationIcon(
                        item.icon,
                    );
                    const hasChildren =
                        item.children.length > 0;
                    const isExpanded =
                        expandedItems.has(item.id);
                    const hasActiveChild =
                        item.children.some(
                            (child) =>
                                child.path &&
                                location.pathname.startsWith(
                                    child.path,
                                ),
                        );
                    /*
                    * Parent navigation
                    */
                    if (hasChildren) {
                        return (
                            <div
                                key={item.id}
                                className="Sidebar-Container__group"
                            >
                                <button
                                    type="button"
                                    className={`Sidebar-Container__link Sidebar-Container__parent ${hasActiveChild
                                        ? "Sidebar-Container__link--active"
                                        : ""
                                        }`}
                                    onClick={() =>
                                        toggleNavigationItem(item.id)
                                    }
                                >
                                    <Icon size={18} />
                                    {!sidebarCollapsed && (
                                        <>
                                            <span className="Sidebar-Container__label">
                                                {item.label}
                                            </span>

                                            {isExpanded ? (
                                                <ChevronDown
                                                    size={16}
                                                    className="Sidebar-Container__chevron"
                                                />
                                            ) : (
                                                <ChevronRight
                                                    size={16}
                                                    className="Sidebar-Container__chevron"
                                                />
                                            )}
                                        </>
                                    )}
                                </button>
                                {!sidebarCollapsed &&
                                    isExpanded && (
                                        <div className="Sidebar-Container__submenu">
                                            {item.children.map(
                                                (child) => {
                                                    const ChildIcon =
                                                        getNavigationIcon(
                                                            child.icon,
                                                        );

                                                    if (!child.path) {
                                                        return null;
                                                    }

                                                    return (
                                                        <NavLink
                                                            key={child.id}
                                                            to={child.path}
                                                            onClick={(event) =>
                                                                handleNavigation(
                                                                    event,
                                                                    child.path!,
                                                                )
                                                            }
                                                            className={({
                                                                isActive,
                                                            }) =>
                                                                `Sidebar-Container__sublink ${isActive
                                                                    ? "Sidebar-Container__sublink--active"
                                                                    : ""
                                                                }`
                                                            }
                                                        >
                                                            <ChildIcon size={17} />

                                                            <span>
                                                                {child.label}
                                                            </span>
                                                        </NavLink>
                                                    );
                                                },
                                            )}
                                        </div>
                                    )}
                            </div>
                        );
                    }
                    /*
                    * Normal navigation item
                    */
                    if (!item.path) {
                        return null;
                    }
                    return (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            onClick={(event) =>
                                handleNavigation(
                                    event,
                                    item.path!,
                                )
                            }
                            className={({
                                isActive,
                            }) =>
                                `Sidebar-Container__link ${isActive
                                    ? "Sidebar-Container__link--active"
                                    : ""
                                }`
                            }
                        >
                            <Icon size={18} />

                            {!sidebarCollapsed && (
                                <span className="Sidebar-Container__label">
                                    {item.label}
                                </span>
                            )}
                        </NavLink>
                    );
                })}
                {/* {savedPrompts.length > 0 && (
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
                )} */}
                {/* {React.Children.toArray(savedPrompts.map((item) => {
                    const Icon = iconMap[item.icon] || SquarePlus
                    const path = `/saved-prompts/${item.id}`

                    return (
                        <>
                            <NavLink
                                key={item.id}
                                to={path}
                                onClick={(e) => handleNavigation(e, path)}
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
                }))} */}
            </div>
            <ConfirmModal
                open={showConfirmModal}
                title="Discard changes"
                message="You have unsaved changes.Do you want to leave the page?"
                confirmText="Discard"
                cancelText="Stay"
                type="warning"
                loading={false}
                onConfirm={handleDiscard}
                onCancel={handleCancel}
            />
        </div>
    )
}