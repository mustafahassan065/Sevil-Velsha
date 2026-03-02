import React from 'react'

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center border-b border-gray-800">
      {/* Background Video Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-black">
        <video 
          className="w-full h-full object-cover opacity-50"
          autoPlay 
          loop 
          muted 
          playsInline
          poster="https://via.placeholder.com/1920x1080"
        >
          <source src="#" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-8xl md:text-9xl font-bold tracking-tighter mb-4 text-white">
          #SEAGLORE
        </h1>
        <p className="text-3xl md:text-4xl font-light tracking-widest mb-2">
          Ocean Couture, Documented
        </p>
        <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-8 text-gray-400">
          A LIMITED DIGITAL EDITORIAL ARCHIVE
        </p>
        <div className="space-x-6">
          <button className="border border-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition">
            VIEW THE FIRST EDITION
          </button>
          <button className="bg-white text-black px-8 py-3 text-sm uppercase tracking-widest hover:bg-gray-200 transition">
            ENTER THE ARCHIVE
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection