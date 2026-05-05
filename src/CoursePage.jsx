// src/CoursePage.jsx
// Ocean Living Certification — Course Dashboard
// Route: /course-ocean-living
// Protected: session check on load
// UPDATED: Brochure days auto-open full preview

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

// ── CERTIFICATE GENERATOR — Ocean Living Design ─────────────────
function generateOceanCertificate(userName) {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  script.onload = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const w = 297; const h = 210;
    const today = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
    const certId = 'SOL-' + Date.now().toString(36).toUpperCase();

    doc.setFillColor(238, 233, 226);
    doc.rect(0, 0, w, h, 'F');
    doc.setDrawColor(45, 74, 71);
    doc.setLineWidth(1.5);
    doc.rect(8, 8, w-16, h-16);
    doc.setDrawColor(74, 124, 118);
    doc.setLineWidth(0.5);
    doc.rect(14, 14, w-28, h-28);
    doc.setDrawColor(180, 180, 170);
    doc.setLineWidth(0.5);
    doc.line(20, 20, 35, 20); doc.line(20, 20, 20, 35);
    doc.line(w-35, 20, w-20, 20); doc.line(w-20, 20, w-20, 35);
    doc.line(20, h-35, 20, h-20); doc.line(20, h-20, 35, h-20);
    doc.line(w-35, h-20, w-20, h-20); doc.line(w-20, h-35, w-20, h-20);
    doc.setFontSize(10);
    doc.setTextColor(45, 74, 71);
    doc.setFont('helvetica', 'bold');
    doc.text('S E A G L O R É   A C A D E M Y', w/2, 32, { align:'center' });
    doc.setDrawColor(201, 169, 110);
    doc.setLineWidth(0.6);
    doc.line(60, 38, w-60, 38);
    doc.setFontSize(26);
    doc.setTextColor(45, 74, 71);
    doc.text('Certification in Ocean Living Systems', w/2, 52, { align:'center' });
    doc.setFontSize(11);
    doc.setTextColor(90, 108, 109);
    doc.setFont('helvetica', 'normal');
    doc.text('This certifies that', w/2, 68, { align:'center' });
    doc.setFontSize(36);
    doc.setTextColor(45, 74, 71);
    doc.setFont('helvetica', 'bolditalic');
    doc.text(userName, w/2, 88, { align:'center' });
    const nameWidth = doc.getTextWidth(userName);
    doc.setDrawColor(45, 74, 71);
    doc.setLineWidth(0.4);
    doc.line(w/2 - nameWidth/2 - 8, 94, w/2 + nameWidth/2 + 8, 94);
    doc.setFontSize(10);
    doc.setTextColor(90, 108, 109);
    doc.setFont('helvetica', 'normal');
    doc.text('has successfully completed the SEAGLORÉ Academy program', w/2, 104, { align:'center' });
    doc.text('and demonstrated applied understanding of:', w/2, 112, { align:'center' });
    doc.setFontSize(10);
    doc.setTextColor(45, 74, 71);
    const skills = ['Sustainable Living Systems', 'Environmental Awareness', 'Personal Wellbeing Through Natural Alignment'];
    skills.forEach((skill, i) => {
      doc.text('•  ' + skill, w/2 - 60 + (i < 2 ? 0 : 80), 124 + (i % 2) * 8, { align:'left' });
    });
    doc.setDrawColor(201, 169, 110);
    doc.setLineWidth(0.5);
    doc.line(24, 140, w-24, 140);
    doc.setFontSize(12);
    doc.setTextColor(74, 156, 148);
    doc.setFont('helvetica', 'italic');
    doc.text('"Where Nature Becomes Couture"', w/2, 152, { align:'center' });
    doc.setFontSize(11);
    doc.setTextColor(45, 74, 71);
    doc.setFont('helvetica', 'bold');
    doc.text('SEAGLORÉ ACADEMY', w/2, 168, { align:'center' });
    doc.setFontSize(9);
    doc.setTextColor(122, 138, 136);
    doc.setFont('helvetica', 'normal');
    doc.text('Issued: ' + today + '    |    Certificate ID: ' + certId, w/2, 176, { align:'center' });
    doc.text('Verify: seaglore.com/verify', w/2, 184, { align:'center' });
    doc.save(`Ocean-Living-Certificate-${userName.replace(/\s+/g,'-')}.pdf`);
  };
  if (!document.querySelector('script[src*="jspdf"]')) {
    document.head.appendChild(script);
  } else if (window.jspdf) {
    script.onload();
  } else {
    document.head.appendChild(script);
  }
}

