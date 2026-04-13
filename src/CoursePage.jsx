// src/CoursePage.jsx
// Ocean Living Certification — Course Dashboard
// Route: /course-ocean-living
// Protected: session check on load
// Structure: Day 1 (Video) → Day 2 (Brochure) → Day 3 (Video) → Day 4 (Brochure) → Day 5–7 coming

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VERIFY_API = '/api/verify-payment';
const CHECKOUT   = '/checkout-ocean-living';

// ── DESIGN TOKENS ─────────────────────────────────────────────────
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
  label:  { fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: MUTED },
  h1:     { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 400, color: TEAL, margin: 0 },
  h2:     { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', fontWeight: 400, color: TEAL, margin: 0 },
  italic: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(1rem,2vw,1.2rem)', fontWeight: 400, color: MUTED, lineHeight: 1.7 },
  body:   { fontFamily: "'Jost', sans-serif", fontSize: '15px', fontWeight: 400, lineHeight: 1.8, color: BODY },
  sm:     { fontFamily: "'Jost', sans-serif", fontSize: '13px', color: MUTED, lineHeight: 1.6 },
};

// ── COURSE DAYS ────────────────────────────────────────────────────
const DAYS = [
  {
    num: 1,
    label: 'Day 1 — Reset',
    type: 'video',
    title: 'You don\'t begin by doing more.',
    subtitle: 'You begin by slowing down.',
    reflection: 'Take one moment today to simply observe.',
    thumbnail: 'https://drive.google.com/thumbnail?id=1QDDX3tbDx8RMl2YURVh4-WgbmBuBGulW&sz=w800',
    videoEmbed: 'https://drive.google.com/file/d/1sf_euWRxKZt_3Zjm9G2V1YyXPopFl8w2/preview',
    cta: '→ Continue to Day 2',
    nextDay: 2,
  },
  {
    num: 2,
    label: 'Day 2 — Awareness',
    type: 'brochure',
    title: 'Today is not about watching.',
    subtitle: 'It is about seeing.',
    reflection: null,
    thumbnail: null,
    pdfUrl: 'https://drive.google.com/file/d/1F3LXJjYFQ97ZkSQMTRyG7S9VvYsK2oqI/preview',
    pdfDownload: 'https://drive.google.com/uc?export=download&id=1F3LXJjYFQ97ZkSQMTRyG7S9VvYsK2oqI',
    pdfName: 'Ocean-Living-Guide.pdf',
    cta: '→ Open Ocean Living Guide',
    nextDay: 3,
  },
  {
    num: 3,
    label: 'Day 3 — Slowing Down',
    type: 'video',
    title: 'Now you begin to feel the shift.',
    subtitle: null,
    reflection: 'What changed in your pace?',
    thumbnail: 'https://drive.google.com/thumbnail?id=1EgsZtur6eH4unhuk0O4YEfdjWW5aGDzC&sz=w800',
    videoEmbed: 'https://drive.google.com/file/d/1Y9NrI_0f1AEUvOIPti8h6DiCpwwC-E84/preview',
    cta: '→ Continue to Day 4',
    nextDay: 4,
  },
  {
    num: 4,
    label: 'Day 4 — Clarity',
    type: 'brochure',
    title: 'Clarity comes when noise disappears.',
    subtitle: null,
    reflection: null,
    thumbnail: null,
    pdfUrl: 'https://drive.google.com/file/d/1uZsahpwezi7C4_WR3kPQEShwJwL9etud/preview',
    pdfDownload: 'https://drive.google.com/uc?export=download&id=1uZsahpwezi7C4_WR3kPQEShwJwL9etud',
    pdfName: 'Ocean-Studies-Volume-1.pdf',
    cta: '→ Read Ocean Studies Volume I',
    nextDay: 5,
  },
  {
    num: 5,
    label: 'Day 5 — Control',
    type: 'video',
    title: 'Build simple, intentional behaviors.',
    subtitle: null,
    reflection: null,
    thumbnail: 'https://drive.google.com/thumbnail?id=1ovJbJRwdonAw5ZnB1XvpXMsx3l32sJ5Z&sz=w800',
    videoEmbed: 'https://drive.google.com/file/d/1duyHOr6dEupCxOQZIeBWEMZOfPZbdE7H/preview',
    cta: '→ Continue to Day 6',
    nextDay: 6,
  },
  {
    num: 6,
    label: 'Day 6 — Integration',
    type: 'coming',
    title: 'Apply the system to your daily routine.',
    subtitle: null,
    reflection: null,
    cta: null,
    nextDay: 7,
  },
  {
    num: 7,
    label: 'Day 7 — Completion',
    type: 'coming',
    title: 'Complete the process and receive your credential.',
    subtitle: null,
    reflection: null,
    cta: null,
    nextDay: null,
  },
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

export default function CoursePage() {
  const navigate   = useNavigate();
  const isMobile   = useWindowWidth() < 768;
  const [checking, setChecking]   = useState(true);
  const [access, setAccess]       = useState(false);
  const [activeDay, setActiveDay] = useState(1);
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('ol_days');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const [pdfOpen, setPdfOpen]     = useState(false);

  // ── PROTECTION CHECK ─────────────────────────────────────────
  useEffect(() => {
    injectFont();
    const checkAccess = async () => {
      try {
        const sessionId = localStorage.getItem('ol_session');
        if (!sessionId) { navigate(CHECKOUT); return; }
        const res  = await fetch(`${VERIFY_API}?session_id=${sessionId}`);
        const data = await res.json();
        if (data.paid) {
          setAccess(true);
        } else {
          localStorage.removeItem('ol_session');
          navigate(CHECKOUT);
        }
      } catch {
        if (localStorage.getItem('ol_session')) setAccess(true);
        else navigate(CHECKOUT);
      } finally {
        setChecking(false);
      }
    };
    checkAccess();
  }, [navigate]);

  const markComplete = (dayNum) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.add(dayNum);
      localStorage.setItem('ol_days', JSON.stringify([...next]));
      return next;
    });
  };

  const goToDay = (num) => {
    setActiveDay(num);
    setPdfOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progressPercent = Math.round((completed.size / DAYS.length) * 100);
  const day = DAYS.find(d => d.num === activeDay);

  if (checking) {
    return (
      <div style={{ minHeight:'100vh', background:CREAM, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <p style={{ ...T.sm, letterSpacing:'0.2em' }}>Verifying access...</p>
      </div>
    );
  }
  if (!access) return null;

  return (
    <div style={{ fontFamily:"'Jost', sans-serif", background:WHITE, minHeight:'100vh' }}>

      {/* ── NAV ── */}
      <nav style={{
        background:TEAL, padding:'16px 28px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        position:'sticky', top:0, zIndex:100,
      }}>
        <span
          onClick={() => navigate('/')}
          style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'18px', fontWeight:500, letterSpacing:'0.2em', color:'rgba(255,255,255,0.9)', cursor:'pointer' }}
        >
          SEAGLORÉ
        </span>
        {!isMobile && (
          <p style={{ ...T.label, color:'rgba(255,255,255,0.5)', margin:0 }}>Ocean Living Certification</p>
        )}
        <p style={{ fontFamily:"'Jost',sans-serif", fontSize:'12px', color:'rgba(255,255,255,0.45)', margin:0 }}>
          {completed.size}/{DAYS.length} complete
        </p>
      </nav>

      {/* ── PROGRESS BAR ── */}
      <div style={{ height:2, background:'#d8d3cc' }}>
        <div style={{ height:'100%', background:TEAL_LT, width:`${progressPercent}%`, transition:'width 0.4s' }}/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '240px 1fr', minHeight:'calc(100vh - 58px)' }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          background:CREAM2, borderRight:`1px solid #d8d3cc`,
          padding:'28px 16px', position: isMobile ? 'static' : 'sticky',
          top:58, maxHeight: isMobile ? 'auto' : 'calc(100vh - 58px)',
          overflowY:'auto',
        }}>
          <p style={{ ...T.label, marginBottom:16, paddingLeft:8 }}>Your Journey</p>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            {DAYS.map(d => (
              <button
                key={d.num}
                onClick={() => goToDay(d.num)}
                style={{
                  display:'flex', gap:10, alignItems:'center',
                  padding:'10px 12px', background:'none', border:'none',
                  borderRadius:6, cursor: d.type==='coming' ? 'default' : 'pointer',
                  textAlign:'left', width:'100%',
                  backgroundColor: activeDay===d.num ? WHITE : 'transparent',
                  borderLeft: activeDay===d.num ? `3px solid ${TEAL}` : '3px solid transparent',
                  opacity: d.type==='coming' ? 0.45 : 1,
                }}
              >
                <div style={{
                  width:24, height:24, borderRadius:'50%', flexShrink:0,
                  border:`1.5px solid ${completed.has(d.num) ? TEAL_LT : '#ccc'}`,
                  background: completed.has(d.num) ? TEAL_LT : 'transparent',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {completed.has(d.num) ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l5 5 9-10" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <span style={{ fontFamily:"'Jost',sans-serif", fontSize:'10px', fontWeight:600, color:'#aaa' }}>{d.num}</span>
                  )}
                </div>
                <div>
                  <p style={{ fontFamily:"'Jost',sans-serif", fontSize:'12px', fontWeight:500, color: activeDay===d.num ? TEAL : BODY, margin:0, lineHeight:1.3 }}>
                    {d.label}
                  </p>
                  <p style={{ fontFamily:"'Jost',sans-serif", fontSize:'10px', color:MUTED, margin:0, textTransform:'uppercase', letterSpacing:'0.1em' }}>
                    {d.type==='coming' ? 'Coming' : d.type==='video' ? 'Video' : 'Brochure'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ padding: isMobile ? '32px 20px' : '52px 60px', maxWidth:760 }}>

          {/* Day label */}
          <p style={{ ...T.label, marginBottom:16 }}>{day.label}</p>

          {/* Title */}
          <h1 style={{ ...T.h1, marginBottom: day.subtitle ? 8 : 32 }}>{day.title}</h1>
          {day.subtitle && (
            <p style={{ ...T.italic, marginBottom:32 }}>{day.subtitle}</p>
          )}

          {/* ── VIDEO DAY ── */}
          {day.type === 'video' && (
            <>
              {/* Thumbnail → click to play */}
              {day.thumbnail && !pdfOpen ? (
                <div
                  style={{ position:'relative', width:'100%', aspectRatio:'16/9', cursor:'pointer', marginBottom:28, borderRadius:4, overflow:'hidden' }}
                  onClick={() => setPdfOpen(true)}
                >
                  <img
                    src={day.thumbnail}
                    alt={day.label}
                    style={{ width:'100%', height:'100%', objectFit:'cover' }}
                  />
                  {/* Play button overlay */}
                  <div style={{
                    position:'absolute', inset:0,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    background:'rgba(0,0,0,0.3)',
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
                <div style={{ width:'100%', aspectRatio:'16/9', marginBottom:28, borderRadius:4, overflow:'hidden', background:'#000' }}>
                  <iframe
                    src={day.videoEmbed}
                    title={day.label}
                    style={{ width:'100%', height:'100%', border:'none' }}
                    allow="autoplay"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Reflection text */}
              {day.reflection && (
                <p style={{ ...T.italic, marginBottom:36, textAlign:'center' }}>{day.reflection}</p>
              )}
            </>
          )}

          {/* ── BROCHURE DAY ── */}
          {day.type === 'brochure' && (
            <>
              {/* Thumbnail preview */}
              {day.thumbnail && !pdfOpen && (
                <div style={{ position:'relative', width:'100%', marginBottom:28, borderRadius:4, overflow:'hidden', cursor:'pointer' }}
                  onClick={() => setPdfOpen(true)}
                >
                  <img src={day.thumbnail} alt={day.label} style={{ width:'100%', objectFit:'cover', display:'block' }}/>
                  <div style={{
                    position:'absolute', inset:0, background:'rgba(0,0,0,0.25)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <div style={{
                      background:'rgba(255,255,255,0.92)', padding:'12px 28px',
                      fontFamily:"'Jost',sans-serif", fontSize:'11px', fontWeight:500,
                      letterSpacing:'0.18em', textTransform:'uppercase', color:TEAL,
                    }}>
                      Click to Open →
                    </div>
                  </div>
                </div>
              )}

              {/* PDF embed — when opened */}
              {pdfOpen && (
                <div style={{ width:'100%', height:'70vh', marginBottom:28, borderRadius:4, overflow:'hidden', border:`1px solid #d8d3cc` }}>
                  <iframe
                    src={day.pdfUrl}
                    title={day.label}
                    style={{ width:'100%', height:'100%', border:'none' }}
                  />
                </div>
              )}

              {/* PDF download button */}
              <a
                href={day.pdfDownload}
                download={day.pdfName}
                target="_blank"
                rel="noreferrer"
                style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  background:WHITE, border:`1.5px solid ${TEAL}`,
                  color:TEAL, textDecoration:'none',
                  fontFamily:"'Jost',sans-serif", fontSize:'11px', fontWeight:500,
                  letterSpacing:'0.18em', textTransform:'uppercase',
                  padding:'12px 24px', borderRadius:2, marginBottom:28,
                }}
              >
                ↓ Download PDF
              </a>

              {day.reflection && (
                <p style={{ ...T.italic, marginBottom:36, textAlign:'center' }}>{day.reflection}</p>
              )}
            </>
          )}

          {/* ── COMING SOON ── */}
          {day.type === 'coming' && (
            <div style={{
              background:CREAM2, padding:'48px 32px', textAlign:'center',
              borderRadius:4, marginBottom:36,
            }}>
              <p style={{ ...T.italic, fontSize:'1.1rem', marginBottom:12 }}>This day will be available soon.</p>
              <p style={{ ...T.sm }}>Complete the previous days first.</p>
            </div>
          )}

          {/* ── DIVIDER ── */}
          <div style={{ width:40, height:1, background:TEAL, margin:'8px 0 32px' }}/>

          {/* ── CTA BUTTON ── */}
          {day.cta && day.type !== 'coming' && (
            <button
              onClick={() => {
                markComplete(day.num);
                if (day.type === 'brochure' && !pdfOpen) {
                  setPdfOpen(true);
                } else if (day.nextDay) {
                  goToDay(day.nextDay);
                }
              }}
              style={{
                background:TEAL, color:WHITE, border:'none', cursor:'pointer',
                fontFamily:"'Jost',sans-serif", fontSize:'11px', fontWeight:500,
                letterSpacing:'0.22em', textTransform:'uppercase',
                padding:'16px 40px', marginBottom:16,
              }}
            >
              {day.type === 'brochure' && !pdfOpen ? day.cta : day.num < 7 ? `→ Continue to Day ${day.nextDay}` : '→ Complete Course'}
            </button>
          )}

          {/* Mark complete */}
          {!completed.has(day.num) && day.type !== 'coming' && (
            <p
              onClick={() => markComplete(day.num)}
              style={{ ...T.sm, cursor:'pointer', textDecoration:'underline', marginTop:8 }}
            >
              Mark as complete
            </p>
          )}
          {completed.has(day.num) && (
            <p style={{ ...T.sm, color:TEAL_LT }}>✓ Day {day.num} complete</p>
          )}

          {/* Congratulations — all done */}
          {completed.size === DAYS.length && (
            <div style={{
              marginTop:48, background:TEAL, padding:'36px 32px', textAlign:'center',
            }}>
              <p style={{ ...T.label, color:'rgba(255,255,255,0.6)', marginBottom:12 }}>Congratulations</p>
              <p style={{
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:400,
                color:WHITE, marginBottom:20, lineHeight:1.4,
              }}>
                You have completed the<br/>Ocean Living Certification
              </p>
              <button style={{
                background:WHITE, color:TEAL, border:'none', cursor:'pointer',
                fontFamily:"'Jost',sans-serif", fontSize:'11px', fontWeight:500,
                letterSpacing:'0.2em', textTransform:'uppercase', padding:'14px 32px',
              }}>
                Download Certificate
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}