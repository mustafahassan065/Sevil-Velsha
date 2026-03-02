import React from 'react'

const FounderSection = () => {
  return (
    <section className="py-20 px-4 border-b border-gray-800">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        <div className="bg-gray-900 h-96">
          <img 
            src="https://via.placeholder.com/600x600" 
            alt="Sevil Velsha"
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        <div className="flex flex-col justify-center space-y-6">
          <p className="text-sm text-gray-400 tracking-widest">FOUNDER & CREATIVE DIRECTOR</p>
          <h2 className="text-5xl font-light">SEVIL VELSHA</h2>
          <p className="text-lg text-gray-300 italic">
            "Seagloré is a study in how couture and ecology can coexist not as contradiction, but as inevitability."
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">CREATIVE</p>
              <p className="text-sm">DIRECTION</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">ENVIRONMENTAL</p>
              <p className="text-sm">STORYTELLING</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">VOICE</p>
              <p className="text-sm">RESEARCH</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FounderSection