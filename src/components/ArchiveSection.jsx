import React from 'react'

const ArchiveSection = () => {
  const archiveItems = [
    { title: "Minimal Luxury", tag: "ARCHIVE ONLY" },
    { title: "Regenerative Craft", tag: "ARCHIVE ONLY" },
    { title: "Couture as Ritual", tag: "ARCHIVE ONLY" }
  ]

  return (
    <section className="py-20 px-4 border-b border-gray-800">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-light mb-12 text-center">From the Archive</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {archiveItems.map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-gray-900 h-80 mb-4 overflow-hidden">
                <img 
                  src={`https://via.placeholder.com/400x500?text=Archive+${index+1}`}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition"
                />
              </div>
              <p className="text-xs text-gray-500 mb-2">{item.tag}</p>
              <h3 className="text-xl tracking-wider">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ArchiveSection