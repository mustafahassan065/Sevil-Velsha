import { Badge } from './ui';

// Ek ritual ka card. Image/audio na ho to "No Image Still" / "No Audio Still" dikhta hai.
export default function RitualCard({ ritual, children, large = false }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-[#FFFDF9] shadow-sm">
      {ritual.imageUrl ? (
        <img src={ritual.imageUrl} alt={ritual.title} className={`w-full object-cover ${large ? 'h-64 sm:h-80' : 'h-44'}`} />
      ) : (
        <div className={`flex w-full items-center justify-center bg-[#F1EADB] text-sm text-[#9AA3A8] ${large ? 'h-64 sm:h-80' : 'h-44'}`}>
          No Image Still
        </div>
      )}
      <div className="p-5 sm:p-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {ritual.category && <Badge tone="soft">{ritual.category}</Badge>}
          <span className="text-xs text-[#6E7B82]">{ritual.durationMin} min</span>
          {ritual.access === 'premium' && <Badge tone="gold">Premium</Badge>}
        </div>
        <h3 className={`font-serif text-[#16324A] ${large ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>{ritual.title}</h3>
        {ritual.description && <p className="mt-2 text-sm leading-relaxed text-[#6E7B82]">{ritual.description}</p>}

        {ritual.locked ? (
          <p className="mt-4 text-sm font-medium text-[#C9A24B]">Unlock with Premium</p>
        ) : ritual.audioUrl ? (
          <audio controls preload="none" src={ritual.audioUrl} className="mt-4 w-full" />
        ) : (
          <p className="mt-4 text-sm text-[#9AA3A8]">No Audio Still</p>
        )}
        {children}
      </div>
    </div>
  );
}