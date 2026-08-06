import { lazy, Suspense, useEffect } from "react"
import { createHashRouter, Navigate } from "react-router-dom"

import Layout from "../app/layout"
import Login from "../components/login/Login"
import ProtectedRoute from "./ProtectedRoute"
import PublicRoute from "./PublicRoute"
import Unauthorized from "../modules/Unauthorized"
import { SafeRemote } from "../components/SafeRemote"
import { retryImport } from "../utils/retryImport"

import Settings from "../modules/settings/Settings"

import { useAuth } from "../store/auth.store"

//MFE's
const Playground = lazy(() => retryImport(() => import("playground/Playground")))
const SavedPromptDetail = lazy(() => retryImport(() => import("playground/SavedPromptDetail")))

const Templates = lazy(() => retryImport(() => import("templates/Templates")))
const Evaluation = lazy(() => retryImport(() => import("evaluation/Evaluation")))

//Local Navigation
import { useParams, useNavigate } from "react-router-dom"

const PlaygroundWrapper = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const handler = (e: Event) => {
            const event = e as CustomEvent<{ id: number }>
            navigate(`/saved-prompts/${event.detail.id}`)
        }
        window.addEventListener("prompt-version-created", handler)
        return () => window.removeEventListener("prompt-version-created", handler)
    }, [navigate])
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
                    <ProtectedRoute allowedRoles={["admin", "developer", "user"]}>
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
                    <ProtectedRoute allowedRoles={["admin", "developer", "user"]}>
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
                    <ProtectedRoute allowedRoles={["admin", "developer"]}>
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
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <Settings />
                    </ProtectedRoute>
                ),
                handle: { title: "Settings" }
            },
            {
                path: "/saved-prompts/:id",
                element: (
                    <ProtectedRoute allowedRoles={["admin", "developer", "user"]}>
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
                    <ProtectedRoute allowedRoles={["admin", "developer", "user"]}>
                        <Unauthorized />
                    </ProtectedRoute>
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