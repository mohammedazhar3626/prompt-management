import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import ErrorBoundary from "../src/components/ErrorBoundary"
import { apolloClient } from './apollo/apolloClient'
import { ApolloProvider } from '@apollo/client/react'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <ApolloProvider client={apolloClient}>
                <App />
            </ApolloProvider>
        </ErrorBoundary>
    </StrictMode>,
)
