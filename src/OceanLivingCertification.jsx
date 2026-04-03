// src/OceanLivingCertification.jsx
// PIXEL-PERFECT match to Figma/PDF screenshots
// Updated: Hero button bordered, Before/After gap, FAQ bordered boxes, Curriculum accordion, sticky removed

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── EASY-EDIT CONFIG ──────────────────────────────────────────────
const PRICE      = '$49';
const PRICE_OLD  = '$79';
const PRODUCT    = 'Ocean Living Certification Experience';
const CHECKOUT   = '/checkout-ocean-living';
const BREVO_API  = '/api/ocean-lead';
// ─────────────────────────────────────────────────────────────────

// ── DESIGN TOKENS ────────────────────────────────────────────────
const TEAL    = '#2d4a47';
const TEAL_LT = '#4a7c76';
const CREAM   = '#eee9e2';
const WHITE   = '#ffffff';
const BODY    = '#3a3a3a';
const MUTED   = '#7a8a88';

const injectFont = () => {
  if (document.getElementById('ol-fonts')) return;
  const link = document.createElement('link');
  link.id   = 'ol-fonts';
  link.rel  = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap';
  document.head.appendChild(link);
};

const SEC_WHITE = { backgroundColor: WHITE,  padding: '72px 0' };
const SEC_CREAM = { backgroundColor: CREAM,  padding: '72px 0' };
const SEC_TEAL  = { backgroundColor: TEAL,   padding: '72px 0' };
const INNER     = { maxWidth: '860px', margin: '0 auto', padding: '0 36px' };

const T = {
  label: {
    fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 500,
    letterSpacing: '0.22em', textTransform: 'uppercase', color: MUTED,
  },
  h1: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 'clamp(2.6rem, 6vw, 4.2rem)', fontWeight: 500, lineHeight: 1.1, color: TEAL, margin: 0,
  },
  h2: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 500, lineHeight: 1.15, color: TEAL, margin: 0,
  },
  h3: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 500, lineHeight: 1.2, color: TEAL, margin: 0,
  },
  body: {
    fontFamily: "'Jost', sans-serif", fontSize: '15px', fontWeight: 400, lineHeight: 1.7, color: BODY,
  },
  italic: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '18px', fontStyle: 'italic', lineHeight: 1.6, color: BODY,
  },
  sm: {
    fontFamily: "'Jost', sans-serif", fontSize: '13px', color: MUTED, lineHeight: 1.6,
  },
};

// ── ICONS ────────────────────────────────────────────────────────
const CheckCircle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
    <circle cx="12" cy="12" r="11" stroke={TEAL_LT} strokeWidth="1.4"/>
    <path d="M7 12.5l3.5 3.5 6.5-7" stroke={TEAL_LT} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LineCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M5 12l5 5 9-10" stroke={TEAL_LT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Ribbon = () => (
  <svg width="48" height="56" viewBox="0 0 48 56" fill="none">
    <circle cx="24" cy="20" r="16" stroke={TEAL_LT} strokeWidth="1.4"/>
    <circle cx="24" cy="20" r="10" stroke={TEAL_LT} strokeWidth="1.4"/>
    <path d="M16 33l-7 22 15-9 15 9-7-22" stroke={TEAL_LT} strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
);

