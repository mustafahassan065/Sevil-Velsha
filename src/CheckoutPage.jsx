// src/CheckoutPage.jsx
// Ocean Living Certification — Stripe Checkout Page
// Route: /checkout-ocean-living
// UPDATED: Conversion-optimized layout, breathing space, text-first hero

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── CONFIG ────────────────────────────────────────────────────────
const PRICE        = '$49';
const PRICE_NUM    = 49;
const PRODUCT      = '7-Day Ocean Reset Experience';
const STRIPE_API   = '/api/create-checkout-session';
const BACK_URL     = '/ocean-living-certification';

// Free intro content
const INTRO_VIDEO    = 'https://drive.google.com/file/d/1h3FuJ2HOOpbtfck5TpPgik5MWjpnXpac/preview';
const INTRO_BROCHURE = 'https://drive.google.com/uc?export=download&id=1F3LXJjYFQ97ZkSQMTRyG7S9VvYsK2oqI';
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
  label:   { fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: MUTED },
  hero:    { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.4rem,6vw,3.8rem)', fontWeight: 400, lineHeight: 1.15, color: TEAL, margin: 0 },
  h2:      { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,5vw,2.8rem)', fontWeight: 400, color: TEAL, margin: 0 },
  h3:      { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.4rem,2.5vw,1.8rem)', fontWeight: 500, color: TEAL, margin: 0 },
  body:    { fontFamily: "'Jost', sans-serif", fontSize: '15px', fontWeight: 400, lineHeight: 1.8, color: BODY },
  bodyLg:  { fontFamily: "'Jost', sans-serif", fontSize: 'clamp(1rem,2vw,1.15rem)', fontWeight: 400, lineHeight: 1.9, color: MUTED },
  sm:      { fontFamily: "'Jost', sans-serif", fontSize: '13px', color: MUTED, lineHeight: 1.6 },
  italic:  { fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(1rem,2vw,1.15rem)', fontWeight: 400, color: MUTED, lineHeight: 1.7 },
};

const LineCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
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
    if (!email.trim()) {
      setError('Please enter your email to continue.');
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
        body: JSON.stringify({ name: name.trim() || 'Student', email: email.trim() }),
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

  // ── SECTION STYLES ─────────────────────────────────────────────
  const sectionPad = { padding: 'clamp(60px,8vw,100px) 24px' };
  const container  = { maxWidth: '720px', margin: '0 auto' };
  const card       = { background: WHITE, padding: isMobile ? '32px 24px' : '48px 44px' };

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

      {/* ═══════════════════════════════════════════════
          HERO — Text-first, NO video, breathing space
      ═══════════════════════════════════════════════ */}
      <section style={{ ...sectionPad, background: WHITE, textAlign: 'center' }}>
        <div style={{ ...container, maxWidth: '640px' }}>
          <h1 style={{ ...T.hero, marginBottom: 24 }}>
            You feel overwhelmed.<br/>Disconnected.<br/>Constantly rushing.
          </h1>
          <p style={{ ...T.bodyLg, maxWidth: 480, margin: '0 auto 40px' }}>
            In 7 days, reset your mind, slow your life, and feel calm, clear, and in control again.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TRANSFORMATION — Before / After
      ═══════════════════════════════════════════════ */}
      <section style={{ ...sectionPad, background: CREAM }}>
        <div style={{ ...container, textAlign: 'center' }}>
          <h2 style={{ ...T.h2, marginBottom: 52 }}>What changes in 7 days</h2>
          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 32 : 24, maxWidth: '700px', margin: '0 auto',
          }}>
            {/* Before */}
            <div style={{ ...card, textAlign: 'left' }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.4rem', fontWeight:500, color:MUTED, marginBottom:28, textAlign:'center' }}>Before</p>
              {['Stressed','Distracted','Overthinking','No clarity'].map((item,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', backgroundColor:'#ccc', flexShrink:0 }}/>
                  <p style={{ ...T.body, color: MUTED, margin:0 }}>{item}</p>
                </div>
              ))}
            </div>
            {/* After */}
            <div style={{ ...card, background: TEAL, textAlign: 'left' }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.4rem', fontWeight:500, color:WHITE, marginBottom:28, textAlign:'center' }}>After</p>
              {['Calm','Focused','Clear decisions','In control'].map((item,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.5)', flexShrink:0 }}/>
                  <p style={{ ...T.body, color:'rgba(255,255,255,0.85)', margin:0 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          WHAT'S INCLUDED
      ═══════════════════════════════════════════════ */}
      <section style={{ ...sectionPad, background: WHITE }}>
        <div style={{ ...container, textAlign: 'center' }}>
          <h2 style={{ ...T.h3, marginBottom: 40 }}>What's Included</h2>
          <div style={{ maxWidth: 460, margin: '0 auto', display:'flex', flexDirection:'column', gap:16 }}>
            {[
              '7-day structured reset system',
              'Daily guided videos',
              'Ocean Living digital guide',
              'Final certification',
              'Lifetime access',
            ].map((item,i) => (
              <div key={i} style={{ display:'flex', gap:14, alignItems:'flex-start', textAlign:'left' }}>
                <LineCheck/>
                <p style={{ ...T.body, fontSize:'15px', margin:0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          VIDEO — Moved down, optional
      ═══════════════════════════════════════════════ */}
      <section style={{ ...sectionPad, background: CREAM, textAlign: 'center' }}>
        <div style={{ ...container, maxWidth: '640px' }}>
          <p style={{ ...T.label, marginBottom: 12 }}>Watch a short introduction (optional)</p>
          {!showIntroVideo ? (
            <div
              style={{ position:'relative', width:'100%', aspectRatio:'16/9', cursor:'pointer', borderRadius:4, overflow:'hidden', background:'#000' }}
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
            </div>
          ) : (
            <div style={{ width:'100%', aspectRatio:'16/9', borderRadius:4, overflow:'hidden', background:'#000' }}>
              <iframe src={INTRO_VIDEO} title="Introduction" style={{ width:'100%', height:'100%', border:'none' }} allow="autoplay" allowFullScreen/>
            </div>
          )}

          {/* Free Brochure Download */}
        {/* Free Brochure — Full Preview + Download */}
<div style={{ marginTop: 40, paddingTop: 40, borderTop: `1px solid #d8d3cc` }}>
  <p style={{ ...T.label, marginBottom: 16 }}>📖 Free Ocean Living Guide</p>
  <p style={{ ...T.body, fontSize:'14px', color: MUTED, marginBottom: 20 }}>
    Preview the full brochure below or download for later.
  </p>
  
  {/* Full Brochure Embed */}
  <div style={{ width:'100%', height:'65vh', borderRadius:4, overflow:'hidden', border:`1px solid #d8d3cc`, marginBottom:20 }}>
    <iframe
      src="https://drive.google.com/file/d/1F3LXJjYFQ97ZkSQMTRyG7S9VvYsK2oqI/preview"
      title="Ocean Living Guide"
      style={{ width:'100%', height:'100%', border:'none' }}
    />
  </div>

  {/* Download Button */}
  <a href={INTRO_BROCHURE} download="Ocean-Living-Guide.pdf" target="_blank" rel="noreferrer"
    style={{
      display:'inline-block', background:TEAL, color:WHITE,
      fontFamily:"'Jost',sans-serif", fontSize:'11px', fontWeight:500,
      letterSpacing:'0.18em', textTransform:'uppercase',
      padding:'12px 28px', textDecoration:'none', borderRadius:2,
    }}>
    ↓ Download Brochure
  </a>
</div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          PRICING + FORM — Moved lower
      ═══════════════════════════════════════════════ */}
      <section style={{ ...sectionPad, background: WHITE }}>
        <div style={{ ...container, maxWidth: '860px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 32 : 40, alignItems: 'start',
          }}>

            {/* LEFT — Order Summary */}
            <div style={card}>
              <p style={{ ...T.label, marginBottom: 16 }}>Your Order</p>
              <h2 style={{ ...T.h3, marginBottom: 6 }}>{PRODUCT}</h2>
              <p style={{ ...T.sm, marginBottom: 28, fontStyle:'italic' }}>
                A guided system for calm, clarity, and control
              </p>

              <div style={{
                borderTop: `1px solid ${CREAM}`, paddingTop: 28,
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              }}>
                <p style={{ ...T.body, fontWeight: 500 }}>Total today</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.6rem', fontWeight: 500, color: TEAL }}>{PRICE}</p>
              </div>

              <p style={{ ...T.sm, marginTop: 4, fontSize: '12px', color: TEAL_LT, fontWeight: 500 }}>
                Early access price — may increase soon
              </p>

              <p style={{ ...T.sm, marginTop: 16, fontSize: '12px', lineHeight: 1.6 }}>
                🔒 Secure payment via Stripe<br/>
                ⚡ Instant access after purchase
              </p>
            </div>

            {/* RIGHT — Customer Form */}
            <div style={card}>
              <p style={{ ...T.label, marginBottom: 24 }}>Complete Your Order</p>

              <div style={{ marginBottom: 20 }}>
                <label style={{ ...T.sm, display: 'block', marginBottom: 6, fontWeight: 500 }}>Full Name</label>
                <input
                  type="text" placeholder="Your full name"
                  value={name} onChange={e => setName(e.target.value)}
                  style={{
                    width: '100%', padding: '14px 16px', boxSizing: 'border-box',
                    border: `1px solid #d8d3cc`, borderRadius: 2,
                    fontFamily: "'Jost', sans-serif", fontSize: '14px', color: BODY,
                    background: WHITE, outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ ...T.sm, display: 'block', marginBottom: 6, fontWeight: 500 }}>Email Address *</label>
                <input
                  type="email" placeholder="your@email.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCheckout()}
                  style={{
                    width: '100%', padding: '14px 16px', boxSizing: 'border-box',
                    border: `1px solid #d8d3cc`, borderRadius: 2,
                    fontFamily: "'Jost', sans-serif", fontSize: '14px', color: BODY,
                    background: WHITE, outline: 'none',
                  }}
                />
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
                  width: '100%', padding: '20px 24px',
                  background: loading ? '#6a8a87' : TEAL,
                  color: WHITE, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: "'Jost', sans-serif", fontSize: '13px', fontWeight: 500,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  transition: 'background 0.2s',
                }}
              >
                {loading ? 'Redirecting to payment...' : 'Start My 7-Day Reset'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CREATOR BLOCK
      ═══════════════════════════════════════════════ */}
      <section style={{ ...sectionPad, background: CREAM, textAlign: 'center' }}>
        <div style={{ ...container, maxWidth: '500px' }}>
          <p style={{ ...T.label, marginBottom: 16 }}>Created by</p>
          <p style={{ ...T.h3, marginBottom: 8 }}>Sevil Velsha</p>
          <p style={{ ...T.italic }}>
            Voice & Presence Expert<br/>
            Helping people build calm, control, and clarity through nature-based systems
          </p>
        </div>
      </section>

    </div>
  );
}