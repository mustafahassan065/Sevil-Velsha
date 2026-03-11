// src/App.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ARCHIVE_ITEMS = [
  { title: 'Minimal Luxury', img: '/images/archive1.jpg' },
  { title: 'Regenerative Craft', img: '/images/archive3.jpg' },
  { title: 'Couture as Ritual', img: '/images/archive2.jpg' },
];

const SEARCH_INDEX = [
  { title: 'Ocean Couture, Documented',          type: 'Hero',             desc: 'The opening tagline of Seagloré.',                                         scrollTo: 'hero' },
  { title: 'Limited Digital Editorial Archive',  type: 'Hero',             desc: 'Seagloré is a limited digital editorial archive.',                          scrollTo: 'hero' },
  { title: 'Season 0: Seafoam Birth',            type: 'Digital Editorial',desc: '84-page digital editorial. Private archive entry. $48.',                   scrollTo: 'editorial-section' },
  { title: 'Seafoam Birth',                      type: 'Digital Editorial',desc: 'Season 0 — the first Seagloré editorial.',                                 scrollTo: 'editorial-section' },
  { title: 'Digital Exclusive',                  type: 'Product Tag',      desc: 'Season 0 is a digital-only release.',                                       scrollTo: 'editorial-section' },
  { title: '84 Pages',                           type: 'Product Detail',   desc: 'Season 0: Seafoam Birth is 84 pages long.',                                 scrollTo: 'editorial-section' },
  { title: 'Private Archive Entry',              type: 'Access',           desc: 'Editorial access is private. Request access to enter.',                     scrollTo: 'editorial-section' },
  { title: '$48',                                type: 'Pricing',          desc: 'Season 0: Seafoam Birth — $48 digital editorial.',                          scrollTo: 'editorial-section' },
  { title: 'Access The Editorial',               type: 'Action',           desc: 'Purchase access to Season 0: Seafoam Birth.',                               scrollTo: 'editorial-section', modal: true },
  { title: 'Fashion Has Always Looked To Paris', type: 'Quote',            desc: 'Seagloré\'s founding contrast — Paris vs the Ocean.',                      scrollTo: 'quote-section' },
  { title: 'Seagloré Looks To The Ocean',        type: 'Quote',            desc: 'The core vision statement of Seagloré.',                                    scrollTo: 'quote-section' },
  { title: 'Seagloré Studies',                   type: 'Section',          desc: '"Water As Structure. Not Symbol." — the editorial study series.',           scrollTo: 'studies-section' },
  { title: 'Water As Structure',                 type: 'Concept',          desc: 'Core editorial concept — water as form, not symbol. From Seagloré Studies.',scrollTo: 'studies-section' },
  { title: 'Seagloré Academy',                   type: 'Section',          desc: 'Where nature is studied before it becomes form.',                           scrollTo: 'academy-section' },
  { title: 'Where Nature Is Studied',            type: 'Academy',          desc: 'Seagloré Academy — nature studied before it becomes form.',                 scrollTo: 'academy-section' },
  { title: 'Perception Training',                type: 'Concept',          desc: 'Not trend education — Seagloré Academy trains how you perceive.',           scrollTo: 'academy-section' },
  { title: 'Not Trend Education',                type: 'Concept',          desc: 'Seagloré Academy\'s philosophy — perception training, not trends.',         scrollTo: 'academy-section' },
  { title: 'Enter Academy',                      type: 'Action',           desc: 'Request access to Seagloré Academy.',                                       scrollTo: 'academy-section', modal: true },
  { title: 'From The Archive',                   type: 'Section',          desc: 'Selected archive essays — available with editorial purchase.',              scrollTo: 'archive' },
  { title: 'Minimal Luxury',                     type: 'Archive Essay',    desc: 'Archive essay — available with editorial access.',                          scrollTo: 'archive' },
  { title: 'Regenerative Craft',                 type: 'Archive Essay',    desc: 'Archive essay — available with editorial access.',                          scrollTo: 'archive' },
  { title: 'Couture as Ritual',                  type: 'Archive Essay',    desc: 'Archive essay — available with editorial access.',                          scrollTo: 'archive' },
  { title: 'Archive Only',                       type: 'Access',           desc: 'These essays are exclusively inside the editorial archive.',                scrollTo: 'archive' },
  { title: 'Sevil Velsha',                       type: 'Founder',          desc: 'Founder & Creative Director of Seagloré.',                                  scrollTo: 'founder-section' },
  { title: 'Founder & Creative Director',        type: 'Founder',          desc: 'Sevil Velsha — Founder & Creative Director of Seagloré.',                  scrollTo: 'founder-section' },
  { title: 'Couture and Ecology',                type: 'Quote',            desc: '"Couture and ecology as inevitability" — Sevil Velsha.',                    scrollTo: 'founder-section' },
  { title: 'Creative Direction',                 type: 'Discipline',       desc: 'One of Sevil Velsha\'s core creative disciplines.',                         scrollTo: 'founder-section' },
  { title: 'Environmental Storytelling',         type: 'Discipline',       desc: 'One of Sevil Velsha\'s core creative disciplines.',                         scrollTo: 'founder-section' },
  { title: 'Voice Research',                     type: 'Discipline',       desc: 'One of Sevil Velsha\'s core creative disciplines.',                         scrollTo: 'founder-section' },
  { title: 'Future Editions',                    type: 'Section',          desc: 'Additional editorial releases entering the archive over time.',             scrollTo: 'future-editions' },
  { title: 'Small Run. Slow Release.',           type: 'Tagline',          desc: 'Future Editions — limited, slow editorial releases.',                       scrollTo: 'future-editions' },
  { title: 'Small Run',                          type: 'Tagline',          desc: 'Future Editions are produced in small runs.',                               scrollTo: 'future-editions' },
  { title: 'Slow Release',                       type: 'Tagline',          desc: 'Seagloré releases editorials slowly over time.',                            scrollTo: 'future-editions' },
  { title: 'Request Access',                     type: 'Action',           desc: 'Submit your email to request archive access.',                              scrollTo: 'footer-section', modal: true },
  { title: 'Contact',                            type: 'Info',             desc: 'info@seaglore.com — for all inquiries.',                                    scrollTo: 'footer-section' },
  { title: 'info@seaglore.com',                  type: 'Contact',          desc: 'Seagloré contact email.',                                                   scrollTo: 'footer-section' },
  { title: 'We Send Beauty, Not Clutter',        type: 'Tagline',          desc: 'Seagloré\'s email philosophy.',                                             scrollTo: 'footer-section' },
];