// Chevron for accordions — white bg version and normal version
const Chevron = ({ open, color = MUTED }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    style={{ flexShrink: 0, marginLeft: 16, transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}>
    <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WHY_ICONS = [
  <svg key="s" width="38" height="38" viewBox="0 0 38 38" fill="none">
    <circle cx="19" cy="19" r="16" stroke={TEAL_LT} strokeWidth="1.3"/>
    <path d="M19 11v9M19 25v2" stroke={TEAL_LT} strokeWidth="2" strokeLinecap="round"/>
  </svg>,
  <svg key="o" width="38" height="38" viewBox="0 0 38 38" fill="none">
    <path d="M6 9h4l4 14h12l4-10H12" stroke={TEAL_LT} strokeWidth="1.3" strokeLinejoin="round"/>
    <circle cx="15" cy="28" r="2" stroke={TEAL_LT} strokeWidth="1.3"/>
    <circle cx="25" cy="28" r="2" stroke={TEAL_LT} strokeWidth="1.3"/>
  </svg>,
  <svg key="b" width="38" height="38" viewBox="0 0 38 38" fill="none">
    <path d="M19 8v22M10 30h18" stroke={TEAL_LT} strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M8 14l11 5M19 19l11-5" stroke={TEAL_LT} strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M5 14h6M27 14h6" stroke={TEAL_LT} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>,
  <svg key="n" width="38" height="38" viewBox="0 0 38 38" fill="none">
    <path d="M19 8C13 15 9 18 9 24a10 10 0 0 0 20 0c0-6-4-9-10-16z" stroke={TEAL_LT} strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>,
  <svg key="r" width="38" height="38" viewBox="0 0 38 38" fill="none">
    <path d="M4 20l6-7 6 10 5-6 6 6 6-9" stroke={TEAL_LT} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
];

const WHO_ICONS = [
  <svg key="br" width="30" height="30" viewBox="0 0 30 30" fill="none"><rect x="4" y="11" width="22" height="15" rx="2" stroke={TEAL_LT} strokeWidth="1.3"/><path d="M10 11V9a5 5 0 0 1 10 0v2" stroke={TEAL_LT} strokeWidth="1.3"/></svg>,
  <svg key="gr" width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M4 11l11-6 11 6-11 6-11-6z" stroke={TEAL_LT} strokeWidth="1.3" strokeLinejoin="round"/><path d="M9 14v7c3 2 9 2 12 0v-7" stroke={TEAL_LT} strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  <svg key="lf" width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M15 4C9 11 5 14 5 20a10 10 0 0 0 20 0c0-6-4-9-10-16z" stroke={TEAL_LT} strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  <svg key="ht" width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M15 26S5 18 5 11a7 7 0 0 1 10-6.3A7 7 0 0 1 25 11c0 7-10 15-10 15z" stroke={TEAL_LT} strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  <svg key="st" width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M15 4l2.5 7h7.5l-6 4.5 2.3 7-6.3-4.5-6.3 4.5 2.3-7L5 11h7.5z" stroke={TEAL_LT} strokeWidth="1.3" strokeLinejoin="round"/></svg>,
];

function useWindowWidth() {
  const [w, setW] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
}

export default function OceanLivingCertification() {
  const navigate  = useNavigate();
  const isMobile = useWindowWidth() < 768;
  const [scrolled, setScrolled] = useState(false);
  const [faq, setFaq]           = useState(null);
  const [curriculum, setCurriculum] = useState(null); // ← curriculum accordion state
  const [email, setEmail]       = useState('');
  const [done, setDone]         = useState(false);
  const [err, setErr]           = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    injectFont();
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go   = (p) => navigate(p);
  const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const submitLead = async () => {
    if (!email.trim()) return;
    setLoading(true); setErr('');
    try {
      await fetch(BREVO_API, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      setDone(true); setEmail('');
    } catch { setErr('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", background: WHITE, minHeight: '100vh' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:50,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding: isMobile ? '14px 20px' : '18px 40px',
        backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        transition: 'all .3s',
      }}>
        
       
      </nav>

      {/* ══════════════════════════════════════════
          HERO — full-bleed photo
          Text: SEAGLORÉ label + "ENTER THE EXPERIENCE" as BORDERED BUTTON
          + "7-day experience • certificate included" tag
      ══════════════════════════════════════════ */}
      <section style={{ position:'relative', width:'100%', height:'145vh', overflow:'hidden' }}>
        <img src="/images/hero.jpg" alt="Ocean Living"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }}/>
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.2)' }}/>
        <div style={{
  position:'relative', zIndex:2,
  height:'100%', display:'flex', flexDirection:'column',
  alignItems:'center', justifyContent:'flex-end', textAlign:'center',
  padding: '0 24px 350px', gap: 0,
}}>

          {/* SEAGLORÉ label */}
          <p style={{
            fontFamily:"'Jost', sans-serif", fontSize:'13px', fontWeight:400,
            letterSpacing:'0.10em', textTransform:'uppercase',
            color:'rgba(255,255,255,0.9)', marginBottom: 28,
          }}>
            S E A G L O R É
          </p>

          {/* ── ENTER THE EXPERIENCE — BORDERED BUTTON (exact from Image 1) ── */}
          <button
            onClick={() => go(CHECKOUT)}
            style={{
              fontFamily:"'Jost', sans-serif", fontSize:'11px', fontWeight:500,
              letterSpacing:'0.28em', textTransform:'uppercase',
              color: WHITE,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.85)',
              padding: '14px 44px',
              cursor: 'pointer',
              marginBottom: 24,
            }}
          >
            ENTER THE EXPERIENCE
          </button>

          {/* Tag line */}
          <p style={{
            fontFamily:"'Jost', sans-serif", fontSize:'11px', fontWeight:300,
            letterSpacing:'0.14em', color:'rgba(255,255,255,0.6)',
          }}>
            7-day experience • certificate included
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HERO TEXT — white bg, large serif headings,
          two bordered rect buttons
      ══════════════════════════════════════════ */}
      <section style={{ ...SEC_WHITE, padding:'140px 0 130px' }}>
  <div style={{ ...INNER, textAlign:'center' }}>

    <h1 style={{
      fontFamily:"'Cormorant Garamond', Georgia, serif",
      fontSize:'clamp(2.2rem, 4.5vw, 3.5rem)',
      fontWeight: 500,
      lineHeight: 1.2,
      color: '#2d4a47',
      margin: '0 auto 6px',
      maxWidth: 480,
    }}>You are not tired.</h1>

    <h1 style={{
      fontFamily:"'Cormorant Garamond', Georgia, serif",
      fontSize:'clamp(2.2rem, 4.5vw, 3.5rem)',
      fontWeight: 500,
      lineHeight: 1.2,
      color: '#2d4a47',
      margin: '0 auto 52px',
      maxWidth: 480,
    }}>You are disconnected.</h1>

    <p style={{
      fontFamily:"'Jost', sans-serif",
      fontSize:'clamp(1.7rem, 2vw, 1.25rem)',
      fontWeight: 400,
      color: '#9aa5a3',
      maxWidth: 420,
      margin:'0 auto 64px',
      lineHeight: 1.85,
      letterSpacing:'0.01em',
    }}>
      A 7-day system to reset your life —<br/>
      with calm, clarity, and control.
    </p>

    <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
      <button onClick={() => go(CHECKOUT)} style={{
        fontFamily:"'Jost', sans-serif",
        fontSize:'11px', fontWeight:400,
        letterSpacing:'0.18em', textTransform:'uppercase',
        padding:'16px 44px',
        border:'1px solid #c8c8c8',
        borderRadius:'4px',
        color:'#7a8a88',
        background:'transparent',
        cursor:'pointer',
      }}>
        ENTER THE EXPERIENCE
      </button>
      <button onClick={() => jump('lead-section')} style={{
        fontFamily:"'Jost', sans-serif",
        fontSize:'11px', fontWeight:400,
        letterSpacing:'0.18em', textTransform:'uppercase',
        padding:'16px 44px',
        border:'1px solid #c8c8c8',
        borderRadius:'4px',
        color:'#7a8a88',
        background:'transparent',
        cursor:'pointer',
      }}>
        RECEIVE THE OCEAN GUIDE
      </button>
    </div>
  </div>
