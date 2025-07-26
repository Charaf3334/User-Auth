import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProdiver } from './context/AppContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter> {/* I think this is where we handle routing in React.js */}
    <AppContextProdiver>
      <App />
    </AppContextProdiver>
  </BrowserRouter>,
)
