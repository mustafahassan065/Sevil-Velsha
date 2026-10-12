import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';


const MEDIA_FOLDER = '/gallery/';

const mediaUrl = (name) => {
  if (!name) return '';
  if (/^(https?:)?\/\//.test(name) || name.startsWith('/')) return name;
  return MEDIA_FOLDER + encodeURIComponent(name);
};

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

/*
  images: har product ki images. Abhi aik hi file hai, is liye 2nd/3rd
  image usi file ka zoom crop hai (zoom + pos). Nayi image milne par
  { file: 'shirt-2.png' } likh do, zoom/pos hata do.
*/
const PRODUCTS = [
  {
    slug: 'seagull-wings-shirt',
    name: 'Seagull Wings Shirt',
    category: 'Ready to wear',
    price: '$295',
    colour: 'Ivory',
    swatch: '#F4EFE4',
    sizes: SIZES,
    tagline: 'A relaxed silk-blend shirt with wing-cut sleeves that lift with the sea breeze.',
    images: [
      { file: 'shirt.png' },
      { file: 'shirt.png', zoom: 1.9, pos: '50% 18%' },
      { file: 'shirt.png', zoom: 1.9, pos: '50% 80%' },
    ],
    description: [
      'Cut from a featherlight silk-cotton blend, the Seagull Wings Shirt moves like the tide. Its softly dropped shoulders and wing-shaped sleeves are finished by hand, giving a loose, airy silhouette that holds its shape from shoreline to evening.',
      'A concealed placket keeps the front clean, while pearlised shell buttons add a quiet note of sea-glass shimmer. Wear it open over a slip, or fastened to the collar with tailored trousers.',
    ],
    details: [
      'Relaxed fit with dropped shoulders',
      'Wing-cut sleeves with a hand-rolled hem',
      'Concealed front placket',
      'Mother-of-pearl style shell buttons',
      'Slightly curved hem, longer at the back',
    ],
    fabric: '70% Silk, 30% Cotton. Lining: none. Hand-finished at our Pacific Atelier.',
    fit: 'Relaxed fit. Model is 177 cm and wears a size S. If you are between sizes, we suggest sizing down for a closer fit.',
    care: 'Dry clean recommended. Or hand wash cold with a gentle detergent. Do not wring. Cool iron on the reverse.',
  },
  {
    slug: 'tide-jeans-skirt',
    name: 'Tide Jeans Skirt',
    category: 'Ready to wear',
    price: '$325',
    colour: 'Sea Wash',
    swatch: '#7E97A8',
    sizes: SIZES,
    tagline: 'A high-rise denim midi skirt in a soft, tide-washed indigo.',
    images: [
      { file: 'skirt.png' },
      { file: 'skirt.png', zoom: 1.9, pos: '50% 30%' },
      { file: 'skirt.png', zoom: 1.9, pos: '50% 90%' },
    ],
    description: [
      'The Tide Jeans Skirt is cut from a washed organic denim that softens with every wear. A high waist and an A-line shape skim the body before falling to a clean midi length with a gentle, wave-like sweep.',
      'The wash is finished by hand to echo the colour of shallow water, with subtle fading at the seams. Pair it with the Seagull Wings Shirt for a look made for the coast.',
    ],
    details: [
      'High-rise waist with a flat waistband',
      'A-line midi length',
      'Hidden zip and button fastening',
      'Two front pockets, tonal topstitching',
      'Hand-finished wash with soft fading',
    ],
    fabric: '100% Organic cotton denim. Unlined. Mid-weight, with a soft hand-feel.',
    fit: 'True to size. Model is 177 cm and wears a size S. Sits at the natural waist.',
    care: 'Machine wash cold inside out with similar colours. Do not tumble dry. Wash separately for the first few washes.',
  },
  {
    slug: 'mist-silk-scarf',
    name: 'Mist Silk Scarf',
    category: 'Accessories',
    price: '$185',
    colour: 'Sea Mist',
    swatch: '#C9D3D2',
    sizes: ['One size'],
    tagline: 'A weightless silk chiffon scarf that drifts like morning mist.',
    images: [
      { file: 'duppata.png' },
      { file: 'duppata.png', zoom: 1.9, pos: '50% 20%' },
      { file: 'duppata.png', zoom: 1.9, pos: '50% 85%' },
    ],
    description: [
      'The Mist Silk Scarf is a long, sheer piece in hand-finished silk chiffon. Light enough to float on the lightest breeze, it falls in soft folds and catches the light like sea spray.',
      'Wear it draped over the shoulders, tied at the neck, knotted on a bag or wrapped through the hair. Rolled edges are stitched by hand for a clean, delicate finish.',
    ],
    details: [
      'Hand-rolled edges',
      'Sheer, lightweight drape',
      'Can be worn as a scarf, wrap or hair tie',
      'Approx. 70 × 200 cm',
      'Made in small batches',
    ],
    fabric: '100% Silk chiffon. Hand-finished at our Pacific Atelier.',
    fit: 'One size. Approx. 70 cm wide and 200 cm long.',
    care: 'Dry clean only. Store flat or rolled, away from direct sunlight. Cool iron on the reverse if needed.',
  },
  {
    slug: 'ocean-wave-shorts',
    name: 'Ocean Wave Shorts',
    category: 'Ready to wear',
    price: '$245',
    colour: 'Deep Tide',
    swatch: '#2F4858',
    sizes: SIZES,
    tagline: 'High-waisted tailored shorts with a softly rippled hem.',
    images: [
      { file: 'nikr.png' },
      { file: 'nikr.png', zoom: 1.9, pos: '50% 25%' },
      { file: 'nikr.png', zoom: 1.9, pos: '50% 85%' },
    ],
    description: [
      'The Ocean Wave Shorts are cut from a fluid, crease-resistant crepe with a soft sheen. A high waist and a subtle wave-like hem give a flattering line that feels as good as it looks.',
      'Tailored pleats at the front add ease through the hip, and side pockets keep the shape clean. Dress them up with the Seagull Wings Shirt or down with a simple tee.',
    ],
    details: [
      'High-rise waist with front pleats',
      'Softly rippled wave hem',
      'Side seam pockets',
      'Hidden side zip and hook closure',
      'Tailored, relaxed leg',
    ],
    fabric: '65% Viscose, 30% Polyester, 5% Elastane. Unlined. Fluid, crease-resistant crepe.',
    fit: 'True to size. Model is 177 cm and wears a size S. Sits high on the natural waist.',
    care: 'Gentle machine wash cold or dry clean. Do not bleach. Cool iron. Hang to dry.',
  },
];

const FONTS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');
.sg-gal { font-family: 'Jost', system-ui, sans-serif; }
.sg-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
.sg-sans { font-family: 'Jost', system-ui, sans-serif; }
.sg-snap { scrollbar-width: none; }
.sg-snap::-webkit-scrollbar { display: none; }
`;

const NAV_LEFT = [
  { label: 'New arrivals', href: '#' },
  { label: 'Collections', href: '#' },
  { label: 'About', href: '#' },
];
const NAV_RIGHT = [
  { label: 'Search', href: '#' },
  { label: 'Account', href: '#' },
];

const FOOTER_COLS = [
  { title: 'Shop', links: ['New arrivals', 'Ready to wear', 'Accessories'] },
  { title: 'Help', links: ['Orders & shipping', 'Returns', 'Size guide'] },
  { title: 'About', links: ['Our story', 'The atelier', 'Stockists'] },
];

const eyebrow =
  'sg-sans text-[9.5px] font-normal uppercase leading-none tracking-[0.12em]';

/* ---------- shared pieces (gallery page jaisa header / footer) ---------- */

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

        <Link
          to="/home-gallery"
          className="sg-serif relative top-[0.8px] pl-[0.3em] text-[20px] font-light uppercase leading-none tracking-[0.3em] text-[#0A1319]"
        >
          Seaglore
        </Link>

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

function Footer() {
  return (
    <footer className="bg-[#FFFAF1] px-5 md:px-20">
      <div className="grid gap-12 pt-16 md:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,120px))] md:gap-x-10 md:gap-y-0 md:pt-[92px] xl:grid-cols-[500px_repeat(3,120px)]">
        <Link
          to="/home-gallery"
          className="sg-serif pl-0 text-[18px] font-light uppercase leading-none tracking-[0.3em] text-[#0A1319]"
        >
          Seaglore
        </Link>
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

/* ---------- product page parts ---------- */

// Aik image (zoom/pos ho to crop dikhata hai)
function ProductImage({ img, alt, priority = false }) {
  const url = mediaUrl(img.file);
  return (
    <div className="aspect-[4/5] w-full overflow-hidden bg-[#F1EEE7]">
      {url && (
        <img
          src={url}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          className="h-full w-full object-cover"
          style={
            img.zoom
              ? { transform: `scale(${img.zoom})`, transformOrigin: img.pos || '50% 50%' }
              : undefined
          }
        />
      )}
    </div>
  );
}

// Mobile: swipe slider, Desktop: 2 column grid
function Gallery({ product }) {
  const [idx, setIdx] = useState(0);
  const onScroll = (e) => {
    const el = e.currentTarget;
    setIdx(Math.round(el.scrollLeft / el.clientWidth));
  };
  return (
    <div>
      {/* mobile slider */}
      <div className="relative md:hidden">
        <div
          onScroll={onScroll}
          className="sg-snap flex snap-x snap-mandatory overflow-x-auto"
        >
          {product.images.map((img, i) => (
            <div key={i} className="w-full shrink-0 snap-center">
              <ProductImage img={img} alt={`${product.name} — ${i + 1}`} priority={i === 0} />
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {product.images.map((_, i) => (
            <span
              key={i}
              className={`h-[5px] w-[5px] rounded-full ${i === idx ? 'bg-[#0A1319]' : 'bg-[#0A1319]/30'}`}
            />
          ))}
        </div>
      </div>

      {/* tablet / desktop grid */}
      <div className="hidden gap-1 md:grid md:grid-cols-2">
        {product.images.map((img, i) => (
          <div key={i} className={i === 0 ? 'col-span-2' : ''}>
            <ProductImage img={img} alt={`${product.name} — ${i + 1}`} priority={i === 0} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Accordion({ items }) {
  const [openKey, setOpenKey] = useState(items[0]?.key);
  return (
    <div className="mt-10 border-t border-[#0A1319]/15">
      {items.map((it) => {
        const open = openKey === it.key;
        return (
          <div key={it.key} className="border-b border-[#0A1319]/15">
            <button
              type="button"
              onClick={() => setOpenKey(open ? null : it.key)}
              aria-expanded={open}
              className="flex w-full items-center justify-between py-5 text-left"
            >
              <span className={`${eyebrow} text-[#0A1319]`}>{it.title}</span>
              <span className="sg-sans text-[16px] font-light leading-none text-[#0A1319]" aria-hidden="true">
                {open ? '−' : '+'}
              </span>
            </button>
            {open && (
              <div className="sg-sans pb-6 text-[12.5px] font-light leading-[1.85] tracking-[0.02em] text-[#0A1319D9]">
                {it.body}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Info({ product }) {
  const [size, setSize] = useState(null);

  useEffect(() => {
    setSize(product.sizes.length === 1 ? product.sizes[0] : null);
  }, [product.slug]);

  const accordions = [
    {
      key: 'description',
      title: 'Description',
      body: (
        <div className="space-y-4">
          {product.description.map((p, i) => (
            <p key={i} className="m-0">
              {p}
            </p>
          ))}
        </div>
      ),
    },
    {
      key: 'details',
      title: 'Details',
      body: (
        <ul className="m-0 list-none space-y-2 p-0">
          {product.details.map((d) => (
            <li key={d} className="flex gap-3">
              <span aria-hidden="true">–</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      ),
    },
    { key: 'fabric', title: 'Fabric', body: <p className="m-0">{product.fabric}</p> },
    { key: 'fit', title: 'Size & fit', body: <p className="m-0">{product.fit}</p> },
    { key: 'care', title: 'Care', body: <p className="m-0">{product.care}</p> },
    {
      key: 'shipping',
      title: 'Shipping & returns',
      body: (
        <p className="m-0">
          Complimentary shipping on orders over $250. Standard delivery takes 3–7 working days. Returns
          are accepted within 14 days of delivery for unworn items in original packaging.
        </p>
      ),
    },
  ];

  return (
    <div>
      <p className={`${eyebrow} m-0 text-[#0A1319D9]`}>{product.category}</p>
      <h1 className="sg-serif m-0 mt-4 text-[34px] font-light uppercase leading-[1.1] tracking-[0.12em] text-[#0A1319] md:text-[38px]">
        {product.name}
      </h1>
      <p className="sg-sans m-0 mt-4 text-[14px] font-normal leading-none tracking-[0.06em] text-[#0A1319]">
        {product.price}
      </p>
      <p className="sg-sans m-0 mt-6 text-[12.5px] font-light leading-[1.85] tracking-[0.02em] text-[#0A1319D9]">
        {product.tagline}
      </p>

      {/* colour */}
      <div className="mt-8 flex items-center gap-3">
        <span className={`${eyebrow} text-[#0A1319D9]`}>Colour</span>
        <span
          className="inline-block h-4 w-4 rounded-full border border-[#0A1319]/30"
          style={{ background: product.swatch }}
          aria-hidden="true"
        />
        <span className={`${eyebrow} text-[#0A1319]`}>{product.colour}</span>
      </div>

      {/* size */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <span className={`${eyebrow} text-[#0A1319D9]`}>Size</span>
          <a href="#" className={`${eyebrow} border-b border-[#0A1319]/70 pb-[3px] text-[#0A1319]`}>
            Size guide
          </a>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {product.sizes.map((s) => {
            const active = size === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={active}
                className={`sg-sans h-11 min-w-[52px] border px-4 text-[11px] font-normal uppercase tracking-[0.1em] transition-colors ${
                  active
                    ? 'border-[#0A1319] bg-[#0A1319] text-white'
                    : 'border-[#0A1319]/25 bg-transparent text-[#0A1319] hover:border-[#0A1319]'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* add to bag — abhi sirf design, cart baad mein */}
      <button
        type="button"
        className="sg-sans mt-8 h-[52px] w-full bg-[#0A1319] text-[10.5px] font-normal uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-85"
      >
        Add to bag
      </button>
      <p className="sg-sans m-0 mt-4 text-center text-[10px] font-light tracking-[0.06em] text-[#0A1319D9]">
        Complimentary shipping on orders over $250
      </p>

      <Accordion key={product.slug} items={accordions} />
    </div>
  );
}

function Related({ current }) {
  const others = PRODUCTS.filter((p) => p.slug !== current.slug);
  return (
    <section className="bg-white px-5 pb-16 pt-14 md:px-20 md:pb-24 md:pt-[72px]">
      <h2 className={`${eyebrow} m-0 text-[#0A1319D9]`}>You may also like</h2>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-12 md:grid-cols-3 md:gap-x-6">
        {others.map((p) => (
          <Link key={p.slug} to={`/products/${p.slug}`} className="group block">
            <ProductImage img={p.images[0]} alt={p.name} />
            <p className="sg-sans m-0 mt-5 text-center text-[8px] font-normal uppercase leading-none tracking-[0.13em] text-[#0A1319D9] md:text-[9px]">
              {p.name}
            </p>
            <p className="sg-sans m-0 mt-3 text-center text-[11px] font-light leading-none tracking-[0.06em] text-[#0A1319]">
              {p.price}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function NotFound() {
  return (
    <div className="px-5 py-32 text-center md:px-20">
      <h1 className="sg-serif m-0 text-[30px] font-light uppercase tracking-[0.2em] text-[#0A1319]">
        Product not found
      </h1>
      <Link to="/home-gallery" className={`${eyebrow} mt-8 inline-block border-b border-[#0A1319]/70 pb-[3px] text-[#0A1319]`}>
        Back to the collection
      </Link>
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const product = PRODUCTS.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="sg-gal min-h-screen bg-[#FFFAF1] text-[#0A1319] antialiased">
      <style>{FONTS_CSS}</style>

      <Header />

      <main>
        {!product ? (
          <NotFound />
        ) : (
          <>
            {/* breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className={`${eyebrow} flex flex-wrap items-center gap-2 px-5 py-6 text-[#0A1319D9] md:px-14`}
            >
              <Link to="/home-gallery" className="hover:opacity-60">Home</Link>
              <span aria-hidden="true">/</span>
              <span>{product.category}</span>
              <span aria-hidden="true">/</span>
              <span className="text-[#0A1319]">{product.name}</span>
            </nav>

            <section className="grid grid-cols-1 gap-8 pb-16 md:px-14 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_460px] xl:gap-20">
              <Gallery product={product} />
              <div className="px-5 md:px-0 lg:sticky lg:top-24 lg:self-start">
                <Info product={product} />
              </div>
            </section>

            <Related current={product} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}