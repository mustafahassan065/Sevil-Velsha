// src/App.jsx
import { useState, useEffect } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [showEditorial, setShowEditorial] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessSubmitted, setAccessSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRequestAccess = () => {
    if (email.trim()) {
      setAccessSubmitted(true);
      setTimeout(() => setAccessSubmitted(false), 3000);
      setEmail('');
    }
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── MODALS ── */}
      {showEditorial && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6" onClick={() => setShowEditorial(false)}>
          <div className="bg-white max-w-lg w-full p-10 relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-xs tracking-widest uppercase" onClick={() => setShowEditorial(false)}>✕ Close</button>
            <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">Editorial</p>
            <h2 className="text-3xl font-serif italic mb-4" style={{ color: '#c9a84c' }}>Season 0: Seafoam Birth</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Our first digital editorial — 84 pages of ocean couture, environmental storytelling, and fashion as ecological document. Available for private archive access.
            </p>
            <button className="px-8 py-4 bg-black text-white text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors w-full" onClick={() => { setShowEditorial(false); setShowAccessModal(true); }}>
              Access The Editorial — $48
            </button>
          </div>
        </div>
      )}

      {showArchive && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6" onClick={() => setShowArchive(false)}>
          <div className="bg-white max-w-2xl w-full p-10 relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-xs tracking-widest uppercase" onClick={() => setShowArchive(false)}>✕ Close</button>
            <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">The Archive</p>
            <h2 className="text-3xl font-serif italic mb-6 text-black">Selected Works</h2>
            <div className="space-y-4">
              {['Minimal Luxury', 'Regenerative Craft', 'Couture as Ritual', 'Water As Structure', 'Ocean Couture Manifesto'].map((title, i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div>
                    <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">Essay {String(i + 1).padStart(2, '0')}</p>
                    <p className="font-serif italic text-base" style={{ color: '#9a8a6a' }}>{title}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(190,158,80,0.88)' }}>
                    <svg width="8" height="10" viewBox="0 0 13 15" fill="none">
                      <rect x="0.5" y="6.5" width="12" height="8" rx="1.5" fill="white"/>
                      <path d="M3.5 6.5V4.5C3.5 2.84 4.84 1.5 6.5 1.5C8.16 1.5 9.5 2.84 9.5 4.5V6.5" stroke="white" strokeWidth="1.4" fill="none"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 italic mt-6">Archive access requires editorial purchase.</p>
          </div>
        </div>
      )}

      {showSearch && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-start justify-center pt-32 p-6" onClick={() => setShowSearch(false)}>
          <div className="w-full max-w-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 border-b border-white/40 pb-4 mb-8">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="SEARCH THE ARCHIVE"
                className="flex-1 text-white text-lg tracking-widest uppercase bg-transparent focus:outline-none placeholder-white/40"
              />
              <button onClick={() => setShowSearch(false)} className="text-white/60 text-xs tracking-widest uppercase">✕</button>
            </div>
            {searchQuery && (
              <div className="space-y-3">
                {['Minimal Luxury', 'Regenerative Craft', 'Couture as Ritual'].filter(t => t.toLowerCase().includes(searchQuery.toLowerCase())).map((r, i) => (
                  <div key={i} className="text-white/70 text-sm tracking-widest uppercase cursor-pointer hover:text-white transition-colors">{r}</div>
                ))}
                {!['Minimal Luxury', 'Regenerative Craft', 'Couture as Ritual'].some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) && (
                  <p className="text-white/40 text-xs tracking-widest uppercase italic">No results found in archive.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showAccessModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6" onClick={() => setShowAccessModal(false)}>
          <div className="bg-white max-w-md w-full p-10 relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-xs tracking-widest uppercase" onClick={() => setShowAccessModal(false)}>✕ Close</button>
            <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">Request Access</p>
            <h2 className="text-2xl font-serif italic mb-6 text-black">Enter The Archive</h2>
            <div className="border-b border-gray-300 pb-2 mb-4">
              <input type="email" placeholder="Email Address" className="w-full text-xs tracking-widest uppercase bg-transparent focus:outline-none text-gray-600 placeholder-gray-400" />
            </div>
            <button className="w-full py-4 bg-black text-white text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors">
              Request Access
            </button>
            <p className="text-xs text-gray-400 italic text-center mt-4">"We send beauty, not clutter."</p>
          </div>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-5 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
        }}
      >
        <div
          className="text-xl font-serif tracking-wider transition-colors duration-300 cursor-pointer"
          style={{ color: scrolled ? '#111111' : '#ffffff' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          SEAGLORÉ
        </div>

        <div className="flex items-center gap-8">
          <div
            className="flex items-center gap-2 px-3 py-1.5 transition-all duration-300 cursor-pointer"
            style={{ border: `1px solid ${scrolled ? '#cccccc' : 'rgba(255,255,255,0.55)'}` }}
            onClick={() => setShowSearch(true)}
          >
            <input
              type="text"
              placeholder="SEARCH"
              className="text-xs tracking-widest uppercase bg-transparent focus:outline-none w-20 placeholder-current cursor-pointer"
              style={{ color: scrolled ? '#666' : 'rgba(255,255,255,0.85)' }}
              readOnly
            />
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke={scrolled ? '#666' : 'rgba(255,255,255,0.85)'} strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <button
            className="text-xs tracking-widest uppercase transition-colors duration-300 hover:opacity-70"
            style={{ color: scrolled ? '#111' : '#ffffff' }}
            onClick={() => setShowEditorial(true)}
          >Editorial</button>
          <button
            className="text-xs tracking-widest uppercase transition-colors duration-300 hover:opacity-70"
            style={{ color: scrolled ? '#111' : '#ffffff' }}
            onClick={() => setShowArchive(true)}
          >Archive</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay loop muted playsInline
        >
          <source src="/images/HeroSection.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/15"></div>

        <div className="relative z-10 h-full flex flex-col justify-end px-8 md:px-16 pb-16">
          <p className="text-white/90 text-xs italic tracking-wide mb-3 font-light">
            Ocean Couture, Documented
          </p>
          <h1 className="font-serif text-7xl md:text-8xl lg:text-[7.5rem] leading-none mb-4">
            <span className="text-white">SEAGL</span><span className="text-white/40">ORÉ</span>
          </h1>
          <p className="text-white/80 text-xs tracking-widest uppercase mb-8 font-light flex items-center gap-3">
            <span className="border-l border-white/50 pl-3">A Limited Digital Editorial Archive.</span>
          </p>
          <div className="flex gap-6">
            <button
              className="text-white text-xs tracking-widest uppercase underline underline-offset-4 hover:text-white/70 transition-colors"
              onClick={() => setShowEditorial(true)}
            >
              View The First Edition
            </button>
            <button
              className="text-white text-xs tracking-widest uppercase underline underline-offset-4 hover:text-white/70 transition-colors"
              onClick={() => setShowArchive(true)}
            >
              Enter The Archive
            </button>
          </div>
        </div>
      </section>

      {/* ── PRODUCT SECTION ── */}
      <section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative overflow-hidden" style={{ minHeight: '580px' }}>
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay loop muted playsInline
            >
              <source src="/images/ModeliingCates2.mp4" type="video/mp4" />
            </video>
            <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs px-3 py-1 tracking-widest uppercase font-semibold z-10">
              Digital Exclusive
            </div>
          </div>

          <div className="px-10 md:px-16 py-16 flex flex-col justify-center space-y-8 bg-white">
            <div>
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">Product Title</p>
              <h2 className="text-5xl md:text-6xl font-serif italic leading-tight" style={{ color: '#c9a84c' }}>
                Season 0:
              </h2>
              <h2 className="text-5xl md:text-6xl font-serif font-black text-black leading-tight">
                Seafoam Birth
              </h2>
            </div>

            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex justify-between">
                <span className="text-gray-500 uppercase tracking-widest text-xs font-medium">Format</span>
                <span className="italic text-gray-700 text-sm">Digital Editorial</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 uppercase tracking-widest text-xs font-medium">Length</span>
                <span className="italic text-gray-700 text-sm">84 Pages</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 uppercase tracking-widest text-xs font-medium">Access</span>
                <span className="italic text-gray-700 text-sm">Private archive entry</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-4xl font-serif">$48</span>
              <button
                className="px-8 py-4 bg-black text-white text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors"
                onClick={() => setShowAccessModal(true)}
              >
                Access The Editorial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE SECTION ── */}
      <section style={{ backgroundColor: '#ede8df' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: '520px' }}>
          <div className="flex flex-col justify-center space-y-6 px-8 md:px-16 py-20">
            <div className="w-10 h-0.5 bg-black"></div>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight text-black">
              Fashion Has Always<br />
              Looked To Paris.
            </h2>
            <p className="text-3xl md:text-4xl font-serif italic leading-snug" style={{ color: '#9aa5b4' }}>
              Seagloré Looks To The<br />
              Ocean.
            </p>
            <p className="text-xs tracking-widest uppercase text-gray-400">
              — Ocean Couture For A Living Planet
            </p>
          </div>

          <div className="relative overflow-hidden" style={{ minHeight: '520px' }}>
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay loop muted playsInline
            >
              <source src="/images/ModelingOcean.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* ── STUDIES SECTION ── */}
      <section className="py-20 px-6 md:px-16 lg:px-24 bg-white">
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">Seagloré Studies</p>
          <h3 className="text-2xl md:text-3xl font-serif italic text-black">
            "Water As Structure. Not Symbol."
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="aspect-square overflow-hidden bg-gray-100">
            <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
              <source src="/images/symbol1.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="aspect-square overflow-hidden bg-gray-100">
            <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
              <source src="/images/symbol2.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="aspect-square overflow-hidden bg-gray-100">
            <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
              <source src="/images/symbol3.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* ── ACADEMY SECTION ── */}
      <section className="py-24 px-6 md:px-16 lg:px-24 text-center" style={{ backgroundColor: '#ede8df' }}>
        <p className="text-xs tracking-widest uppercase text-gray-500 mb-6">Seagloré Academy</p>
        <h2 className="text-4xl md:text-5xl font-serif mb-5 leading-tight text-black">
          Where nature is studied<br />
          before it becomes form.
        </h2>
        <p className="text-xs tracking-widest uppercase text-gray-500 leading-loose mb-10">
          Not Trend Education.<br />
          Perception Training.
        </p>
        <button
          className="text-xs tracking-widest uppercase border-b border-black pb-1 hover:opacity-60 transition-opacity"
          onClick={() => setShowAccessModal(true)}
        >
          Enter Academy
        </button>
      </section>

      {/* ── ARCHIVE SECTION ── */}
      <section id="archive" className="py-20 px-6 md:px-16 lg:px-24 bg-white">
        <div className="flex justify-between items-start mb-12">
          <h3 className="text-3xl font-serif italic">From the Archive</h3>
          <p className="text-xs text-gray-500 max-w-xs text-right tracking-widest uppercase leading-relaxed">
            Selected essays are available inside the<br />Editorial Archive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Minimal Luxury', img: '/images/archive1.jpg' },
            { title: 'Regenerative Craft', img: '/images/archive3.jpg' },
            { title: 'Couture as Ritual', img: '/images/archive2.jpg' }
          ].map((item, index) => (
            <div key={index} className="group cursor-pointer" onClick={() => setShowAccessModal(true)}>
              {/* Image container — wider aspect ratio matching the PDF screenshot */}
              <div className="overflow-hidden bg-gray-200 mb-4 relative" style={{ aspectRatio: '4/3.5' }}>
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  style={{ filter: 'grayscale(100%) blur(2px)', transform: 'scale(1.06)' }}
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/15"></div>
                {/* Golden lock circle — centered, subtle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: 'rgba(190,158,80,0.82)' }}
                  >
                    <svg width="11" height="13" viewBox="0 0 13 15" fill="none">
                      <rect x="0.5" y="6.5" width="12" height="8" rx="1.5" fill="white"/>
                      <path d="M3.5 6.5V4.5C3.5 2.84 4.84 1.5 6.5 1.5C8.16 1.5 9.5 2.84 9.5 4.5V6.5"
                        stroke="white" strokeWidth="1.4" fill="none"/>
                    </svg>
                  </div>
                </div>
              </div>
              {/* Text below image */}
              <p className="text-xs tracking-widest uppercase font-bold text-black mb-1">Archive Only</p>
              <p className="font-serif italic text-base" style={{ color: '#9a8a6a' }}>{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOUNDER SECTION ── */}
      <section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative overflow-hidden" style={{ minHeight: '520px' }}>
            <img
              src="/images/about.png"
              alt="Sevil Velsha"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div
            className="px-10 md:px-16 py-16 flex flex-col justify-center space-y-6"
            style={{ backgroundColor: '#dce8dc' }}
          >
            <div>
              <p className="text-xs tracking-widest uppercase text-gray-600 mb-3 font-medium">Founder & Creative Director</p>
              <h2
                className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight"
                style={{ color: '#c9a84c', textDecoration: 'underline', textUnderlineOffset: '6px' }}
              >
                Sevil Velsha
              </h2>
            </div>

            <blockquote className="text-xl md:text-2xl font-serif font-bold italic leading-relaxed text-black">
              "Seagloré is a study in how couture and ecology can coexist not as contradiction, but as inevitability."
            </blockquote>

            <div className="space-y-1.5 text-xs tracking-widest uppercase text-gray-600 pt-2">
              <p>Creative Direction</p>
              <p>Environmental Storytelling</p>
              <p>Voice Research</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FUTURE EDITIONS ── */}
      <section className="pt-16 pb-6 px-6 md:px-16 lg:px-24 bg-white">
        <h2
          className="font-black uppercase leading-none mb-8 text-black"
          style={{ fontSize: 'clamp(4rem, 12vw, 9rem)', letterSpacing: '-0.02em' }}
        >
          Future<br />Editions
        </h2>
        <div className="flex justify-between items-center mb-6">
          <p className="text-xs tracking-widest uppercase text-gray-500 leading-relaxed">
            Additional editorial releases will enter the<br />archive over time.
          </p>
          <div className="border border-gray-400 px-4 py-2">
            <p className="text-xs tracking-widest uppercase text-gray-600">Small Run. Slow Release.</p>
          </div>
        </div>
        <div className="border-t-2 border-black"></div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 md:px-16 lg:px-24 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="pt-2">
            <p className="text-xs tracking-widest uppercase text-gray-500">© 2026 Seagloré. Ocean Couture.</p>
          </div>

          <div className="w-full md:w-1/2 space-y-3">
            <h4 className="text-sm font-black uppercase tracking-widest text-black">Request Access</h4>
            <div className="flex items-end gap-4 border-b border-gray-400 pb-2">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 text-xs tracking-widest uppercase bg-transparent focus:outline-none text-gray-500 placeholder-gray-400"
              />
              <button
                className="text-xs tracking-widest uppercase text-black hover:text-gray-600 transition-colors whitespace-nowrap"
                onClick={handleRequestAccess}
              >
                {accessSubmitted ? '[ Submitted ✓ ]' : '[ Request Access ]'}
              </button>
            </div>
            <p className="text-xs text-gray-400 italic text-right">"We send beauty, not clutter."</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;