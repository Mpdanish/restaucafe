import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from './context/authContext'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
    <App  />
    </AuthProvider>
)