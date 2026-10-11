import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------
   Seaglore — Home / Gallery
   Single file page. Fonts: Cormorant Garamond + Jost (Google Fonts)
   Colors: #FFFAF1  #0A1319  #0A1319D9  #FFFFFF  #FFFFFFE5

   IMAGES / VIDEOS:
   Saari files  public/gallery/  folder mein rakho.
   Neeche MEDIA mein sirf file ka NAAM likho (jaise 'hero.mp4').
   Khali ('') chhodoge to dummy placeholder dikhega.
   .mp4 / .webm / .mov ho to video chalegi, warna image dikhegi,
   is liye kisi bhi slot mein image ya video dono daal sakte ho.
------------------------------------------------------------------- */
const MEDIA_FOLDER = '/gallery/';

const MEDIA = {
  heroVideo: 'hero2.mp4', // VIDEO  1440 x 960 — sabse upar wali hero video
  shirtImage: 'shirt.png', // IMAGE  520 x 650 — Seagull Wings Shirt
  skirtImage: 'skirt.png', // IMAGE  520 x 650 — Tide Jeans Skirt
  lookVideo: 'middle.mp4', // VIDEO  1440 x 960 — walking wali video (shirt + skirt)
  scarfImage: 'duppata.png', // IMAGE  520 x 650 — Mist Silk Scarf
  shortsImage: 'nikr.png', // IMAGE  520 x 650 — Ocean Wave Shorts
  fabricMedia: 'halfface.png', // IMAGE  1440 x 976 — fabric close-up (video bhi chalegi)
  campaignVideo: 'bottom.mp4', // VIDEO  1440 x 728 — Fall 2026 campaign
};

