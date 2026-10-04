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
        <nav className="w-full h-[84px] flex items-center justify-between px-8 lg:px-16 bg-[#FAF8F4] border-b border-[#D9C6A540]/5 relative z-50">
          <div className="flex flex-col cursor-pointer" onClick={() => scrollToSection('hero')}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="font-medium text-[22px] text-[#0D3045] tracking-[3px] uppercase leading-none">
              Seagloré
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[9px] text-[#B8A07A] tracking-[2px] uppercase mt-1">
              Where Nature Becomes a Way of Living
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
        <section id="hero" className="w-full relative overflow-hidden min-h-[720px] flex items-center">
          <img alt="" className="absolute inset-0 w-full h-full object-cover object-top" src="/images/oceanreset/oceanhero.png" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF5EC]/35 via-[#FAF5EC]/10 to-transparent" />

          <div className="relative z-10 w-full max-w-[1180px] mx-auto px-6 lg:px-0">
            <div className="max-w-[560px]">
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#B8A07A] text-[11px] tracking-[3px] uppercase mb-4 font-semibold">
                The 3-Minute Ocean Reset
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-[#1E4D6B] font-medium leading-[1.05] text-[48px] lg:text-[64px] mb-6">
                Feeling<br /><span className="italic">Overwhelmed?</span>
              </h1>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#1E4D6B] text-[16px] leading-relaxed mb-8 max-w-[440px]">
                Take a breath. Reset in just 3 minutes. Try our Free 3-Minute Ocean Reset and feel calmer, clearer, and more like yourself.
              </p>
              <button
                onClick={() => scrollToSection('free-reset')}
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="inline-flex items-center gap-2 bg-[#1E4D6B] text-white text-[13px] font-semibold tracking-[1px] uppercase px-8 py-4 rounded-full hover:bg-[#163a51] transition-colors"
              >
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.52075 9.12447C1.52075 9.12447 3.80189 3.80182 9.12453 3.80182C14.4472 3.80182 16.7283 9.12447 16.7283 9.12447C16.7283 9.12447 14.4472 14.4471 9.12453 14.4471C3.80189 14.4471 1.52075 9.12447 1.52075 9.12447Z" stroke="white" stroke-width="1.52076"/>
<path d="M9.1244 11.4057C10.3842 11.4057 11.4055 10.3844 11.4055 9.12452C11.4055 7.86468 10.3842 6.84338 9.1244 6.84338C7.86456 6.84338 6.84326 7.86468 6.84326 9.12452C6.84326 10.3844 7.86456 11.4057 9.1244 11.4057Z" stroke="white" stroke-width="1.52076"/>
</svg>

                Try For Free →
              </button>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E767D] text-[11px] mt-3 tracking-[1px]">
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
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.11646 8.69788L9.48861 11.07L17.3958 3.16284" stroke="#1E4D6B" stroke-width="1.58144"/>
<path d="M16.605 9.48861V15.0236C16.605 15.4431 16.4384 15.8453 16.1418 16.1419C15.8453 16.4385 15.443 16.6051 15.0236 16.6051H3.95351C3.53409 16.6051 3.13184 16.4385 2.83526 16.1419C2.53869 15.8453 2.37207 15.4431 2.37207 15.0236V3.95357C2.37207 3.53415 2.53869 3.1319 2.83526 2.83532C3.13184 2.53875 3.53409 2.37213 3.95351 2.37213H12.6514" stroke="#1E4D6B" stroke-width="1.58144"/>
</svg>

              ) },
              { title: '3-Minute Experience', desc: 'Quick, guided reset for your mind', icon: (
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_12_38)">
<path d="M9.4885 17.3958C13.8555 17.3958 17.3957 13.8556 17.3957 9.48862C17.3957 5.12159 13.8555 1.58142 9.4885 1.58142C5.12147 1.58142 1.5813 5.12159 1.5813 9.48862C1.5813 13.8556 5.12147 17.3958 9.4885 17.3958Z" stroke="#1E4D6B" stroke-width="1.58144"/>
<path d="M9.48853 4.74426V9.48858L12.6514 11.07" stroke="#1E4D6B" stroke-width="1.58144"/>
</g>
<defs>
<clipPath id="clip0_12_38">
<rect width="18.9773" height="18.9773" fill="white"/>
</clipPath>
</defs>
</svg>

              ) },
              { title: 'Personalized Ocean Ritual', desc: 'Get a ritual that fits your needs', icon: (
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_12_49)">
<path d="M1.58154 9.48865C1.58154 9.48865 3.9537 3.95361 9.48874 3.95361C15.0238 3.95361 17.3959 9.48865 17.3959 9.48865C17.3959 9.48865 15.0238 15.0237 9.48874 15.0237C3.9537 15.0237 1.58154 9.48865 1.58154 9.48865Z" stroke="#1E4D6B" stroke-width="1.58144"/>
<path d="M9.48886 11.8608C10.799 11.8608 11.861 10.7987 11.861 9.48861C11.861 8.17851 10.799 7.11646 9.48886 7.11646C8.17875 7.11646 7.1167 8.17851 7.1167 9.48861C7.1167 10.7987 8.17875 11.8608 9.48886 11.8608Z" stroke="#1E4D6B" stroke-width="1.58144"/>
</g>
<defs>
<clipPath id="clip0_12_49">
<rect width="18.9773" height="18.9773" fill="white"/>
</clipPath>
</defs>
</svg>

              ) },
              { title: 'Instant Access', desc: 'Start your reset right away', icon: (
               <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_12_60)">
<path d="M15.0233 8.69788H3.95327C3.07986 8.69788 2.37183 9.40591 2.37183 10.2793V15.8144C2.37183 16.6878 3.07986 17.3958 3.95327 17.3958H15.0233C15.8967 17.3958 16.6048 16.6878 16.6048 15.8144V10.2793C16.6048 9.40591 15.8967 8.69788 15.0233 8.69788Z" stroke="#1E4D6B" stroke-width="1.58144"/>
<path d="M5.53491 8.6979V5.53502C5.53491 4.48646 5.95145 3.48085 6.69289 2.7394C7.43434 1.99796 8.43995 1.58142 9.48851 1.58142C10.5371 1.58142 11.5427 1.99796 12.2841 2.7394C13.0256 3.48085 13.4421 4.48646 13.4421 5.53502V8.6979" stroke="#1E4D6B" stroke-width="1.58144"/>
</g>
<defs>
<clipPath id="clip0_12_60">
<rect width="18.9773" height="18.9773" fill="white"/>
</clipPath>
</defs>
</svg>

              ) },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-full bg-[#1E4D6B]/8 flex items-center justify-center shrink-0">
                  <span className="w-[18px] h-[18px]">{f.icon}</span>
                </span>
                <div className="flex flex-col gap-1">
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#0D3045] text-[13px] font-semibold">{f.title}</p>
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
            <h2 style={{ fontFamily: "'Fraunces', serif" }} className="text-[#16324A] font-medium text-[34px] lg:text-[44px] leading-tight mb-5">
              Your Mind Was Not Designed<br />For Constant Noise.
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E7B82] text-[15px] leading-relaxed max-w-[560px] mb-14">
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
                  <p style={{ fontFamily: "'Fraunces', sans-serif" }} className="text-[#16324A] text-[13px] font-semibold mb-1">{p.title}</p>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E7B82] text-[11px] leading-snug">{p.desc}</p>
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
                <p style={{ fontFamily: "'Fraunces', serif" }} className="italic text-white text-[18px] lg:text-[22px]">
                  You deserve a reset. You deserve to feel like yourself again.
                </p>
                <div className="flex gap-10">
                  <div className="text-center">
                    <p style={{ fontFamily: "'Fraunces', serif" }} className="text-[#D9BC8C] text-[28px] font-medium leading-none">3 min</p>
                    <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-#FFFDF9A6 text-[9px] tracking-[1px] uppercase mt-1">is all it takes</p>
                  </div>
                  <div className="text-center">
                    <p style={{ fontFamily: "'Fraunces', serif" }} className="text-[#D9BC8C] text-[28px] font-medium leading-none">92%</p>
                    <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-#FFFDF9A6 text-[9px] tracking-[1px] uppercase mt-1">feel calmer after one reset</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ HOW IT WORKS ══════════════ */}
        <section id="how-it-works" className="w-full flex justify-center bg-[#F3E9DA] py-20 px-6">
          <div className="max-w-[980px] w-full flex flex-col items-center text-center">
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#B68A4E] text-[11px] tracking-[4px] uppercase mb-4">
              How It Works
            </p>
            <h2 style={{ fontFamily: "'Fraunces', serif" }} className="text-[#16324A] font-medium text-[34px] lg:text-[42px] mb-5">
              A Simple 3-Step Reset.
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E7B82] text-[15px] leading-relaxed max-w-[560px] mb-14">
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
                  <p style={{ fontFamily: "'Fraunces', sans-serif" }} className="text-[#16324A] text-[15px] font-semibold mb-2">{s.title}</p>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E7B82] text-[13px] leading-relaxed max-w-[280px]">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-full px-8 py-4 flex items-center gap-4 shadow-sm">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.83325 12.8333C3.66659 12.8333 3.66659 10.0833 5.49992 10.0833C7.33325 10.0833 7.33325 12.8333 9.16659 12.8333C10.9999 12.8333 10.9999 10.0833 12.8333 10.0833C14.6666 10.0833 14.6666 12.8333 16.4999 12.8333C18.3333 12.8333 18.3333 10.0833 20.1666 10.0833" stroke="#B68A4E" stroke-width="1.46667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.83325 17.4167C3.66659 17.4167 3.66659 14.6667 5.49992 14.6667C7.33325 14.6667 7.33325 17.4167 9.16659 17.4167C10.9999 17.4167 10.9999 14.6667 12.8333 14.6667C14.6666 14.6667 14.6666 17.4167 16.4999 17.4167C18.3333 17.4167 18.3333 14.6667 20.1666 14.6667" stroke="#B68A4E" stroke-width="1.46667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              <p style={{ fontFamily: "'Fraunces', serif" }} className="italic text-[#16324A] text-[15px]">Small steps. Big change.</p>
              <span className="w-px h-5 bg-[#6E767D]/20" />
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E7B82] text-[12px]">You don\u2019t need hours of meditation. Just minutes a day, inspired by the rhythm of the ocean.</p>
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
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#B68A4E] text-[11px] tracking-[4px] uppercase mb-4">
              Your Free Experience
            </p>
            <h2 style={{ fontFamily: "'Fraunces', serif" }} className="text-[#16324A] font-medium text-[34px] lg:text-[42px] mb-5">
              Start Your Free 3-Minute Ocean Reset
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E7B82] text-[15px] leading-relaxed max-w-[560px] mb-14">
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
                  <p style={{ fontFamily: "'Fraunces', sans-serif" }} className="text-[#16324A] text-[12px] font-semibold mb-1">{c.title}</p>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E7B82] text-[10px] leading-snug">{c.desc}</p>
                </div>
              ))}
            </div>

            {!emailSubmitted ? (
              <form onSubmit={handleEmailSubmit} className="flex flex-col items-center gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
              
                  <button
                    type="submit"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="bg-[#1E4D6B] text-white text-[13px] font-medium tracking-[1px] px-8 py-4 rounded-full hover:bg-[#163a51] transition-colors whitespace-nowrap"
                  >
                    Start My Free Ocean Reset 
                  </button>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#2D2E2F] text-[11px] tracking-[1px]">
                  No credit card required
                </p>
              </form>
            ) : (
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#1E4D6B] text-[14px] font-medium">
                Check your inbox — your Ocean Reset is on its way! 🌊
              </p>
            )}

            <p style={{ fontFamily: "'Fraunces', serif" }} className="italic text-[#16324A] text-[17px] mt-14 max-w-[480px]">
              "The ocean doesn't try to be powerful. It simply is. And that is its beauty."
            </p>
          </div>
        </section>

        {/* ══════════════ IMAGINE THIS ══════════════ */}
        <section id="imagine" className="w-full flex justify-center py-20 px-6" style={{ background: '#1E4D6B' }}>
          <div className="max-w-[980px] w-full flex flex-col items-center text-center">
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#D9BC8C] text-[11px] tracking-[4px] uppercase mb-4">
              7 Days From Now
            </p>
            <h2 style={{ fontFamily: "'Fraunces', serif" }} className="italic text-[#FFFDF9] font-medium text-[34px] lg:text-[42px] mb-12">
              Imagine this.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-left">
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#D9BC8C] text-[11px] tracking-[2px] uppercase mb-5">Right Now</p>
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
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#FFFFFF] text-[11px] tracking-[4px] uppercase mb-4">
                Ready For More?
              </p>
              <h2 style={{ fontFamily: "'Fraunces', serif" }} className="text-[#FFFFFF] font-medium text-[32px] lg:text-[40px] leading-tight mb-5">
                Continue your journey with the full reset.
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#FFFFFF] text-[14px] leading-relaxed mb-8 max-w-[420px]">
                Go deeper with our 7-day Ocean Reset Program and transform daily stress into lasting calm and clarity.
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 max-w-[420px] mb-10">
                {['Daily ocean rituals', 'Guided breathing', 'Ocean soundscapes', 'Reflection exercises', 'Progress tracking', 'Ocean Living certificate'].map((f) => (
                  <p key={f} style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#FFFFFF] text-[12px] flex items-center gap-2">
                    <span className="text-[#FFFFFF]">✓</span> {f}
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
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#B68A4E] text-[11px] tracking-[4px] uppercase mb-4">
                  Ready For More?
                </p>
                <h2 style={{ fontFamily: "'Fraunces', serif" }} className="text-[#16324A] font-medium text-[32px] lg:text-[38px] leading-tight mb-8">
                  Continue Your Journey With The Full Reset.
                </h2>

          

                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E7B82] text-[14px] leading-relaxed mb-10 max-w-[440px]">
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
                        <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#16324A] text-[13px] font-semibold mb-1">{f.title}</p>
                        <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E7B82] text-[12px] leading-snug">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust badges row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 pb-8 border-b border-[#1E4D6B]/10">
                  {[
                    { label: '30-Day Guarantee', icon: (
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.9975 2.74951L17.4127 5.49889V10.9976C17.4127 15.5799 14.48 18.146 10.9975 19.2458C7.51494 18.146 4.58228 15.5799 4.58228 10.9976V5.49889L10.9975 2.74951Z" stroke="#B68A4E" stroke-width="1.46633" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.24817 10.9977L10.0811 12.8306L13.7469 8.98145" stroke="#B68A4E" stroke-width="1.46633" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                    ) },
                    { label: 'Secure Payment', icon: (
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.5798 10.0811H6.41519C5.4029 10.0811 4.58228 10.9017 4.58228 11.914V16.9545C4.58228 17.9668 5.4029 18.7874 6.41519 18.7874H15.5798C16.5921 18.7874 17.4127 17.9668 17.4127 16.9545V11.914C17.4127 10.9017 16.5921 10.0811 15.5798 10.0811Z" stroke="#B68A4E" stroke-width="1.46633" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.33179 10.0812V7.33185C7.33179 6.35961 7.71801 5.42719 8.40548 4.73971C9.09296 4.05224 10.0254 3.66602 10.9976 3.66602C11.9699 3.66602 12.9023 4.05224 13.5898 4.73971C14.2772 5.42719 14.6635 6.35961 14.6635 7.33185V10.0812" stroke="#B68A4E" stroke-width="1.46633" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                    ) },
                    { label: 'Instant Access', icon: (
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.9974 18.7873C15.2997 18.7873 18.7873 15.2997 18.7873 10.9974C18.7873 6.69517 15.2997 3.20752 10.9974 3.20752C6.69517 3.20752 3.20752 6.69517 3.20752 10.9974C3.20752 15.2997 6.69517 18.7873 10.9974 18.7873Z" stroke="#B68A4E" stroke-width="1.46633" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.9976 6.87354V10.9976L13.9302 12.8305" stroke="#B68A4E" stroke-width="1.46633" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                    ) },
                    { label: 'Backed By Nature', icon: (
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.5824 17.4129C3.66595 10.9977 7.33178 4.58247 17.4128 3.66602C18.3293 13.7471 11.9141 17.4129 5.49886 17.4129C4.12418 17.4129 2.74949 17.138 4.5824 15.58V17.4129Z" stroke="#B68A4E" stroke-width="1.46633" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.41528 15.5796C10.9976 11.9137 12.8305 8.24791 14.6634 5.49854" stroke="#B68A4E" stroke-width="1.46633" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                    ) },
                  ].map((b) => (
                    <div key={b.label} className="flex flex-col items-start gap-2">
                      <span className="w-6 h-6">{b.icon}</span>
                      <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#16324A] text-[11px] font-semibold leading-snug">{b.label}</p>
                    </div>
                  ))}
                </div>
          </div>
        </section>

        {/* ══════════════ TESTIMONIALS ══════════════ */}
        <section id="testimonials" className="w-full flex justify-center bg-[#F3E9DA] py-20 px-6">
          <div className="max-w-[1080px] w-full flex flex-col items-center text-center">
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#B68A4E] text-[11px] tracking-[4px] uppercase mb-4">
              Real Stories, Real Transformation
            </p>
            <h2 style={{ fontFamily: "'Fraunces', serif" }} className="text-[#16324A] font-medium text-[32px] lg:text-[40px] mb-5">
              Loved by Thousands Around the World
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#6E7B82] text-[14px] leading-relaxed max-w-[520px] mb-14">
              People just like you are using Ocean Reset to reduce stress, sleep better, think clearer, and feel more connected to life.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
              {[
                { name: 'Sarah M.', loc: 'California, USA', text: 'The 3-minute Ocean Reset completely changed my mornings. I feel calmer, more focused, and ready for the day.', img: "/images/oceanreset/review1.png" },
                { name: 'James T.', loc: 'London, UK', text: 'I was skeptical at first, but the guided breathing and ocean sounds made such a difference in just one week.', img: "/images/oceanreset/review2.png" },
                { name: 'Maya L.', loc: 'Manila, PH', text: 'The 7-day program gave me simple rituals that fit perfectly into my busy life. I feel lighter and more in control.', img: "/images/oceanreset/review3.png" },
              ].map((t) => (
                <div key={t.name} className="bg-white rounded-2xl p-7 text-left shadow-sm">
                  <p style={{ fontFamily: "'Cormorant Garamond', serif" }} className="bold text-[#D9BC8C] text-[22px] leading-none mb-4">“</p>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#16324A] text-[13px] leading-relaxed mb-6">{t.text}</p>
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
              <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-[#FFFDF9] font-medium text-[26px] lg:text-[32px] mb-3">
                Your Reset Starts Now.
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#FFFDF9BF] text-[13px] leading-relaxed mb-8 max-w-[440px]">
                Take the first step towards a calmer, clearer mind — and give yourself the true gift of stillness.
              </p>
              <button
                onClick={() => scrollToSection('free-reset')}
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="bg-[#B68A4E] text-[#0A1A28] text-[13px] font-medium tracking-[1px] px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
              >
                Start My Free Ocean Reset →
              </button>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#FFFDF999] text-[10px] mt-3 tracking-[1px]">
                No credit card required. Free forever.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════ FINAL CTA ══════════════ */}
        <section id="final-cta" className="w-full relative overflow-hidden min-h-[640px] flex flex-col justify-between px-6 lg:px-16 pt-24 pb-10">
          <img alt="" className="absolute inset-0 w-full h-full object-cover object-right" style={{ transform: 'scaleX(-1)' }} src="/images/oceanreset/autopilotbg.png" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E4D6B]/80 via-[#1E4D6B]/35 to-transparent" />

          <div className="relative z-10 max-w-[1180px] w-full mx-auto">
            <div className="flex items-center gap-4 mb-5">
              <span className="w-8 h-px bg-white/40" />
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#FFFFFF] text-[11px] tracking-[4px] uppercase">
                The Time Is Now
              </p>
              <span className="w-8 h-px bg-white/40" />
            </div>
            <h2 style={{ fontFamily: "'Fraunces', serif" }} className="text-[#FFFFFF] font-medium text-[40px] lg:text-[52px] leading-[1.1] mb-4">
              Stop Living<br />on Autopilot.
            </h2>
            <p style={{ fontFamily: "'Fraunces', serif" }} className="italic text-[#FFFFFF] text-[19px] mb-4">
              The ocean never rushes.
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#FFFFF] text-[15px] leading-relaxed mb-8 max-w-[480px]">
              Yet it transforms everything it touches. Perhaps it's time for <span className="text-[#DCB988] font-medium">your reset</span> too.
            </p>
            <button
              onClick={() => scrollToSection('free-reset')}
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="inline-flex items-center gap-2 bg-[#B68A4E] text-[#FFFFFF] text-[13px] font-semibold tracking-[1px] uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Start Your Free Ocean Reset →
            </button>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#FFFFFFA6] text-[12px] mt-4 flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.49531 1.87402L11.8676 3.74785V7.4955C11.8676 10.6185 9.86882 12.3674 7.49531 13.117C5.12179 12.3674 3.12305 10.6185 3.12305 7.4955V3.74785L7.49531 1.87402Z" stroke="white" stroke-width="0.999373" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.62146 7.49523L6.87068 8.74445L9.36911 6.12109" stroke="white" stroke-width="0.999373" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              No credit card required • Takes just 3 minutes
            </p>
          </div>

          <div className="relative z-10 max-w-[1180px] w-full mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: '3-Minute Experience', icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.9975 18.7878C15.2998 18.7878 18.7874 15.3001 18.7874 10.9979C18.7874 6.69566 15.2998 3.20801 10.9975 3.20801C6.6953 3.20801 3.20764 6.69566 3.20764 10.9979C3.20764 15.3001 6.6953 18.7878 10.9975 18.7878Z" stroke="#D9BC8C" stroke-width="1.46633" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.9976 6.87305V10.9971L13.9302 12.83" stroke="#D9BC8C" stroke-width="1.46633" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              ) },
              { title: 'Reduce Stress & Mental Noise', icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.24804 3.84961C7.82751 3.86837 7.41595 3.97745 7.04132 4.16942C6.6667 4.36139 6.33779 4.63176 6.07696 4.96215C5.81612 5.29254 5.62947 5.67522 5.52968 6.08417C5.42989 6.49311 5.41932 6.91875 5.49866 7.33215C4.80369 7.31263 4.1244 7.54064 3.58195 7.97551C3.0395 8.41038 2.66919 9.02382 2.53708 9.70639C2.40497 10.389 2.51965 11.0963 2.86067 11.7021C3.20168 12.308 3.74685 12.773 4.39891 13.0142C4.17048 13.4696 4.07307 13.9795 4.11754 14.487C4.16202 14.9945 4.34663 15.4797 4.65078 15.8884C4.95493 16.2971 5.36666 16.6132 5.84003 16.8016C6.3134 16.9899 6.82978 17.043 7.33158 16.955H7.78981V5.04101C8.08037 4.71161 8.24298 4.28882 8.24804 3.84961Z" stroke="#D9BC8C" stroke-width="1.46633" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.7468 3.84961C14.1674 3.86837 14.5789 3.97745 14.9535 4.16942C15.3282 4.36139 15.6571 4.63176 15.9179 4.96215C16.1787 5.29254 16.3654 5.67522 16.4652 6.08417C16.565 6.49311 16.5755 6.91875 16.4962 7.33215C17.1912 7.31263 17.8705 7.54064 18.4129 7.97551C18.9554 8.41038 19.3257 9.02382 19.4578 9.70639C19.5899 10.389 19.4752 11.0963 19.1342 11.7021C18.7932 12.308 18.248 12.773 17.596 13.0142C17.8244 13.4696 17.9218 13.9795 17.8773 14.487C17.8328 14.9945 17.6482 15.4797 17.3441 15.8884C17.0399 16.2971 16.6282 16.6132 16.1548 16.8016C15.6815 16.9899 15.1651 17.043 14.6633 16.955H14.2051V5.04101C14.2101 4.6018 14.3727 4.17901 14.6633 3.84961H13.7468Z" stroke="#D9BC8C" stroke-width="1.46633" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.5393 5.04004V16.954" stroke="#D9BC8C" stroke-width="1.46633" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              ) },
              { title: 'Reconnect with Yourself', icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.9974 18.3292C6.41515 17.4127 3.66577 13.7469 3.66577 10.0811C7.3316 10.0811 10.081 11.914 10.9974 14.6633C11.9139 11.914 14.6633 10.0811 18.3291 10.0811C18.3291 13.7469 15.5797 17.4127 10.9974 18.3292Z" stroke="#D9BC8C" stroke-width="1.46633" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.9976 10.0807C10.9976 6.41486 12.464 4.12371 14.6635 2.74902C11.9141 3.66548 10.0812 5.04017 10.9976 10.0807ZM10.9976 10.0807C10.9976 6.41486 9.53129 4.12371 7.33179 2.74902C10.0812 3.66548 11.9141 5.04017 10.9976 10.0807Z" stroke="#D9BC8C" stroke-width="1.46633" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              ) },
              { title: 'Feel Calmer, Clearer, Lighter', icon: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.9974 18.3293C10.9974 18.3293 2.74927 13.2888 2.74927 7.97337C2.74927 5.31564 4.85712 3.66602 7.14827 3.66602C8.70625 3.66602 10.1726 4.49083 10.9974 5.86552C11.9139 4.49083 13.3802 3.66602 14.8465 3.66602C17.1377 3.66602 19.2455 5.31564 19.2455 7.97337C19.2455 13.2888 10.9974 18.3293 10.9974 18.3293Z" stroke="#D9BC8C" stroke-width="1.46633" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              ) },
            ].map((t) => (
              <div key={t.title} className="pt-5 border-t border-white/25 flex items-center gap-2">
                <span className="w-4 h-4 shrink-0">{t.icon}</span>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#FFFFFFD9] text-[12px] font-medium leading-snug">
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
            <div className="flex justify-center">
  <p
    style={{ fontFamily: "'Inter', sans-serif" }}
    className="text-[#B8A07A] text-[11px] tracking-[1px] uppercase"
  >
    WHERE NATURE BECOMES A WAY OF LIVING
  </p>
</div>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#FFFFFF99] text-[10px] tracking-[1px]">
              © 2026 Seagloré. All rights reserved.
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}