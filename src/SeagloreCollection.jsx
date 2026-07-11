import React, { useState, useEffect } from 'react';

// ── IMAGE PATHS ──
const imgHero = "/images/collection-hero.jpg";
const imgSeagullShirt = "/images/seagull-wing-shirt.jpg";
const imgConvertibleSkirt = "/images/convertible-ocean-skirt.jpg";
const imgOceanShorts = "/images/ocean-wave-shorts.jpg";
const imgMistScarf = "/images/ocean-mist-scarf.jpg";
const imgMotion = "/images/collection-motion.jpg";
const imgCraft = "/images/craftsmanship.jpg";
const imgOceanLiving = "/images/ocean-living.jpg";
const imgClosing = "/images/closing.jpg";

// ── DESIGN TOKENS ──
const TEAL = '#2d4a47';
const TEAL_LT = '#4a7c76';
const CREAM = '#eee9e2';
const WHITE = '#ffffff';
const BODY = '#3a3a3a';
const MUTED = '#7a8a88';

export default function SeagloreCollection() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', overflowX: 'hidden', margin: 0, padding: 0, fontFamily: "'Jost', sans-serif" }}>

      {/* ══════════════════════════════════════════
          NAVIGATION
      ══════════════════════════════════════════ */}
      <nav 
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-12 lg:px-16 transition-all duration-400"
        style={{ 
          height: '80px',
          background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.05)' : 'none',
        }}
      >
        <p 
          onClick={() => scrollToSection('hero')}
          className="cursor-pointer hover:opacity-70 transition-opacity"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '20px',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: scrolled ? TEAL : WHITE,
            textShadow: scrolled ? 'none' : '0 2px 10px rgba(0,0,0,0.3)',
          }}
        >
          SEAGLORÉ
        </p>

        <div className="hidden md:flex gap-10">
          {[
            { name: 'Collection', id: 'collection' },
            { name: 'Philosophy', id: 'philosophy' },
            { name: 'Craftsmanship', id: 'craftsmanship' },
            { name: 'Ocean Living', id: 'ocean-living' },
          ].map(link => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.id)}
              className="cursor-pointer hover:opacity-70 transition-opacity"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: scrolled ? TEAL : WHITE,
                textShadow: scrolled ? 'none' : '0 2px 10px rgba(0,0,0,0.3)',
                background: 'none',
                border: 'none',
                padding: 0,
              }}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[6px] cursor-pointer p-2"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <div className="w-6 h-[2px]" style={{ background: scrolled ? TEAL : WHITE }} />
          <div className="w-6 h-[2px]" style={{ background: scrolled ? TEAL : WHITE }} />
          <div className="w-6 h-[2px]" style={{ background: scrolled ? TEAL : WHITE }} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] flex flex-col pt-24 px-10 pb-10" style={{ background: TEAL }}>
          <button
            className="absolute top-6 right-8 text-white text-xs tracking-[4px] uppercase font-bold"
            onClick={() => setMobileMenuOpen(false)}
          >
            ✕ Close
          </button>
          <p
            onClick={() => { setMobileMenuOpen(false); scrollToSection('hero'); }}
            className="text-[20px] text-white tracking-[6px] uppercase mb-12 cursor-pointer"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            SEAGLORÉ
          </p>
          <nav className="flex flex-col gap-0">
            {[
              { name: 'Collection', id: 'collection' },
              { name: 'Philosophy', id: 'philosophy' },
              { name: 'Craftsmanship', id: 'craftsmanship' },
              { name: 'Ocean Living', id: 'ocean-living' },
            ].map(link => (
              <button
                key={link.name}
                onClick={() => { setMobileMenuOpen(false); setTimeout(() => scrollToSection(link.id), 100); }}
                className="text-left text-[28px] text-white/90 tracking-[4px] uppercase border-b border-white/10 py-6 hover:text-white transition-colors"
                style={{ background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
              >
                {link.name}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section 
        id="hero"
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{ height: '100vh', minHeight: '700px' }}
      >
        {/* Background */}
        <div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #1a3330 0%, #2d4a47 40%, #1e3d3a 100%)' }}
        />

        {/* Wave overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M0,160L48,170.7C96,181,192,203,288,186.7C384,171,480,117,576,122.7C672,128,768,192,864,208C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E") no-repeat bottom`,
            backgroundSize: 'cover',
          }}
        />

        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.15)' }} />

        {/* Content */}
        <div className="relative z-10 text-center px-6" style={{ maxWidth: '800px' }}>
          <p 
            className="mb-8"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            The First Collection
          </p>

          <h1 
            className="mb-7"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              color: WHITE,
              letterSpacing: '-0.01em',
            }}
          >
            Where Nature<br />Becomes Couture
          </h1>

          <p 
            className="mb-12 mx-auto"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 'clamp(0.9rem, 1.6vw, 1.1rem)',
              fontWeight: 300,
              letterSpacing: '0.04em',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 2,
              maxWidth: '520px',
            }}
          >
            Inspired by the movement of the ocean and the freedom of transformation, 
            the first Seaglore collection invites you to experience clothing that changes with you.
          </p>

          <button
            onClick={() => scrollToSection('collection')}
            className="cursor-pointer transition-all duration-300 hover:bg-white hover:text-[#2d4a47]"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: WHITE,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.5)',
              padding: '18px 56px',
            }}
          >
            Discover the Collection
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PHILOSOPHY SECTION
      ══════════════════════════════════════════ */}
      <section 
        id="philosophy"
        className="w-full flex justify-center"
        style={{ background: CREAM, padding: '100px 0' }}
      >
        <div className="px-9" style={{ maxWidth: '700px', textAlign: 'center' }}>
          <p 
            className="mb-6"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: MUTED,
            }}
          >
            Philosophy
          </p>

          <h2 
            className="mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: TEAL,
            }}
          >
            The Ocean Never Stands Still.<br />Neither Should You.
          </h2>

          <div className="mx-auto mb-8" style={{ width: '40px', height: '1px', background: TEAL }} />

          <div 
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.3rem, 2.8vw, 1.8rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 1.85,
              color: TEAL,
            }}
          >
            <p className="mb-4">The ocean is never the same twice.</p>
            <p className="mb-4">One moment it is calm. The next, powerful. Soft. Strong. Quiet. Expressive.</p>
            <p className="mb-4">The first Seaglore collection was created with the same philosophy. Every piece transforms with you, allowing you to choose how you want to move through the world.</p>
            <p>This is more than fashion. It is Ocean Living expressed through couture.</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          THE COLLECTION SECTION
      ══════════════════════════════════════════ */}
      <section 
        id="collection"
        className="w-full flex justify-center"
        style={{ background: WHITE, padding: '100px 0' }}
      >
        <div className="px-9 w-full" style={{ maxWidth: '1100px' }}>
          <p 
            className="mb-6 text-center"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: MUTED,
            }}
          >
            The Collection
          </p>

          <h2 
            className="mb-6 text-center"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: TEAL,
            }}
          >
            The First Seaglore Collection
          </h2>

          <div className="mx-auto mb-16" style={{ width: '40px', height: '1px', background: TEAL }} />

          <div 
            className="text-center mx-auto mb-16"
            style={{ maxWidth: '560px' }}
          >
            <p 
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '15px',
                lineHeight: 1.9,
                color: BODY,
              }}
            >
              Inspired by seagull wings, ocean waves, and the elegance of movement, every piece in the collection was designed to work beautifully on its own or together.
            </p>
            <p 
              className="mt-2"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '15px',
                fontStyle: 'italic',
                color: MUTED,
              }}
            >
              One collection. Multiple expressions. Timeless craftsmanship.
            </p>
          </div>

          {/* Products Grid */}
          <div 
            className="grid gap-10"
            style={{ 
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '60px 40px',
              maxWidth: '1000px',
              margin: '0 auto',
            }}
          >
            {/* Product 1: Seagull Wing Shirt */}
            <div className="text-center group">
              <div 
                className="w-full overflow-hidden mb-7 relative"
                style={{ aspectRatio: '3/4', background: '#e8e4de' }}
              >
                <img 
                  src={imgSeagullShirt} 
                  alt="The Seagull Wing Shirt"
                  className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-103"
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'linear-gradient(135deg, #e8e4de 0%, #ddd8d0 100%)'; }}
                />
              </div>
              <h3 
                className="mb-3"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                  fontWeight: 400,
                  color: TEAL,
                }}
              >
                The Seagull Wing Shirt
              </h3>
              <p 
                className="mx-auto"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '14px',
                  lineHeight: 1.8,
                  color: MUTED,
                  maxWidth: '420px',
                }}
              >
                Inspired by the graceful flight of a seagull over the ocean, this shirt celebrates movement, freedom, and lightness. Its flowing sculptural sleeves create beautiful motion with every step.
              </p>
            </div>

            {/* Product 2: Convertible Ocean Skirt */}
            <div className="text-center group">
              <div 
                className="w-full overflow-hidden mb-7 relative"
                style={{ aspectRatio: '3/4', background: '#e8e4de' }}
              >
                <img 
                  src={imgConvertibleSkirt} 
                  alt="The Convertible Ocean Skirt"
                  className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-103"
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'linear-gradient(135deg, #e8e4de 0%, #ddd8d0 100%)'; }}
                />
              </div>
              <h3 
                className="mb-3"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                  fontWeight: 400,
                  color: TEAL,
                }}
              >
                The Convertible Ocean Skirt
              </h3>
              <p 
                className="mx-auto"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '14px',
                  lineHeight: 1.8,
                  color: MUTED,
                  maxWidth: '420px',
                }}
              >
                Reflects the changing rhythm of the sea. A concealed zipper allows you to decide how you wear it. Keep it closed for a refined silhouette, or reveal the embroidered Ocean Wave Shorts beneath.
              </p>
            </div>

            {/* Product 3: Ocean Wave Shorts */}
            <div className="text-center group">
              <div 
                className="w-full overflow-hidden mb-7 relative"
                style={{ aspectRatio: '3/4', background: '#e8e4de' }}
              >
                <img 
                  src={imgOceanShorts} 
                  alt="The Ocean Wave Shorts"
                  className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-103"
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'linear-gradient(135deg, #e8e4de 0%, #ddd8d0 100%)'; }}
                />
              </div>
              <h3 
                className="mb-3"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                  fontWeight: 400,
                  color: TEAL,
                }}
              >
                The Ocean Wave Shorts
              </h3>
              <p 
                className="mx-auto"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '14px',
                  lineHeight: 1.8,
                  color: MUTED,
                  maxWidth: '420px',
                }}
              >
                Crafted from soft Italian cotton and finished with handmade embroidery inspired by ocean waves. Designed to be both practical and beautiful — worn beneath the skirt or elegantly on their own.
              </p>
            </div>

            {/* Product 4: Ocean Mist Scarf */}
            <div className="text-center group">
              <div 
                className="w-full overflow-hidden mb-7 relative"
                style={{ aspectRatio: '3/4', background: '#e8e4de' }}
              >
                <img 
                  src={imgMistScarf} 
                  alt="The Ocean Mist Scarf"
                  className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-103"
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'linear-gradient(135deg, #e8e4de 0%, #ddd8d0 100%)'; }}
                />
              </div>
              <h3 
                className="mb-3"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                  fontWeight: 400,
                  color: TEAL,
                }}
              >
                The Ocean Mist Scarf
              </h3>
              <p 
                className="mx-auto"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '14px',
                  lineHeight: 1.8,
                  color: MUTED,
                  maxWidth: '420px',
                }}
              >
                Soft, weightless chiffon moves like a gentle ocean breeze. Designed to be worn around the neck, over the shoulders, or styled creatively. It completes the collection with effortless elegance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          DESIGNED TO TRANSFORM
      ══════════════════════════════════════════ */}
      <section 
        className="w-full flex justify-center"
        style={{ background: CREAM, padding: '120px 36px' }}
      >
        <div className="text-center" style={{ maxWidth: '700px' }}>
          <p 
            className="mb-6"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: MUTED,
            }}
          >
            One Collection. Many Possibilities.
          </p>

          <h2 
            className="mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: TEAL,
            }}
          >
            Designed to Transform
          </h2>

          <div className="mx-auto mb-8" style={{ width: '40px', height: '1px', background: TEAL }} />

          <div 
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.3rem, 2.8vw, 1.8rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 1.85,
              color: TEAL,
            }}
          >
            <p className="mb-4">Luxury should never limit creativity.</p>
            <p className="mb-4">The first Seaglore collection was created as a modular wardrobe that adapts to every moment.</p>
            <p className="mb-4">Style it your way. Wear every piece together. Or create entirely different looks by combining individual garments.</p>
            <p>One collection becomes many.</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          THE COLLECTION IN MOTION
      ══════════════════════════════════════════ */}
      <section 
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{ height: '80vh', minHeight: '500px' }}
      >
        <div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #1a3330 0%, #2d4a47 50%, #1e3d3a 100%)' }}
        />

        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E") no-repeat bottom`,
            backgroundSize: 'cover',
          }}
        />

        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.2)' }} />

        <div className="relative z-10 text-center px-9" style={{ maxWidth: '700px' }}>
          <p 
            className="mb-6"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            The Collection in Motion
          </p>

          <h2 
            className="mb-5"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: WHITE,
            }}
          >
            True luxury isn't only seen.<br />It's experienced through movement.
          </h2>

          <div className="mx-auto mb-8" style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.4)' }} />

          <p 
            className="mx-auto mb-4"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '15px',
              lineHeight: 2,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '540px',
            }}
          >
            The flowing sleeves. The dancing chiffon. The gentle rhythm of Italian cotton. The opening of the skirt. The details come alive only when they move.
          </p>

          <p 
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '15px',
              fontStyle: 'italic',
              lineHeight: 2,
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            Explore the collection through a series of short cinematic moments inspired by the ocean.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CRAFTSMANSHIP SECTION
      ══════════════════════════════════════════ */}
      <section 
        id="craftsmanship"
        className="w-full flex justify-center"
        style={{ background: WHITE, padding: '100px 0' }}
      >
        <div className="px-9 w-full" style={{ maxWidth: '1100px' }}>
          <p 
            className="mb-6 text-center"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: MUTED,
            }}
          >
            Craftsmanship
          </p>

          <h2 
            className="mb-6 text-center"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: TEAL,
            }}
          >
            Created with Intention
          </h2>

          <div className="mx-auto mb-8" style={{ width: '40px', height: '1px', background: TEAL }} />

          <p 
            className="text-center mx-auto mb-16"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '15px',
              lineHeight: 1.9,
              color: BODY,
              maxWidth: '600px',
            }}
          >
            Every stitch serves a purpose. Every silhouette reflects nature.
          </p>

          {/* Craft Grid */}
          <div 
            className="grid gap-8 mx-auto"
            style={{ 
              gridTemplateColumns: 'repeat(4, 1fr)',
              maxWidth: '1000px',
              margin: '64px auto 0',
            }}
          >
            {[
              { 
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke={TEAL_LT} strokeWidth="1.3">
                    <circle cx="24" cy="24" r="16"/>
                    <path d="M24 12v12M24 32v4" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Freedom',
                desc: 'The Seagull Wing Shirt captures the essence of liberation in every flowing sleeve.'
              },
              { 
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke={TEAL_LT} strokeWidth="1.3">
                    <path d="M8 16h6l4 14h12l4-10H16" strokeLinejoin="round"/>
                    <circle cx="18" cy="36" r="2"/>
                    <circle cx="30" cy="36" r="2"/>
                  </svg>
                ),
                title: 'Transformation',
                desc: 'The Convertible Ocean Skirt represents the ever-changing nature of the sea.'
              },
              { 
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke={TEAL_LT} strokeWidth="1.3">
                    <path d="M24 8v32M12 36h24" strokeLinecap="round"/>
                    <path d="M8 16l8 4M24 20l8-4" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Craftsmanship',
                desc: 'Ocean Wave Shorts celebrate artistry through handmade embroidery.'
              },
              { 
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke={TEAL_LT} strokeWidth="1.3">
                    <path d="M24 8C14 20 8 26 8 34a16 16 0 0 0 32 0c0-8-6-14-16-26z" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'Softness',
                desc: 'The Ocean Mist Scarf introduces softness and movement to every look.'
              },
            ].map((item, i) => (
              <div key={i} className="text-center" style={{ padding: '32px 16px' }}>
                <div className="mx-auto mb-5" style={{ width: '48px', height: '48px' }}>
                  {item.icon}
                </div>
                <h4 
                  className="mb-2"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.3rem',
                    fontWeight: 500,
                    color: TEAL,
                  }}
                >
                  {item.title}
                </h4>
                <p 
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '13px',
                    lineHeight: 1.7,
                    color: MUTED,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <p 
            className="text-center mx-auto mt-12"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '15px',
              lineHeight: 1.9,
              color: BODY,
              maxWidth: '600px',
              fontStyle: 'italic',
            }}
          >
            Together they create a collection inspired by the elegance and constant motion of the sea.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          OCEAN LIVING SECTION
      ══════════════════════════════════════════ */}
      <section 
        id="ocean-living"
        className="w-full flex justify-center"
        style={{ background: CREAM, padding: '100px 0' }}
      >
        <div className="px-9" style={{ maxWidth: '700px', textAlign: 'center' }}>
          <p 
            className="mb-6"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: MUTED,
            }}
          >
            Philosophy
          </p>

          <h2 
            className="mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: TEAL,
            }}
          >
            Ocean Living
          </h2>

          <div className="mx-auto mb-8" style={{ width: '40px', height: '1px', background: TEAL }} />

          <div 
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.3rem, 2.8vw, 1.8rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 1.85,
              color: TEAL,
            }}
          >
            <p className="mb-3">Ocean Living is the philosophy behind every Seaglore creation.</p>
            <p className="mb-3">It reminds us to slow down. To breathe more deeply. To embrace change. To reconnect with nature.</p>
            <p>Our collections are designed not only to be worn, but to inspire a different way of living — one that values beauty, presence, and timeless craftsmanship.</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CLOSING STATEMENT
      ══════════════════════════════════════════ */}
      <section 
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{ padding: '140px 36px' }}
      >
        <div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #1a3330 0%, #2d4a47 50%, #1e3d3a 100%)' }}
        />

        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,122.7C672,128,768,192,864,213.3C960,235,1056,213,1152,186.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E") no-repeat bottom`,
            backgroundSize: 'cover',
          }}
        />

        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.15)' }} />

        <div className="relative z-10 text-center" style={{ maxWidth: '700px' }}>
          <p 
            className="mb-6"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            Closing Statement
          </p>

          <h2 
            className="mb-8"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              color: WHITE,
            }}
          >
            Wear the Movement<br />of the Ocean
          </h2>

          <div className="mx-auto mb-8" style={{ width: '48px', height: '1px', background: 'rgba(255,255,255,0.4)' }} />

          <p 
            className="mb-4"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '15px',
              lineHeight: 2,
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            The first Seaglore collection invites you to experience fashion inspired by nature's endless transformation.
          </p>
          <p 
            className="mb-4"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '15px',
              lineHeight: 2,
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            Elegant. Versatile. Crafted with intention.
          </p>
          <p 
            className="mb-8"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '15px',
              lineHeight: 2,
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            Created for women who embrace freedom, movement, and their own unique expression.
          </p>

          <p 
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.4rem',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.85)',
              marginTop: '32px',
            }}
          >
            Welcome to Seaglore. Where Nature Becomes Couture.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CALL TO ACTION
      ══════════════════════════════════════════ */}
      <section 
        className="w-full flex justify-center"
        style={{ background: CREAM, padding: '100px 36px' }}
      >
        <div className="text-center" style={{ maxWidth: '700px' }}>
          <h2 
            className="mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: TEAL,
            }}
          >
            Discover the First Collection
          </h2>

          <div className="mx-auto mb-8" style={{ width: '40px', height: '1px', background: TEAL }} />

          <p 
            className="mb-10 mx-auto"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '15px',
              lineHeight: 1.8,
              color: MUTED,
              maxWidth: '520px',
            }}
          >
            Experience the artistry, movement, and philosophy behind Seaglore's debut collection.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              className="cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: WHITE,
                background: TEAL,
                padding: '18px 48px',
                border: 'none',
              }}
            >
              Shop the Collection
            </button>

            <button
              className="cursor-pointer transition-all duration-300 hover:bg-[#2d4a47] hover:text-white"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: TEAL,
                background: 'transparent',
                padding: '18px 48px',
                border: `1px solid ${TEAL}`,
              }}
            >
              Request a Private Appointment
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer 
        className="w-full text-center"
        style={{ background: TEAL, padding: '80px 36px 40px' }}
      >
        <p 
          className="mb-2"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '24px',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: CREAM,
          }}
        >
          SEAGLORÉ
        </p>

        <p 
          className="mb-10"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '15px',
            fontStyle: 'italic',
            color: 'rgba(238,233,226,0.6)',
          }}
        >
          Where Nature Becomes Couture
        </p>

        <div 
          className="flex justify-center gap-8 mb-10 flex-wrap"
        >
          {['Collection', 'Philosophy', 'Craftsmanship', 'Ocean Living', 'Contact'].map(link => (
            <button
              key={link}
              onClick={() => scrollToSection(link.toLowerCase().replace(' ', '-'))}
              className="cursor-pointer hover:text-white transition-colors"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
                background: 'none',
                border: 'none',
                padding: 0,
              }}
            >
              {link}
            </button>
          ))}
        </div>

        <div 
          className="pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          <p 
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '12px',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            © 2026 SEAGLORÉ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
