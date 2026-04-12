
// src/UpsellOceanPage.jsx
// Route: /upsell-ocean
// Shown after Thank You page — coaching upsell offer

import { useNavigate } from 'react-router-dom';

const COURSE_URL = '/course-ocean-living';
// ── Replace with actual coaching Stripe link ──────────────────────
const COACHING_URL = 'https://buy.stripe.com/YOUR_COACHING_LINK';

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

import { useEffect } from 'react';

export default function UpsellOceanPage() {
  const navigate = useNavigate();

  useEffect(() => { injectFont(); }, []);

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", background: CREAM, minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{
        background: WHITE, padding: '16px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: `1px solid ${CREAM}`,
      }}>
        <img src="/images/logo.png" alt="Seagloré"
          style={{ height: 50, objectFit: 'contain', cursor: 'pointer' }}
          onClick={() => navigate('/')}/>
      </nav>

      <div style={{
        maxWidth: '620px', margin: '0 auto',
        padding: 'clamp(40px, 8vw, 80px) 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      }}>

        {/* Badge */}
        <div style={{
          background: TEAL, color: WHITE,
          fontFamily: "'Jost', sans-serif", fontSize: '10px',
          fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
          padding: '6px 20px', marginBottom: 32,
        }}>
          Exclusive — New Students Only
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 400,
          color: TEAL, margin: '0 0 16px', lineHeight: 1.2,
        }}>
          One More Step.
        </h1>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontStyle: 'italic',
          fontWeight: 400, color: BODY, margin: '0 0 40px', lineHeight: 1.6,
        }}>
          Accelerate your transformation with a private session.
        </p>

        <div style={{ width: 40, height: 1, background: TEAL, marginBottom: 40 }}/>

        {/* Offer card */}
        <div style={{
          width: '100%', background: WHITE,
          padding: 'clamp(28px, 5vw, 48px)',
          border: `1px solid #d8d3cc`, marginBottom: 24,
        }}>
          <p style={{
            fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.22em', textTransform: 'uppercase', color: MUTED,
            marginBottom: 16,
          }}>Private Coaching Session</p>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 500,
            color: TEAL, marginBottom: 16, lineHeight: 1.3,
          }}>
            1:1 Voice & Ocean Living<br/>Coaching with Sevil Velsha
          </p>

          <p style={{
            fontFamily: "'Jost', sans-serif", fontSize: '14px', fontWeight: 400,
            color: MUTED, marginBottom: 28, lineHeight: 1.8,
          }}>
            A private 60-minute session where Sevil personally guides you through
            your Ocean Living practice, answers your questions, and creates a
            custom plan for your transformation.
          </p>

          {/* Includes */}
          <div style={{ textAlign: 'left', marginBottom: 32 }}>
            {[
              '60-minute private Zoom session with Sevil',
              'Personal practice review & feedback',
              'Custom 30-day plan for your lifestyle',
              'Recording of the session',
              'Priority email support for 30 days',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ color: TEAL_LT, fontWeight: 700, flexShrink: 0 }}>—</span>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '14px', color: BODY, margin: 0, lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 12, marginBottom: 28 }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.4rem', color: MUTED, textDecoration: 'line-through',
            }}>$500</span>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.4rem, 6vw, 3.2rem)', fontWeight: 500, color: TEAL,
            }}>$197</span>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '12px', color: MUTED }}>today only</span>
          </div>

          {/* CTA */}
          <a
            href={COACHING_URL}
            style={{
              display: 'block', width: '100%', padding: '18px 24px',
              background: TEAL, color: WHITE, textDecoration: 'none',
              fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.22em', textTransform: 'uppercase', textAlign: 'center',
              marginBottom: 12, boxSizing: 'border-box',
            }}
          >
            Yes — Add Coaching for $197 →
          </a>

          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '12px', color: '#c0392b', fontWeight: 600 }}>
            ⚠️ Limited to 4 spots per month
          </p>
        </div>

        {/* Skip */}
        <button
          onClick={() => navigate(COURSE_URL)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Jost', sans-serif", fontSize: '12px', color: MUTED,
            textDecoration: 'underline', padding: '8px',
          }}
        >
          No thanks — take me to my course
        </button>

        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '11px', color: MUTED, marginTop: 16 }}>
          🔒 Secure payment · 30-day guarantee
        </p>

      </div>
    </div>
  );
}