import React from 'react'

const ProductSection = () => {
  return (
    <section className="py-20 px-4 border-b border-gray-800">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Left - Product Image */}
        <div className="bg-gray-900 h-96 flex items-center justify-center">
          <img 
            src="https://via.placeholder.com/600x800" 
            alt="Product"
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        
        {/* Right - Product Details */}
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-4xl font-light tracking-wider">PRODUCT TITLE</h2>
          <p className="text-xl text-gray-300">Season 0: Seafood Birth</p>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-800 py-2">
              <span className="text-gray-400">FORMAT</span>
              <span>Digital Editorial</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 py-2">
              <span className="text-gray-400">LENGTH</span>
              <span>48 Pages</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 py-2">
              <span className="text-gray-400">ACCESS</span>
              <span>$48</span>
            </div>
          </div>
          
          <div className="pt-4">
            <button className="w-full border border-gray-700 py-4 text-sm uppercase tracking-widest hover:border-white transition">
              PRIVATE ARCHIVE ENTRY
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">Private archive entry</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductSection