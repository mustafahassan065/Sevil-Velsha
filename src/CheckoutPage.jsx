// src/CheckoutPage.jsx
// Ocean Living Certification — Stripe Checkout Page
// Route: /checkout-ocean-living
// UPDATED: Free intro video + brochure before payment

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── CONFIG ────────────────────────────────────────────────────────
const PRICE        = '$49';
const PRICE_NUM    = 49;
const PRODUCT      = 'Ocean Living Certification Experience';
const STRIPE_API   = '/api/create-checkout-session';
const BACK_URL     = '/ocean-living-certification';

// Free intro content
const INTRO_VIDEO   = 'https://drive.google.com/file/d/1h3FuJ2HOOpbtfck5TpPgik5MWjpnXpac/preview';
const INTRO_BROCHURE = 'https://drive.google.com/uc?export=download&id=1F3LXJjYFQ97ZkSQMTRyG7S9VvYsK2oqI'; // Same as Day 2 brochure ya naya link
// ─────────────────────────────────────────────────────────────────

// ── DESIGN TOKENS ─────────────────────────────────────────────────
const TEAL    = '#2d4a47';
const TEAL_LT = '#4a7c76';
const CREAM   = '#eee9e2';
const WHITE   = '#ffffff';
const BODY    = '#3a3a3a';
const MUTED   = '#7a8a88';

const injectFont = () => {
  if (document.getElementById('ol-fonts')) return;
  const link = document.createElement('link');
  link.id = 'ol-fonts'; link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap';
  document.head.appendChild(link);
};