// ── COURSE DAYS ────────────────────────────────────────────────────
const DAYS = [
  {
    num: 1,
    label: 'Day 1 — Reset',
    type: 'video',
    title: 'You don\'t begin by doing more.',
    subtitle: 'You begin by slowing down.',
    reflection: 'Take one moment today to simply observe.',
    thumbnail: null,
    videoEmbed: 'https://drive.google.com/file/d/19rRsJhNClFaXJ3J3Y5tJGu-AjCRRC_lb/preview',
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
    cta: '→ Continue to Day 3',
    nextDay: 3,
  },
  {
    num: 3,
    label: 'Day 3 — Slowing Down',
    type: 'video',
    title: 'Now you begin to feel the shift.',
    subtitle: null,
    reflection: 'What changed in your pace?',
    thumbnail: null,
    videoEmbed: 'https://drive.google.com/file/d/1zugcewAC39jCNrXfPdU3Fm7IKEY9k3H2/preview',
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
    cta: '→ Continue to Day 5',
    nextDay: 5,
  },
  {
    num: 5,
    label: 'Day 5 — Control',
    type: 'video',
    title: 'Build simple, intentional behaviors.',
    subtitle: null,
    reflection: null,
    thumbnail: null,
    videoEmbed: 'https://drive.google.com/file/d/1cVo54mKYoOZV1Zwo7He6LmKFLGaKgmUo/preview',
    cta: '→ Continue to Day 6',
    nextDay: 6,
  },
  {
    num: 6,
    label: 'Day 6 — Integration',
    type: 'video',
    title: 'Apply the system to your daily routine.',
    subtitle: null,
    reflection: 'How will you move differently from here?',
    thumbnail: null,
    videoEmbed: 'https://drive.google.com/file/d/1WfDRUxZ528dvVCQfw3Hbty2E9Td3hRf5/preview',
    cta: '→ Continue to Day 7',
    nextDay: 7,
  },
  {
    num: 7,
    label: 'Day 7 — Ocean Studies',
    type: 'brochure',
    title: 'Ocean Studies Brochure',
    subtitle: null,
    reflection: null,
    thumbnail: null,
    pdfUrl: 'https://drive.google.com/file/d/1uZsahpwezi7C4_WR3kPQEShwJwL9etud/preview',
    pdfDownload: 'https://drive.google.com/uc?export=download&id=1uZsahpwezi7C4_WR3kPQEShwJwL9etud',
    pdfName: 'Ocean-Studies-Brochure.pdf',
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
  const [certIssued, setCertIssued] = useState(false);
  const [userName, setUserName]   = useState('');

  // Load user name from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ol_buyer_name') || localStorage.getItem('ol_lead_name') || '';
    if (saved) setUserName(saved);
  }, []);

  // 🔥 Brochure days auto-open full preview
  useEffect(() => {
    const day = DAYS.find(d => d.num === activeDay);
    if (day && day.type === 'brochure') {
      setPdfOpen(true);
    } else {
      setPdfOpen(false);
    }
  }, [activeDay]);

  // Mark day 7 complete when all previous days done
  useEffect(() => {
    if (activeDay === 7 && [1,2,3,4,5,6].every(n => completed.has(n))) {
      markComplete(7);
      localStorage.setItem('ol_course_completed', new Date().toISOString());
    }
  }, [activeDay]);

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

          <p style={{ ...T.label, marginBottom:16 }}>{day.label}</p>
          <h1 style={{ ...T.h1, marginBottom: day.subtitle ? 8 : 32 }}>{day.title}</h1>
          {day.subtitle && <p style={{ ...T.italic, marginBottom:32 }}>{day.subtitle}</p>}

          {/* ── VIDEO DAY ── */}
          {day.type === 'video' && (
            <>
              {day.thumbnail && !pdfOpen ? (
                <div style={{ position:'relative', width:'100%', aspectRatio:'16/9', cursor:'pointer', marginBottom:28, borderRadius:4, overflow:'hidden' }}
                  onClick={() => setPdfOpen(true)}>
                  <img src={day.thumbnail} alt={day.label} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.3)' }}>
                    <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(255,255,255,0.9)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill={TEAL}><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ width:'100%', aspectRatio:'16/9', marginBottom:28, borderRadius:4, overflow:'hidden', background:'#000' }}>
                  <iframe src={day.videoEmbed} title={day.label} style={{ width:'100%', height:'100%', border:'none' }} allow="autoplay" allowFullScreen/>
                </div>
              )}
              {day.reflection && <p style={{ ...T.italic, marginBottom:36, textAlign:'center' }}>{day.reflection}</p>}
            </>
          )}

          {/* ── BROCHURE DAY — AUTO-OPEN FULL PREVIEW ── */}
          {day.type === 'brochure' && (
            <>
              {pdfOpen && (
                <div style={{ width:'100%', height:'75vh', marginBottom:20, borderRadius:4, overflow:'hidden', border:`1px solid #d8d3cc` }}>
                  <iframe src={day.pdfUrl} title={day.label} style={{ width:'100%', height:'100%', border:'none' }}/>
                </div>
              )}

              <a href={day.pdfDownload} download={day.pdfName} target="_blank" rel="noreferrer"
                style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  background:WHITE, border:`1.5px solid ${TEAL}`,
                  color:TEAL, textDecoration:'none',
                  fontFamily:"'Jost',sans-serif", fontSize:'11px', fontWeight:500,
                  letterSpacing:'0.18em', textTransform:'uppercase',
                  padding:'12px 24px', borderRadius:2, marginBottom:28,
                }}>
                ↓ Download PDF
              </a>
              {day.reflection && <p style={{ ...T.italic, marginBottom:36, textAlign:'center' }}>{day.reflection}</p>}
            </>
          )}

          {/* ── COMPLETION ── */}
          {day.type === 'completion' && (() => {
            const allPrevDone = [1,2,3,4,5,6].every(n => completed.has(n));
            if (!allPrevDone) {
              return (
                <div style={{ background:CREAM2, padding:'48px 32px', textAlign:'center', borderRadius:4, marginBottom:36 }}>
                  <p style={{ ...T.italic, fontSize:'1.1rem', marginBottom:12 }}>Please complete previous days to unlock this section.</p>
                  <p style={{ ...T.sm }}>Days 1–6 must be completed first.</p>
                </div>
              );
            }
            return (
              <>
                <div style={{ maxWidth:560, margin:'0 auto 52px', textAlign:'center' }}>
                  {['You began on the surface.','Now you understand depth.','You have learned to pause before reacting.','To observe before deciding.','To return to stillness.','This is not something you complete.','It is something you carry.','From this point forward, move differently.','Slower when needed.','Clear when it matters.','Calm under pressure.','You are now living with intention.'].map((line, i) => (
                    <p key={i} style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:'clamp(1rem,2.2vw,1.25rem)', fontWeight:400, color: i < 2 ? TEAL : BODY, lineHeight:2.2, margin:0, marginTop: i===5 || i===8 ? 24 : 0 }}>{line}</p>
                  ))}
                </div>

                {/* Certificate */}
                <div style={{ textAlign:'center', marginBottom:60 }}>
                  <div style={{ width:40, height:1, background:TEAL, margin:'0 auto 32px' }}/>
                  <div style={{ maxWidth:400, margin:'0 auto 32px' }}>
                    <p style={{ fontFamily:"'Jost',sans-serif", fontSize:'13px', fontWeight:500, color:MUTED, marginBottom:12, letterSpacing:'0.04em' }}>
                      Enter your full name as it should appear on the certificate:
                    </p>
                    <input type="text" value={userName}
                      onChange={(e) => { setUserName(e.target.value); localStorage.setItem('ol_buyer_name', e.target.value); }}
                      onKeyDown={(e) => { if (e.key === 'Enter' && userName.trim()) { generateOceanCertificate(userName.trim()); setCertIssued(true); } }}
                      placeholder="Your Full Name"
                      style={{ width:'100%', padding:'15px 16px', fontSize:'15px', border:`1.5px solid #d8d3cc`, background:WHITE, color:TEAL, fontFamily:"'Cormorant Garamond', Georgia, serif", textAlign:'center', outline:'none', borderRadius:2, boxSizing:'border-box', marginBottom:16 }}/>
                  </div>
                  {userName.trim() && (
                    <p style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'clamp(1.2rem,2.5vw,1.6rem)', fontWeight:500, color:TEAL, marginBottom:24, fontStyle:'italic' }}>
                      Certificate for: {userName.trim()}
                    </p>
                  )}
                  <button onClick={() => { if (userName.trim()) { generateOceanCertificate(userName.trim()); setCertIssued(true); } }}
                    disabled={!userName.trim()}
                    style={{ display:'inline-block', background: userName.trim() ? TEAL : '#ccc', color:WHITE, fontFamily:"'Jost',sans-serif", fontSize:'11px', fontWeight:500, letterSpacing:'0.22em', textTransform:'uppercase', padding:'16px 48px', border:'none', cursor: userName.trim() ? 'pointer' : 'not-allowed', borderRadius:2, transition:'background 0.2s' }}>
                    ↓ Download Certificate
                  </button>
                  {!userName.trim() && <p style={{ ...T.sm, color:'#aaa', marginTop:8 }}>Please enter your name to download</p>}
                  {certIssued && <p style={{ ...T.sm, color:TEAL_LT, marginTop:8 }}>✓ Your certificate has been issued.</p>}
                </div>

                <div style={{ borderTop:`1px solid #d8d3cc`, paddingTop:52, marginBottom:52 }}>
                  <p style={{ ...T.label, textAlign:'center', marginBottom:12 }}>Continue Your Journey</p>
                  <p style={{ ...T.italic, textAlign:'center', marginBottom:48 }}>Ocean Living was only the beginning.</p>
                  <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:20 }}>
                    <div style={{ background:CREAM2, padding:'36px 28px' }}>
                      <p style={{ ...T.label, marginBottom:12 }}>SEAGLORÉ Academy</p>
                      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.2rem,2.5vw,1.6rem)', fontWeight:400, color:TEAL, marginBottom:12, lineHeight:1.3 }}>A structured path for long-term clarity, calm, and intentional living.</p>
                      <a href="/ocean-living-certification" style={{ display:'inline-block', background:TEAL, color:WHITE, fontFamily:"'Jost',sans-serif", fontSize:'11px', fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase', padding:'12px 28px', textDecoration:'none', marginTop:8 }}>Enter the Academy</a>
                    </div>
                    <div style={{ background:CREAM2, padding:'36px 28px' }}>
                      <p style={{ ...T.label, marginBottom:12 }}>Private Experience</p>
                      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.2rem,2.5vw,1.6rem)', fontWeight:400, color:TEAL, marginBottom:12, lineHeight:1.3 }}>A high-level personal experience designed to refine your presence, thinking, and control.</p>
                      <a href="/upsell-ocean" style={{ display:'inline-block', background:TEAL, color:WHITE, fontFamily:"'Jost',sans-serif", fontSize:'11px', fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase', padding:'12px 28px', textDecoration:'none', marginTop:8 }}>Apply for Private Coaching</a>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}

          {/* ── DIVIDER ── */}
          <div style={{ width:40, height:1, background:TEAL, margin:'8px 0 32px' }}/>

          {/* ── CTA BUTTON ── */}
          {day.cta && (
            <button onClick={() => { markComplete(day.num); if (day.nextDay) goToDay(day.nextDay); }}
              style={{ background:TEAL, color:WHITE, border:'none', cursor:'pointer', fontFamily:"'Jost',sans-serif", fontSize:'11px', fontWeight:500, letterSpacing:'0.22em', textTransform:'uppercase', padding:'16px 40px', marginBottom:16 }}>
              {day.cta}
            </button>
          )}

          {!completed.has(day.num) && day.type !== 'completion' && (
            <p onClick={() => markComplete(day.num)} style={{ ...T.sm, cursor:'pointer', textDecoration:'underline', marginTop:8 }}>Mark as complete</p>
          )}
          {completed.has(day.num) && <p style={{ ...T.sm, color:TEAL_LT }}>✓ Day {day.num} complete</p>}

          {/* ── SUPPORT ── */}
          <div style={{ marginTop:64, borderTop:`1px solid #d8d3cc`, paddingTop:48, display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:24 }}>
            <div style={{ background:CREAM2, padding:'28px 24px' }}>
              <p style={{ ...T.label, marginBottom:12 }}>Need Assistance?</p>
              <p style={{ ...T.body, fontSize:'14px', color:MUTED, marginBottom:16, lineHeight:1.7 }}>If you have any questions or need support, please contact us:</p>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@seaglore.com" style={{ fontFamily:"'Jost',sans-serif", fontSize:'13px', fontWeight:500, color:TEAL, textDecoration:'none', borderBottom:`1px solid ${TEAL}`, paddingBottom:2 }}>info@seaglore.com</a>
            </div>
            <div style={{ background:CREAM2, padding:'28px 24px' }}>
              <p style={{ ...T.label, marginBottom:12 }}>Private Assistance</p>
              <p style={{ ...T.body, fontSize:'14px', color:MUTED, marginBottom:16, lineHeight:1.7 }}>For a more personalized experience, contact us directly.</p>
              <a href="https://wa.me/17786366633" target="_blank" rel="noreferrer"
                style={{ display:'inline-block', background:'#25D366', color:WHITE, fontFamily:"'Jost',sans-serif", fontSize:'11px', fontWeight:500, letterSpacing:'0.16em', textTransform:'uppercase', padding:'10px 24px', textDecoration:'none', borderRadius:2 }}>
                Message on WhatsApp
              </a>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}