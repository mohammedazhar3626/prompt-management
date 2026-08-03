import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import { ToastContainer } from "react-toastify"
import ErrorBoundary from './components/ErrorBoundary'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </ErrorBoundary>
  )
}

export default App