const T = {
  label: { fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: MUTED },
  h2:    { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 500, color: TEAL, margin: 0 },
  h3:    { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', fontWeight: 500, color: TEAL, margin: 0 },
  body:  { fontFamily: "'Jost', sans-serif", fontSize: '15px', fontWeight: 400, lineHeight: 1.7, color: BODY },
  sm:    { fontFamily: "'Jost', sans-serif", fontSize: '13px', color: MUTED, lineHeight: 1.6 },
};

const LineCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
    <path d="M5 12l5 5 9-10" stroke={TEAL_LT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function useWindowWidth() {
  const [w, setW] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const isMobile = useWindowWidth() < 768;
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [showIntroVideo, setShowIntroVideo] = useState(false);

  useEffect(() => {
    injectFont();
    if (window.gtag) window.gtag('event', 'begin_checkout_ocean', { value: 49, currency: 'USD' });
    if (window.fbq) window.fbq('track', 'InitiateCheckout', { value: 49, currency: 'USD' });
  }, []);

  const handleCheckout = async () => {
    if (!name.trim() || !email.trim()) {
      setError('Please enter your name and email to continue.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true); setError('');
    try {
      if (window.gtag) window.gtag('event', 'click_primary_cta', { page: 'checkout' });
      if (window.fbq)  window.fbq('track', 'AddPaymentInfo');
      const res = await fetch(STRIPE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Could not create checkout session.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", background: CREAM, minHeight: '100vh' }}>

      {/* ── NAV ── */}
      <nav style={{
        background: WHITE, padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${CREAM}`,
      }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'20px', fontWeight:500, letterSpacing:'0.2em', color:TEAL }}>SEAGLORÉ</span>
        </div>
        <button
          onClick={() => navigate(BACK_URL)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTED,
          }}
        >
          ← Back
        </button>
      </nav>

      {/* ── FREE INTRO SECTION ── */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px 0' }}>
        <div style={{ background: WHITE, padding: '36px', marginBottom: 24, textAlign: 'center' }}>
          <p style={{ ...T.label, marginBottom: 12 }}>Free Introduction</p>
          <h3 style={{ ...T.h3, marginBottom: 8 }}>Watch Before You Enroll</h3>
          <p style={{ ...T.body, fontSize: '14px', color: MUTED, marginBottom: 20 }}>
            Get a preview of the Ocean Living experience before you commit.
          </p>
          
          {/* Intro Video Thumbnail */}
          {!showIntroVideo ? (
            <div
              style={{ position:'relative', width:'100%', maxWidth:640, aspectRatio:'16/9', cursor:'pointer', margin:'0 auto', borderRadius:4, overflow:'hidden', background:'#000' }}
              onClick={() => setShowIntroVideo(true)}
            >
              <div style={{
                position:'absolute', inset:0,
                display:'flex', alignItems:'center', justifyContent:'center',
                background:'rgba(0,0,0,0.4)',
              }}>
                <div style={{
                  width:72, height:72, borderRadius:'50%',
                  background:'rgba(255,255,255,0.9)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={TEAL}>
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <p style={{
                position:'absolute', bottom:16, width:'100%', textAlign:'center',
                color:'rgba(255,255,255,0.8)', fontFamily:"'Jost',sans-serif", fontSize:'13px',
              }}>▶ Click to Watch Free Introduction</p>
            </div>
          ) : (
            <div style={{ width:'100%', maxWidth:640, aspectRatio:'16/9', margin:'0 auto', borderRadius:4, overflow:'hidden', background:'#000' }}>
              <iframe
                src={INTRO_VIDEO}
                title="Free Introduction"
                style={{ width:'100%', height:'100%', border:'none' }}
                allow="autoplay"
                allowFullScreen
              />
            </div>
          )}

          {/* Free Brochure Download */}
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${CREAM}` }}>
            <p style={{ ...T.body, fontSize: '14px', marginBottom: 12 }}>📖 Also included: Free Ocean Living Guide</p>
            <a
              href={INTRO_BROCHURE}
              download="Ocean-Living-Guide.pdf"
              target="_blank"
              rel="noreferrer"
              style={{
                display:'inline-block', background:TEAL, color:WHITE,
                fontFamily:"'Jost',sans-serif", fontSize:'11px', fontWeight:500,
                letterSpacing:'0.18em', textTransform:'uppercase',
                padding:'12px 28px', textDecoration:'none', borderRadius:2,
              }}
            >
              ↓ Download Free Brochure
            </a>
          </div>
        </div>
      </div>

      {/* ── CHECKOUT BODY ── */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 52px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 20 : 40, alignItems: 'start' }}>

          {/* ── LEFT — Order Summary ── */}
          <div style={{ background: WHITE, padding: '40px 36px' }}>
            <p style={{ ...T.label, marginBottom: 16 }}>Your Order</p>
            <h2 style={{ ...T.h2, marginBottom: 8 }}>{PRODUCT}</h2>
            <p style={{ ...T.sm, marginBottom: 28, lineHeight: 1.7 }}>
              A calm, guided return to clarity, ecological awareness, and a more intentional life.
            </p>

            <div style={{ borderTop: `1px solid ${CREAM}`, paddingTop: 24, marginBottom: 28 }}>
              <p style={{ ...T.label, marginBottom: 16 }}>What's included</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  '7-day structured experience',
                  'Ocean Study Digital Brochure',
                  'Final certification',
                  'Practical lifestyle system',
                  'Lifetime access',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <LineCheck/>
                    <p style={{ ...T.body, fontSize: '14px' }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              borderTop: `1px solid ${CREAM}`, paddingTop: 24,
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            }}>
              <p style={{ ...T.body, fontWeight: 500 }}>Total today</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.4rem', fontWeight: 500, color: TEAL }}>{PRICE}</p>
            </div>

            <p style={{ ...T.sm, marginTop: 12, fontSize: '12px', lineHeight: 1.6 }}>
              🔒 Secure payment via Stripe.<br/>
              Immediate access after payment.<br/>
              Early access price — may increase later.
            </p>
          </div>

          {/* ── RIGHT — Customer Form ── */}
          <div style={{ background: WHITE, padding: '40px 36px' }}>
            <p style={{ ...T.label, marginBottom: 24 }}>Complete Your Order</p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ ...T.sm, display: 'block', marginBottom: 6, fontWeight: 500 }}>Full Name</label>
              <input
                type="text" placeholder="Your full name"
                value={name} onChange={e => setName(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px', boxSizing: 'border-box',
                  border: `1px solid #d8d3cc`, borderRadius: 2,
                  fontFamily: "'Jost', sans-serif", fontSize: '14px', color: BODY,
                  background: WHITE, outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ ...T.sm, display: 'block', marginBottom: 6, fontWeight: 500 }}>Email Address</label>
              <input
                type="email" placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCheckout()}
                style={{
                  width: '100%', padding: '12px 16px', boxSizing: 'border-box',
                  border: `1px solid #d8d3cc`, borderRadius: 2,
                  fontFamily: "'Jost', sans-serif", fontSize: '14px', color: BODY,
                  background: WHITE, outline: 'none',
                }}
              />
              <p style={{ ...T.sm, fontSize: '12px', marginTop: 4 }}>Your access details will be sent here.</p>
            </div>

            {error && (
              <p style={{
                fontFamily: "'Jost', sans-serif", fontSize: '13px', color: '#c0392b',
                marginBottom: 16, padding: '10px 14px',
                background: '#fdf0ef', border: '1px solid #f5c6c2', borderRadius: 2,
              }}>
                {error}
              </p>
            )}

            <button
              onClick={handleCheckout} disabled={loading}
              style={{
                width: '100%', padding: '18px 24px',
                background: loading ? '#6a8a87' : TEAL,
                color: WHITE, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Redirecting to payment...' : `Pay ${PRICE} — Secure Checkout`}
            </button>

            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <p style={{ ...T.sm, fontSize: '11px', color: '#aaa' }}>
                Powered by <strong style={{ color: MUTED }}>Stripe</strong> · 256-bit SSL encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}