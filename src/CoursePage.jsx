// src/CoursePage.jsx
// Ocean Living Certification — Protected Course Dashboard
// Route: /course-ocean-living
// Protected: only accessible after payment (session stored in localStorage)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VERIFY_API  = '/api/verify-payment';
const CHECKOUT    = '/checkout-ocean-living';

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
  h1:    { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 500, color: TEAL, margin: 0 },
  h2:    { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 500, color: TEAL, margin: 0 },
  body:  { fontFamily: "'Jost', sans-serif", fontSize: '15px', fontWeight: 400, lineHeight: 1.7, color: BODY },
  sm:    { fontFamily: "'Jost', sans-serif", fontSize: '13px', color: MUTED, lineHeight: 1.6 },
};

const MODULES = [
  {
    num: '01',
    title: "Why People Don't Feel Well",
    lessons: [
      { title: 'The Root of Modern Disconnection', duration: '8 min' },
      { title: 'Understanding Mental Fatigue', duration: '6 min' },
      { title: "Why Information Isn't the Answer", duration: '5 min' },
    ],
    description: 'Understand why modern life disconnects people from calm, clarity, and their natural rhythm.',
  },
  {
    num: '02',
    title: 'Sustainable Living Made Simple',
    lessons: [
      { title: 'Reducing Consumption Intentionally', duration: '7 min' },
      { title: 'Daily Choices That Matter', duration: '9 min' },
      { title: 'Building Slower Routines', duration: '6 min' },
    ],
    description: 'Practical, elegant approaches to reducing consumption and making daily choices with intention.',
  },
  {
    num: '03',
    title: 'The Ocean Living Method',
    lessons: [
      { title: 'The Core Framework', duration: '10 min' },
      { title: 'Rebuilding Your Daily Rhythm', duration: '8 min' },
      { title: 'Final Practice & Reflection', duration: '7 min' },
      { title: 'Final Quiz', duration: '10 min' },
    ],
    description: 'The complete Ocean Living system for rebuilding rhythm, reducing noise, and returning to clarity.',
  },
];

const RESOURCES = [
  { title: 'Ocean Study Digital Brochure', type: 'PDF', icon: '📄' },
  { title: 'Daily Rhythm Worksheet', type: 'PDF', icon: '📋' },
  { title: 'Certificate of Completion', type: 'Certificate', icon: '🏅' },
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
  const [access, setAccess]     = useState(false);
  const [checking, setChecking] = useState(true);
  const [openModule, setOpenModule] = useState(0);
  const [progress, setProgress] = useState({ lessons: new Set() });

  // ── PROTECTION CHECK ──────────────────────────────────────────
  useEffect(() => {
    injectFont();

    const checkAccess = async () => {
      try {
        const sessionId = localStorage.getItem('ol_session');

        if (!sessionId) {
          // No session — redirect to checkout
          navigate(CHECKOUT);
          return;
        }

        // Verify session with backend
        const res  = await fetch(`${VERIFY_API}?session_id=${sessionId}`);
        const data = await res.json();

        if (data.paid) {
          setAccess(true);
          // Load progress
          try {
            const saved = localStorage.getItem('ol_progress');
            if (saved) setProgress({ lessons: new Set(JSON.parse(saved)) });
          } catch {}
        } else {
          // Invalid session — redirect to checkout
          localStorage.removeItem('ol_session');
          navigate(CHECKOUT);
        }
      } catch {
        // If verify fails, still allow access (graceful fallback)
        const sessionId = localStorage.getItem('ol_session');
        if (sessionId) {
          setAccess(true);
          try {
            const saved = localStorage.getItem('ol_progress');
            if (saved) setProgress({ lessons: new Set(JSON.parse(saved)) });
          } catch {}
        } else {
          navigate(CHECKOUT);
        }
      } finally {
        setChecking(false);
      }
    };

    checkAccess();
  }, [navigate]);

  const toggleLesson = (key) => {
    setProgress(prev => {
      const next = new Set(prev.lessons);
      next.has(key) ? next.delete(key) : next.add(key);
      localStorage.setItem('ol_progress', JSON.stringify([...next]));
      return { lessons: next };
    });
  };

  const totalLessons    = MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount  = progress.lessons.size;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  // ── LOADING ───────────────────────────────────────────────────
  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ ...T.sm, letterSpacing: '0.2em' }}>Verifying access...</p>
      </div>
    );
  }

  if (!access) return null;

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", background: CREAM, minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{
        background: TEAL, padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span
  onClick={() => navigate('/')}
  style={{
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '22px',
    fontWeight: 500,
    letterSpacing: '0.28em',
    color: '#c9a84c',
    cursor: 'pointer',
    textTransform: 'uppercase',
  }}
>
  SEAGLORÉ
