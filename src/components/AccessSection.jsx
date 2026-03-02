import React from 'react'

const AccessSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-md mx-auto text-center space-y-8">
        <h2 className="text-4xl font-light">REQUESTS ACCESS</h2>
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="EMAIL ADDRESS"
            className="w-full bg-transparent border border-gray-700 px-6 py-4 text-white placeholder-gray-500 focus:border-white outline-none"
          />
          <button className="w-full bg-white text-black py-4 text-sm uppercase tracking-widest hover:bg-gray-200 transition">
            REQUEST ACCESS
          </button>
        </div>
      </div>
    </section>
  )
}

export default AccessSection