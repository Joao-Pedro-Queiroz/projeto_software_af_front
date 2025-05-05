import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <Auth0Provider
      domain="dev-vlbhbshl7b1pxe8e.us.auth0.com"
      clientId="eo8WNkaTwrcGujuCMSkRZG3yMYuQvXTy"
      authorizationParams={{
        audience: "https://dev-vlbhbshl7b1pxe8e.us.auth0.com/api/v2/",
        redirect_uri: window.location.origin
      }}
    >
    <App />
  </Auth0Provider>,
)