const API_URL = import.meta.env.DEV
  ? 'http://localhost:3001/api/send-email'
  : '/api/send-email';

const CONTACT_API_URL = import.meta.env.DEV
  ? 'http://localhost:3001/api/send-contact'
  : '/api/send-contact';

// ── Atelier URL — apna actual Atelier page ka URL yahan set karein ──


function App() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessSubmitted, setAccessSubmitted] = useState(false);
  const [accessError, setAccessError] = useState(false);
  const [modalEmail, setModalEmail] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [modalError, setModalError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [showContactModal, setShowContactModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sendEmail = async (emailAddress) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailAddress }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Server error');
    }
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data;
  };

  const handleRequestAccess = async () => {
    if (!email.trim()) return;
    setAccessError(false);
    try {
      await sendEmail(email.trim());
      setAccessSubmitted(true);
      setEmail('');
      setTimeout(() => setAccessSubmitted(false), 3000);
    } catch (err) {
      console.error('Footer email error:', err);
      setAccessError(true);
      setTimeout(() => setAccessError(false), 3000);
    }
  };

  const handleModalSubmit = async () => {
    if (!modalEmail.trim()) return;
    setModalSubmitting(true);
    setModalError('');
    try {
      await sendEmail(modalEmail.trim());
      setModalSubmitted(true);
      setModalEmail('');
      setTimeout(() => {
        setModalSubmitted(false);
        setShowAccessModal(false);
      }, 3000);
    } catch (err) {
      console.error('Modal email error:', err);
      setModalError('Something went wrong. Please try again.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleContactSubmit = async () => {
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setContactError('Please fill in all fields.');
      return;
    }
    setContactSubmitting(true);
    setContactError('');
    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: contactName.trim(), email: contactEmail.trim(), message: contactMessage.trim() }),
      });
      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      setContactSubmitted(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setTimeout(() => {
        setContactSubmitted(false);
        setShowContactModal(false);
      }, 3000);
    } catch (err) {
      console.error('Contact email error:', err);
      setContactError('Something went wrong. Please try again.');
    } finally {
      setContactSubmitting(false);
    }
  };

  const closeContactModal = () => {
    setShowContactModal(false);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setContactSubmitted(false);
    setContactError('');
  };

  const scrollToEditorial = () => {
    setShowArchive(false);
    setShowSearch(false);
    setShowAccessModal(false);
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById('editorial-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const scrollToArchive = () => {
    setShowArchive(false);
    setShowSearch(false);
    setShowAccessModal(false);
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // ── Atelier page par navigate karna ──
  const openAtelier = () => {
    navigate('/atelier');
  };

  const searchResults = searchQuery.trim()
    ? SEARCH_INDEX.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchResultClick = (item) => {
    setShowSearch(false);
    setSearchQuery('');
    setTimeout(() => {
      document.getElementById(item.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
      if (item.modal) setShowAccessModal(true);
    }, 100);
  };

  const closeModal = () => {
    setShowAccessModal(false);
    setModalEmail('');
    setModalSubmitted(false);
    setModalError('');
  };

  const typeBadgeColor = (type) => {
    if (type === 'Archive Essay')    return 'rgba(190,158,80,0.85)';
    if (type === 'Digital Editorial' || type === 'Pricing') return '#c9a84c';
    if (type === 'Section')          return '#9aa5b4';
    if (type === 'Concept')          return '#9a8a6a';
    if (type === 'Founder' || type === 'Discipline') return '#7a9e7a';
    if (type === 'Action')           return '#aaa';
    return 'rgba(255,255,255,0.35)';
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── ARCHIVE MODAL ── */}
      {showArchive && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 sm:p-6" onClick={() => setShowArchive(false)}>
          <div className="bg-white max-w-2xl w-full p-6 sm:p-10 relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-xs tracking-widest uppercase" onClick={() => setShowArchive(false)}>✕ Close</button>
            <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">The Archive</p>
            <h2 className="text-2xl sm:text-3xl font-serif italic mb-6 text-black">Selected Works</h2>
            <div className="space-y-4">
              {ARCHIVE_ITEMS.map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div>
                    <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">Essay {String(i + 1).padStart(2, '0')}</p>
                    <p className="font-serif italic text-base" style={{ color: '#9a8a6a' }}>{item.title}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ml-4" style={{ backgroundColor: 'rgba(190,158,80,0.88)' }}>
                    <svg width="8" height="10" viewBox="0 0 13 15" fill="none">
                      <rect x="0.5" y="6.5" width="12" height="8" rx="1.5" fill="white"/>
                      <path d="M3.5 6.5V4.5C3.5 2.84 4.84 1.5 6.5 1.5C8.16 1.5 9.5 2.84 9.5 4.5V6.5" stroke="white" strokeWidth="1.4" fill="none"/>
                    </svg>
                  </div>
                </div>
              ))}
              {['Water As Structure', 'Ocean Couture Manifesto'].map((title, i) => (
                <div key={i + 3} className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div>
                    <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">Essay {String(i + 4).padStart(2, '0')}</p>
                    <p className="font-serif italic text-base" style={{ color: '#9a8a6a' }}>{title}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ml-4" style={{ backgroundColor: 'rgba(190,158,80,0.88)' }}>
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

      {/* ── SEARCH MODAL ── */}
      {showSearch && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-start justify-center pt-24 sm:pt-32 p-4 sm:p-6"
          onClick={() => { setShowSearch(false); setSearchQuery(''); }}
        >
          <div className="w-full max-w-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 border-b border-white/40 pb-4 mb-8">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Seagloré..."
                className="flex-1 text-white text-base sm:text-lg bg-transparent focus:outline-none placeholder-white/40"
                style={{ letterSpacing: '0.05em' }}
              />
              <button
                onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                className="text-white/60 text-xs tracking-widest uppercase flex-shrink-0"
              >✕</button>
            </div>
            {searchQuery.trim() && (
              <div className="space-y-1">
                {searchResults.length > 0 ? (
                  searchResults.map((item, i) => (
                    <div
                      key={i}
                      className="group flex items-start gap-4 px-3 py-3 cursor-pointer hover:bg-white/5 transition-colors rounded"
                      onClick={() => handleSearchResultClick(item)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-0.5 flex-wrap">
                          <p className="text-white text-sm tracking-wide group-hover:text-white/80 transition-colors">{item.title}</p>
                          <span className="text-xs tracking-widest uppercase flex-shrink-0" style={{ color: typeBadgeColor(item.type) }}>{item.type}</span>
                        </div>
                        <p className="text-white/35 text-xs tracking-wide leading-relaxed">{item.desc}</p>
                      </div>
                      <svg className="flex-shrink-0 mt-1 opacity-30 group-hover:opacity-70 transition-opacity" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  ))
                ) : (
                  <p className="text-white/40 text-xs tracking-widest italic px-3">No results found.</p>
                )}
              </div>
            )}
            {!searchQuery.trim() && (
              <div className="space-y-6">
                <div>
                  <p className="text-white/30 text-xs tracking-widest uppercase mb-3">Sections</p>
                  <div className="space-y-2">
                    {SEARCH_INDEX.filter(i => i.type === 'Section').map((item, i) => (
                      <div key={i} className="text-white/45 text-sm tracking-widest hover:text-white/80 cursor-pointer transition-colors px-1" onClick={() => handleSearchResultClick(item)}>
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-white/30 text-xs tracking-widest uppercase mb-3">Archive Essays</p>
                  <div className="space-y-2">
                    {SEARCH_INDEX.filter(i => i.type === 'Archive Essay').map((item, i) => (
                      <div key={i} className="text-white/45 text-sm tracking-widest hover:text-white/80 cursor-pointer transition-colors px-1" onClick={() => handleSearchResultClick(item)}>
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-white/30 text-xs tracking-widest uppercase mb-3">Concepts & People</p>
                  <div className="space-y-2">
                    {SEARCH_INDEX.filter(i => ['Concept', 'Founder', 'Discipline', 'Tagline', 'Quote'].includes(i.type)).map((item, i) => (
                      <div key={i} className="text-white/45 text-sm tracking-widest hover:text-white/80 cursor-pointer transition-colors px-1" onClick={() => handleSearchResultClick(item)}>
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ACCESS MODAL ── */}
      {showAccessModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 sm:p-6" onClick={closeModal}>
          <div className="bg-white max-w-md w-full p-6 sm:p-10 relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-xs tracking-widest uppercase" onClick={closeModal}>✕ Close</button>
            <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">Request Access</p>
            <h2 className="text-xl sm:text-2xl font-serif italic mb-6 text-black">Enter The Archive</h2>
            {modalSubmitted ? (
              <div className="text-center py-8">
                <p className="text-xs tracking-widest uppercase text-gray-500 mb-2">Request Submitted ✓</p>
                <p className="font-serif italic text-gray-400 text-sm">We'll be in touch soon.</p>
              </div>
            ) : (
              <>
                <div className="border-b border-gray-300 pb-2 mb-4">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={modalEmail}
                    onChange={e => setModalEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleModalSubmit()}
                    className="w-full text-sm bg-transparent focus:outline-none text-gray-600 placeholder-gray-400"
                    style={{ letterSpacing: '0.02em' }}
                  />
                </div>
                {modalError && (
                  <p className="text-xs text-red-400 tracking-wide mb-3 italic">{modalError}</p>
                )}
                <button
                  className="w-full py-4 bg-black text-white text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-50"
                  onClick={handleModalSubmit}
                  disabled={modalSubmitting}
                >
                  {modalSubmitting ? 'Submitting...' : 'Request Access'}
                </button>
              </>
            )}
            <p className="text-xs text-gray-400 italic text-center mt-4">"We send beauty, not clutter."</p>
          </div>
        </div>
      )}

      {/* ── CONTACT MODAL ── */}
      {showContactModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 sm:p-6" onClick={closeContactModal}>
          <div className="bg-white max-w-md w-full p-6 sm:p-10 relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-xs tracking-widest uppercase" onClick={closeContactModal}>✕ Close</button>
            <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">Get In Touch</p>
            <h2 className="text-xl sm:text-2xl font-serif italic mb-6 text-black">Contact Us</h2>
            {contactSubmitted ? (
              <div className="text-center py-8">
                <p className="text-xs tracking-widest uppercase text-gray-500 mb-2">Message Sent ✓</p>
                <p className="font-serif italic text-gray-400 text-sm">We'll be in touch soon.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <div className="border-b border-gray-300 pb-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      className="w-full text-sm bg-transparent focus:outline-none text-gray-600 placeholder-gray-400"
                      style={{ letterSpacing: '0.02em' }}
                    />
                  </div>
                  <div className="border-b border-gray-300 pb-2">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      className="w-full text-sm bg-transparent focus:outline-none text-gray-600 placeholder-gray-400"
                      style={{ letterSpacing: '0.02em' }}
                    />
                  </div>
                  <div className="border-b border-gray-300 pb-2">
                    <textarea
                      placeholder="Your message..."
                      value={contactMessage}
                      onChange={e => setContactMessage(e.target.value)}
                      rows={4}
                      className="w-full text-sm bg-transparent focus:outline-none text-gray-600 placeholder-gray-400 resize-none"
                      style={{ letterSpacing: '0.02em' }}
                    />
                  </div>
                </div>
                {contactError && (
                  <p className="text-xs text-red-400 tracking-wide mb-3 italic">{contactError}</p>
                )}
                <button
                  className="w-full py-4 bg-black text-white text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-50"
                  onClick={handleContactSubmit}
                  disabled={contactSubmitting}
                >
                  {contactSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </>
            )}
            <p className="text-xs text-gray-400 italic text-center mt-4">"We send beauty, not clutter."</p>
          </div>
        </div>
      )}

      {/* ── MOBILE MENU ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-white flex flex-col pt-24 px-8 pb-10">
          <button
            className="absolute top-5 right-6 text-xs tracking-widest uppercase font-bold"
            onClick={() => setMobileMenuOpen(false)}
          >
            ✕ Close
          </button>
          <div
            className="flex items-center gap-3 border border-gray-300 px-4 py-3 mb-8 cursor-pointer"
            onClick={() => { setMobileMenuOpen(false); setShowSearch(true); }}
          >
            <input
              type="text"
              placeholder="SEARCH"
              className="text-xs font-bold tracking-widest uppercase bg-transparent focus:outline-none flex-1 placeholder-gray-500 cursor-pointer"
              readOnly
            />
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <nav className="flex flex-col gap-8">
            <button
              className="text-left text-2xl font-black uppercase tracking-widest text-black border-b border-gray-100 pb-6"
              onClick={scrollToEditorial}
            >
              Editorial
            </button>
            <button
              className="text-left text-2xl font-black uppercase tracking-widest text-black border-b border-gray-100 pb-6"
              onClick={scrollToArchive}
            >
              Archive
            </button>
            {/* ── Seagloré Atelier — Mobile Menu ── */}
            <button
              className="text-left text-2xl font-black uppercase tracking-widest border-b border-gray-100 pb-6"
              style={{ color: '#c9a84c' }}
              onClick={() => { setMobileMenuOpen(false); openAtelier(); }}
            >
              Seagloré Atelier
            </button>
            <button
              className="text-left text-2xl font-black uppercase tracking-widest text-black border-b border-gray-100 pb-6"
              onClick={() => { setMobileMenuOpen(false); setShowAccessModal(true); }}
            >
              Request Access
            </button>
          </nav>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 md:px-16 py-4 sm:py-5 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
        }}
      >
        <div
          className="cursor-pointer flex-shrink-0"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src="/images/logo.png"
            alt="Seagloré"
            style={{ width: '100px', height: '28px', objectFit: 'cover' }}
          />
        </div>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <div
            className="flex items-center justify-between bg-white font-bold gap-2 px-3 py-1.5 transition-all duration-300 cursor-pointer"
            style={{ border: `1px solid ${scrolled ? '#cccccc' : 'white'}`, width: '230px', minWidth: '230px' }}
            onClick={() => setShowSearch(true)}
          >
            <input
              type="text"
              placeholder="SEARCH"
              className="text-xs font-bold tracking-widest uppercase bg-transparent focus:outline-none flex-1 placeholder-current cursor-pointer"
              style={{ color: scrolled ? '#666' : '#000000' }}
              readOnly
            />
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke={scrolled ? '#666' : '#000000'} strokeWidth="2" style={{ flexShrink: 0, display: 'block' }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>

          <button
            className="text-xs font-bold tracking-widest uppercase transition-colors duration-300 hover:opacity-70"
            style={{ color: scrolled ? '#111' : '#000000' }}
            onClick={scrollToEditorial}
          >Editorial</button>

          <button
            className="text-xs font-bold tracking-widest uppercase transition-colors duration-300 hover:opacity-70"
            style={{ color: scrolled ? '#111' : '#000000' }}
            onClick={scrollToArchive}
          >Archive</button>

          {/* ── Seagloré Atelier — Desktop Navbar ── */}
          <button
            className="text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-70 px-3 py-1.5"
            style={{ color: '#c9a84c', border: '1px solid #c9a84c' }}
            onClick={openAtelier}
          >
            Seagloré Atelier
          </button>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <span className="block w-6 h-0.5" style={{ backgroundColor: scrolled ? '#111' : '#000' }}></span>
          <span className="block w-6 h-0.5" style={{ backgroundColor: scrolled ? '#111' : '#000' }}></span>
          <span className="block w-6 h-0.5" style={{ backgroundColor: scrolled ? '#111' : '#000' }}></span>
        </button>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="relative h-screen w-full overflow-hidden">
        <video className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline>
          <source src="/images/HeroSection.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/15"></div>
        <div className="relative z-10 h-full flex flex-col justify-end px-5 sm:px-8 md:px-16 pb-12 sm:pb-16">
          <p className="text-white/90 text-sm sm:text-base italic tracking-wide mb-3">Ocean Couture, Documented</p>
          <h1 className="font-serif leading-none mb-4" style={{ fontSize: 'clamp(3.5rem, 12vw, 7.5rem)' }}>
            <span className="text-white">SEAGL</span><span className="text-white/40">ORÉ</span>
          </h1>
          <p className="text-white/80 text-xs sm:text-base tracking-widest uppercase mb-8 flex items-center gap-3">
            <span className="border-l border-white/50 pl-3">A Limited Digital Editorial Archive.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <button className="text-white text-xs font-bold tracking-widest uppercase underline underline-offset-4 hover:text-white/70 transition-colors text-left" onClick={scrollToEditorial}>
              View The First Edition
            </button>
            <button className="text-white text-xs font-bold tracking-widest uppercase underline underline-offset-4 hover:text-white/70 transition-colors text-left" onClick={scrollToArchive}>
              Enter The Archive
            </button>
          </div>
        </div>
      </section>

      {/* ── PRODUCT / EDITORIAL SECTION ── */}
      <section id="editorial-section" className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative overflow-hidden" style={{ minHeight: '340px' }}>
            <video className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline>
              <source src="/images/ModeliingCates2.mp4" type="video/mp4" />
            </video>
            <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs px-3 py-1 tracking-widest uppercase font-semibold z-10">
              Digital Exclusive
            </div>
          </div>
          <div className="px-6 sm:px-10 md:px-16 py-10 sm:py-16 flex flex-col justify-center font-bold space-y-6 sm:space-y-8 bg-white">
            <div>
              <p className="text-sm tracking-widest uppercase font-bold text-gray-400 mb-4">Product Title</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-sans" style={{ color: '#c9a84c' }}>Season 0:</h2>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-black">Seafoam Birth</h2>
            </div>
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex justify-between">
                <span className="text-black uppercase tracking-widest text-xs font-bold">Format</span>
                <span className="italic text-gray-700 text-sm">Digital Editorial</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black uppercase tracking-widest text-xs font-bold">Length</span>
                <span className="italic text-gray-700 text-sm">84 Pages</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black uppercase tracking-widest text-xs font-bold">Access</span>
                <span className="italic text-gray-700 text-sm">Private archive entry</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 flex-wrap gap-4">
              <span className="text-4xl font-serif">$48</span>
              <button className="px-6 sm:px-8 py-4 bg-black text-white text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors" onClick={() => setShowAccessModal(true)}>
                Access The Editorial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE SECTION ── */}
      <section id="quote-section" style={{ backgroundColor: '#ede8df' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: '420px' }}>
          <div className="flex flex-col justify-center space-y-5 sm:space-y-6 px-6 sm:px-8 md:px-16 py-14 sm:py-20">
            <div className="w-10 h-0.5 bg-black"></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight text-black">
              Fashion Has Always<br />Looked To Paris.
            </h2>
            <p className="text-2xl sm:text-3xl md:text-4xl font-serif italic leading-snug" style={{ color: '#9aa5b4' }}>
              Seagloré Looks To The<br />Ocean.
            </p>
            <p className="text-xs tracking-widest uppercase font-bold text-gray-400">— Ocean Couture For A Living Planet</p>
          </div>
          <div className="relative overflow-hidden" style={{ minHeight: '320px' }}>
            <video className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline>
              <source src="/images/ModelingOcean.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* ── STUDIES SECTION ── */}
      <section id="studies-section" className="py-14 sm:py-20 px-5 sm:px-8 md:px-16 lg:px-24 bg-white">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-sm tracking-widest uppercase text-gray-400 mb-4 font-medium">Seagloré Studies</p>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif italic text-black">"Water As Structure. Not Symbol."</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {['symbol1', 'symbol2', 'symbol3'].map(s => (
            <div key={s} className="overflow-hidden bg-gray-100" style={{ aspectRatio: '1/1' }}>
              <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                <source src={`/images/${s}.mp4`} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>
      </section>

      {/* ── ACADEMY SECTION ── */}
      <section id="academy-section" className="py-16 sm:py-24 px-5 sm:px-8 md:px-16 lg:px-24 text-center" style={{ backgroundColor: '#ede8df' }}>
        <p className="text-xs tracking-widest uppercase font-bold mb-6">Seagloré Academy</p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-5 leading-tight text-black">
          Where nature is studied<br />before it becomes form.
        </h2>
        <p className="text-xs tracking-widest uppercase leading-loose mb-10 font-bold">
          Not Trend Education.<br />Perception Training.
        </p>
        <button className="text-xs tracking-widest uppercase border-b border-black font-bold pb-1 hover:opacity-60 transition-opacity" onClick={() => setShowAccessModal(true)}>
          Enter Academy
        </button>
      </section>

      {/* ── ARCHIVE SECTION ── */}
      <section id="archive" className="py-14 sm:py-20 px-5 sm:px-8 md:px-16 lg:px-24 bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-10 sm:mb-12">
          <h3 className="text-2xl sm:text-3xl font-serif italic">From the Archive</h3>
          <p className="text-xs text-gray-500 font-bold sm:max-w-xs sm:text-right tracking-widest uppercase leading-relaxed">
            Selected essays are available inside the<br />Editorial Archive.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {ARCHIVE_ITEMS.map((item, index) => (
            <div key={index} className="group cursor-pointer" onClick={() => setShowAccessModal(true)}>
              <div className="overflow-hidden bg-gray-200 mb-4 relative" style={{ aspectRatio: '4/3.5' }}>
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  style={{ filter: 'grayscale(100%) blur(7.5px)', transform: 'scale(1.1)' }}
                />
                <div className="absolute inset-0 bg-black/15"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: 'white' }}>
                    <svg width="11" height="13" viewBox="0 0 13 15" fill="none">
                      <rect x="0.5" y="6.5" width="12" height="8" rx="1.5" fill="rgba(190,158,80,0.82)"/>
                      <path d="M3.5 6.5V4.5C3.5 2.84 4.84 1.5 6.5 1.5C8.16 1.5 9.5 2.84 9.5 4.5V6.5" stroke="rgba(190,158,80,0.82)" strokeWidth="1.4" fill="none"/>
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-sm tracking-widest uppercase font-bold text-black mb-1">Archive Only</p>
              <p className="font-serif italic text-sm font-bold" style={{ color: 'gray' }}>{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOUNDER SECTION ── */}
      <section id="founder-section" className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative overflow-hidden" style={{ minHeight: '400px' }}>
            <img src="/images/about.png" alt="Sevil Velsha" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="px-6 sm:px-10 md:px-16 py-12 sm:py-16 flex flex-col justify-center space-y-6" style={{ backgroundColor: '#dce8dc' }}>
            <div>
              <p className="text-sm tracking-widest uppercase mb-3 font-bold">Founder & Creative Director</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight" style={{ color: '#c9a84c', textDecoration: 'underline', textUnderlineOffset: '6px' }}>
                Sevil Velsha
              </h2>
            </div>
            <blockquote className="text-lg sm:text-xl md:text-2xl font-serif font-bold italic leading-relaxed text-black">
              "Seagloré is a study in how couture and ecology can coexist not as contradiction, but as inevitability."
            </blockquote>
            <div className="space-y-1.5 text-xs tracking-widest uppercase pt-2">
              <p>Creative Direction</p>
              <p>Environmental Storytelling</p>
              <p>Voice Research</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FUTURE EDITIONS ── */}
      <section id="future-editions" className="pt-12 sm:pt-16 pb-6 px-5 sm:px-8 md:px-16 lg:px-24 bg-white">
        <h2 className="font-black uppercase leading-none mb-6 sm:mb-8 text-black" style={{ fontSize: 'clamp(3rem, 12vw, 9rem)', letterSpacing: '-0.02em' }}>
          Future<br />Editions
        </h2>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
          <p className="text-sm font-bold tracking-widest uppercase leading-relaxed">
            Additional editorial releases will enter the<br />archive over time.
          </p>
          <div className="border border-gray-200 bg-gray-200 px-4 py-2">
            <p className="text-xs tracking-widest uppercase font-bold">Small Run. Slow Release.</p>
          </div>
        </div>
        <div className="border-t-2 border-black"></div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="footer-section" className="py-10 px-5 sm:px-8 md:px-16 lg:px-24 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="pt-2">
            <p className="text-sm tracking-widest uppercase font-bold text-gray-500">© 2026 Seagloré. Ocean Couture.</p>
          </div>
          <div className="w-full md:w-1/2 space-y-3">

            {/* ── Seagloré Atelier — Footer ── */}
            <button
              onClick={openAtelier}
              className="group flex items-center gap-3 px-5 py-3 hover:opacity-80 transition-opacity duration-200"
              style={{ border: '1px solid #c9a84c' }}
            >
              <span className="text-sm font-black uppercase tracking-widest" style={{ color: '#c9a84c' }}>Seagloré Atelier</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            <button
              onClick={() => setShowContactModal(true)}
              className="group flex items-center gap-3 border border-black px-5 py-3 hover:bg-black transition-colors duration-200"
            >
              <span className="text-sm font-black uppercase tracking-widest text-black group-hover:text-white transition-colors duration-200">Contact Us</span>
              <svg className="text-black group-hover:text-white transition-colors duration-200" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            <p className="text-sm text-gray-600">
              For inquiries, please contact us at: <span className="text-black">info@seaglore.com</span>
            </p>
            <div className="border-t border-gray-200 pt-3 mt-3">
              <h4 className="text-base font-black uppercase tracking-widest text-black mb-2">Request Access</h4>
              <div className="flex items-end gap-3 border-b border-gray-400 pb-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleRequestAccess()}
                  className="flex-1 text-sm bg-transparent focus:outline-none text-gray-500 placeholder-gray-400 min-w-0"
                  style={{ letterSpacing: '0.02em' }}
                />
                <button
                  className="text-xs tracking-widest uppercase text-black hover:text-gray-600 transition-colors whitespace-nowrap flex-shrink-0"
                  onClick={handleRequestAccess}
                >
                  {accessSubmitted ? '[ Submitted ✓ ]' : accessError ? '[ Try Again ]' : '[ Request Access ]'}
                </button>
              </div>
              <p className="text-xs text-gray-400 italic text-right">"We send beauty, not clutter."</p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;