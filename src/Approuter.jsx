// src/AppRouter.jsx
// Main Router — connects ALL pages including Ocean Living funnel
// Replace your existing router/main.jsx with this OR import into it

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ── Existing pages ────────────────────────────────────────────────
import App                      from './App';          // existing Seagloré home page

// ── Ocean Living funnel pages ─────────────────────────────────────
import OceanLivingCertification from './OceanLivingCertification';
import CheckoutPage             from './CheckoutPage';
import ThankYouPage             from './ThankYouPage';
import CoursePage               from './CoursePage';

// ── If you have an Atelier page ───────────────────────────────────
// import AtelierPage from './AtelierPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── MAIN SEAGLORÉ HOME ── */}
        <Route path="/"                             element={<App />} />

        {/* ── OCEAN LIVING FUNNEL ── */}
        <Route path="/ocean-living-certification"   element={<OceanLivingCertification />} />
        <Route path="/checkout-ocean-living"        element={<CheckoutPage />} />
        <Route path="/thank-you-ocean"              element={<ThankYouPage />} />
        <Route path="/course-ocean-living"          element={<CoursePage />} />

        {/* ── OTHER EXISTING ROUTES ── */}
        {/* <Route path="/atelier" element={<AtelierPage />} /> */}

        {/* ── 404 fallback ── */}
        <Route path="*" element={<App />} />

      </Routes>
    </BrowserRouter>
  );
}