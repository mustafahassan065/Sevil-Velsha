// src/FreeOceanGuide.jsx
// SEAGLORÉ — Free Ocean Living Guide Page
// Route: /free-ocean-living-guide
// Flow: Preview Thumbnail → Form → Full PDF Preview + Download

import React, { useState, useEffect } from 'react';

// ── PDF LINKS ─────────────────────────────────────────────────────
const PDF_PREVIEW  = 'https://drive.google.com/file/d/1uZsahpwezi7C4_WR3kPQEShwJwL9etud/preview';
const PDF_DOWNLOAD = 'https://drive.google.com/uc?export=download&id=1uZsahpwezi7C4_WR3kPQEShwJwL9etud';
const PDF_NAME     = 'Ocean-Living-Guide.pdf';

// ── EMAIL (LEADS COLLECTION) ──────────────────────────────────────
const LEAD_API = '/api/ocean-living-leads';   // <-- Apna backend endpoint yahan lagao
const BRAND_EMAIL = 'info@seaglore.com';

// ── DESIGN TOKENS (SEAGLORÉ Ocean Living Style) ───────────────────
const TEAL    = '#2d4a47';
const TEAL_LT = '#4a7c76';
const CREAM   = '#eee9e2';
const CREAM2  = '#EAE8E5';
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
  hero:    { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem,5vw,2.8rem)', fontWeight: 400, lineHeight: 1.2, color: TEAL, margin: 0 },
  h2:      { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', fontWeight: 400, color: TEAL, margin: 0 },
  h3:      { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.3rem,2.5vw,1.6rem)', fontWeight: 500, color: TEAL, margin: 0 },
  body:    { fontFamily: "'Jost', sans-serif", fontSize: '15px', fontWeight: 400, lineHeight: 1.8, color: BODY },
  bodyLg:  { fontFamily: "'Jost', sans-serif", fontSize: 'clamp(1rem,2vw,1.15rem)', fontWeight: 400, lineHeight: 1.9, color: MUTED },
  sm:      { fontFamily: "'Jost', sans-serif", fontSize: '13px', color: MUTED, lineHeight: 1.6 },
  italic:  { fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(1rem,2vw,1.15rem)', fontWeight: 400, color: MUTED, lineHeight: 1.7 },
  xs:      { fontFamily: "'Jost', sans-serif", fontSize: '11px', color: MUTED, lineHeight: 1.5 },
};

function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
}

// ── SUB-COMPONENTS ────────────────────────────────────────────────

const LineCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
    <path d="M5 12l5 5 9-10" stroke={TEAL_LT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── MAIN COMPONENT ────────────────────────────────────────────────

export default function FreeOceanGuide() {
  const isMobile = useWindowWidth() < 768;

  // Form state
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Inject fonts on mount
  useEffect(() => {
    injectFont();
    window.scrollTo(0, 0);
  }, []);

  // ── FORM SUBMIT HANDLER ──────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Validation
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      // API call to save lead
      const res = await fetch(LEAD_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Ocean Student',
          email: email.trim(),
          source: 'free-ocean-living-guide',
          tag: 'seaglore-free-pdf',
        }),
      });

      if (res.ok || res.status === 201) {
        // Success — show PDF
        setSubmitted(true);
        setSuccessMsg('✓ Your free guide is ready below!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // API fail hone par bhi PDF show karo (lead maybe save ho)
        console.warn('Lead API returned non-OK, showing PDF anyway');
        setSubmitted(true);
        setSuccessMsg('✓ Your free guide is ready below!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      // Network error par bhi PDF show karo
      console.warn('Lead API error, showing PDF anyway:', err.message);
      setSubmitted(true);
      setSuccessMsg('✓ Your free guide is ready below!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  // ── LAYOUT HELPERS ───────────────────────────────────────────
  const sectionPad = { padding: 'clamp(40px,6vw,80px) 24px' };
  const container  = { maxWidth: '720px', margin: '0 auto' };
  const card       = { background: WHITE, padding: isMobile ? '28px 20px' : '40px 36px', borderRadius: 4 };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", background: CREAM, minHeight: '100vh' }}>

      {/* ── NAV ── */}
      <nav style={{
        background: WHITE, padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${CREAM}`,
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: 500, letterSpacing: '0.2em', color: TEAL }}>
          SEAGLORÉ
        </span>
        <span style={{ ...T.xs, letterSpacing: '0.1em' }}>Free Ocean Guide</span>
      </nav>

      {/* ═══════════════════════════════════════════════
          HERO — With PDF Preview Thumbnail
      ═══════════════════════════════════════════════ */}
      <section style={{ ...sectionPad, background: WHITE, textAlign: 'center' }}>
        <div style={{ ...container, maxWidth: '600px' }}>
          
          {/* SUCCESS MESSAGE (After form submit) */}
          {successMsg && (
            <div style={{
              background: '#e8f5f0', border: '1px solid #b8d9cc',
              padding: '12px 20px', borderRadius: 4, marginBottom: 24,
              display: 'inline-block',
            }}>
              <p style={{ ...T.sm, color: TEAL, margin: 0, fontWeight: 500 }}>{successMsg}</p>
            </div>
          )}

          <p style={{ ...T.label, marginBottom: 12 }}>Free Download</p>
          <h1 style={{ ...T.hero, marginBottom: 16 }}>
            The Ocean Living Guide
          </h1>
          <p style={{ ...T.italic, marginBottom: 32 }}>
            A free introduction to calm, clarity, and intentional living — inspired by the ocean.
          </p>

          {/* ── PDF SINGLE PAGE PREVIEW ── */}
          <div style={{
            width: '100%', maxWidth: '480px', margin: '0 auto 32px',
            aspectRatio: '3/4', borderRadius: 4, overflow: 'hidden',
            border: `1px solid #d8d3cc`, boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            background: '#f5f3ef',
          }}>
            <iframe
              src={PDF_PREVIEW}
              title="Ocean Living Guide Preview"
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>

          <p style={{ ...T.sm, maxWidth: 420, margin: '0 auto' }}>
            Enter your details below to unlock the <strong>full guide</strong> — read online or download for free.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FORM SECTION
      ═══════════════════════════════════════════════ */}
      {!submitted && (
        <section style={{ ...sectionPad, background: CREAM }}>
          <div style={{ ...container, maxWidth: '520px' }}>
            <div style={card}>
              <p style={{ ...T.h3, marginBottom: 8, textAlign: 'center' }}>Get Your Free Guide</p>
              <p style={{ ...T.sm, marginBottom: 28, textAlign: 'center' }}>
                Fill in your details and we'll instantly unlock the full PDF.
              </p>

              <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ ...T.xs, display: 'block', marginBottom: 6, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%', padding: '14px 16px', boxSizing: 'border-box',
                      border: `1px solid #d8d3cc`, borderRadius: 2,
                      fontFamily: "'Jost', sans-serif", fontSize: '14px', color: BODY,
                      background: WHITE, outline: 'none',
                    }}
                  />
                </div>

                {/* Email Field */}
                <div style={{ marginBottom: 8 }}>
                  <label style={{ ...T.xs, display: 'block', marginBottom: 6, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%', padding: '14px 16px', boxSizing: 'border-box',
                      border: `1px solid #d8d3cc`, borderRadius: 2,
                      fontFamily: "'Jost', sans-serif", fontSize: '14px', color: BODY,
                      background: WHITE, outline: 'none',
                    }}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <p style={{
                    ...T.xs, color: '#c0392b', marginBottom: 20,
                    padding: '10px 14px', background: '#fdf0ef',
                    border: '1px solid #f5c6c2', borderRadius: 2,
                  }}>
                    {error}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '18px 24px', marginTop: 20,
                    background: loading ? '#6a8a87' : TEAL,
                    color: WHITE, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: "'Jost', sans-serif", fontSize: '12px', fontWeight: 500,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    borderRadius: 2, transition: 'background 0.2s',
                  }}
                >
                  {loading ? 'Unlocking...' : 'Unlock My Free Guide →'}
                </button>
              </form>

              <p style={{ ...T.xs, marginTop: 16, textAlign: 'center', fontSize: '10px', color: '#aaa' }}>
                🔒 We respect your privacy. No spam, ever. You'll also receive occasional insights from SEAGLORÉ.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          FULL PDF PREVIEW + DOWNLOAD (After Submit)
      ═══════════════════════════════════════════════ */}
      {submitted && (
        <section style={{ ...sectionPad, background: CREAM }}>
          <div style={{ ...container, maxWidth: '800px', textAlign: 'center' }}>
            
            <div style={{ ...card, marginBottom: 32 }}>
              <p style={{ ...T.h3, marginBottom: 12 }}>
                📖 Your Free Ocean Living Guide
              </p>
              <p style={{ ...T.sm, marginBottom: 28 }}>
                Read the full guide below or download it for offline reading.
              </p>

              {/* Download Button */}
              <a
                href={PDF_DOWNLOAD}
                download={PDF_NAME}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: TEAL, color: WHITE, textDecoration: 'none',
                  fontFamily: "'Jost', sans-serif", fontSize: '12px', fontWeight: 500,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  padding: '14px 32px', borderRadius: 2, marginBottom: 32,
                  transition: 'background 0.2s',
                }}
              >
                ↓ Download PDF
              </a>

              {/* Full PDF Embed */}
              <div style={{
                width: '100%', height: '75vh', minHeight: '500px',
                borderRadius: 4, overflow: 'hidden',
                border: `1px solid #d8d3cc`,
              }}>
                <iframe
                  src={PDF_PREVIEW}
                  title="Ocean Living Guide — Full Preview"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            </div>

            {/* Bonus Info */}
            <div style={{
              background: CREAM2, padding: '28px 24px', borderRadius: 4,
              border: `1px solid #d8d3cc`, textAlign: 'center',
            }}>
              <p style={{ ...T.label, marginBottom: 8 }}>Want the full experience?</p>
              <p style={{ ...T.body, fontSize: '14px', color: MUTED, marginBottom: 16, maxWidth: 420, margin: '0 auto 16px' }}>
                This is just the beginning. Join the complete 7-Day Ocean Reset and earn your certification.
              </p>
              <a
                href="/checkout-ocean-living"
                style={{
                  display: 'inline-block', background: TEAL, color: WHITE, textDecoration: 'none',
                  fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 500,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  padding: '12px 28px', borderRadius: 2,
                }}
              >
                Explore the Full Program →
              </a>
            </div>

          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          WHAT'S INSIDE (Before form ya after bhi)
      ═══════════════════════════════════════════════ */}
      <section style={{ ...sectionPad, background: WHITE }}>
        <div style={{ ...container, maxWidth: '520px', textAlign: 'center' }}>
          <p style={{ ...T.h3, marginBottom: 32 }}>What's Inside This Free Guide</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
            {[
              'Introduction to Ocean-Inspired Living',
              'The 3 Pillars of Calm & Clarity',
              'Simple Daily Reset Rituals',
              'Ocean Studies Overview',
              'Next Steps for Certification',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <LineCheck />
                <p style={{ ...T.body, fontSize: '14px', margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOOTER — Contact
      ═══════════════════════════════════════════════ */}
      <section style={{ ...sectionPad, background: TEAL, textAlign: 'center' }}>
        <div style={{ ...container, maxWidth: '500px' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 400, color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>
            SEAGLORÉ
          </p>
          <p style={{ ...T.sm, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
            "Where Nature Becomes Couture"
          </p>
          <p style={{ ...T.xs, color: 'rgba(255,255,255,0.5)' }}>
            Need help? Contact us at{' '}
            <a href={`mailto:${BRAND_EMAIL}`} style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'underline' }}>
              {BRAND_EMAIL}
            </a>
          </p>
        </div>
      </section>

    </div>
  );
}