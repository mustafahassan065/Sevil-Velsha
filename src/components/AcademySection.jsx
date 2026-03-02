import React from 'react'

const AcademySection = () => {
  return (
    <section className="py-20 px-4 border-b border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-light leading-tight">
              Where nature is studied <br />
              <span className="font-bold">before it becomes form.</span>
            </h2>
            
            <div className="space-y-4 pt-4">
              <p className="text-2xl text-gray-300 uppercase tracking-widest">
                NOT TREND EDUCATION.
              </p>
              <p className="text-2xl text-white font-light">
                PERCEPTION TRAINING.
              </p>
            </div>
            
            <button className="group relative mt-8">
              <span className="text-4xl font-light tracking-wider border-b border-gray-600 pb-1 group-hover:border-white transition">
                [ENTER ACADEMY]
              </span>
            </button>
          </div>
          
          {/* Right - Image/Video Placeholder */}
          <div className="bg-gradient-to-br from-blue-900/20 to-gray-900 h-96 flex items-center justify-center border border-gray-800">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 border-2 border-gray-600 rounded-full flex items-center justify-center">
                <span className="text-4xl">🌊</span>
              </div>
              <p className="text-sm text-gray-400 tracking-widest">ACADEMY PREVIEW</p>
              <p className="text-xs text-gray-600 mt-2">(Video placeholder)</p>
            </div>
            {/* Video placeholder - aap baad mein replace kar sakte ho */}
            <video className="hidden" src="#"></video>
          </div>
        </div>
        
        {/* Additional Academy Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="border-l border-gray-800 pl-6">
            <p className="text-3xl font-light mb-2">01</p>
            <h3 className="text-xl mb-2">OCEAN STUDIES</h3>
            <p className="text-sm text-gray-500">Understanding marine ecosystems as design philosophy</p>
          </div>
          <div className="border-l border-gray-800 pl-6">
            <p className="text-3xl font-light mb-2">02</p>
            <h3 className="text-xl mb-2">MATERIAL RESEARCH</h3>
            <p className="text-sm text-gray-500">Regenerative fabrics and biomimicry</p>
          </div>
          <div className="border-l border-gray-800 pl-6">
            <p className="text-3xl font-light mb-2">03</p>
            <h3 className="text-xl mb-2">PERCEPTION LAB</h3>
            <p className="text-sm text-gray-500">Training the eye beyond trends</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AcademySection