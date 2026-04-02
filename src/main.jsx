import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Atelier from './Atelier.jsx'
import OceanLivingCertification from './OceanLivingCertification';
import CheckoutPage             from './CheckoutPage';
import ThankYouPage             from './ThankYouPage';
import CoursePage               from './CoursePage';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/atelier" element={<Atelier />} />
        <Route path="/ocean-living-certification" element={<OceanLivingCertification />} />
        <Route path="/checkout-ocean-living"      element={<CheckoutPage />} />
<Route path="/thank-you-ocean"            element={<ThankYouPage />} />
<Route path="/course-ocean-living"        element={<CoursePage />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)