// 'hero.mp4' -> '/gallery/hero.mp4'   (full path ya http link do to wahi use hoga)
const mediaUrl = (name) => {
  if (!name) return '';
  if (/^(https?:)?\/\//.test(name) || name.startsWith('/')) return name;
  return MEDIA_FOLDER + encodeURIComponent(name);
};

const FONTS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');
.sg-gal { font-family: 'Jost', system-ui, sans-serif; }
.sg-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
.sg-sans { font-family: 'Jost', system-ui, sans-serif; }
`;

const VIDEO_RE = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i;

const NAV_LEFT = [
  { label: 'New arrivals', href: '#' },
  { label: 'Collections', href: '#' },
  { label: 'About', href: '#' },
];
const NAV_RIGHT = [
  { label: 'Search', href: '#' },
  { label: 'Account', href: '#' },
];

const PRODUCTS_TOP = [
  { name: 'SEAGULL WINGS SHIRT', src: 'shirtImage', link: 'Shop the shirt', ul: 138 },
  { name: 'Tide Jeans Skirt', src: 'skirtImage', link: 'Shop the skirt', ul: 140 },
];
const PRODUCTS_BOTTOM = [
  { name: 'MIST SILK SCARF', src: 'scarfImage', link: 'Shop the scarf', ul: 107 },
  { name: 'Ocean Wave Shorts', src: 'shortsImage', link: 'Shop the shorts', ul: 134 },
];

const FOOTER_COLS = [
  { title: 'Shop', links: ['New arrivals', 'Ready to wear', 'Accessories'] },
  { title: 'Help', links: ['Orders & shipping', 'Returns', 'Size guide'] },
  { title: 'About', links: ['Our story', 'The atelier', 'Stockists'] },
];

const eyebrow =
  'sg-sans text-[9.5px] font-normal uppercase leading-none tracking-[0.12em]';

// Image ya video — file ka naam do. Khali ho to dummy block.
// Video sirf tab chalti hai jab screen par nazar aaye (data bachta hai).
function Media({ src, label, alt = '', tone = 'dark', className = '' }) {
  const url = mediaUrl(src);
  const videoRef = useRef(null);
  const isVideo = VIDEO_RE.test(url);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [url]);

  if (!url) {
    const look =
      tone === 'dark'
        ? 'bg-[linear-gradient(135deg,#27362F_0%,#4B5B50_55%,#6B7A6C_100%)] text-[#FFFFFFE5]'
        : 'bg-[#F1EEE7] text-[#0A1319D9]';
    return (
      <div
        className={`flex h-full w-full items-start justify-center ${look} ${className}`}
        role="img"
        aria-label={alt || label}
      >
        <span className={`${eyebrow} mt-6 opacity-60`}>{label}</span>
      </div>
    );
  }
  if (isVideo) {
    return (
      <video
        ref={videoRef}
        className={`h-full w-full object-cover ${className}`}
        src={url}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt || label}
      />
    );
  }
  return (
    <img
      className={`h-full w-full object-cover ${className}`}
      src={url}
      alt={alt || label}
      loading="lazy"
    />
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50">
      <div className="grid h-20 grid-cols-[1fr_auto_1fr] items-center border-b border-[#0A1319]/15 bg-[#FFFAF1] px-5 md:px-14">
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {NAV_LEFT.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`${eyebrow} relative top-[1.3px] text-[#0A1319D9] transition-opacity hover:opacity-60`}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={`${eyebrow} justify-self-start text-[#0A1319D9] md:hidden`}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <a
          href="/"
          className="sg-serif relative top-[0.8px] pl-[0.3em] text-[20px] font-light uppercase leading-none tracking-[0.3em] text-[#0A1319]"
        >
          Seaglore
        </a>

        <nav className="-mr-px flex items-center justify-end gap-6" aria-label="Secondary">
          {NAV_RIGHT.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`${eyebrow} relative top-[1.3px] hidden text-[#0A1319D9] transition-opacity hover:opacity-60 md:inline`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#"
            className={`${eyebrow} relative top-[1.3px] text-[#0A1319D9] transition-opacity hover:opacity-60`}
          >
            Bag (0)
          </a>
        </nav>
      </div>

      {open && (
        <div className="border-b border-[#0A1319]/15 bg-[#FFFAF1] px-5 py-6 md:hidden">
          <ul className="space-y-5">
            {[...NAV_LEFT, ...NAV_RIGHT].map((l) => (
              <li key={l.label}>
                <a href={l.href} className={`${eyebrow} text-[#0A1319D9]`}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative aspect-[4/5] w-full overflow-hidden bg-[#0A1319] md:aspect-[3/2]">
      <Media src={MEDIA.heroVideo} label="Hero video — 1440 × 960" />
      <div className="absolute bottom-[72px] left-5 md:bottom-[83px] md:left-20">
        <h1 className="sg-serif m-0 text-[34px] font-light uppercase leading-none tracking-[0.3em] text-white md:text-[46px]">
          Seaglore
        </h1>
        <p className="sg-serif mb-0 mt-[11.7px] text-[18px] font-light leading-none tracking-[0.02em] text-[#FFFFFFE5]">
          Ocean-borne silhouettes
        </p>
        <a
          href="#"
          className={`${eyebrow} mt-[32.8px] inline-flex items-center gap-2 text-white transition-opacity hover:opacity-70`}
        >
          Explore the collection
          <span aria-hidden="true">—</span>
        </a>
      </div>
    </section>
  );
}

function ShopLinkBar({ items }) {
  return (
    <div className="grid grid-cols-2 gap-1 bg-[#FFFAF1]">
      {items.map((p) => (
        <a key={p.link} href="#" className="group flex h-11 items-start px-[10px] pt-[17px]">
          <span
            className={`${eyebrow} inline-block border-b border-[#0A1319]/70 pb-[3.4px] text-[#0A1319] transition-opacity group-hover:opacity-60`}
            style={{ width: p.ul, maxWidth: '100%' }}
          >
            {p.link}
          </span>
        </a>
      ))}
    </div>
  );
}

function ProductRow({ title, items }) {
  return (
    <>
      <section className="bg-white px-5 pb-16 pt-[48px] md:h-[940px] md:px-20 md:pb-0 md:pt-[53px]">
        <h2 className={`${eyebrow} m-0 text-[#0A1319D9]`}>{title}</h2>
        <div className="mt-10 grid grid-cols-1 gap-12 md:mt-[84px] md:grid-cols-2 md:gap-x-10">
          {items.map((p) => (
            <figure key={p.name} className="m-0">
              <div className="mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden bg-white">
                <Media src={MEDIA[p.src]} label="Product image — 520 × 650" alt={p.name} tone="light" />
              </div>
              <figcaption className="sg-sans mt-[23px] text-center text-[8px] md:text-[6.75px] font-normal leading-none tracking-[0.13em] text-[#0A1319D9]">
                {p.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <ShopLinkBar items={items} />
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-[#FFFAF1] px-5 md:px-20">
      <div className="grid gap-12 pt-16 md:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,120px))] md:gap-x-10 xl:grid-cols-[500px_repeat(3,120px)] md:gap-y-0 md:pt-[92px]">
        <a
          href="/"
          className="sg-serif pl-0 text-[18px] font-light uppercase leading-none tracking-[0.3em] text-[#0A1319]"
        >
          Seaglore
        </a>
        <div className="grid grid-cols-3 gap-6 md:contents">
          {FOOTER_COLS.map((c) => (
            <div key={c.title}>
              <h3 className={`${eyebrow} relative top-px m-0 text-[#0A1319]`}>{c.title}</h3>
              <ul className="m-0 mt-5 list-none p-0">
                {c.links.map((l) => (
                  <li key={l} className="sg-sans text-[10px] font-normal leading-5 tracking-[0.04em] text-[#0A1319D9]">
                    <a href="#" className="transition-opacity hover:opacity-60">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-4 border-t border-[#0A1319]/20 pb-10 pt-6 md:mt-[102px] md:flex-row md:items-center md:justify-between md:pb-[43.1px] md:pt-[24px]">
        <p className="sg-sans m-0 pl-[2px] text-[8.4px] font-normal uppercase leading-none tracking-[0.08em] text-[#0A1319D9]">
          © 2026 Seaglore — Pacific Atelier
        </p>
        <div className="flex gap-5">
          {['Privacy', 'Terms', 'Accessibility'].map((t) => (
            <a
              key={t}
              href="#"
              className="sg-sans text-[8.4px] font-normal uppercase leading-none tracking-[0.08em] text-[#0A1319D9] transition-opacity hover:opacity-60"
            >
              {t}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function SeagloreGallery() {
  return (
    <div className="sg-gal min-h-screen bg-[#FFFAF1] text-[#0A1319] antialiased">
      <style>{FONTS_CSS}</style>

      <Header />

      <main>
        <Hero />

        <ProductRow title="Shop Fall 2026" items={PRODUCTS_TOP} />

        {/* Walking video */}
        <section className="aspect-[4/5] w-full overflow-hidden bg-[#0A1319] md:aspect-[3/2]">
          <Media src={MEDIA.lookVideo} label="Look video — 1440 × 960" />
        </section>

        <ProductRow title="The accessories edit" items={PRODUCTS_BOTTOM} />

        {/* Fabric in motion */}
        <section className="relative aspect-[4/5] w-full overflow-hidden bg-[#0A1319] md:aspect-[1440/976]">
          <Media src={MEDIA.fabricMedia} label="Fabric image — 1440 × 976" />
          <p className="sg-sans absolute bottom-[72px] left-5 m-0 text-[9px] font-light uppercase leading-none tracking-[0.16em] text-white md:bottom-[85px] md:left-20">
            Fabric in motion — hand-finished silk chiffon
          </p>
        </section>

        {/* Campaign */}
        <section className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A1319] md:aspect-[1440/728]">
          <Media src={MEDIA.campaignVideo} label="Campaign video — 1440 × 728" />
          <p className="sg-sans absolute bottom-[48.4px] left-0 right-0 m-0 pl-[0.14em] text-center text-[9.6px] font-normal uppercase leading-none tracking-[0.14em] text-white">
            Fall 2026 campaign
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}