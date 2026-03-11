import React, { useState } from 'react';
import './App.css';

const imgImageAbstractWaveTexture = "/images/wave.png";
const imgImage = "/images/ethos.png";
const imgImage1 = "/images/atelier.png";
const imgImage2 = "/images/study-1.png";
const imgImage3 = "/images/study-2.png";
const imgImage4 = "/images/study-3.png";
const imgIcon = "/images/icon.png";

export default function App() {
  const [inquirySent, setInquirySent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare form data for backend submission
    const contactData = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      subject: "Private Showing Inquiry",
      submittedAt: new Date().toISOString(),
    };
    
    try {
      // TODO: Replace with actual backend API endpoint when ready
      console.log('Form submitted:', contactData);
      
      // Close modal and show success notification
      setShowModal(false);
      setFormData({ name: '', email: '', message: '' });
      setInquirySent(true);
      setTimeout(() => setInquirySent(false), 3000);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full overflow-x-hidden bg-white min-h-screen flex flex-col items-center font-serif">
      {/* Inquiry Notification */}
      <div className={`fixed top-16 right-8 z-[60] bg-[#3a414d] text-white px-8 py-4 shadow-2xl transition-all duration-500 transform ${inquirySent ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <p className="text-[10px] tracking-[3px] uppercase">Message submitted successfully!</p>
      </div>

      {/* Private Showing Modal */}
      <div className={`fixed inset-0 z-[100] bg-[#3a414d]/80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-500 ${showModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`bg-white p-10 md:p-16 max-w-[600px] w-full shadow-2xl relative transform transition-transform duration-500 ${showModal ? 'translate-y-0' : 'translate-y-8'}`}>
          <button 
            type="button"
            onClick={() => setShowModal(false)}
            className="absolute top-6 right-6 text-[#8a95a5] hover:text-[#3a414d] text-[24px] leading-none"
          >
            &times;
          </button>
          <h3 className="font-medium text-[#3a414d] text-[24px] mb-2 tracking-[4px] uppercase">Private Showing</h3>
          <p className="text-[#8a95a5] text-[12px] mb-12 tracking-[2px] uppercase">Please fill out the form below. We will review your request and reply shortly.</p>
          
          <form action="https://formspree.io/f/xlgpdovz"
               method="POST"  onSubmit={handleFormSubmit} className="flex flex-col gap-8">
            <input 
              type="text" 
              required 
              placeholder="Your Name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="border-b border-[#e2b6a3]/40 pb-3 text-[12px] tracking-[2px] uppercase text-[#3a414d] outline-none focus:border-[#e2b6a3] transition-colors bg-transparent placeholder:text-[#8a95a5]/50"
            />
            <input 
              type="email" 
              required 
              placeholder="Your Email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="border-b border-[#e2b6a3]/40 pb-3 text-[12px] tracking-[2px] uppercase text-[#3a414d] outline-none focus:border-[#e2b6a3] transition-colors bg-transparent placeholder:text-[#8a95a5]/50"
            />
            <textarea 
              required 
              placeholder="Message" 
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="border-b border-[#e2b6a3]/40 pb-3 text-[12px] tracking-[2px] uppercase text-[#3a414d] outline-none focus:border-[#e2b6a3] transition-colors bg-transparent placeholder:text-[#8a95a5]/50 resize-none"
            />
            <button 
              type="submit"
              className="bg-[#3a414d] text-white font-medium text-[11px] tracking-[5px] uppercase py-5 mt-4 hover:bg-[#2c323b] transition-all"
            >
              Submit Message
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-col items-start relative w-full overflow-hidden" data-name="SEAGLORÉ">
        
        {/* Navigation */}
        <nav className="absolute top-0 left-0 w-full h-[100px] z-50 flex items-center justify-between px-12 lg:px-16 bg-transparent">
          <p onClick={() => scrollToSection('hero')} className="font-normal text-[20px] text-white tracking-[6px] uppercase cursor-pointer hover:opacity-70 transition-opacity drop-shadow-md">
            SEAGLORÉ
          </p>
          <div className="hidden md:flex gap-12">
            {[
              { name: 'Atelier', id: 'atelier' },
              { name: 'Archive', id: 'collection' },
              { name: 'Process', id: 'ethos' },
              { name: 'Contact', id: 'contact' }
            ].map(link => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="text-[11px] text-white/90 tracking-[4px] uppercase cursor-pointer hover:text-white transition-opacity drop-shadow-md"
              >
                {link.name}
              </button>
            ))}
          </div>
          {/* Mobile hamburger — properly wired */}
          <button
            className="md:hidden flex flex-col gap-[6px] cursor-pointer p-2"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <div className="w-6 h-[2px] bg-white drop-shadow-md" />
            <div className="w-6 h-[2px] bg-white drop-shadow-md" />
            <div className="w-6 h-[2px] bg-white drop-shadow-md" />
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[90] bg-[#3a414d] flex flex-col pt-24 px-10 pb-10">
            <button
              className="absolute top-6 right-8 text-white text-xs tracking-[4px] uppercase font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              ✕ Close
            </button>
            <p
              onClick={() => { setMobileMenuOpen(false); scrollToSection('hero'); }}
              className="text-[20px] text-white tracking-[6px] uppercase mb-12 cursor-pointer"
            >
              SEAGLORÉ
            </p>
            <nav className="flex flex-col gap-0">
              {[
                { name: 'Atelier', id: 'atelier' },
                { name: 'Archive', id: 'collection' },
                { name: 'Process', id: 'ethos' },
                { name: 'Contact', id: 'contact' }
              ].map(link => (
                <button
                  key={link.name}
                  onClick={() => { setMobileMenuOpen(false); setTimeout(() => scrollToSection(link.id), 100); }}
                  className="text-left text-[28px] text-white/90 tracking-[4px] uppercase border-b border-white/10 py-6 hover:text-white transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <button
                onClick={() => { setMobileMenuOpen(false); setShowModal(true); }}
                className="text-left text-[28px] tracking-[4px] uppercase py-6 mt-2"
                style={{ color: '#e2b6a3' }}
              >
                Request Showing
              </button>
            </nav>
          </div>
        )}

        {/* Hero Section - Height tightly restricted so the section below peeks out naturally */}
        <div id="hero" className="bg-[#f8f8f8] h-[calc(100vh-60px+72px)] min-h-[726px] overflow-hidden relative shrink-0 w-full" data-name="Section">
          <div className="absolute inset-0 opacity-90 overflow-hidden" data-name="Container">
            <img alt="" className="absolute inset-0 object-cover pointer-events-none w-full h-full scale-110" src={imgImageAbstractWaveTexture} />
          </div>
          <div className="absolute inset-0 bg-white/5" data-name="Container" />
          
          <div className="absolute bottom-6 left-12" data-name="Paragraph">
            <p className="font-normal leading-tight text-[#5a5a5a] text-[10px] tracking-[2px] uppercase whitespace-nowrap">
              01.2026 / FORM RESEARCH
            </p>
          </div>

          <div className="relative flex flex-col gap-12 h-full items-center justify-center w-full pt-16" data-name="Container">
            <div className="flex flex-col gap-3 items-center" data-name="Container">
              <h1 className="font-light leading-none text-[#2c2c2c] text-[8vw] lg:text-[88px] text-center tracking-[18px] uppercase whitespace-nowrap animate-in fade-in slide-in-from-bottom-8 duration-1000">
                SEAGLORÉ
              </h1>
              <p className="font-normal leading-tight text-[#5a5a5a] text-[10px] text-center tracking-[4px] uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                Atelier — Where Ocean Becomes COUTURE
              </p>
            </div>
            
            <div className="flex gap-16 items-center animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-500">
              <button 
                onClick={() => scrollToSection('collection')}
                className="border-b border-[#2c2c2c]/50 pb-2 cursor-pointer hover:border-[#2c2c2c] transition-all"
              >
                <p className="font-normal text-[9px] tracking-[4px] uppercase text-[#2c2c2c]">
                  ENTER THE ARCHIVE
                </p>
              </button>
              <button 
                onClick={() => scrollToSection('special-project')}
                className="border-b border-[#2c2c2c]/50 pb-2 cursor-pointer hover:border-[#2c2c2c] transition-all"
              >
                <p className="font-normal text-[9px] tracking-[4px] uppercase text-[#2c2c2c]">
                  OPEN EDITION I
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Ethos Section - Top padding reduced heavily to perfectly align right under the hero wave */}
        <div id="ethos" className="bg-white pt-16 lg:pt-20 pb-32 relative w-full flex justify-center" data-name="Section">
          <div className="max-w-[1280px] w-full px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-4">
                <p className="font-normal text-[#e2b6a3] text-[11px] tracking-[4px] uppercase">
                  Our Ethos
                </p>
                <div className="font-medium leading-[1.15] text-[52px] lg:text-[60px]">
                  <p className="italic text-[#3a414d]">The ocean does not</p>
                  <p className="italic text-[#3a414d]">decorate.</p>
                  <p className="text-[#e2b6a3] mt-2">It shapes.</p>
                </div>
              </div>

              <div className="flex flex-col gap-8 max-w-[500px]">
                <p className="font-normal leading-relaxed text-[#8a95a5] text-[18px]">
                  SEAGLORÉ is not inspired by the ocean. It is structured by it. We study how water moves around stone. How pressure creates form. How repetition never repeats.
                </p>
                <p className="italic font-normal leading-relaxed text-[#3a414d] text-[18px]">
                  {`"Our garments follow the same intelligence — quiet, precise, and intentional."`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-12 pt-12 border-t border-[#e2b6a3]/20">
                {[
                  { title: 'Zero Trends', desc: 'Timeless structural integrity' },
                  { title: 'Manual Speed', desc: 'Crafted at the rate of nature' },
                  { title: 'Pure Form', desc: 'Function follows fluid geometry' },
                  { title: 'Tidal Rhythm', desc: 'Collections aligned with sea cycles' }
                ].map((item) => (
                  <div key={item.title} className="flex flex-col gap-2">
                    <p className="font-normal text-[#3a414d] text-[12px] tracking-[2px] uppercase">{item.title}</p>
                    <p className="font-normal text-[#8a95a5] text-[13px]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative lg:mt-6">
              <div className="relative aspect-[4/3] w-full shadow-2xl overflow-hidden group">
                <img alt="" className="absolute inset-0 object-cover size-full opacity-80 group-hover:scale-105 transition-transform duration-1000" src={imgImage} />
                <div className="absolute inset-0 bg-[#e2b6a3]/5" />
              </div>
              <div className="absolute -left-12 -bottom-12 bg-white p-8 shadow-xl max-w-[200px] flex flex-col gap-2">
                <p className="text-[#e2b6a3] text-[10px] tracking-[2px] uppercase">Ocean Study II</p>
                <p className="italic text-[#3a414d] text-[12px] leading-tight">
                  "The texture of salt-baked linen under morning light."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Atelier Section */}
        <div id="atelier" className="bg-[#f6f2ef] py-32 relative w-full flex justify-center" data-name="Section">
          <div className="max-w-[1280px] w-full px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1 relative aspect-[3/4] shadow-2xl overflow-hidden group">
              <img alt="" className="absolute inset-0 object-cover size-full group-hover:scale-105 transition-transform duration-1000" src={imgImage1} />
              <div className="absolute inset-0 bg-black/5" />
            </div>

            <div className="order-1 lg:order-2 flex flex-col gap-12">
              <div className="flex flex-col gap-4">
                <h2 className="font-normal leading-none text-[#3a414d] text-[72px] tracking-tight">
                  SEAGLORÉ ATELIER
                </h2>
                <p className="italic font-normal text-[#e2b6a3] text-[14px] tracking-[4px] uppercase">
                  Where couture is made slowly.
                </p>
              </div>

              <div className="flex flex-col gap-12">
                {[
                  { id: '01', title: 'Finite Quantities', desc: 'Developing in small, intentional batches to preserve the integrity of the material.' },
                  { id: '02', title: 'Hand Shaping', desc: 'No speed-based production. Every seam is a considered decision made by hand.' },
                  { id: '03', title: 'Body Alignment', desc: 'Garments that adjust to the human form, not mass-market templates.' }
                ].map((item) => (
                  <div key={item.id} className="flex gap-8 group">
                    <div className="size-8 rounded-full border border-[#e2b6a3]/30 flex items-center justify-center shrink-0 group-hover:bg-[#e2b6a3]/10 transition-colors">
                      <p className="text-[#e2b6a3] text-[10px]">{item.id}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h4 className="italic text-[#3a414d] text-[24px] leading-none group-hover:text-[#e2b6a3] transition-colors">{item.title}</h4>
                      <p className="text-[#8a95a5] text-[14px] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-[#e2b6a3]/20 flex justify-between items-center">
                <p className="text-[#8a95a5] text-[12px] tracking-[2px] uppercase">
                  Time is part of the design.
                </p>
                <div onClick={() => scrollToSection('collection')} className="flex items-center gap-2 cursor-pointer group">
                  <p className="font-medium text-[#3a414d] text-[12px] tracking-[4px] uppercase group-hover:opacity-70 transition-opacity">
                    Enter the Archive
                  </p>
                  <img alt="" className="size-4 group-hover:translate-x-1 transition-transform" src={imgIcon} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Section */}
        <div id="collection" className="bg-[#edfaff] py-32 w-full flex justify-center" data-name="Section">
          <div className="max-w-[1280px] w-full px-12">
            <div className="flex justify-between items-end pb-12 border-b border-[#e2b6a3]/20 mb-16">
              <div className="flex flex-col gap-4">
                <p className="font-normal text-[#e2b6a3] text-[12px] tracking-[4px] uppercase">
                  The Collection
                </p>
                <h2 className="font-medium text-[#3a414d] text-[60px] leading-none">
                  Ocean Studies
                </h2>
                <p className="font-normal text-[#e2b6a3] text-[14px] tracking-[3px] uppercase">
                  Limited works. No repetition.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { id: '01', title: 'Ocean Study I', subtitle: 'Raw Linen. Early tide.', img: imgImage2 },
                { id: '02', title: 'Ocean Study II', subtitle: 'Sea Cotton. Wind-cut form.', img: imgImage3 },
                { id: '03', title: 'Tidal Form I', subtitle: 'Silk. Stone-weighted drape.', img: imgImage4 }
              ].map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden relative bg-white">
                    <img alt="" className="absolute inset-0 object-cover size-full opacity-80 blur-[1px] group-hover:scale-105 group-hover:blur-0 transition-all duration-700" src={item.img} />
                    <div className="absolute top-6 left-6 flex flex-col items-center gap-2">
                      <p className="text-[#e2b6a3] text-[10px]">{item.id}</p>
                      <div className="w-px h-8 bg-[#e2b6a3]/30" />
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col gap-2">
                    <h4 className="font-medium text-[24px] text-[#3a414d] group-hover:text-[#e2b6a3] transition-colors">{item.title}</h4>
                    <p className="text-[#e2b6a3] text-[12px] tracking-[2px] uppercase">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tide Project Section */}
        <div id="special-project" className="bg-[#f4f2ea] py-32 relative w-full overflow-hidden flex justify-center" data-name="Section">
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <p className="text-[30vw] leading-none text-black select-none">TIDE</p>
          </div>
          <div className="relative z-10 flex flex-col items-center max-w-[1280px] w-full px-12">
            <div className="border border-[#e2b6a3] rounded-full px-8 py-3 mb-8">
              <p className="font-bold text-[10px] text-[#e2b6a3] tracking-[5px] uppercase">Special Project</p>
            </div>
            <h2 className="font-medium text-[6vw] lg:text-[96px] text-[#3a414d] text-center mb-4">Tide-Adjusted Pieces</h2>
            <p className="text-[14px] text-[#e2b6a3] tracking-[8px] uppercase mb-24 text-center">Capsule Collection 01</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full mb-24">
              {['Silk-Cotton Matrix', 'Dynamic Fitment', 'Fluid Memory'].map((label) => (
                <div key={label} className="bg-white border border-[#e2b6a3]/10 shadow-lg p-12 flex flex-col items-center justify-center gap-6 group hover:-translate-y-2 transition-transform duration-500">
                  <div className="size-10 bg-[#e2b6a3]/10 rounded-full flex items-center justify-center group-hover:bg-[#e2b6a3]/20 transition-colors">
                    <span className="text-[#e2b6a3] text-xl font-sans">•</span>
                  </div>
                  <p className="text-[11px] text-[#3a414d] tracking-[3px] uppercase text-center">{label}</p>
                </div>
              ))}
            </div>

            <p className="italic text-[24px] lg:text-[36px] text-[#8a95a5] text-center max-w-[800px] mb-16 leading-tight">
              "A fluid form that breathes with the wearer, adjusted by the tide of movement."
            </p>

            <button 
              onClick={() => setShowModal(true)}
              className="bg-[#3a414d] text-white font-medium text-[12px] tracking-[6px] uppercase px-12 py-6 shadow-2xl hover:bg-[#2c323b] transition-all transform hover:-translate-y-1 active:scale-95"
            >
              Request a Private Showing
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer id="contact" className="bg-white border-t border-[#e2b6a3]/20 w-full py-24 flex justify-center">
          <div className="max-w-[1280px] w-full px-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-24">
              <div className="flex flex-col md:items-start gap-6">
                <h2 onClick={() => scrollToSection('hero')} className="font-medium text-[36px] text-[#3a414d] tracking-[6px] cursor-pointer hover:opacity-70 transition-opacity">
                  SEAGLORÉ
                </h2>
                <a href="mailto:seaglore@gmail.com" className="text-[#8a95a5] hover:text-[#3a414d] text-[12px] tracking-[3px] uppercase transition-colors">
                  seaglore@gmail.com
                </a>
              </div>
              <div className="flex gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="size-5 border border-[#8a95a5]/50 rounded cursor-pointer hover:border-[#3a414d] transition-colors" />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
              {[
                { title: 'Atelier', links:['Our Process', 'Materials', 'Ethos'], id: 'atelier' },
                { title: 'Archive', links:['Ocean Studies', 'Tidal Form I', 'Past Works'], id: 'collection' },
                { title: 'Contact', links:['Private Showing', 'Custom Inquiries', 'Press'], id: 'contact' },
                { title: 'Legal', links:['Privacy Policy', 'Terms of Service'], id: 'hero' }
              ].map(group => (
                <div key={group.title}>
                  <p className="text-[10px] text-[#e2b6a3] tracking-[3px] uppercase mb-6">{group.title}</p>
                  <ul className="flex flex-col gap-3">
                    {group.links.map(link => (
                   <li 
                   key={link} 
                   onClick={() => 
                     ['Private Showing', 'Custom Inquiries', 'Press'].includes(link) 
                       ? setShowModal(true) 
                       : scrollToSection(group.id)
                   }
                   className="text-[11px] text-[#8a95a5] tracking-[1px] uppercase cursor-pointer hover:text-[#3a414d] transition-colors"
                 >
                   {link}
                 </li>
                    ))}
                    {/* Extra email link in Contact column */}
                    {group.title === 'Contact' && (
                      <li className="mt-2">
                         <a href="mailto:seaglore@gmail.com" onClick={() => setShowModal(true)} className="text-[11px] text-[#e2b6a3] tracking-[1px] uppercase hover:text-[#3a414d] transition-colors">
                            EMAIL US directly
                         </a>
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-[#e2b6a3]/10 pt-12 flex justify-between items-center">
              <p className="text-[9px] text-[#8a95a5] tracking-[1px] uppercase">
                © 2026 SEAGLORÉ. ALL RIGHTS RESERVED.
              </p>
              <div className="flex gap-8">
                <p onClick={() => scrollToSection('collection')} className="text-[9px] text-[#8a95a5] tracking-[1px] uppercase cursor-pointer hover:text-[#3a414d]">ARCHIVE 01</p>
                <p onClick={() => scrollToSection('special-project')} className="text-[9px] text-[#8a95a5] tracking-[1px] uppercase cursor-pointer hover:text-[#3a414d]">EDITION 01</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}