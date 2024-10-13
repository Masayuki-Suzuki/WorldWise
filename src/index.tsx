import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CitiesProvider } from './contexts/CitiesContext'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CitiesProvider>
            <App />
        </CitiesProvider>
    </StrictMode>
)