</section>
      {/* ══════════════════════════════════════════
          CREATED BY SEVIL VELSHA
      ══════════════════════════════════════════ */}
      <section style={{ ...SEC_WHITE, padding:'68px 0 152px' }}>
  <div style={{ ...INNER }}>
    <h2 style={{
      fontFamily:"'Cormorant Garamond', Georgia, serif",
      fontSize:'clamp(2.2rem, 4.5vw, 3.5rem)',
      fontWeight: 900,
      color: '#2d4a47',
      textAlign:'center',
      marginBottom: 15,
      margin: '0 auto 52px',
    }}>Created by Sevil Velsha</h2>

    <div style={{
      display:'flex', gap: isMobile ? 24 : 48,
      alignItems:'flex-start',
      flexDirection: isMobile ? 'column' : 'row'
    }}>
      {/* SV Avatar */}
<div style={{
  flexShrink: 0,
  width: isMobile ? 140 : 240,
  height: isMobile ? 140 : 260,
  backgroundColor: '#e8e4de',
  display:'flex', alignItems:'center', justifyContent:'center',
  overflow: 'hidden',
  borderRadius:'12px' ,
}}>
  <img
    src="/images/profile.png"
    alt="Sevil Velsha"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }}
  />
</div>

      {/* Text */}
      <div style={{ flex:1, minWidth:240, paddingTop: 40 }}>
        <p style={{
          fontFamily:"'Jost', sans-serif",
          fontSize:'20px', fontWeight:400,
          color:'#5A6C6D',
          marginBottom: 20,
          letterSpacing:'0.02em',
        }}>Founder of Seagloré</p>

        <p style={{
          fontFamily:"'Jost', sans-serif",
          fontSize:'clamp(0.95rem, 1.5vw, 1.05rem)',
          fontWeight: 400,
          color:'#5A6C6D',
          marginBottom: 32,
          maxWidth: 480,
          lineHeight: 1.85,
          letterSpacing:'0.01em',
        }}>
          Creator of the Ocean Living philosophy — a system for calm,
          clarity, and conscious living.
        </p>

        <p style={{
          fontFamily:"'Cormorant Garamond', Georgia, serif",
          fontSize:'clamp(1.1rem, 2vw, 1.3rem)',
          fontStyle:'italic',
          fontWeight: 900,
          color:'#2d4a47',
          marginBottom: 6,
          lineHeight: 1.5,
          
        }}>"Where Nature Becomes Couture"</p>

        <p style={{
          fontFamily:"'Jost', sans-serif",
          fontSize:'11px', fontWeight:500,
          letterSpacing:'0.22em',
          textTransform:'uppercase',
          color:'#7aaba5',
        }}>— SEAGLORÉ</p>
      </div>
    </div>
  </div>
