import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { MobileView } from './components/MobileView.tsx'
import { LocaleProvider } from './i18n/LocaleContext.tsx'

const isMobile = window.matchMedia('(pointer: coarse)').matches

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider>
      {isMobile ? <MobileView /> : <App />}
    </LocaleProvider>
  </StrictMode>,
)
