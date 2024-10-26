import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './store/AuthContext.tsx'
import { TextProvider } from './store/TextContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TextProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </TextProvider>


  </StrictMode>,
)
