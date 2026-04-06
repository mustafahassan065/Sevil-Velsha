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
  // Professionals seeking balance — briefcase
  <svg key="br" width="36" height="36" viewBox="0 0 40 40" fill="none">
    <path d="M26.6648 33.3307V6.66609C26.6648 5.7821 26.3137 4.93432 25.6886 4.30924C25.0635 3.68417 24.2157 3.33301 23.3318 3.33301H16.6656C15.7816 3.33301 14.9338 3.68417 14.3088 4.30924C13.6837 4.93432 13.3325 5.7821 13.3325 6.66609V33.3307" stroke="#7A9C9E" strokeWidth="2.49981" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M33.3307 9.99902H6.66609C4.82528 9.99902 3.33301 11.4913 3.33301 13.3321V29.9975C3.33301 31.8383 4.82528 33.3306 6.66609 33.3306H33.3307C35.1715 33.3306 36.6638 31.8383 36.6638 29.9975V13.3321C36.6638 11.4913 35.1715 9.99902 33.3307 9.99902Z" stroke="#7A9C9E" strokeWidth="2.49981" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,

  // Students building a stronger profile — graduation cap
  <svg key="gr" width="36" height="36" viewBox="0 0 40 40" fill="none">
    <path d="M35.6972 18.2019C35.9955 18.0703 36.2487 17.854 36.4254 17.5799C36.602 17.3058 36.6944 16.986 36.691 16.6599C36.6876 16.3338 36.5887 16.0159 36.4064 15.7455C36.2241 15.4752 35.9665 15.2642 35.6655 15.1388L21.3816 8.6326C20.9474 8.43453 20.4757 8.33203 19.9984 8.33203C19.5211 8.33203 19.0494 8.43453 18.6152 8.6326L4.33292 15.1321C4.03622 15.2621 3.78382 15.4756 3.60659 15.7468C3.42935 16.0179 3.33496 16.3348 3.33496 16.6587C3.33496 16.9826 3.42935 17.2994 3.60659 17.5706C3.78382 17.8417 4.03622 18.0553 4.33292 18.1852L18.6152 24.698C19.0494 24.8961 19.5211 24.9986 19.9984 24.9986C20.4757 24.9986 20.9474 24.8961 21.3816 24.698L35.6972 18.2019Z" stroke="#7A9C9E" strokeWidth="2.49981" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M36.6641 16.6655V26.6648" stroke="#7A9C9E" strokeWidth="2.49981" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.99902 20.8315V26.6644C9.99902 27.9904 11.0525 29.2621 12.9277 30.1997C14.803 31.1373 17.3463 31.6641 19.9983 31.6641C22.6502 31.6641 25.1936 31.1373 27.0688 30.1997C28.944 29.2621 29.9975 27.9904 29.9975 26.6644V20.8315" stroke="#7A9C9E" strokeWidth="2.49981" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,

  // People interested in sustainable living — leaf
  <svg key="lf" width="36" height="36" viewBox="0 0 40 40" fill="none">
    <path d="M18.332 33.3307C15.4057 33.3396 12.5829 32.2483 10.4235 30.2733C8.26407 28.2983 6.92581 25.5839 6.67411 22.6684C6.42242 19.7529 7.27566 16.8492 9.06462 14.5334C10.8536 12.2175 13.4476 10.6586 16.3322 10.1658C25.8314 8.33263 28.3312 7.46603 31.6643 3.33301C33.3309 6.66609 34.9974 10.2991 34.9974 16.6653C34.9974 25.8313 27.0313 33.3307 18.332 33.3307Z" stroke="#7A9C9E" strokeWidth="2.49981" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.33301 34.9974C3.33301 29.9978 6.41611 26.0647 11.799 24.9982C15.8321 24.1982 19.9984 21.6651 21.6649 19.9985" stroke="#7A9C9E" strokeWidth="2.49981" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,

  // Those who want a calmer lifestyle — heart
  <svg key="ht" width="36" height="36" viewBox="0 0 40 40" fill="none">
    <path d="M31.6642 23.3314C34.1473 20.8983 36.6638 17.9819 36.6638 14.1655C36.6638 11.7345 35.6981 9.40311 33.9791 7.68416C32.2602 5.96521 29.9288 4.99951 27.4978 4.99951C24.5647 4.99951 22.4982 5.83278 19.9984 8.33259C17.4986 5.83278 15.4321 4.99951 12.499 4.99951C10.068 4.99951 7.73661 5.96521 6.01766 7.68416C4.29871 9.40311 3.33301 11.7345 3.33301 14.1655C3.33301 17.9985 5.83282 20.915 8.33263 23.3314L19.9984 34.9972L31.6642 23.3314Z" stroke="#7A9C9E" strokeWidth="2.49981" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,

  // Individuals drawn to elegant intentional living — sparkle/star
  <svg key="st" width="36" height="36" viewBox="0 0 40 40" fill="none">
    <path d="M16.5602 25.8312C16.4114 25.2545 16.1108 24.7281 15.6897 24.307C15.2685 23.8858 14.7422 23.5852 14.1654 23.4364L3.9412 20.7999C3.76676 20.7504 3.61324 20.6454 3.50392 20.5007C3.3946 20.356 3.33545 20.1797 3.33545 19.9983C3.33545 19.817 3.3946 19.6406 3.50392 19.496C3.61324 19.3513 3.76676 19.2462 3.9412 19.1967L14.1654 16.5586C14.742 16.4099 15.2681 16.1096 15.6893 15.6887C16.1105 15.2679 16.4112 14.7419 16.5602 14.1654L19.1967 3.94122C19.2457 3.7661 19.3507 3.61182 19.4955 3.50191C19.6404 3.39201 19.8173 3.33252 19.9991 3.33252C20.181 3.33252 20.3578 3.39201 20.5027 3.50191C20.6476 3.61182 20.7526 3.7661 20.8016 3.94122L23.4364 14.1654C23.5852 14.7422 23.8858 15.2685 24.3069 15.6897C24.7281 16.1109 25.2545 16.4115 25.8312 16.5603L36.0554 19.1951C36.2312 19.2436 36.3863 19.3484 36.4968 19.4935C36.6073 19.6386 36.6671 19.8159 36.6671 19.9983C36.6671 20.1807 36.6073 20.3581 36.4968 20.5032C36.3863 20.6483 36.2312 20.7531 36.0554 20.8016L25.8312 23.4364C25.2545 23.5852 24.7281 23.8858 24.3069 24.307C23.8858 24.7281 23.5852 25.2545 23.4364 25.8312L20.7999 36.0554C20.7509 36.2306 20.6459 36.3848 20.5011 36.4947C20.3562 36.6047 20.1793 36.6641 19.9975 36.6641C19.8156 36.6641 19.6388 36.6047 19.4939 36.4947C19.349 36.3848 19.244 36.2306 19.195 36.0554L16.5602 25.8312Z" stroke="#7A9C9E" strokeWidth="2.49981" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M33.3306 4.99951V11.6657" stroke="#7A9C9E" strokeWidth="2.49981" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M36.6637 8.33252H29.9976" stroke="#7A9C9E" strokeWidth="2.49981" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.66602 28.3311V31.6641" stroke="#7A9C9E" strokeWidth="2.49981" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.33259 29.9976H4.99951" stroke="#7A9C9E" strokeWidth="2.49981" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
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

      

      {/* ══════════════════════════════════════════
          HERO — full-bleed photo
          Text: SEAGLORÉ label + "ENTER THE EXPERIENCE" as BORDERED BUTTON
          + "7-day experience • certificate included" tag
      ══════════════════════════════════════════ */}
      <section style={{ position:'relative', width:'100%', height:'133vh', overflow:'hidden' }}>
        <img src="/images/hero.jpg" alt="Ocean Living"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center center',filter: 'brightness(1.2) saturate(1.1)' }}/>
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
    fontFamily:"'Jost', sans-serif", fontSize:'11px', fontWeight:300,
    letterSpacing:'0.28em', textTransform:'uppercase',
    color: WHITE,
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(1px)',
    border: '1px solid rgba(255,255,255,0.12)',
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
      <button onClick={() => jump('ocean')} style={{
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
  <div style={{ ...INNER, textAlign:'center',backgroundColor:'#EAE8E5' }}>

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
      <section id='ocean' style={{ ...SEC_WHITE, padding:'72px 0 0' }}>
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
  <div style={{ ...INNER, textAlign:'center',backgroundColor:'#EAE8E5' }}>
    <h2 style={{ ...T.h2, fontWeight:900, marginBottom:52 }}>What You Will Learn</h2>
    <div style={{ maxWidth:560, margin:'0 auto' }}>
      {[
        'Rebuild your daily rhythm with clarity',
        'Reduce mental and environmental noise',
        'Design a calm, intentional lifestyle',
        'Shift your thinking toward conscious living',
      ].map((item, i, arr) => (
        <div key={i}>
          <div style={{ width:40, height:1, background:TEAL, margin:'0 auto', marginBottom:22 }}/>
          <p style={{ ...T.body, textAlign:'center', color:BODY, padding:'0 0 30px', fontSize:'23px' }}>{item}</p>
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
          <h2 style={{ ...T.h2, marginBottom:58 }}>Course Curriculum</h2>
          <div style={{ maxWidth:820,height:450,  margin:'0 auto' }}>

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
                  backgroundColor: '#F9F8F6',
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
                    fontFamily:"'Cormorant Garamond', serif", fontSize:'1.3rem', fontWeight:900,
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
  <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'72px 36px',backgroundColor:'#EAE8E5' }}>

    {/* Heading */}
    <h2 style={{
      fontFamily:"'Cormorant Garamond', Georgia, serif",
      fontSize:'clamp(1.8rem, 3.5vw, 2.8rem)',
      fontWeight: 700,
      color: '#2d4a47',
      textAlign:'center',
      marginBottom: 12,
      whiteSpace: isMobile ? 'normal' : 'nowrap',
    }}>Become Certified in Ocean Living Systems</h2>

    <p style={{
      fontFamily:"'Jost', sans-serif",
      fontSize:'15px', fontWeight:400,
      color:'#7a8a88',
      textAlign:'center',
      marginBottom: 64,
      letterSpacing:'0.02em',
    }}>A recognized certification in sustainable living and personal wellbeing</p>

    {/* Main grid */}
    <div style={{
      display:'grid',
      gridTemplateColumns: isMobile ? '1fr' : '280px 1fr',
      gap: isMobile ? 40 : 80,
      alignItems:'center',
      marginBottom: 48,
    }}>

      {/* LEFT — bullet points */}
      <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
        {[
          'Master sustainable living principles grounded in real-world application',
          'Apply ocean-based practices for clarity, balance, and wellbeing',
          'Earn a verified SEAGLORÉ certification',
          'Showcase your certification on LinkedIn, in schools, on your CV, or in your professional portfolio',
        ].map((text, i) => (
          <div key={i} style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
            <div style={{ width:20, height:2, backgroundColor:'#2d4a47', flexShrink:0, marginTop:10 }}/>
            <p style={{
              fontFamily:"'Jost', sans-serif",
              fontSize:'15px', fontWeight:400,
              color:'#2C3E3F', lineHeight:1.7, margin:0,
            }}>{text}</p>
          </div>
        ))}
      </div>

      {/* RIGHT — Certificate card */}
      <div style={{
        background: WHITE,
        padding:'40px 60px',
        position:'relative',
        boxShadow:'0 2px 24px rgba(0,0,0,0.07)',
        width:'100%',
      }}>
        {/* Corner marks */}
        <div style={{ position:'absolute', top:16, left:16, width:16, height:16, borderTop:'1.5px solid #ccc', borderLeft:'1.5px solid #ccc' }}/>
        <div style={{ position:'absolute', top:16, right:16, width:16, height:16, borderTop:'1.5px solid #ccc', borderRight:'1.5px solid #ccc' }}/>
        <div style={{ position:'absolute', bottom:16, left:16, width:16, height:16, borderBottom:'1.5px solid #ccc', borderLeft:'1.5px solid #ccc' }}/>
        <div style={{ position:'absolute', bottom:16, right:16, width:16, height:16, borderBottom:'1.5px solid #ccc', borderRight:'1.5px solid #ccc' }}/>

        <p style={{ fontFamily:"'Jost', sans-serif", fontSize:'10px', fontWeight:500, letterSpacing:'0.28em', textTransform:'uppercase', color:'#2C3E3F', textAlign:'center', marginBottom:20 }}>
          S E A G L O R É &nbsp; A C A D E M Y
        </p>
        <p style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'clamp(1.2rem, 2vw, 1.5rem)', fontWeight:600, color:'#2C3E3F', textAlign:'center', marginBottom:8, lineHeight:1.3 }}>
          Certification in Ocean Living Systems
        </p>
        <p style={{ fontFamily:"'Jost', sans-serif", fontSize:'12px', fontWeight:400, color:'#5A6C6D', textAlign:'center', marginBottom:16 }}>
          This certifies that
        </p>
        <p style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'clamp(2rem, 4vw, 2.8rem)', fontWeight:700, color:'#2C3E3F', textAlign:'center', marginBottom:6, lineHeight:1.2 }}>
          Emma Wilson
        </p>
        <p style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'12px', fontStyle:'italic', color:'#7A9C9E', textAlign:'center', marginBottom:20 }}>
          Sample Certificate — Your Name Will Appear Here
        </p>
        <p style={{ fontFamily:"'Jost', sans-serif", fontSize:'12px', fontWeight:400, color:'#7A9C9E', textAlign:'center', marginBottom:16, lineHeight:1.7 }}>
          has successfully completed the SEAGLORÉ Academy program<br/>and demonstrated applied understanding of:
        </p>
        <div style={{ marginBottom:20, textAlign:'center' }}>
          {['Sustainable Living Systems','Environmental Awareness','Personal Wellbeing Through Natural Alignment'].map((item,i) => (
            <p key={i} style={{ fontFamily:"'Jost', sans-serif", fontSize:'12px', fontWeight:400, color:'#2C3E3F', marginBottom:4 }}>• {item}</p>
          ))}
        </div>
        <p style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'12px', fontStyle:'italic', color:'#2C3E3F', textAlign:'center', marginBottom:24, lineHeight:1.7 }}>
          This certification represents disciplined study, observation,<br/>and integration of ocean-derived principles into daily life.
        </p>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
          <p style={{ fontFamily:"'Jost', sans-serif", fontSize:'10px', fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase', color:'#2C3E3F' }}>SEAGLORÉ ACADEMY</p>
          <div style={{ textAlign:'right' }}>
            <p style={{ fontFamily:"'Jost', sans-serif", fontSize:'10px', color:'#7a8a88', marginBottom:2 }}>Issued: April 12, 2026</p>
            <p style={{ fontFamily:"'Jost', sans-serif", fontSize:'10px', color:'#7a8a88', marginBottom:2 }}>Certificate ID: SOL-2026-XXXXX</p>
            <p style={{ fontFamily:"'Jost', sans-serif", fontSize:'10px', color:'#7a8a88' }}>Verify: seaglore.com/verify</p>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom */}
    <div style={{ textAlign:'center', marginBottom:24 }}>
      <p style={{ fontFamily:"'Jost', sans-serif", fontSize:'13px', fontWeight:400, color:'#7aaba5', letterSpacing:'0.08em' }}>
        Downloadable &nbsp;•&nbsp; Shareable &nbsp;•&nbsp; Verified
      </p>
    </div>
    <div style={{ borderTop:'1px solid #d8d3cc', paddingTop:24, textAlign:'center' }}>
      <p style={{ fontFamily:"'Jost', sans-serif", fontSize:'14px', fontWeight:400, color:'#7a8a88' }}>
        Each certificate includes a unique ID and can be verified online
      </p>
    </div>

  </div>
</section>

      {/* ══════════════════════════════════════════
          WHO THIS COURSE IS FOR
      ══════════════════════════════════════════ */}
      <section style={{ ...SEC_WHITE,marginBottom:'60px' }}>
        <div style={{ ...INNER, textAlign:'center',maxWidth:'1000px' }}>
          <h2 style={{ ...T.h2,color:'#2C3E3F', fontWeight:900, marginBottom:48 }}>Who This Course Is For</h2>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:14,fontWeight:900, marginBottom:14,color:'#2C3E3F', }}>
            {[
              'Professionals seeking balance',
              'Students building a stronger profile',
              'People interested in sustainable living',
            ].map((label,i) => (
              <div key={i} style={{ background:'#F9F8F6', padding:'28px 22px', textAlign:'left',border:'0.85px solid #E0DDD8', borderRadius:4 }}>
                <div style={{ marginBottom:16 }}>{WHO_ICONS[i]}</div>
                <p style={{ ...T.body }}>{label}</p>
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap:14,fontWeight:900, maxWidth:700, margin:'0 auto',color:'#2C3E3F', }}>
            {[
              'Those who want a calmer, healthier lifestyle',
              'Individuals drawn to elegant, intentional living',
            ].map((label,i) => (
              <div key={i} style={{ background:'#F9F8F6', padding:'28px 22px', textAlign:'left',border:'0.85px solid #E0DDD8', borderRadius:4 }}>
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
      <section style={{ backgroundColor:'#EAE8E5', paddingTop:72 }}>
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
          maxWidth:1020, margin:'40px auto 0', padding:'0 36px 72px',
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
          <p style={{ ...T.label,color:'#7A9C9E', marginBottom:14 }}>EARLY EXPERIENCE</p>
          <div style={{ width:40, height:1, background:TEAL, margin:'0 auto 28px' }}/>
          <p style={{ ...T.italic, fontSize:'clamp(1.1rem,2.8vw,1.6rem)', maxWidth:580, margin:'0 auto', color:'#2C3E3F', lineHeight:1.6 }}>
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
            padding: isMobile ? '32px 24px' : '52px 48px', textAlign:'center', borderRadius:'8px'
          }}>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:14, marginBottom:6 }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.7rem', color:'#7A9C9E', textDecoration:'line-through' }}>
                {PRICE_OLD}
              </span>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2.8rem,8vw,4.2rem)', fontWeight:500, color:TEAL }}>
                {PRICE}
              </span>
            </div>
            <p style={{ ...T.sm, marginBottom:28 }}>One-time investment</p>
            <div style={{ borderTop:`1px solid #ccc7be`, marginBottom:28 }}/>
            <div style={{ display:'flex',color:'#7A9C9E', flexDirection:'column', gap:12, textAlign:'left', marginBottom:36 }}>
              {[
                '7-day structured experience',
                'Ocean Study Digital Brochure (included)',
                'Final certification',
                'Practical lifestyle system',
                'Lifetime access',
              ].map((item,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <LineCheck/>
                  <p style={{ ...T.body,color:'#7A9C9E' }}>{item}</p>
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
          <div style={{ maxWidth:700, margin:'0 auto', textAlign:'left', display:'flex', flexDirection:'column', gap:8, }}>
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
          style={{ width:'100%', height:'700px', objectFit:'cover', objectPosition:'center', display:'block' }}/>
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
          fontFamily:"'Jost',sans-serif", fontSize:24, fontWeight:900,
          letterSpacing:'0.1em', textTransform:'uppercase', color:'#F5F3F0', marginBottom:10,
        }}>SEAGLORÉ</p>
        <p style={{
          
          fontSize:15, fontStyle:'solid', color:'#B8A99A', marginBottom:28,
        }}>
          Where Nature Becomes Couture
        </p>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:20 }}>
          <p style={{ ...T.sm, color:'#7A9C9E', fontSize:12 }}>
            © 2026 SEAGLORÉ. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}