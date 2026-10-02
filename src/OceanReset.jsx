import React, { useState } from 'react';
import './index.css';


export default function OceanReset() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire to Resend / lead-capture backend endpoint
    console.log('Lead captured:', email);
    setEmailSubmitted(true);
    setEmail('');
    setTimeout(() => setEmailSubmitted(false), 3000);
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', overflowX: 'hidden', margin: 0, padding: 0 }}>
      <div className="flex flex-col w-full overflow-hidden bg-[#FAF5EC]" data-name="SEAGLORÉ — Ocean Reset">

        {/* ══════════════ NAVIGATION ══════════════ */}
        <nav className="w-full h-[84px] flex items-center justify-between px-8 lg:px-16 bg-[#FAF5EC] border-b border-[#1E4D6B]/5 relative z-50">
          <div className="flex flex-col cursor-pointer" onClick={() => scrollToSection('hero')}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="font-medium text-[22px] text-[#1E4D6B] tracking-[3px] uppercase leading-none">
              Seagloré
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[9px] text-[#6E767D] tracking-[2px] uppercase mt-1">
              Ocean Reset &amp; Water State
            </p>
          </div>

          <button
            onClick={() => scrollToSection('free-reset')}
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="hidden md:inline-flex items-center bg-[#1E4D6B] text-white text-[12px] font-medium tracking-[1px] px-6 py-3 rounded-full hover:bg-[#163a51] transition-colors"
          >
            Try for Free →
          </button>

          <button
            className="md:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <div className="w-6 h-[2px] bg-[#1E4D6B]" />
            <div className="w-6 h-[2px] bg-[#1E4D6B]" />
            <div className="w-6 h-[2px] bg-[#1E4D6B]" />
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[90] bg-[#1E4D6B] flex flex-col pt-16 px-10 pb-10">
            <button
              className="absolute top-6 right-8 text-white text-xs tracking-[3px] uppercase font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              ✕ Close
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('free-reset'); }}
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="mt-16 bg-[#B8A07A] text-white text-[14px] tracking-[2px] uppercase py-4 rounded-full"
            >
              Try for Free
            </button>
          </div>
        )}

        {/* ══════════════ HERO ══════════════ */}
        <section id="hero" className="w-full relative overflow-hidden min-h-[640px] flex items-end">
          <img alt="" className="absolute inset-0 w-full h-full object-cover object-center" src="/images/oceanreset/oceanhero.png" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E4D6B]/50 via-[#1E4D6B]/15 to-transparent" />

          <div className="relative z-10 w-full max-w-[1180px] mx-auto px-6 lg:px-0 pb-16 pt-24">
            <div className="max-w-[560px]">
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white text-[11px] tracking-[3px] uppercase mb-4 opacity-90">
                The 3-Minute Ocean Reset
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-[#1E4D6B] font-medium leading-[1.05] text-[48px] lg:text-[64px] mb-6">
                Feeling<br /><span className="italic">Overwhelmed?</span>
              </h1>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/90 text-[16px] leading-relaxed mb-8 max-w-[440px]">
                Take a breath. Reset in just 3 minutes. Try our Free 3-Minute Ocean Reset and feel calmer, clearer, and more like yourself.
              </p>
              <button
                onClick={() => scrollToSection('free-reset')}
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="inline-flex items-center gap-2 bg-[#1E4D6B] text-white text-[13px] font-medium tracking-[1px] px-8 py-4 rounded-full hover:bg-[#163a51] transition-colors"
              >
                ⏱ Try for Free →
              </button>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/70 text-[11px] mt-3 tracking-[1px]">
                No credit card required
              </p>
            </div>
          </div>
        </section>

        {/* Feature strip */}
        <section className="w-full flex justify-center bg-[#FAF5EC] py-10 px-6">
          <div className="max-w-[1180px] w-full grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: 'Free Assessment', desc: 'Discover your stress level', icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#1E4D6B" strokeWidth="1.6"><path d="M9 11l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
              ) },
              { title: '3-Minute Experience', desc: 'Quick, guided reset for your mind', icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#1E4D6B" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              ) },
              { title: 'Personalized Ocean Ritual', desc: 'Get a ritual that fits your needs', icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#1E4D6B" strokeWidth="1.6"><path d="M12 2c3 4 5 7 5 10a5 5 0 11-10 0c0-3 2-6 5-10z" /></svg>
              ) },
              { title: 'Instant Access', desc: 'Start your reset right away', icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#1E4D6B" strokeWidth="1.6"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" /></svg>
              ) },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-full bg-[#1E4D6B]/8 flex items-center justify-center shrink-0">
                  <span className="w-[18px] h-[18px]">{f.icon}</span>
                </span>
                <div className="flex flex-col gap-1">
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#1E4D6B] text-[13px] font-semibold">{f.title}</p>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E767D] text-[12px] leading-snug">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ THE PROBLEM ══════════════ */}
        <section id="problem" className="w-full flex justify-center bg-[#FAF5EC] py-20 px-6">
          <div className="max-w-[880px] w-full text-center flex flex-col items-center">
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#B8A07A] text-[11px] tracking-[4px] uppercase mb-4">
              The Problem
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-[#1E4D6B] font-medium text-[34px] lg:text-[44px] leading-tight mb-5">
              Your Mind Was Not Designed<br />For Constant Noise.
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E767D] text-[15px] leading-relaxed max-w-[560px] mb-14">
              Modern life overloads your mind and nervous system every single day. Over time, it leaves you feeling drained, disconnected, and stuck.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 w-full mb-12">
              {[
                { title: 'Constant Notifications', desc: 'Your attention is pulled in every direction, all day long.', img: "/images/oceanreset/oceanproblem1.png" },
                { title: 'Daily Stress', desc: 'Deadlines, responsibilities, and pressure keep your body in overdrive.', img: "/images/oceanreset/oceanproblem2.png" },
                { title: 'Overthinking', desc: 'Mental clutter makes it hard to focus, decide, and move forward.', img: "/images/oceanreset/oceanproblem3.png" },
                { title: 'Mental Exhaustion', desc: 'You feel tired, unmotivated, and like you\u2019re running on empty.', img: "/images/oceanreset/oceanproblem4.png" },
              ].map((p) => (
                <div key={p.title} className="bg-white rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
                  <div className="w-full aspect-square rounded-xl overflow-hidden mb-4">
                    <img alt="" className="w-full h-full object-cover" src={p.img} />
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#1E4D6B] text-[13px] font-semibold mb-1">{p.title}</p>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E767D] text-[11px] leading-snug">{p.desc}</p>
                </div>
              ))}
            </div>

            <div
  className="w-full rounded-2xl overflow-hidden relative min-h-[110px] flex items-center px-8"
  style={{
    backgroundImage: "url('/images/oceanreset/oceanwater.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }}
>
              <div className="relative z-10 flex items-center justify-between w-full flex-wrap gap-4">
                <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="italic text-white text-[18px] lg:text-[22px]">
                  You deserve a reset. You deserve to feel like yourself again.
                </p>
                <div className="flex gap-10">
                  <div className="text-center">
                    <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-[#B8A07A] text-[28px] font-medium leading-none">3 min</p>
                    <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/70 text-[9px] tracking-[1px] uppercase mt-1">is all it takes</p>
                  </div>
                  <div className="text-center">
                    <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-[#B8A07A] text-[28px] font-medium leading-none">92%</p>
                    <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/70 text-[9px] tracking-[1px] uppercase mt-1">feel calmer after one reset</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ HOW IT WORKS ══════════════ */}
        <section id="how-it-works" className="w-full flex justify-center bg-[#F3E9DA] py-20 px-6">
          <div className="max-w-[980px] w-full flex flex-col items-center text-center">
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#B8A07A] text-[11px] tracking-[4px] uppercase mb-4">
              How It Works
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-[#1E4D6B] font-medium text-[34px] lg:text-[42px] mb-5">
              A Simple 3-Step Reset.
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E767D] text-[15px] leading-relaxed max-w-[560px] mb-14">
              In just a few minutes, you\u2019ll understand your stress, receive personalized guidance, and begin your reset.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full mb-12">
              {[
                { title: 'Take the Ocean Reset Assessment', desc: 'Answer a few simple questions about your stress, mood, and daily habits. It only takes 2 minutes.', img: "/images/oceanreset/oceanreset1.png" },
                { title: 'Receive Your Ocean Reset Score', desc: 'Discover your stress level and get personalized insights to help you understand what you need most.', img: "/images/oceanreset/oceanreset2.png" },
                { title: 'Start Your Personalized Ocean Ritual', desc: 'Receive a custom ritual, guided practices, and resources to help you feel calmer, clearer, and more connected.', img: "/images/oceanreset/oceanreset3.png" },
              ].map((s) => (
                <div key={s.title} className="flex flex-col items-center">
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-sm">
                    <img alt="" className="w-full h-full object-cover" src={s.img} />
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#1E4D6B] text-[15px] font-semibold mb-2">{s.title}</p>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E767D] text-[13px] leading-relaxed max-w-[280px]">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-full px-8 py-4 flex items-center gap-4 shadow-sm">
              <span className="text-[#B8A07A] text-[16px]">〰</span>
              <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="italic text-[#1E4D6B] text-[15px]">Small steps. Big change.</p>
              <span className="w-px h-5 bg-[#6E767D]/20" />
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E767D] text-[12px]">You don\u2019t need hours of meditation. Just minutes a day, inspired by the rhythm of the ocean.</p>
            </div>
          </div>
        </section>

        {/* ══════════════ FREE 3-MIN RESET OFFER ══════════════ */}
        <section
  id="free-reset"
  className="w-full flex justify-center py-24 px-6 relative overflow-hidden"
  style={{
    backgroundImage: "url('/images/oceanreset/cloudbg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }}
>
          <div className="max-w-[1080px] w-full flex flex-col items-center text-center relative z-10">
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#1E4D6B] text-[11px] tracking-[4px] uppercase mb-4">
              Your Free Experience
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-[#1E4D6B] font-medium text-[34px] lg:text-[42px] mb-5">
              Start Your Free 3-Minute Ocean Reset
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E767D] text-[15px] leading-relaxed max-w-[560px] mb-14">
              A powerful, science-backed experience designed to help you understand your stress and feel calm — fast.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-5 w-full mb-12">
              {[
                { title: 'Ocean Stress Assessment', desc: 'Answer a few simple questions about your current stress.', img: "/images/oceanreset/exp1.png" },
                { title: 'Guided Ocean Breathing', desc: 'A 3-minute guided breathing practice to calm your mind and body.', img: "/images/oceanreset/exp2.png" },
                { title: 'Ocean Sound Experience', desc: 'Immerse yourself in soothing ocean waves and nature sounds.', img: "/images/oceanreset/exp3.png" },
                { title: 'Personalized Ocean Ritual', desc: 'Receive a custom ritual designed for you based on your results.', img: "/images/oceanreset/exp4.png" },
                { title: 'Ocean Reset Guide PDF', desc: 'Get your free guide with practical tips to bring more calm into your daily life.', img: "/images/oceanreset/exp5.png" },
              ].map((c) => (
                <div key={c.title} className="bg-white rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
                  <div className="w-full aspect-square rounded-xl overflow-hidden mb-4">
                    <img alt="" className="w-full h-full object-cover" src={c.img} />
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#1E4D6B] text-[12px] font-semibold mb-1">{c.title}</p>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E767D] text-[10px] leading-snug">{c.desc}</p>
                </div>
              ))}
            </div>

            {!emailSubmitted ? (
              <form onSubmit={handleEmailSubmit} className="flex flex-col items-center gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="px-6 py-4 rounded-full border border-[#1E4D6B]/20 text-[13px] text-[#1E4D6B] outline-none focus:border-[#1E4D6B] bg-white min-w-[260px]"
                  />
                  <button
                    type="submit"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="bg-[#1E4D6B] text-white text-[13px] font-medium tracking-[1px] px-8 py-4 rounded-full hover:bg-[#163a51] transition-colors whitespace-nowrap"
                  >
                    Start My Free Ocean Reset →
                  </button>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E767D] text-[11px] tracking-[1px]">
                  No credit card required
                </p>
              </form>
            ) : (
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#1E4D6B] text-[14px] font-medium">
                Check your inbox — your Ocean Reset is on its way! 🌊
              </p>
            )}

            <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="italic text-[#1E4D6B]/80 text-[17px] mt-14 max-w-[480px]">
              "The ocean doesn't try to be powerful. It simply is. And that is its beauty."
            </p>
          </div>
        </section>

        {/* ══════════════ IMAGINE THIS ══════════════ */}
        <section id="imagine" className="w-full flex justify-center py-20 px-6" style={{ background: '#1E4D6B' }}>
          <div className="max-w-[980px] w-full flex flex-col items-center text-center">
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#B8A07A] text-[11px] tracking-[4px] uppercase mb-4">
              7 Days From Now
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="italic text-white font-medium text-[34px] lg:text-[42px] mb-12">
              Imagine this.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-left">
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/60 text-[11px] tracking-[2px] uppercase mb-5">Right Now</p>
                <ul className="flex flex-col gap-3">
                  {[
                    'You wake up already tired',
                    'You scroll through notifications and feel overwhelmed',
                    'You react to everything around you',
                    'Your days blur together without change',
                  ].map((t) => (
                    <li key={t} style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/80 text-[13px] flex gap-2">
                      <span className="text-white/40">×</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#B8A07A]/10 border border-[#B8A07A]/30 rounded-2xl p-8 text-left">
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#B8A07A] text-[11px] tracking-[2px] uppercase mb-5">After Your Reset</p>
                <ul className="flex flex-col gap-3">
                  {[
                    'You wake up calmer and rested',
                    'Your thoughts feel clearer and more focused',
                    'You reconnect with what truly matters',
                    'Small daily rituals create lasting change',
                  ].map((t) => (
                    <li key={t} style={{ fontFamily: "'Inter', sans-serif" }} className="text-white text-[13px] flex gap-2">
                      <span className="text-[#B8A07A]">✓</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ FULL RESET (7-DAY) ══════════════ */}
        <section id="full-reset" className="w-full relative overflow-hidden min-h-[760px] flex items-start px-6 lg:px-16 pt-28 pb-20">
          <img alt="" className="absolute inset-0 w-full h-full object-cover object-[center_20%]" src="/images/oceanreset/journeybg.png" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E4D6B]/70 via-[#1E4D6B]/20 to-transparent" />

          <div className="relative z-10 max-w-[1180px] w-full mx-auto">
            <div className="max-w-[440px]">
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#B8A07A] text-[11px] tracking-[4px] uppercase mb-4">
                Ready For More?
              </p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-white font-medium text-[32px] lg:text-[40px] leading-tight mb-5">
                Continue your journey with the full reset.
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/85 text-[14px] leading-relaxed mb-8 max-w-[420px]">
                Go deeper with our 7-day Ocean Reset Program and transform daily stress into lasting calm and clarity.
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 max-w-[420px] mb-10">
                {['Daily ocean rituals', 'Guided breathing', 'Ocean soundscapes', 'Reflection exercises', 'Progress tracking', 'Ocean Living certificate'].map((f) => (
                  <p key={f} style={{ fontFamily: "'Inter', sans-serif" }} className="text-white text-[12px] flex items-center gap-2">
                    <span className="text-[#B8A07A]">✓</span> {f}
                  </p>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-7 max-w-[340px] w-full shadow-2xl">
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#B8A07A] text-[10px] tracking-[3px] uppercase mb-2">Ocean Reset</p>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-[#1E4D6B] font-medium text-[22px] mb-2">7-Day Experience</h3>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E767D] text-[12px] leading-relaxed mb-5">
                  A complete guided program to help you reset, recharge, and reconnect.
                </p>
                <div className="flex items-end gap-5 mb-5">
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E767D] text-[9px] tracking-[1px] uppercase mb-1">Regular price</p>
                    <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E767D] text-[14px] line-through">$49</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#B8A07A] text-[9px] tracking-[1px] uppercase mb-1">Today only</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-[#1E4D6B] text-[28px] font-medium leading-none">$19</p>
                  </div>
                </div>
                <button
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="w-full bg-[#1E4D6B] text-white text-[12px] font-medium tracking-[1px] py-3.5 rounded-full hover:bg-[#163a51] transition-colors mb-3"
                >
                  Start my 7-day reset →
                </button>
                <div className="flex items-center justify-between text-[9px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <p className="text-[#6E767D]">30-day guarantee</p>
                  <p className="text-[#6E767D]">Secure payment</p>
                  <p className="text-[#6E767D]">Instant access</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ CONTINUE YOUR JOURNEY ══════════════ */}
        <section id="continue-journey" className="w-full flex justify-center bg-[#FAF5EC] py-20 px-6">
          <div className="max-w-[1180px] w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
              <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-sm">
                <img alt="" className="w-full h-full object-cover object-right" src="/images/oceanreset/readybg.png" />
              </div>

              <div>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#B8A07A] text-[11px] tracking-[4px] uppercase mb-4">
                  Ready For More?
                </p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-[#1E4D6B] font-medium text-[32px] lg:text-[38px] leading-tight mb-8">
                  Continue Your Journey With The Full Reset.
                </h2>

                {/* Trust badges row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 pb-8 border-b border-[#1E4D6B]/10">
                  {[
                    { label: '30-Day Guarantee', icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#1E4D6B" strokeWidth="1.6"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
                    ) },
                    { label: 'Secure Payment', icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#1E4D6B" strokeWidth="1.6"><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></svg>
                    ) },
                    { label: 'Instant Access', icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#1E4D6B" strokeWidth="1.6"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" /></svg>
                    ) },
                    { label: 'Backed By Nature', icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#1E4D6B" strokeWidth="1.6"><path d="M12 22s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" /><path d="M12 11v6" /></svg>
                    ) },
                  ].map((b) => (
                    <div key={b.label} className="flex flex-col items-start gap-2">
                      <span className="w-6 h-6">{b.icon}</span>
                      <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#1E4D6B] text-[11px] font-semibold leading-snug">{b.label}</p>
                    </div>
                  ))}
                </div>

                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E767D] text-[14px] leading-relaxed mb-10 max-w-[440px]">
                  Go deeper with our 7-day Ocean Reset Program and transform daily stress into lasting calm and clarity.
                </p>

                <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                  {[
                    { title: 'Daily Ocean Rituals', desc: 'Simple daily practices designed for your mind and body.', img: '/images/oceanreset/ready1.png' },
                    { title: 'Guided Breathing', desc: 'Calm your nervous system with guided breathing exercises.', img: '/images/oceanreset/ready2.png' },
                    { title: 'Ocean Soundscapes', desc: 'Immersive ocean sounds to relax, restore, and refocus.', img: '/images/oceanreset/ready3.png' },
                    { title: 'Reflection Exercises', desc: 'Thoughtful prompts to help you gain clarity and deeper self-awareness.', img: '/images/oceanreset/ready4.png' },
                    { title: 'Progress Tracking', desc: 'Track your progress and celebrate every small win.', img: '/images/oceanreset/ready5.png' },
                    { title: 'Ocean Living Certificate', desc: 'Earn your completion certificate at the end of your journey.', img: '/images/oceanreset/ready6.png' },
                  ].map((f) => (
                    <div key={f.title} className="flex gap-3">
                      <span className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                        <img alt="" className="w-full h-full object-cover" src={f.img} />
                      </span>
                      <div>
                        <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#1E4D6B] text-[13px] font-semibold mb-1">{f.title}</p>
                        <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E767D] text-[12px] leading-snug">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ TESTIMONIALS ══════════════ */}
        <section id="testimonials" className="w-full flex justify-center bg-[#F3E9DA] py-20 px-6">
          <div className="max-w-[1080px] w-full flex flex-col items-center text-center">
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#B8A07A] text-[11px] tracking-[4px] uppercase mb-4">
              Real Stories, Real Transformation
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-[#1E4D6B] font-medium text-[32px] lg:text-[40px] mb-5">
              Loved by Thousands Around the World
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E767D] text-[14px] leading-relaxed max-w-[520px] mb-14">
              People just like you are using Ocean Reset to reduce stress, sleep better, think clearer, and feel more connected to life.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
              {[
                { name: 'Sarah M.', loc: 'California, USA', text: 'The 3-minute Ocean Reset completely changed my mornings. I feel calmer, more focused, and ready for the day.', img: "/images/oceanreset/review1.png" },
                { name: 'James T.', loc: 'London, UK', text: 'I was skeptical at first, but the guided breathing and ocean sounds made such a difference in just one week.', img: "/images/oceanreset/review2.png" },
                { name: 'Maya L.', loc: 'Manila, PH', text: 'The 7-day program gave me simple rituals that fit perfectly into my busy life. I feel lighter and more in control.', img: "/images/oceanreset/review3.png" },
              ].map((t) => (
                <div key={t.name} className="bg-white rounded-2xl p-7 text-left shadow-sm">
                  <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="italic text-[#1E4D6B] text-[22px] leading-none mb-4">“</p>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E767D] text-[13px] leading-relaxed mb-6">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                      <img alt="" className="w-full h-full object-cover" src={t.img} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#1E4D6B] text-[12px] font-semibold leading-none">{t.name}</p>
                      <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E767D] text-[11px] mt-1">{t.loc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
  className="w-full rounded-2xl p-10 lg:p-14 flex flex-col items-center text-center"
  style={{
    backgroundImage: "url('/images/oceanreset/oceanwater2.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }}
>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-white font-medium text-[26px] lg:text-[32px] mb-3">
                Your Reset Starts Now.
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/80 text-[13px] leading-relaxed mb-8 max-w-[440px]">
                Take the first step towards a calmer, clearer mind — and give yourself the true gift of stillness.
              </p>
              <button
                onClick={() => scrollToSection('free-reset')}
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="bg-[#B8A07A] text-white text-[13px] font-medium tracking-[1px] px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
              >
                Start My Free Ocean Reset →
              </button>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/60 text-[10px] mt-3 tracking-[1px]">
                No credit card required
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════ FINAL CTA ══════════════ */}
        <section id="final-cta" className="w-full relative overflow-hidden min-h-[640px] flex flex-col justify-between px-6 lg:px-16 pt-24 pb-10">
          <img alt="" className="absolute inset-0 w-full h-full object-cover object-right" src="/images/oceanreset/autopilotbg.png" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E4D6B]/80 via-[#1E4D6B]/35 to-transparent" />

          <div className="relative z-10 max-w-[1180px] w-full mx-auto">
            <div className="flex items-center gap-4 mb-5">
              <span className="w-8 h-px bg-white/40" />
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white text-[11px] tracking-[4px] uppercase">
                The Time Is Now
              </p>
              <span className="w-8 h-px bg-white/40" />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-white font-medium text-[40px] lg:text-[52px] leading-[1.1] mb-4">
              Stop Living<br />on Autopilot.
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="italic text-white text-[19px] mb-4">
              The ocean never rushes.
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white text-[15px] leading-relaxed mb-8 max-w-[480px]">
              Yet it transforms everything it touches. Perhaps it's time for <span className="text-[#B8A07A] font-medium">your reset</span> too.
            </p>
            <button
              onClick={() => scrollToSection('free-reset')}
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="inline-flex items-center gap-2 bg-[#B8A07A] text-white text-[13px] font-semibold tracking-[1px] uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Start Your Free Ocean Reset →
            </button>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/85 text-[12px] mt-4 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" /></svg>
              No credit card required • Takes just 3 minutes
            </p>
          </div>

          <div className="relative z-10 max-w-[1180px] w-full mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: '3-Minute Experience', icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#B8A07A" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              ) },
              { title: 'Reduce Stress & Mental Noise', icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#B8A07A" strokeWidth="1.6"><path d="M4 12c2-3 4-3 6 0s4 3 6 0 4-3 4 0" /></svg>
              ) },
              { title: 'Reconnect with Yourself', icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#B8A07A" strokeWidth="1.6"><path d="M12 21s-7-4.5-7-10a5 5 0 019-3 5 5 0 019 3c0 5.5-7 10-11 10z" transform="scale(0.7) translate(5,4)" /><path d="M12 5v5l3 2" /></svg>
              ) },
              { title: 'Feel Calmer, Clearer, Lighter', icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="#B8A07A" strokeWidth="1.6"><path d="M12 21s-7-4.5-7-10a7 7 0 1114 0c0 5.5-7 10-7 10z" /></svg>
              ) },
            ].map((t) => (
              <div key={t.title} className="pt-5 border-t border-white/25 flex items-center gap-2">
                <span className="w-4 h-4 shrink-0">{t.icon}</span>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white text-[12px] font-medium leading-snug">
                  {t.title}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ FOOTER ══════════════ */}
        <footer
  id="footer"
  className="w-full py-16 px-6 flex justify-center"
  style={{
    backgroundImage: "url('/images/oceanreset/oceanwater3.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }}
>
          <div className="max-w-[1180px] w-full flex flex-col items-center text-center gap-6">
            <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-white text-[20px] tracking-[3px] uppercase">
              Seagloré
            </p>
            <div className="flex gap-8 flex-wrap justify-center">
              {['Home', 'Free Reset', '7-Day Program', 'Certificate', 'Contact', 'Privacy Policy'].map((l) => (
                <p key={l} style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/70 text-[11px] tracking-[1px] uppercase cursor-pointer hover:text-white transition-colors">
                  {l}
                </p>
              ))}
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/50 text-[10px] tracking-[1px]">
              © 2026 Seagloré. All rights reserved.
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}