</span>
        {!isMobile && (
          <p style={{ ...T.label, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
            Ocean Living Certification
          </p>
        )}
        <p style={{ ...T.sm, color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '12px' }}>
          {completedCount}/{totalLessons} completed
        </p>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 24px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ ...T.label, marginBottom: 12 }}>Your Course</p>
          <h1 style={{ ...T.h1, marginBottom: 16 }}>Ocean Living Certification Experience</h1>
          <p style={{ ...T.body, color: MUTED, maxWidth: 540, marginBottom: 28 }}>
            A 7-day guided return to clarity, ecological awareness, and a more intentional life.
          </p>
          <div style={{ background: WHITE, borderRadius: 99, height: 6, maxWidth: 380, overflow: 'hidden' }}>
            <div style={{
              height: '100%', background: TEAL_LT,
              width: `${progressPercent}%`, transition: 'width 0.3s', borderRadius: 99,
            }}/>
          </div>
          <p style={{ ...T.sm, fontSize: '12px', marginTop: 8 }}>
            {progressPercent}% complete — {completedCount} of {totalLessons} lessons done
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: 24, alignItems: 'start' }}>

          {/* MODULES */}
          <div>
            <p style={{ ...T.label, marginBottom: 20 }}>Course Modules</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {MODULES.map((module, mi) => (
                <div key={mi} style={{ background: WHITE, border: `1px solid #d8d3cc`, borderRadius: 2, overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpenModule(openModule === mi ? null : mi)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 16,
                      padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 600, color: TEAL_LT, letterSpacing: '0.1em', minWidth: 24 }}>
                      {module.num}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 500, color: TEAL, margin: 0 }}>
                        {module.title}
                      </p>
                      <p style={{ ...T.sm, fontSize: '12px', margin: '2px 0 0' }}>
                        {module.lessons.length} lessons
                      </p>
                    </div>
                    {module.lessons.every((_, li) => progress.lessons.has(`${mi}-${li}`)) && (
                      <span style={{ ...T.sm, fontSize: '11px', color: TEAL_LT }}>✓ Done</span>
                    )}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      style={{ transform: openModule === mi ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                      <path d="M6 9l6 6 6-6" stroke={MUTED} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>

                  {openModule === mi && (
                    <div style={{ borderTop: `1px solid ${CREAM}`, padding: '16px 24px 20px' }}>
                      <p style={{ ...T.sm, marginBottom: 16 }}>{module.description}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {module.lessons.map((lesson, li) => {
                          const key  = `${mi}-${li}`;
                          const done = progress.lessons.has(key);
                          return (
                            <div key={li}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '12px 16px',
                                background: done ? 'rgba(74,124,118,0.06)' : CREAM,
                                borderRadius: 2, cursor: 'pointer',
                              }}
                              onClick={() => toggleLesson(key)}
                            >
                              <div style={{
                                width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                                border: `1.5px solid ${done ? TEAL_LT : '#ccc'}`,
                                background: done ? TEAL_LT : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                {done && (
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12l5 5 9-10" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round"/>
                                  </svg>
                                )}
                              </div>
                              <div style={{ flex: 1 }}>
                                <p style={{ ...T.body, fontSize: '14px', margin: 0, color: done ? MUTED : BODY, textDecoration: done ? 'line-through' : 'none' }}>
                                  {lesson.title}
                                </p>
                              </div>
                              <p style={{ ...T.sm, fontSize: '12px', flexShrink: 0 }}>{lesson.duration}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: WHITE, padding: '28px 24px', border: `1px solid #d8d3cc` }}>
              <p style={{ ...T.label, marginBottom: 16 }}>Your Resources</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {RESOURCES.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: CREAM, borderRadius: 2, cursor: 'pointer' }}>
                    <span style={{ fontSize: '18px' }}>{r.icon}</span>
                    <div>
                      <p style={{ ...T.body, fontSize: '13px', margin: 0 }}>{r.title}</p>
                      <p style={{ ...T.sm, fontSize: '11px', margin: 0 }}>{r.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {progressPercent === 100 && (
              <div style={{ background: TEAL, padding: '28px 24px', textAlign: 'center' }}>
                <p style={{ ...T.label, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>Congratulations</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 500, color: WHITE, marginBottom: 16 }}>
                  You've completed the Ocean Living Certification
                </p>
                <button style={{
                  width: '100%', padding: '14px 20px',
                  background: WHITE, color: TEAL, border: 'none', cursor: 'pointer',
                  fontFamily: "'Jost', sans-serif", fontSize: '11px', fontWeight: 500,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                }}>
                  Download Certificate
                </button>
              </div>
            )}

            <div style={{ background: WHITE, padding: '24px', border: `1px solid #d8d3cc` }}>
              <p style={{ ...T.label, marginBottom: 10 }}>Need Help?</p>
              <p style={{ ...T.sm, marginBottom: 12 }}>For any questions about your course, contact us.</p>
              <a href="mailto:info@seaglore.com" style={{
                fontFamily: "'Jost', sans-serif", fontSize: '12px', fontWeight: 500,
                letterSpacing: '0.14em', textTransform: 'uppercase', color: TEAL,
                textDecoration: 'none', borderBottom: `1px solid ${TEAL}`, paddingBottom: 1,
              }}>
                info@seaglore.com
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}