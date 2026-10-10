import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Atelier from './Atelier.jsx'
import OceanLivingCertification from './OceanLivingCertification.jsx'
import CheckoutPage from './CheckoutPage.jsx'
import ThankYouPage from './ThankYouPage.jsx'
import CoursePage from './CoursePage.jsx'
import UpsellOceanPage from './UpsellOceanPage.jsx'
import FreeOceanGuide from './FreeOceanGuide';
import OceanFreeConfirmed from './OceanFreeConfirmed';
import SeagloreCollection from './SeagloreCollection';
import OceanReset from './pages/OceanReset.jsx'

// Seaglore app (auth, dashboard, admin)
import { AuthProvider } from './context/AuthContext'
import PageTracker from './components/PageTracker'
import { appRoutes } from './routes'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PageTracker />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/atelier" element={<Atelier />} />
          <Route path="/ocean-living-certification" element={<OceanLivingCertification />} />
          <Route path="/checkout-ocean-living" element={<CheckoutPage />} />
          <Route path="/thank-you-ocean" element={<ThankYouPage />} />
          <Route path="/course-ocean-living" element={<CoursePage />} />
          <Route path="/upsell-ocean" element={<UpsellOceanPage />} />
          <Route path="/free-ocean-living-guide" element={<FreeOceanGuide />} />
          <Route path="/ocean-free-confirmed" element={<OceanFreeConfirmed />} />
          <Route path="/collection" element={<SeagloreCollection />} />
          <Route path="/ocean-reset" element={<OceanReset />} />
          {appRoutes}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)