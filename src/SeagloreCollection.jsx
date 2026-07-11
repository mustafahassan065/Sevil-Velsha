import React, { useState, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════
//  IMAGE & VIDEO PATHS — Placeholder paths for client to fill
// ═══════════════════════════════════════════════════════════════

// Hero Video
const videoHeroDesktop = "/videos/hero-desktop.mp4";
const videoHeroMobile  = "/videos/hero-mobile.mp4";
const videoHeroPoster  = "/images/hero-poster.jpg";

// Editorial Transition Image
const imgEditorial = "/images/editorial-ocean.jpg";

// Product Images
const imgSeagullShirt     = "/images/seagull-wing-shirt.jpg";
const imgConvertibleSkirt = "/images/convertible-ocean-skirt.jpg";
const imgOceanShorts      = "/images/ocean-wave-shorts.jpg";
const imgMistScarf        = "/images/ocean-mist-scarf.jpg";

// Motion Gallery Videos (15 videos)
const motionVideos = [
  { src: "/videos/motion-01-sleeves-wind.mp4",      poster: "/images/motion-01.jpg", title: "Sleeves in the Wind" },
  { src: "/videos/motion-02-walk-ocean.mp4",        poster: "/images/motion-02.jpg", title: "Walking Toward the Ocean" },
  { src: "/videos/motion-03-walk-away.mp4",         poster: "/images/motion-03.jpg", title: "Walking Away" },
  { src: "/videos/motion-04-turning.mp4",         poster: "/images/motion-04.jpg", title: "Turning Slowly" },
  { src: "/videos/motion-05-zipper-open.mp4",     poster: "/images/motion-05.jpg", title: "Opening the Skirt" },
  { src: "/videos/motion-06-zipper-close.mp4",    poster: "/images/motion-06.jpg", title: "Closing the Skirt" },
  { src: "/videos/motion-07-embroidery.mp4",      poster: "/images/motion-07.jpg", title: "Embroidery Detail" },
  { src: "/videos/motion-08-cotton-fabric.mp4",   poster: "/images/motion-08.jpg", title: "Italian Cotton" },
  { src: "/videos/motion-09-scarf-breeze.mp4",    poster: "/images/motion-09.jpg", title: "Scarf in the Breeze" },
  { src: "/videos/motion-10-walk-scarf.mp4",     poster: "/images/motion-10.jpg", title: "Walking with Scarf" },
  { src: "/videos/motion-11-ocean-waves.mp4",     poster: "/images/motion-11.jpg", title: "Ocean Waves" },
  { src: "/videos/motion-12-standing-rocks.mp4",  poster: "/images/motion-12.jpg", title: "Standing on Rocks" },
  { src: "/videos/motion-13-slow-sleeves.mp4",    poster: "/images/motion-13.jpg", title: "Slow Motion Sleeves" },
  { src: "/videos/motion-14-wind-chiffon.mp4",     poster: "/images/motion-14.jpg", title: "Wind Catches Chiffon" },
  { src: "/videos/motion-15-complete-outfit.mp4", poster: "/images/motion-15.jpg", title: "Complete Outfit" },
];

// Closing / CTA Image
const imgClosing = "/images/closing-ocean.jpg";

// ═══════════════════════════════════════════════════════════════
//  DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════
const TEAL    = '#2d4a47';
const TEAL_LT = '#4a7c76';
const CREAM   = '#eee9e2';
const IVORY   = '#f5f3f0';
const SAND    = '#d4c4b0';
const WHITE   = '#ffffff';
const BODY    = '#3a3a3a';
const MUTED   = '#7a8a88';
const NAVY    = '#1a2e2c';

// ═══════════════════════════════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function SeagloreCollection() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxVideo, setLightboxVideo]   = useState(null);
  const [heroLoaded, setHeroLoaded]         = useState(false);
  const [editorialVisible, setEditorialVisible] = useState(false);
  const [productsVisible, setProductsVisible]   = useState([false, false, false, false]);
  const motionRefs = useRef([]);
  const [motionPlaying, setMotionPlaying] = useState({});

  // ── Scroll handler ──
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // ── Intersection Observer for scroll reveals ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Auto-play motion videos when visible
            const idx = entry.target.dataset.motionIdx;
            if (idx !== undefined) {
              setMotionPlaying(prev => ({ ...prev, [idx]: true }));
            }
          } else {
            const idx = entry.target.dataset.motionIdx;
            if (idx !== undefined) {
              setMotionPlaying(prev => ({ ...prev, [idx]: false }));
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ── Editorial section observer ──
  useEffect(() => {
    const el = document.getElementById('editorial-trigger');
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setEditorialVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  // ── Product data ──
  const products = [
    {
      name: "The Seagull Wing Shirt",
      story: "Inspired by the graceful flight of a seagull over the ocean, this shirt celebrates movement, freedom, and lightness. Its flowing sculptural sleeves create beautiful motion with every step while maintaining a clean and elegant silhouette.",
      details: "Designed to pair effortlessly with every piece in the collection, it becomes the foundation of a wardrobe that transforms with you.",
      image: imgSeagullShirt,
      reverse: false,
    },
    {
      name: "The Convertible Ocean Skirt",
      story: "The Convertible Ocean Skirt reflects the changing rhythm of the sea. A concealed zipper allows you to decide how you wear it.",
      details: "Keep the opening closed for a refined, timeless silhouette. Or reveal the beautifully embroidered Ocean Wave Shorts beneath for a contemporary, expressive look. One garment. Two personalities. Your choice.",
      image: imgConvertibleSkirt,
      reverse: true,
    },
    {
      name: "The Ocean Wave Shorts",
      story: "Crafted from soft Italian cotton and finished with handmade embroidery inspired by ocean waves, these shorts are designed to be both practical and beautiful.",
      details: "Worn beneath the skirt, they provide comfort and confidence while becoming an artistic detail when revealed. They also create an elegant look when worn on their own with the Seagull Wing Shirt.",
      image: imgOceanShorts,
      reverse: false,
    },
    {
      name: "The Ocean Mist Scarf",
      story: "Soft, weightless chiffon moves like a gentle ocean breeze. Designed to be worn around the neck, over the shoulders, or styled creatively.",
      details: "The Ocean Mist Scarf brings softness, movement, and romance to every look. It completes the collection with effortless elegance.",
      image: imgMistScarf,
      reverse: true,
    },
  ];

  return (
    <div style={{ width: '100%', minHeight: '100vh', overflowX: 'hidden', margin: 0, padding: 0, fontFamily: "'Jost', sans-serif", background: WHITE }}>

      {/* ═══════════════════════════════════════════════════════════════
          GLOBAL STYLES (injected for reveal animations)
      ═══════════════════════════════════════════════════════════════ */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slowScale {
          from { transform: scale(1.05); }
          to   { transform: scale(1); }
        }
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .reveal-on-scroll.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .motion-gallery::-webkit-scrollbar { height: 3px; }
        .motion-gallery::-webkit-scrollbar-track { background: transparent; }
        .motion-gallery::-webkit-scrollbar-thumb { background: rgba(45,74,71,0.2); border-radius: 3px; }
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; }
          .craft-grid   { grid-template-columns: repeat(2, 1fr) !important; }
          .motion-card  { min-width: 280px !important; }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════
          NAVIGATION — Minimal, transparent over hero
      ═══════════════════════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 lg:px-16 transition-all duration-500"
        style={{
          height: '80px',
          background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          boxShadow: scrolled ? '0 1px 30px rgba(0,0,0,0.04)' : 'none',
        }}
      >
        <p
          onClick={() => scrollToSection('hero')}
          className="cursor-pointer hover:opacity-60 transition-opacity duration-300"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '18px',
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: scrolled ? TEAL : WHITE,
            textShadow: scrolled ? 'none' : '0 2px 20px rgba(0,0,0,0.3)',
            transition: 'color 0.5s ease',
          }}
        >
          Seagloré
        </p>

        <div className="hidden md:flex items-center gap-10">
          {[
            { name: 'Collection', id: 'collection' },
            { name: 'Philosophy', id: 'philosophy' },
            { name: 'Motion',     id: 'motion' },
            { name: 'Contact',    id: 'contact' },
          ].map(link => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.id)}
              className="cursor-pointer relative group"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '10px',
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: scrolled ? TEAL : WHITE,
                textShadow: scrolled ? 'none' : '0 2px 20px rgba(0,0,0,0.3)',
                background: 'none',
                border: 'none',
                padding: '4px 0',
                transition: 'color 0.5s ease',
              }}
            >
              {link.name}
              <span
                className="absolute bottom-0 left-0 h-px bg-current transition-all duration-300"
                style={{ width: '0%' }}
              />
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] cursor-pointer p-2"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <div className="w-5 h-px" style={{ background: scrolled ? TEAL : WHITE, transition: 'background 0.5s' }} />
          <div className="w-5 h-px" style={{ background: scrolled ? TEAL : WHITE, transition: 'background 0.5s' }} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col pt-28 px-10 pb-10"
          style={{ background: NAVY }}
        >
          <button
            className="absolute top-6 right-8 text-white/60 hover:text-white text-xs tracking-[4px] uppercase font-light transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            ✕ Close
          </button>
          <p
            onClick={() => { setMobileMenuOpen(false); scrollToSection('hero'); }}
            className="text-[22px] text-white tracking-[6px] uppercase mb-16 cursor-pointer"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Seagloré
          </p>
          <nav className="flex flex-col gap-0">
            {[
              { name: 'Collection', id: 'collection' },
              { name: 'Philosophy', id: 'philosophy' },
              { name: 'Motion',     id: 'motion' },
              { name: 'Contact',    id: 'contact' },
            ].map(link => (
              <button
                key={link.name}
                onClick={() => { setMobileMenuOpen(false); setTimeout(() => scrollToSection(link.id), 100); }}
                className="text-left text-[26px] text-white/80 tracking-[3px] uppercase py-7 hover:text-white transition-colors"
                style={{ background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                {link.name}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          HERO — Full-screen cinematic video
          No products. No prices. Just ocean, wind, silence, movement.
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative w-full overflow-hidden"
        style={{ height: '100vh', minHeight: '700px' }}
      >
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={videoHeroPoster}
            onLoadedData={() => setHeroLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: heroLoaded ? 1 : 0,
              transition: 'opacity 1.5s ease',
            }}
          >
            <source src={videoHeroMobile} type="video/mp4" media="(max-width: 768px)" />
            <source src={videoHeroDesktop} type="video/mp4" />
          </video>
          {/* Fallback gradient if video fails */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #1a3330 0%, #2d4a47 50%, #1e3d3a 100%)',
              opacity: heroLoaded ? 0 : 1,
              transition: 'opacity 1s ease',
            }}
          />
        </div>

        {/* Overlay gradient for readability */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.25) 100%)',
          }}
        />

        {/* Hero Content — fades in after video loads */}
        <div
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
          style={{
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1.5s ease 0.5s, transform 1.5s ease 0.5s',
          }}
        >
          <p
            className="mb-10"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            The First Collection
          </p>

          <h1
            className="mb-8"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.4rem, 6.5vw, 5rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              color: WHITE,
              letterSpacing: '0.02em',
            }}
          >
            Where Nature<br />Becomes Couture
          </h1>

          <p
            className="mb-14 mx-auto"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
              fontWeight: 300,
              letterSpacing: '0.06em',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 2,
              maxWidth: '460px',
            }}
          >
            The First Seaglore Collection
          </p>

          <button
            onClick={() => scrollToSection('editorial')}
            className="cursor-pointer transition-all duration-500 hover:bg-white hover:text-[#2d4a47]"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '10px',
              fontWeight: 400,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: WHITE,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.4)',
              padding: '16px 48px',
            }}
          >
            Discover the Collection
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
          style={{
            opacity: heroLoaded ? 0.4 : 0,
            transition: 'opacity 1s ease 2s',
            animation: 'fadeInUp 2s ease infinite',
          }}
        >
          <div className="w-px h-8 bg-white/40 mx-auto mb-2" />
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '8px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            Scroll
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          EDITORIAL SECTION — Transition from video to image
          Large photograph. Minimal copy. Emotional connection.
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="editorial"
        className="relative w-full overflow-hidden"
        style={{ height: '100vh', minHeight: '600px' }}
      >
        <div id="editorial-trigger" className="absolute top-0" />

        {/* Full-width editorial photograph */}
        <div className="absolute inset-0">
          <img
            src={imgEditorial}
            alt="Ocean editorial"
            className="w-full h-full object-cover"
            style={{
              transform: editorialVisible ? 'scale(1)' : 'scale(1.08)',
              transition: 'transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'linear-gradient(180deg, #e8e4de 0%, #d4c4b0 100%)';
            }}
          />
        </div>

        {/* Soft overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(26,46,44,0.5) 0%, rgba(26,46,44,0.1) 50%, transparent 100%)' }}
        />

        {/* Editorial text — bottom aligned, minimal */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 px-8 lg:px-20 pb-20 lg:pb-28"
          style={{
            opacity: editorialVisible ? 1 : 0,
            transform: editorialVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1.5s ease 0.3s, transform 1.5s ease 0.3s',
          }}
        >
          <div style={{ maxWidth: '520px' }}>
            <p
              className="mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
                fontWeight: 400,
                fontStyle: 'italic',
                lineHeight: 1.3,
                color: WHITE,
              }}
            >
              The ocean never stays the same.
            </p>
            <p
              className="mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
                fontWeight: 400,
                fontStyle: 'italic',
                lineHeight: 1.3,
                color: WHITE,
              }}
            >
              Neither should the woman who wears it.
            </p>
            <div className="w-10 h-px bg-white/30 mb-6" />
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '13px',
                fontWeight: 300,
                lineHeight: 2,
                color: 'rgba(255,255,255,0.6)',
                maxWidth: '400px',
              }}
            >
              Every piece transforms with you, allowing you to choose how you want to move through the world.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PHILOSOPHY SECTION — White space, breathing room
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="philosophy"
        className="w-full flex justify-center"
        style={{ background: WHITE, padding: '160px 36px' }}
      >
        <div className="text-center reveal-on-scroll" style={{ maxWidth: '640px' }}>
          <p
            className="mb-8"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: SAND,
            }}
          >
            Philosophy
          </p>

          <h2
            className="mb-10"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: TEAL,
            }}
          >
            The Ocean Never Stands Still.<br />Neither Should You.
          </h2>

          <div className="mx-auto mb-10" style={{ width: '30px', height: '1px', background: SAND }} />

          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 1.9,
              color: TEAL,
            }}
          >
            <p className="mb-5">The ocean is never the same twice.</p>
            <p className="mb-5">One moment it is calm. The next, powerful. Soft. Strong. Quiet. Expressive.</p>
            <p className="mb-5">The first Seaglore collection was created with the same philosophy.</p>
            <p>This is more than fashion. It is Ocean Living expressed through couture.</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          COLLECTION SECTION — Products appear AFTER emotional intro
          Each product: large editorial photo + story + details
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="collection"
        className="w-full"
        style={{ background: IVORY }}
      >
        {/* Section Header */}
        <div className="text-center py-24 px-9">
          <p
            className="mb-6"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: SAND,
            }}
          >
            The Collection
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: TEAL,
            }}
          >
            The First Seaglore Collection
          </h2>
        </div>

        {/* Products — alternating layout, large photography */}
        {products.map((product, idx) => (
          <div
            key={idx}
            className="reveal-on-scroll"
            style={{
              borderTop: idx === 0 ? 'none' : '1px solid rgba(212,196,176,0.3)',
            }}
          >
            <div
              className="product-grid mx-auto"
              style={{
                maxWidth: '1200px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                minHeight: '90vh',
              }}
            >
              {/* Image Side */}
              <div
                className="relative overflow-hidden"
                style={{ order: product.reverse ? 2 : 1 }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                  style={{ minHeight: '500px' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = 'linear-gradient(135deg, #e8e4de 0%, #d4c4b0 100%)';
                  }}
                />
              </div>

              {/* Content Side */}
              <div
                className="flex flex-col justify-center px-10 lg:px-20 py-20"
                style={{ order: product.reverse ? 1 : 2, background: WHITE }}
              >
                <p
                  className="mb-6"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '9px',
                    fontWeight: 500,
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    color: SAND,
                  }}
                >
                  {String(idx + 1).padStart(2, '0')} / 04
                </p>

                <h3
                  className="mb-8"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                    fontWeight: 400,
                    lineHeight: 1.2,
                    color: TEAL,
                  }}
                >
                  {product.name}
                </h3>

                <p
                  className="mb-6"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '14px',
                    fontWeight: 300,
                    lineHeight: 2,
                    color: BODY,
                    maxWidth: '420px',
                  }}
                >
                  {product.story}
                </p>

                <p
                  className="mb-10"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '13px',
                    fontWeight: 300,
                    lineHeight: 1.9,
                    color: MUTED,
                    maxWidth: '420px',
                  }}
                >
                  {product.details}
                </p>

                <button
                  className="cursor-pointer self-start transition-all duration-300 hover:bg-[#2d4a47] hover:text-white"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '10px',
                    fontWeight: 400,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: TEAL,
                    background: 'transparent',
                    border: `1px solid ${TEAL}`,
                    padding: '14px 40px',
                  }}
                >
                  Discover
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DESIGNED TO TRANSFORM — Modular wardrobe philosophy
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="w-full flex justify-center"
        style={{ background: WHITE, padding: '160px 36px' }}
      >
        <div className="text-center reveal-on-scroll" style={{ maxWidth: '600px' }}>
          <p
            className="mb-8"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: SAND,
            }}
          >
            One Collection. Many Possibilities.
          </p>

          <h2
            className="mb-10"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: TEAL,
            }}
          >
            Designed to Transform
          </h2>

          <div className="mx-auto mb-10" style={{ width: '30px', height: '1px', background: SAND }} />

          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 1.9,
              color: TEAL,
            }}
          >
            <p className="mb-5">Luxury should never limit creativity.</p>
            <p className="mb-5">The first Seaglore collection was created as a modular wardrobe that adapts to every moment.</p>
            <p>One collection becomes many.</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          THE COLLECTION IN MOTION — Horizontal scrolling video gallery
          15 videos. Muted. Loop. No controls. Click opens fullscreen.
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="motion"
        className="w-full"
        style={{ background: NAVY, padding: '120px 0' }}
      >
        <div className="px-8 lg:px-16 mb-16">
          <p
            className="mb-6"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            The Collection in Motion
          </p>
          <h2
            className="mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: WHITE,
            }}
          >
            Experience How Every Piece<br />Transforms Through Movement
          </h2>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '13px',
              fontWeight: 300,
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.4)',
              maxWidth: '400px',
            }}
          >
            Click any moment to view fullscreen
          </p>
        </div>

        {/* Horizontal scrolling gallery */}
        <div
          className="motion-gallery flex gap-5 px-8 lg:px-16 overflow-x-auto pb-6"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {motionVideos.map((video, idx) => (
            <div
              key={idx}
              ref={(el) => { motionRefs.current[idx] = el; }}
              data-motion-idx={idx}
              className="motion-card relative flex-shrink-0 cursor-pointer group overflow-hidden"
              style={{
                minWidth: '380px',
                width: '380px',
                aspectRatio: '3/4',
                scrollSnapAlign: 'start',
                borderRadius: '2px',
              }}
              onClick={() => setLightboxVideo(video)}
            >
              {/* Video */}
              <video
                muted
                loop
                playsInline
                poster={video.poster}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ opacity: 0.85 }}
              >
                <source src={video.src} type="video/mp4" />
              </video>

              {/* Play indicator on hover */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'rgba(0,0,0,0.2)' }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ border: '1px solid rgba(255,255,255,0.4)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <polygon points="5,3 19,12 5,21" fill="white" />
                  </svg>
                </div>
              </div>

              {/* Title overlay */}
              <div
                className="absolute bottom-0 left-0 right-0 p-6"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
                }}
              >
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '10px',
                    fontWeight: 400,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  {String(idx + 1).padStart(2, '0')} — {video.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CRAFTSMANSHIP SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="craftsmanship"
        className="w-full flex justify-center"
        style={{ background: WHITE, padding: '160px 36px' }}
      >
        <div className="w-full" style={{ maxWidth: '1100px' }}>
          <div className="text-center reveal-on-scroll mb-20">
            <p
              className="mb-6"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '9px',
                fontWeight: 500,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: SAND,
              }}
            >
              Craftsmanship
            </p>
            <h2
              className="mb-8"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                fontWeight: 400,
                lineHeight: 1.2,
                color: TEAL,
              }}
            >
              Created with Intention
            </h2>
            <div className="mx-auto" style={{ width: '30px', height: '1px', background: SAND }} />
          </div>

          <div
            className="craft-grid reveal-on-scroll"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '48px',
              maxWidth: '1000px',
              margin: '0 auto',
            }}
          >
            {[
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke={TEAL_LT} strokeWidth="1">
                    <circle cx="24" cy="24" r="18"/>
                    <path d="M24 10v14M24 30v8" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Freedom',
                desc: 'The Seagull Wing Shirt captures the essence of liberation in every flowing sleeve.',
              },
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke={TEAL_LT} strokeWidth="1">
                    <path d="M10 18h6l4 12h14l4-8H20" strokeLinejoin="round"/>
                    <circle cx="18" cy="36" r="2"/>
                    <circle cx="30" cy="36" r="2"/>
                  </svg>
                ),
                title: 'Transformation',
                desc: 'The Convertible Ocean Skirt represents the ever-changing nature of the sea.',
              },
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke={TEAL_LT} strokeWidth="1">
                    <path d="M24 6v36M10 36h28" strokeLinecap="round"/>
                    <path d="M8 16l10 4M24 20l10-4" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Craftsmanship',
                desc: 'Ocean Wave Shorts celebrate artistry through handmade embroidery.',
              },
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke={TEAL_LT} strokeWidth="1">
                    <path d="M24 6C12 18 6 24 6 34a18 18 0 0 0 36 0c0-10-6-16-18-28z" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'Softness',
                desc: 'The Ocean Mist Scarf introduces softness and movement to every look.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center" style={{ padding: '20px 8px' }}>
                <div className="mx-auto mb-6" style={{ width: '40px', height: '40px' }}>
                  {item.icon}
                </div>
                <h4
                  className="mb-3"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.2rem',
                    fontWeight: 400,
                    color: TEAL,
                  }}
                >
                  {item.title}
                </h4>
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '12px',
                    lineHeight: 1.8,
                    color: MUTED,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <p
            className="text-center mt-16 reveal-on-scroll"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.1rem, 2.2vw, 1.4rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 1.8,
              color: TEAL,
              maxWidth: '600px',
              margin: '64px auto 0',
            }}
          >
            Together they create a collection inspired by the elegance and constant motion of the sea.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          OCEAN LIVING PHILOSOPHY
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="ocean-living"
        className="w-full flex justify-center"
        style={{ background: CREAM, padding: '160px 36px' }}
      >
        <div className="text-center reveal-on-scroll" style={{ maxWidth: '640px' }}>
          <p
            className="mb-8"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: SAND,
            }}
          >
            Philosophy
          </p>

          <h2
            className="mb-10"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: TEAL,
            }}
          >
            Ocean Living
          </h2>

          <div className="mx-auto mb-10" style={{ width: '30px', height: '1px', background: SAND }} />

          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 1.9,
              color: TEAL,
            }}
          >
            <p className="mb-5">Ocean Living is the philosophy behind every Seaglore creation.</p>
            <p className="mb-5">It reminds us to slow down. To breathe more deeply. To embrace change. To reconnect with nature.</p>
            <p>Our collections are designed not only to be worn, but to inspire a different way of living — one that values beauty, presence, and timeless craftsmanship.</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CLOSING STATEMENT — Full-screen image with overlay text
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{ height: '100vh', minHeight: '600px' }}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={imgClosing}
            alt="Ocean closing"
            className="w-full h-full object-cover"
            style={{
              filter: 'brightness(0.7)',
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'linear-gradient(135deg, #1a3330 0%, #2d4a47 50%, #1e3d3a 100%)';
            }}
          />
        </div>

        {/* Soft overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(26,46,44,0.3)' }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-8 reveal-on-scroll" style={{ maxWidth: '700px' }}>
          <p
            className="mb-8"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            Closing Statement
          </p>

          <h2
            className="mb-10"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 5vw, 3.6rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              color: WHITE,
            }}
          >
            Wear the Movement<br />of the Ocean
          </h2>

          <div className="mx-auto mb-10" style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />

          <div
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '14px',
              fontWeight: 300,
              lineHeight: 2.2,
              color: 'rgba(255,255,255,0.65)',
              maxWidth: '520px',
              margin: '0 auto',
            }}
          >
            <p className="mb-4">The first Seaglore collection invites you to experience fashion inspired by nature's endless transformation.</p>
            <p className="mb-4">Elegant. Versatile. Crafted with intention.</p>
            <p className="mb-8">Created for women who embrace freedom, movement, and their own unique expression.</p>
          </div>

          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.3rem',
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            Welcome to Seaglore. Where Nature Becomes Couture.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FINAL CALL TO ACTION
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="contact"
        className="w-full flex justify-center"
        style={{ background: WHITE, padding: '120px 36px' }}
      >
        <div className="text-center reveal-on-scroll" style={{ maxWidth: '600px' }}>
          <h2
            className="mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: TEAL,
            }}
          >
            Discover the First Collection
          </h2>

          <div className="mx-auto mb-8" style={{ width: '30px', height: '1px', background: SAND }} />

          <p
            className="mb-12 mx-auto"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '14px',
              fontWeight: 300,
              lineHeight: 1.9,
              color: MUTED,
              maxWidth: '480px',
            }}
          >
            Experience the artistry, movement, and philosophy behind Seaglore's debut collection.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              className="cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '10px',
                fontWeight: 400,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: WHITE,
                background: TEAL,
                padding: '16px 44px',
                border: 'none',
              }}
            >
              Shop the Collection
            </button>

            <button
              className="cursor-pointer transition-all duration-300 hover:bg-[#2d4a47] hover:text-white"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '10px',
                fontWeight: 400,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: TEAL,
                background: 'transparent',
                padding: '16px 44px',
                border: `1px solid ${TEAL}`,
              }}
            >
              Request a Private Appointment
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════ */}
      <footer
        className="w-full text-center"
        style={{ background: TEAL, padding: '80px 36px 40px' }}
      >
        <p
          className="mb-2 cursor-pointer hover:opacity-70 transition-opacity"
          onClick={() => scrollToSection('hero')}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '22px',
            fontWeight: 500,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: CREAM,
          }}
        >
          Seagloré
        </p>

        <p
          className="mb-12"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '14px',
            fontStyle: 'italic',
            color: 'rgba(238,233,226,0.5)',
          }}
        >
          Where Nature Becomes Couture
        </p>

        <div className="flex justify-center gap-8 mb-12 flex-wrap">
          {['Collection', 'Philosophy', 'Motion', 'Contact'].map(link => (
            <button
              key={link}
              onClick={() => scrollToSection(link.toLowerCase())}
              className="cursor-pointer hover:text-white transition-colors"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '10px',
                fontWeight: 400,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
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
          className="pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '11px',
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.1em',
            }}
          >
            © 2026 SEAGLORÉ. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════
          VIDEO LIGHTBOX — Fullscreen overlay
      ═══════════════════════════════════════════════════════════════ */}
      {lightboxVideo && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: 'rgba(10,20,20,0.95)', backdropFilter: 'blur(10px)' }}
          onClick={() => setLightboxVideo(null)}
        >
          {/* Close button */}
          <button
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-10"
            onClick={() => setLightboxVideo(null)}
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '14px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ✕ Close
          </button>

          {/* Video */}
          <div
            className="relative w-full max-w-6xl mx-8"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              controls
              className="w-full"
              style={{ maxHeight: '85vh', objectFit: 'contain' }}
            >
              <source src={lightboxVideo.src} type="video/mp4" />
            </video>

            {/* Video title */}
            <p
              className="text-center mt-6"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              {lightboxVideo.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