</section>

      {/* ══════════════════════════════════════════
          WHY MODERN LIFE
      ══════════════════════════════════════════ */}
      <section style={{ ...SEC_CREAM }}>
  <div style={{ ...INNER, textAlign:'center' }}>

    {/* Heading */}
    <h2 style={{
      fontFamily:"'Cormorant Garamond', Georgia, serif",
      fontSize:'clamp(2.1rem, 4.5vw, 2.8rem)',
      fontWeight: 900,
      color: '#2C3E3F',
      maxWidth: 900,
      margin:'0 auto 64px',
      lineHeight: 1.25,
    }}>
      Why modern life leaves people tired and<br/>disconnected
    </h2>

    {/* Icons row */}
    <div style={{ display:'flex', justifyContent:'center', gap: 90, flexWrap:'nowrap', marginBottom: 56 }}>
      {[
{ label: 'Constant Stress', icon: (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    <circle cx="21" cy="21" r="18" stroke="#7A9C9E" strokeWidth="1.3"/>
    <circle cx="21" cy="21" r="18" stroke="#7A9C9E" strokeWidth="1.3"/>
    <path d="M21 12v11" stroke="#7A9C9E" strokeWidth="1.6" strokeLinecap="round"/>
    <circle cx="21" cy="28" r="1.2" fill="#7A9C9E"/>
  </svg>
)},
{ label: 'Overconsumption', icon: (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    <path d="M6 10h4.5l4.5 14h13l4-11H15" stroke="#7A9C9E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="17.5" cy="30.5" r="2.2" stroke="#7A9C9E" strokeWidth="1.3"/>
    <circle cx="29.5" cy="30.5" r="2.2" stroke="#7A9C9E" strokeWidth="1.3"/>
  </svg>
)},
{ label: 'Lack of Balance', icon: (
  <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
    <path d="M31.9976 31.9976L37.9971 15.9988L43.9966 31.9976C42.2568 33.2975 40.1569 33.9974 37.9971 33.9974C35.8373 33.9974 33.7374 33.2975 31.9976 31.9976Z" stroke="#7aaba5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.99951 31.9976L9.99905 15.9988L15.9986 31.9976C14.2587 33.2975 12.1589 33.9974 9.99905 33.9974C7.83922 33.9974 5.73938 33.2975 3.99951 31.9976Z" stroke="#7aaba5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.999 41.9968H33.9975" stroke="#7A9C9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23.998 5.99954V41.9968" stroke="#7A9C9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.99951 13.9989H9.99921C13.9989 13.9989 19.9984 11.9991 23.9981 9.99924C27.9978 11.9991 33.9974 13.9989 37.9971 13.9989H41.9968" stroke="#7aaba5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)},

{ label: 'Disconnection from Nature', icon: (
  <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
    <path d="M21.9984 39.9969C18.4868 40.0076 15.0994 38.698 12.5082 36.3281C9.91688 33.9581 8.31098 30.7008 8.00894 27.2021C7.7069 23.7035 8.73079 20.2192 10.8775 17.4402C13.0243 14.6611 16.1371 12.7904 19.5986 12.1991C30.9977 9.99924 33.9975 8.95932 37.9972 3.99969C39.997 7.99939 41.9969 12.3591 41.9969 19.9985C41.9969 30.9976 32.4376 39.9969 21.9984 39.9969Z" stroke="#7A9C9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.99951 41.9968C3.99951 35.9973 7.69923 31.2776 14.1587 29.9977C18.9984 29.0378 23.998 25.998 25.9978 23.9982" stroke="#7A9C9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)},

{ label: 'Unhealthy Routines', icon: (
  <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
    <path d="M43.9965 23.9982H39.0368C38.1628 23.9963 37.3123 24.2808 36.6153 24.808C35.9182 25.3353 35.4131 26.0764 35.1771 26.9179L30.4775 43.6367C30.4472 43.7405 30.384 43.8317 30.2975 43.8967C30.211 43.9616 30.1057 43.9966 29.9975 43.9966C29.8894 43.9966 29.7841 43.9616 29.6976 43.8967C29.611 43.8317 29.5479 43.7405 29.5176 43.6367L18.4784 4.35967C18.4481 4.25582 18.385 4.16459 18.2984 4.09969C18.2119 4.03478 18.1066 3.99969 17.9984 3.99969C17.8903 3.99969 17.785 4.03478 17.6985 4.09969C17.6119 4.16459 17.5488 4.25582 17.5185 4.35967L12.8188 21.0784C12.5838 21.9166 12.0817 22.6553 11.3887 23.1823C10.6957 23.7092 9.8497 23.9957 8.97913 23.9982H3.99951" stroke="#7A9C9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)},
      ].map((item, i) => (
        <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, width:120, minWidth:120 }}>
      {item.icon}
      <p style={{
        fontFamily:"'Jost', sans-serif",
        fontSize:'17px', fontWeight:500,
        color:'#4A5C5D',
        textAlign:'center',
        lineHeight: 1.5,
        letterSpacing:'0.01em',
        whiteSpace:'nowrap',
      }}>{item.label}</p>
    </div>
      ))}
    </div>

    {/* Quote */}
    <p style={{
      fontFamily:"'Cormorant Garamond', Georgia, serif",
      fontSize:'clamp(1.2rem, 2.2vw, 1.5rem)',
      fontStyle:'italic',
      fontWeight: 900,
      color:'#2C3E3F',
      maxWidth: 860,
      margin:'0 auto',
      lineHeight: 1.7,
    }}>
      "Most people do not need more information. They need a better way to<br/>live."
    </p>

  </div>
</section>

      {/* ══════════════════════════════════════════
          WHAT OCEAN LIVING MEANS
      ══════════════════════════════════════════ */}
      <section style={{ ...SEC_WHITE, padding:'72px 0 0' }}>
        <div style={{ ...INNER, textAlign:'center', marginBottom:40 }}>
          <h2 style={{ ...T.h2,color:'#2C3E3F',fontWeight:900, marginBottom:20 }}>What Ocean Living Means</h2>
          <p style={{ ...T.bold, color:'#5A6C6D',fontWeight:400, maxWidth:600, margin:'0 auto', fontSize:'clamp(1rem,2.2vw,1.15rem)' }}>
            "Ocean Living is not about ocean science. It is a philosophy of living with calm,
            clarity, conscious choice, and better daily habits."
          </p>
        </div>
        <div style={{ maxWidth:820, margin:'0 auto', padding:'0 36px' }}>
          <img src="/images/oceanliving.jpg" alt="Ocean Living"
            style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', display:'block' }}/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 350px))', marginBottom:48, justifyContent:'center' }}>
  {[
    { t:'Calm',           d:'Slower, more intentional life' },
    { t:'Sustainability', d:'Better choices, less waste' },
    { t:'Wellbeing',      d:'Habits that support energy and balance' },
  ].map((c,i) => (
    <div key={i} style={{
      padding:'54px 4px', textAlign:'center',
    }}>
      <p style={{ ...T.h3, marginBottom:5,fontWeight:700 }}>{c.t}</p>
      <p style={{ ...T.sm,fontWeight:500 }}>{c.d}</p>
    </div>
  ))}
</div>
      </section>

      {/* ══════════════════════════════════════════
          WHAT YOU WILL LEARN
      ══════════════════════════════════════════ */}
      <section style={{ ...SEC_CREAM }}>
        <div style={{ ...INNER, textAlign:'center' }}>
          <h2 style={{ ...T.h2, marginBottom:52 }}>What You Will Learn</h2>
          <div style={{ maxWidth:560, margin:'0 auto' }}>
            {[
              'Rebuild your daily rhythm with clarity',
              'Reduce mental and environmental noise',
              'Design a calm, intentional lifestyle',
              'Shift your thinking toward conscious living',
            ].map((item, i, arr) => (
              <div key={i}>
                <div style={{ width:40, height:1, background:TEAL, margin:'0 auto', marginBottom:22 }}/>
                <p style={{ ...T.body, textAlign:'center', color:BODY, padding:'0 0 4px' }}>{item}</p>
                {i === arr.length-1 && <div style={{ width:40, height:1, background:TEAL, margin:'22px auto 0' }}/>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COURSE CURRICULUM — ACCORDION with cream bg + border
          (exact match Image 2 / Screenshot 345)
      ══════════════════════════════════════════ */}
      <section style={{ ...SEC_WHITE }}>
        <div style={{ ...INNER, textAlign:'center' }}>
          <h2 style={{ ...T.h2, marginBottom:48 }}>Course Curriculum</h2>
          <div style={{ maxWidth:820, margin:'0 auto' }}>

            {/* Accordion rows — cream background with border, chevron */}
            {[
              ['Module 1 — Why People Don\'t Feel Well', 'This module explores why modern life disconnects people from calm, clarity, and their natural rhythm. You will understand the root causes of mental fatigue and environmental overwhelm.'],
              ['Module 2 — Sustainable Living Made Simple', 'Learn practical, elegant approaches to reducing consumption and making daily choices that align with a slower, more intentional lifestyle.'],
              ['Module 3 — The Ocean Living Method', 'The complete Ocean Living system — a structured daily practice for rebuilding rhythm, reducing noise, and returning to clarity and conscious living.'],
            ].map(([title, desc], i) => (
              <div
                key={i}
                style={{
                  border: `1px solid #d8d3cc`,
                  backgroundColor: CREAM,
                  marginBottom: 8,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setCurriculum(curriculum === i ? null : i)}
                  style={{
                    width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'20px 24px', background:'none', border:'none', cursor:'pointer', textAlign:'left',
                  }}
                >
                  <p style={{
                    fontFamily:"'Cormorant Garamond', serif", fontSize:'1.1rem', fontWeight:500,
                    color: TEAL, margin:0,
                  }}>{title}</p>
                  <Chevron open={curriculum === i} color={TEAL_LT}/>
                </button>
                {curriculum === i && (
                  <div style={{ padding:'0 24px 20px' }}>
                    <p style={{ ...T.body, color:MUTED }}>{desc}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Format info — centered below */}
            <div style={{ marginTop:28, textAlign:'center' }}>
              <p style={{ ...T.sm, marginBottom:4 }}>
                <span style={{ fontWeight:600, color:BODY }}>Format:</span> Short video lessons
              </p>
              <p style={{ ...T.sm, marginBottom:4 }}>
                <span style={{ fontWeight:600, color:BODY }}>Final quiz</span> included
              </p>
              <p style={{ ...T.sm }}>
                <span style={{ fontWeight:600, color:BODY }}>Certificate</span> upon completion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EARN YOUR CERTIFICATE
      ══════════════════════════════════════════ */}
      <section style={{ ...SEC_CREAM }}>
        <div style={{ ...INNER }}>
          <h2 style={{ ...T.h2, textAlign:'center', marginBottom:56 }}>Earn Your Certificate</h2>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 60, alignItems:'start' }}>
            <div>
              {[
                ['Complete all lessons','Learn at your own pace with lifetime access'],
                ['Pass the final quiz','Demonstrate your understanding of the Ocean Living Method'],
                ['Receive your branded certificate','Download and share your achievement'],
              ].map(([tl,d],i) => (
                <div key={i} style={{ display:'flex', gap:16, alignItems:'flex-start', marginBottom:28 }}>
                  <CheckCircle/>
                  <div>
                    <p style={{ ...T.body, fontWeight:500, marginBottom:4 }}>{tl}</p>
                    <p style={{ ...T.sm }}>{d}</p>
                  </div>
                </div>
              ))}
              <p style={{ ...T.italic, fontSize:15, color:MUTED, marginTop:8 }}>
                "Add your certificate to LinkedIn, CV, or personal development portfolio."
              </p>
            </div>
            <div style={{ background:WHITE, padding:'40px 32px', textAlign:'center', boxShadow:'0 2px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}><Ribbon/></div>
              <p style={{ ...T.h3, marginBottom:8 }}>Certificate of Completion</p>
              <p style={{ ...T.sm, marginBottom:10 }}>This certifies that</p>
              <p style={{
                fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontStyle:'italic',
                fontWeight:500, color:TEAL, marginBottom:10,
              }}>[Your Name]</p>
              <p style={{ ...T.sm, marginBottom:10 }}>has successfully completed</p>
              <p style={{ ...T.body, fontWeight:500, color:TEAL, lineHeight:1.5, marginBottom:14 }}>
                Ocean Living Certification:<br/>
                Sustainable Living &amp; Personal Wellbeing
              </p>
              <p style={{ ...T.label }}>SEAGLORÉ METHOD</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHO THIS COURSE IS FOR
      ══════════════════════════════════════════ */}
      <section style={{ ...SEC_WHITE }}>
        <div style={{ ...INNER, textAlign:'center' }}>
          <h2 style={{ ...T.h2, marginBottom:48 }}>Who This Course Is For</h2>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:14, marginBottom:14 }}>
            {[
              'Professionals seeking balance',
              'Students building a stronger profile',
              'People interested in sustainable living',
            ].map((label,i) => (
              <div key={i} style={{ background:CREAM, padding:'28px 22px', textAlign:'left', borderRadius:4 }}>
                <div style={{ marginBottom:16 }}>{WHO_ICONS[i]}</div>
                <p style={{ ...T.body }}>{label}</p>
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap:14, maxWidth:580, margin:'0 auto' }}>
            {[
              'Those who want a calmer, healthier lifestyle',
              'Individuals drawn to elegant, intentional living',
            ].map((label,i) => (
              <div key={i} style={{ background:CREAM, padding:'28px 22px', textAlign:'left', borderRadius:4 }}>
                <div style={{ marginBottom:16 }}>{WHO_ICONS[3+i]}</div>
                <p style={{ ...T.body }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          AFTER THIS EXPERIENCE
          ── Before/After boxes with GAP between them
      ══════════════════════════════════════════ */}
      <section style={{ backgroundColor:CREAM, paddingTop:72 }}>
        <div style={{ textAlign:'center', marginBottom:40, padding:'0 36px' }}>
          <h2 style={{ ...T.h2 }}>After This Experience</h2>
        </div>
        {/* Photo */}
        <div style={{ maxWidth:820, margin:'0 auto', padding:'0 36px' }}>
          <img src="/images/ocean3.jpg" alt="After"
            style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block' }}/>
        </div>

        {/* ── Before / After — gap:24 between boxes ── */}
        <div style={{
          maxWidth:820, margin:'40px auto 0', padding:'0 36px 72px',
          display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 24,
        }}>
          {/* Before — white card */}
          <div style={{ background:WHITE, padding:'40px 36px', borderRadius:2 }}>
            <p style={{
              fontFamily:"'Cormorant Garamond',serif", fontSize:'1.9rem', fontWeight:500,
              color:TEAL, textAlign:'center', marginBottom:28,
            }}>Before</p>
            {['Rushed','Overstimulated','Consuming without intention','Disconnected from nature','Tired and unfocused'].map((b,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', backgroundColor:'#ccc', flexShrink:0 }}/>
                <p style={{ ...T.body, color:MUTED }}>{b}</p>
              </div>
            ))}
          </div>

          {/* After — dark teal card */}
          <div style={{ background:TEAL, padding:'40px 36px', borderRadius:2 }}>
            <p style={{
              fontFamily:"'Cormorant Garamond',serif", fontSize:'1.9rem', fontWeight:500,
              color:WHITE, textAlign:'center', marginBottom:28,
            }}>After</p>
            {['Calmer','More intentional','More balanced','More aware of daily choices','Living with greater quality and clarity'].map((a,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.45)', flexShrink:0 }}/>
                <p style={{ ...T.body, color:'rgba(255,255,255,0.85)' }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EARLY EXPERIENCE testimonial
      ══════════════════════════════════════════ */}
      <section style={{ ...SEC_WHITE }}>
        <div style={{ ...INNER, textAlign:'center' }}>
          <p style={{ ...T.label, marginBottom:14 }}>EARLY EXPERIENCE</p>
          <div style={{ width:40, height:1, background:TEAL, margin:'0 auto 28px' }}/>
          <p style={{ ...T.italic, fontSize:'clamp(1.1rem,2.8vw,1.6rem)', maxWidth:580, margin:'0 auto', color:BODY, lineHeight:1.6 }}>
            Participants report feeling calmer, clearer, and more in control within days.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LEAD CAPTURE
      ══════════════════════════════════════════ */}
      

      {/* ══════════════════════════════════════════
          PRICING
      ══════════════════════════════════════════ */}
      <section id="pricing" style={{ ...SEC_TEAL }}>
        <div style={{ ...INNER, textAlign:'center' }}>
          <h2 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:500,
            color:WHITE, marginBottom:48,
          }}>
            {PRODUCT}
          </h2>
          <div style={{
            background:CREAM, maxWidth:540, margin:'0 auto',
            padding: isMobile ? '32px 24px' : '52px 48px', textAlign:'center',
          }}>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:14, marginBottom:6 }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.7rem', color:MUTED, textDecoration:'line-through' }}>
                {PRICE_OLD}
              </span>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2.8rem,8vw,4.2rem)', fontWeight:500, color:TEAL }}>
                {PRICE}
              </span>
            </div>
            <p style={{ ...T.sm, marginBottom:28 }}>One-time investment</p>
            <div style={{ borderTop:`1px solid #ccc7be`, marginBottom:28 }}/>
            <div style={{ display:'flex', flexDirection:'column', gap:12, textAlign:'left', marginBottom:36 }}>
              {[
                '7-day structured experience',
                'Ocean Study Digital Brochure (included)',
                'Final certification',
                'Practical lifestyle system',
                'Lifetime access',
              ].map((item,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <LineCheck/>
                  <p style={{ ...T.body }}>{item}</p>
                </div>
              ))}
            </div>
            <button onClick={() => go(CHECKOUT)} style={{
              width:'100%', padding:'18px 24px',
              background:TEAL, color:WHITE, border:'none', cursor:'pointer',
              fontFamily:"'Jost',sans-serif", fontSize:'11px', fontWeight:500,
              letterSpacing:'0.22em', textTransform:'uppercase',
            }}>
              BEGIN THE EXPERIENCE
            </button>
          </div>
          <p style={{ ...T.sm, color:'rgba(255,255,255,0.4)', marginTop:18, fontSize:12 }}>
            A curated experience, not a course
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FAQ — bordered box per row (exact Image 1 / Screenshot 341)
          Each row: white background, border, chevron icon
      ══════════════════════════════════════════ */}
      <section style={{ ...SEC_WHITE }}>
        <div style={{ ...INNER, textAlign:'center' }}>
          <h2 style={{ ...T.h2, marginBottom:48 }}>Frequently Asked Questions</h2>
          <div style={{ maxWidth:700, margin:'0 auto', textAlign:'left', display:'flex', flexDirection:'column', gap:8 }}>
            {[
              ['Who is this for?','This is for anyone feeling overwhelmed, overstimulated, or disconnected. No prior knowledge needed.'],
              ['How is this different from other courses?','Ocean Living is not a trend course. It is a structured philosophy — calm, intentional, deeply personal.'],
              ['How quickly will I feel results?','Participants report feeling calmer, clearer, and more in control within days of beginning.'],
              ['Is this worth the price?',`At ${PRICE}, this is a one-time investment in a lifetime of calmer, more intentional living.`],
              ['Do I get a certificate?','Yes. Upon completing all lessons and the final quiz, you receive a branded certificate.'],
              ['Can I add it to LinkedIn?','Yes. Your certificate can be added to LinkedIn, your CV, or personal development portfolio.'],
              ['Do I need previous knowledge?','No. This experience is designed to be accessible to everyone, wherever you are in life.'],
            ].map(([q,a],i) => (
              <div
                key={i}
                style={{
                  border: `1px solid #d8d3cc`,   // ← visible border on each row
                  borderRadius: 2,
                  overflow: 'hidden',
                  backgroundColor: WHITE,
                }}
              >
                <button
                  onClick={() => setFaq(faq===i ? null : i)}
                  style={{
                    width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'18px 20px', background:'none', border:'none', cursor:'pointer', textAlign:'left',
                  }}
                >
                  <p style={{ ...T.body, fontWeight:400, color:BODY, margin:0 }}>{q}</p>
                  <Chevron open={faq===i} color={MUTED}/>
                </button>
                {faq===i && (
                  <div style={{ padding:'0 20px 18px' }}>
                    <p style={{ ...T.body, color:MUTED }}>{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════ */}
      <section style={{ position:'relative', overflow:'hidden' }}>
        <img src="/images/oceanCta.png" alt="Begin"
          style={{ width:'100%', height:580, objectFit:'cover', objectPosition:'center', display:'block' }}/>
        <div style={{ position:'absolute', inset:0, background:'rgba(25,42,40,0.55)' }}/>
        <div style={{
          position:'absolute', inset:0,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          textAlign:'center', padding:'0 32px',
        }}>
          <h2 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:'clamp(2rem,5vw,3.4rem)', fontWeight:500,
            color:WHITE, marginBottom:14, lineHeight:1.2,
          }}>
            Begin a New Way of Living
          </h2>
          <div style={{ width:48, height:1, background:'rgba(255,255,255,0.4)', margin:'0 auto 18px' }}/>
          <p style={{ ...T.body, color:'rgba(255,255,255,0.75)', marginBottom:36, maxWidth:480 }}>
            A curated 7-day experience to reset your lifestyle, clarity, and daily rhythm.
          </p>
          <button onClick={() => go(CHECKOUT)} style={{
            fontFamily:"'Jost',sans-serif", fontSize:'11px', fontWeight:500,
            letterSpacing:'0.22em', textTransform:'uppercase',
            padding:'16px 52px', background:WHITE, color:TEAL,
            border:'none', cursor:'pointer',
          }}>
            START NOW
          </button>
          <div style={{ marginTop:52, borderTop:'1px solid rgba(255,255,255,0.18)', paddingTop:28, maxWidth:380 }}>
            <p style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:20, fontStyle:'italic', fontWeight:400,
              color:'rgba(255,255,255,0.82)', marginBottom:8, lineHeight:1.5,
            }}>
              "The ocean does not decorate.<br/>It structures."
            </p>
            <p style={{ ...T.label, color:'rgba(255,255,255,0.45)' }}>— SEAGLORÉ</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer style={{ backgroundColor:TEAL, padding:'52px 32px', textAlign:'center' }}>
        <p style={{
          fontFamily:"'Jost',sans-serif", fontSize:14, fontWeight:500,
          letterSpacing:'0.3em', textTransform:'uppercase', color:WHITE, marginBottom:10,
        }}>SEAGLORÉ</p>
        <p style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:15, fontStyle:'italic', color:'rgba(255,255,255,0.55)', marginBottom:28,
        }}>
          Where Nature Becomes Couture
        </p>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:20 }}>
          <p style={{ ...T.sm, color:'rgba(255,255,255,0.35)', fontSize:12 }}>
            © 2026 SEAGLORÉ. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}