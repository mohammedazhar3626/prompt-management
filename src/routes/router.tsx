import { lazy, Suspense, useEffect } from "react"
import { createHashRouter, Navigate } from "react-router-dom"

import Layout from "../app/layout"
import Login from "../components/login/Login"
import ProtectedRoute from "./ProtectedRoute"
import PublicRoute from "./PublicRoute"
import Unauthorized from "../modules/Unauthorized"
import { SafeRemote } from "../components/SafeRemote"
import { retryImport } from "../utils/retryImport"
import { useNavigationStore } from "../store/navigation.store"

import Settings from "../modules/settings/Settings"

import { useAuth } from "../store/auth.store"

//MFE's
const Playground = lazy(() => retryImport(() => import("playground/Playground")))
const SavedPromptDetail = lazy(() => retryImport(() => import("playground/SavedPromptDetail")))

const Templates = lazy(() => retryImport(() => import("templates/Templates")))
const Evaluation = lazy(() => retryImport(() => import("evaluation/Evaluation")))

//Local Navigation
import { useParams, useNavigate } from "react-router-dom"
import { ADMIN_DEVELOPER_ROLES, ADMIN_ROLES, ALL_ROLES } from "../constants/roles"
import Signup from "../components/signup/Signup"
import ForgotPassword from "../components/forgot-password/ForgotPassword"
import ResetPassword from "../components/reset-password/ResetPassword"
import Users from "../modules/settings/users/Users"

const PlaygroundWrapper = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { setPlaygroundDirty } = useNavigationStore()

    useEffect(() => {
        const handler = (e: Event) => {
            const event = e as CustomEvent<{ id: number }>
            navigate(`/saved-prompts/${event.detail.id}`)
        }
        window.addEventListener("prompt-version-created", handler)
        return () => window.removeEventListener("prompt-version-created", handler)
    }, [navigate])

    useEffect(() => {
        const handler = (e: any) => {
            setPlaygroundDirty(e.detail)
        }

        window.addEventListener("playground-dirty-change", handler)

        return () => {
            window.removeEventListener("playground-dirty-change", handler)
        }
    }, [])
    return <Playground />
}

const SavedPromptWrapper = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    return <SavedPromptDetail id={id} onDelete={() => navigate("/playground")} onEdit={(promptId: any) => navigate(`/playground?edit=${promptId}&version=current`)} />
}


const RootRedirect = () => {
    const { user, hasHydrated } = useAuth()

    if (!hasHydrated) return null
    return user
        ? <Navigate to="/playground" replace />
        : <Navigate to="/login" replace />
}

export const router = createHashRouter([
    {
        path: "/login",
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        )
    },
    {
        path: "/signup",
        element: (
            <PublicRoute>
                <Signup />
            </PublicRoute>
        )
    },
    {
        path: "/forgot-password",
        element: (
            <PublicRoute>
                <ForgotPassword />
            </PublicRoute>
        )
    },
    {
        path: "/reset-password",
        element: (
            <PublicRoute>
                <ResetPassword />
            </PublicRoute>
        )
    },
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <RootRedirect />
            },
            {
                path: "playground",
                element: (
                    <ProtectedRoute allowedRoles={ALL_ROLES}>
                        <SafeRemote fallback={<div>Failed to load Playground</div>}>
                            <PlaygroundWrapper />
                        </SafeRemote>
                    </ProtectedRoute>
                ),
                handle: { title: "Prompt Playground" },
                errorElement: <div>Route Error Occurred</div>
            },
            {
                path: "templates",
                element: (
                    <ProtectedRoute allowedRoles={ALL_ROLES}>
                        <SafeRemote fallback={<div>Failed to load Templates</div>}>
                            <Templates />
                        </SafeRemote>
                    </ProtectedRoute>
                ),
                handle: { title: "Template Library" }
            },
            {
                path: "evaluation",
                element: (
                    <ProtectedRoute allowedRoles={ADMIN_DEVELOPER_ROLES}>
                        <SafeRemote fallback={<div>Failed to load Evaluation</div>}>
                            <Evaluation />
                        </SafeRemote>
                    </ProtectedRoute>
                ),
                handle: { title: "Evaluation Reports" }
            },
            {
                path: "settings",
                element: (
                    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                        <Settings />
                    </ProtectedRoute>
                ),
                handle: { title: "Settings" },
                children: [
                    {
                        path: "users",
                        element: <Users />,
                        handle: { title: "Users Management" }
                    }
                ]
            },
            {
                path: "/saved-prompts/:id",
                element: (
                    <ProtectedRoute allowedRoles={ALL_ROLES}>
                        <SafeRemote fallback={<div>Failed to load Saved Prompt</div>}>
                            <SavedPromptWrapper />
                        </SafeRemote>
                    </ProtectedRoute>
                ),
                handle: { title: "Saved Prompt" }
            },
            {
                path: "unauthorized",
                element: (
                    <Unauthorized />
                ),
                handle: { title: "Unauthorized" }
            },
            {
                path: "*",
                element: <RootRedirect />
            }
        ]
    }
])