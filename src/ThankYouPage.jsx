// src/ThankYouPage.jsx
// Ocean Living Certification — Thank You Page
// Route: /thank-you-ocean
// After payment: verify → show upsell → then course

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const UPSELL_URL  = '/upsell-ocean';
const VERIFY_API  = '/api/verify-payment';

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
  h1:    { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.4rem,6vw,4rem)', fontWeight: 500, color: TEAL, margin: 0, lineHeight: 1.1 },
  h2:    { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 500, color: TEAL, margin: 0 },
  body:  { fontFamily: "'Jost', sans-serif", fontSize: '15px', fontWeight: 400, lineHeight: 1.7, color: BODY },
  sm:    { fontFamily: "'Jost', sans-serif", fontSize: '13px', color: MUTED, lineHeight: 1.6 },
};

export default function ThankYouPage() {
  const navigate           = useNavigate();
  const [searchParams]     = useSearchParams();
  const [verified, setVerified]       = useState(false);
  const [checking, setChecking]       = useState(true);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    injectFont();
    const sessionId = searchParams.get('session_id');

    const verify = async () => {
      try {
        if (sessionId) {
          const res  = await fetch(`${VERIFY_API}?session_id=${sessionId}`);
          const data = await res.json();
          if (data.paid) {
            setVerified(true);
            setCustomerEmail(data.email || '');
            // Save session_id for course access protection
            localStorage.setItem('ol_session', sessionId);
            // GA4
            if (window.gtag) window.gtag('event', 'purchase_ocean', {
              transaction_id: sessionId, value: 49, currency: 'USD',
            });
            // Meta Pixel
            if (window.fbq) window.fbq('track', 'Purchase', { value: 49, currency: 'USD' });
          }
        } else {
          setVerified(true);
        }
      } catch {
        setVerified(true);
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, [searchParams]);

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ ...T.sm, letterSpacing: '0.2em' }}>Confirming your order...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", background: CREAM, minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{
        background: WHITE, padding: '16px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: `1px solid ${CREAM}`,
      }}>
        <img src="/images/logo.png" alt="Seagloré"
          style={{ height: 24, objectFit: 'contain', cursor: 'pointer' }}
          onClick={() => navigate('/')}/>
      </nav>

      {/* MAIN */}
      <div style={{
        maxWidth: '640px', margin: '0 auto',
        padding: 'clamp(40px, 8vw, 80px) 20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      }}>

        {/* Checkmark */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          border: `2px solid ${TEAL_LT}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 36,
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5 9-10" stroke={TEAL_LT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <p style={{ ...T.label, marginBottom: 16 }}>Order Confirmed</p>
        <h1 style={{ ...T.h1, marginBottom: 16 }}>Welcome.</h1>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 400,
          color: BODY, margin: '0 0 24px', lineHeight: 1.4,
        }}>
          Your Ocean Living journey begins now.
        </h2>

        <p style={{ ...T.body, color: MUTED, marginBottom: 48, maxWidth: 440 }}>
          Thank you for joining the Ocean Living Certification Experience.
          {customerEmail
            ? <> Your access details have been sent to <strong style={{ color: TEAL }}>{customerEmail}</strong>.</>
            : <> We've also sent your access details to your email.</>
          }
        </p>

        <div style={{ width: 48, height: 1, background: TEAL, marginBottom: 48 }}/>

        {/* ── UPSELL BLOCK ── */}
        <div style={{
          width: '100%', background: TEAL,
          padding: '36px 32px', marginBottom: 24, textAlign: 'center',
        }}>
          <p style={{ ...T.label, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>
            One More Step
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.3rem,3vw,1.8rem)', fontWeight: 400,
            color: WHITE, marginBottom: 12, lineHeight: 1.4,
          }}>
            Add a Private Coaching Session
          </p>
          <p style={{ ...T.sm, color: 'rgba(255,255,255,0.65)', marginBottom: 24, lineHeight: 1.7 }}>
            Get a 1:1 session with Sevil to accelerate your transformation.<br/>
            Limited spots — exclusive to new students only.
          </p>
          <button
            onClick={() => navigate(UPSELL_URL)}
            style={{
              background: WHITE, color: TEAL, border: 'none',
              padding: '14px 40px', cursor: 'pointer',
              fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              marginBottom: 12, width: '100%',
            }}
          >
            See Coaching Offer →
          </button>
          <button
            onClick={() => navigate('/course-ocean-living')}
            style={{
              background: 'transparent', color: 'rgba(255,255,255,0.5)',
              border: 'none', cursor: 'pointer',
              fontFamily: "'Jost', sans-serif", fontSize: '11px',
              letterSpacing: '0.1em', textDecoration: 'underline',
            }}
          >
            No thanks, take me to my course
          </button>
        </div>

        {/* Access Course CTA */}
        <button
          onClick={() => navigate('/course-ocean-living')}
          style={{
            padding: '18px 32px', background: TEAL, color: WHITE, width: '100%',
            border: 'none', cursor: 'pointer',
            fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 500,
            letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16,
          }}
        >
          Access Your Course
        </button>

        <p style={{ ...T.sm, fontSize: '12px' }}>
          You can also access the course anytime via the link in your email.
        </p>

        {/* What's next */}
        <div style={{
          marginTop: 60, width: '100%', background: WHITE,
          padding: 'clamp(24px, 4vw, 36px) clamp(20px, 4vw, 32px)', textAlign: 'left',
        }}>
          <p style={{ ...T.label, marginBottom: 20 }}>What Happens Next</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { step: '01', text: 'Check your email — your access link and welcome message are waiting.' },
              { step: '02', text: 'Open your course dashboard and begin Module 1.' },
              { step: '03', text: 'Over the next 7 days, receive guided lessons to reset your daily rhythm.' },
              { step: '04', text: 'Complete the final quiz and receive your certificate.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{
                  fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 600,
                  color: TEAL_LT, letterSpacing: '0.1em', minWidth: 24, paddingTop: 2,
                }}>{item.step}</span>
                <p style={{ ...T.body, fontSize: '14px', color: MUTED, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ ...T.sm, marginTop: 40, fontSize: '12px', lineHeight: 1.8 }}>
          Questions? Contact us at{' '}
          <a href="mailto:info@seaglore.com" style={{ color: TEAL, textDecoration: 'none' }}>
            info@seaglore.com
          </a>
        </p>

      </div>
    </div>
  );
}