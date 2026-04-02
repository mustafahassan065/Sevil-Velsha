// src/analytics.js
// Ocean Living — Analytics & Tracking Setup
// Add this to your index.html <head> OR call initAnalytics() in main.jsx

// ─────────────────────────────────────────────────────────────────
// EDIT THESE WITH YOUR REAL IDs
// ─────────────────────────────────────────────────────────────────
const GA4_ID       = 'G-XXXXXXXXXX';       // ← paste your GA4 ID
const META_PIXEL   = 'XXXXXXXXXXXXXXXXXX'; // ← paste your Meta Pixel ID
// ─────────────────────────────────────────────────────────────────

// ── Initialize GA4 ────────────────────────────────────────────────
export function initGA4() {
  if (window.gtagLoaded) return;
  window.gtagLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src   = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA4_ID);
}

// ── Initialize Meta Pixel ─────────────────────────────────────────
export function initMetaPixel() {
  if (window.fbq) return;
  (function(f,b,e,v,n,t,s) {
    if (f.fbq) return; n=f.fbq=function() {
      n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq=n; n.push=n; n.loaded=!0; n.version='2.0';
    n.queue=[]; t=b.createElement(e); t.async=!0;
    t.src=v; s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s);
  })(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', META_PIXEL);
  window.fbq('track', 'PageView');
}

// ── Custom Events ─────────────────────────────────────────────────
// Call these at the right places in your components

// 1. When landing page loads
export const trackLandingView = () => {
  if (window.gtag) window.gtag('event', 'view_ocean_landing');
  if (window.fbq)  window.fbq('track', 'ViewContent', { content_name: 'Ocean Living Landing' });
};

// 2. When primary CTA is clicked
export const trackPrimaryCtaClick = () => {
  if (window.gtag) window.gtag('event', 'click_primary_cta', { page: 'ocean_landing' });
  if (window.fbq)  window.fbq('track', 'AddToCart', { value: 49, currency: 'USD' });
};

// 3. When free lesson email is submitted
export const trackLeadSubmit = () => {
  if (window.gtag) window.gtag('event', 'submit_free_lesson_email');
  if (window.fbq)  window.fbq('track', 'Lead', { content_name: 'Ocean Living Free Lesson' });
};

// 4. When checkout starts
export const trackCheckoutStart = () => {
  if (window.gtag) window.gtag('event', 'begin_checkout_ocean', { value: 49, currency: 'USD' });
  if (window.fbq)  window.fbq('track', 'InitiateCheckout', { value: 49, currency: 'USD' });
};

// 5. When purchase completes
export const trackPurchase = (sessionId) => {
  if (window.gtag) window.gtag('event', 'purchase_ocean', {
    transaction_id: sessionId, value: 49, currency: 'USD',
  });
  if (window.fbq) window.fbq('track', 'Purchase', { value: 49, currency: 'USD' });
};

// ── Initialize both on app load ────────────────────────────────────
export function initAnalytics() {
  initGA4();
  initMetaPixel();
}