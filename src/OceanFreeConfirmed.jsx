// src/OceanFreeConfirmed.jsx
// Route: /ocean-free-confirmed
// Shows after user clicks verification link

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OceanFreeConfirmed() {
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const G = "'Cormorant Garamond', Georgia, serif";
  const J = "'Jost', sans-serif";
  const TEAL   = '#2d4a47';
  const TEAL_LT = '#4a7c76';
  const CREAM  = '#eee9e2';

  return (
    <div style={{
      minHeight: '100vh',
      background: TEAL,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(40px,6vw,80px) 24px',
      fontFamily: J,
    }}>
      <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>

        {/* Wave icon */}
        <svg width="64" height="32" viewBox="0 0 64 32" fill="none"
          style={{ display: 'block', margin: '0 auto 32px' }}>
          <path d="M0,16 C8,4 16,4 24,16 C32,28 40,28 48,16 C56,4 60,4 64,12"
            stroke={CREAM} strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M0,22 C10,12 20,28 32,22 C44,16 54,28 64,22"
            stroke={CREAM} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
        </svg>

        {/* Label */}
        <p style={{
          fontFamily: J, fontSize: '10px', fontWeight: 600,
          letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'rgba(238,233,226,0.5)', margin: '0 0 20px',
        }}>
          Ocean Living — Free Experience
        </p>

        {/* Checkmark */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          border: `1.5px solid rgba(238,233,226,0.3)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5 9-10" stroke={CREAM} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily: G, fontSize: 'clamp(1.8rem,4vw,2.8rem)',
          fontWeight: 400, fontStyle: 'italic',
          color: CREAM, margin: '0 0 16px', lineHeight: 1.2,
        }}>
          Your free lesson is on its way.
        </h1>

        {/* Subtext */}
        <p style={{
          fontFamily: J, fontSize: '15px', fontWeight: 300,
          color: 'rgba(238,233,226,0.65)', margin: '0 0 8px', lineHeight: 1.8,
        }}>
          Your free video lesson and downloadable guide have been sent to your inbox.
        </p>
        <p style={{
          fontFamily: J, fontSize: '14px', fontWeight: 300,
          color: 'rgba(238,233,226,0.45)', margin: '0 0 48px', lineHeight: 1.7,
        }}>
          Please check your email — including your spam folder if you don't see it within a few minutes.
        </p>

        {/* Divider */}
        <div style={{ width: 40, height: 1, background: 'rgba(238,233,226,0.2)', margin: '0 auto 40px' }} />

        {/* Upsell */}
        <p style={{
          fontFamily: G, fontSize: 'clamp(1rem,2vw,1.2rem)', fontStyle: 'italic',
          color: 'rgba(238,233,226,0.55)', margin: '0 0 20px',
        }}>
          Loved what you saw? Join the full experience.
        </p>

        <button
          onClick={() => navigate('/checkout-ocean-living')}
          style={{
            background: CREAM, color: TEAL,
            fontFamily: J, fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            padding: '16px 36px', border: 'none', cursor: 'pointer',
            marginBottom: 16,
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#ffffff'}
          onMouseLeave={e => e.currentTarget.style.background = CREAM}
        >
          Begin the Full Experience — $49 →
        </button>

        <p style={{
          fontFamily: J, fontSize: '11px', fontWeight: 300,
          color: 'rgba(238,233,226,0.3)', margin: 0,
        }}>
          7 days · Guided experience · Instant access
        </p>

      </div>
    </div>
  );
}