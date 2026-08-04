import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { Outlet } from "react-router-dom";
import Loader from "../components/loader/Loader";
import { useUI } from "../store/ui.store";

import "./layout.scss"

export default function Layout() {
    const location = useLocation()
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const { loading, showLoader, hideLoader } = useUI()


    const sidebarCollapsed = useUI((state) => state.sidebarCollapsed)
    const toggleSidebar = useUI((state) => state.toggleSidebar)

    useEffect(() => {
        showLoader()
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }
        timerRef.current = setTimeout(() => {
            hideLoader()
        }, 1000)
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [location.pathname])


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 992) {
                useUI.getState().setSidebarCollapsed(true)
            } else {
                useUI.getState().setSidebarCollapsed(false)
            }
        }
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
                e.preventDefault()
                toggleSidebar()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])


    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !sidebarCollapsed && window.innerWidth < 992) {
                useUI.getState().setSidebarCollapsed(true)
            }
        }
        window.addEventListener("keydown", handleEscape)
        return () => window.removeEventListener("keydown", handleEscape)
    }, [sidebarCollapsed])

    return (
        <div className={`layout ${sidebarCollapsed ? "layout--collapsed" : ""}`}>
            <div className="layout__sidebar">
                <Sidebar />
            </div>
            <div className="layout__content">
                <div className="layout__header">
                    <Header />
                </div>
                <div className="layout__main">
                    <Outlet />
                </div>
            </div>
            {loading && <Loader />}
        </div>
    )
}