import React from 'react'

const PhilosophySection = () => {
  return (
    <section className="py-20 px-4 border-b border-gray-800 text-center">
      <div className="max-w-4xl mx-auto space-y-12">
        <h2 className="text-5xl md:text-6xl font-light leading-tight">
          FASHION HAS ALWAYS LOOKED TO PARIS.<br />
          <span className="font-bold">Seagloré Looks To The Ocean.</span>
        </h2>
        <p className="text-2xl text-gray-400 tracking-widest">
          — OCEAN COUTURE FOR A LIVING PLANET —
        </p>
        
        <div className="pt-8">
          <p className="text-3xl italic font-light">"Water As Structure. Not Symbol."</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 pt-12">
          <div className="border border-gray-800 p-6">
            <p className="text-sm uppercase tracking-widest">Where nature is studied before it becomes form.</p>
          </div>
          <div className="border border-gray-800 p-6">
            <p className="text-sm uppercase tracking-widest">NOT TREND EDUCATION. PERCEPTION TRAINING.</p>
          </div>
          <div className="border border-gray-800 p-6 bg-gray-900">
            <p className="text-sm uppercase tracking-widest">[ENTER ACADEMY]</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PhilosophySection