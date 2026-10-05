import { useState } from 'react';
import { FIELD_EVIDENCE_PHOTOS } from '../data/leaves';

export default function FieldProof() {
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  return (
    <section id="field-proof-section" className="relative w-full py-20 sm:py-28 px-4 sm:px-10 lg:px-16 bg-[#F4EFE6] border-t border-[#E2D9CB]">
      
      {/* ── Section Header ────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto text-center mb-14 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5DAC8] border border-[#D5C9B4] text-xs font-semibold uppercase tracking-wider text-[#3F4E49] mb-4">
          <span>📍 IN-SITU VERIFICATION</span> • <span>INDORE FIELD SURVEY</span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#1A2621] tracking-tight">
          Field Evidence & Geotags
        </h2>
        <p className="mt-4 text-sm sm:text-base md:text-lg text-[#55665E] max-w-2xl mx-auto leading-relaxed font-sans">
          To ensure genuine botanical documentation, each specimen was observed, photographed with live camera geotag metadata, and collected in-situ on 03 October 2026.
        </p>
      </div>

      {/* ── Verified Field Metadata Cards ─────────────────────────── */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        
        {/* Card 1: GPS Location */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xs border border-[#DFD5C4] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#3F4E49]/10 text-[#3F4E49] flex items-center justify-center text-base mb-3 font-semibold">
              📍
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#73847C] block mb-1">
              Field Station Location
            </span>
            <p className="text-sm font-bold text-[#1A2621] leading-snug">
              Scheme No 114, Indore
            </p>
          </div>
          <p className="text-xs text-[#5D6F66] mt-3 pt-2 border-t border-[#EFE8DC]">
            Velocity Girls Hostel grounds & rooftop garden
          </p>
        </div>

        {/* Card 2: Date & Time */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xs border border-[#DFD5C4] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#3F4E49]/10 text-[#3F4E49] flex items-center justify-center text-base mb-3 font-semibold">
              📅
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#73847C] block mb-1">
              Collection Timestamp
            </span>
            <p className="text-sm font-bold text-[#1A2621] leading-snug">
              03 October 2026
            </p>
          </div>
          <p className="text-xs text-[#5D6F66] mt-3 pt-2 border-t border-[#EFE8DC]">
            12:19 PM – 12:54 PM (Peak sunlight)
          </p>
        </div>

        {/* Card 3: Weather */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xs border border-[#DFD5C4] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#3F4E49]/10 text-[#3F4E49] flex items-center justify-center text-base mb-3 font-semibold">
              ☀️
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#73847C] block mb-1">
              Atmospheric Condition
            </span>
            <p className="text-sm font-bold text-[#1A2621] leading-snug">
              34.0 °C • Clear Sky
            </p>
          </div>
          <p className="text-xs text-[#5D6F66] mt-3 pt-2 border-t border-[#EFE8DC]">
            Ideal low moisture for immediate herbarium pressing
          </p>
        </div>

        {/* Card 4: Verification Status */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xs border border-[#DFD5C4] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-base mb-3 font-semibold">
              ✓
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#73847C] block mb-1">
              Taxonomy Check
            </span>
            <p className="text-sm font-bold text-[#1A2621] leading-snug">
              8 Families Verified
            </p>
          </div>
          <p className="text-xs text-[#5D6F66] mt-3 pt-2 border-t border-[#EFE8DC]">
            Meliaceae, Malvaceae, Rosaceae, etc.
          </p>
        </div>

      </div>

      {/* ── Geotag Photo Gallery ──────────────────────────────────── */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2621]">
            Captured Field Specimens & GPS Overlays
          </h3>
          <span className="text-xs text-[#63756D] font-medium hidden sm:inline">
            Click any field photo to examine live geotag
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FIELD_EVIDENCE_PHOTOS.map((item, idx) => (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              aria-label={`View full resolution field photo: ${item.title}`}
              onClick={() => setActivePhoto(item.image)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActivePhoto(item.image);
                }
              }}
              className="group relative bg-white rounded-2xl overflow-hidden border border-[#DED4C3] shadow-xs hover:shadow-md cursor-pointer transition-all transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F4E49]"
            >
              {/* Image with Geotag Banner at bottom (contain: never crop the GPS overlay) */}
              <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                  <span className="px-3 py-1.5 rounded-full bg-white/90 text-xs font-semibold text-[#1A2621] shadow-md">
                    🔍 View Full Resolution
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="p-4 bg-white">
                <h4 className="font-serif font-bold text-base text-[#1A2621] group-hover:text-[#3F4E49] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs font-serif italic text-[#576B61] mt-0.5">
                  {item.plant}
                </p>
                <div className="mt-2.5 pt-2 border-t border-[#F0EAE0] flex items-center justify-between text-[11px] text-[#71827A]">
                  <span>Indore Survey</span>
                  <span className="font-mono">{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Herbarium Methodology Process Strip ───────────────────── */}
      <div className="max-w-5xl mx-auto mt-20 p-6 sm:p-10 rounded-3xl bg-white border border-[#DDD3C2] shadow-sm">
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2621] text-center mb-8">
          Herbarium Preparation & Preservation Methodology
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <span className="w-8 h-8 rounded-full bg-[#3F4E49] text-white flex-shrink-0 flex items-center justify-center font-bold text-xs">
              1
            </span>
            <div>
              <h4 className="font-semibold text-sm text-[#1A2621] mb-1">
                In-Situ Field Harvesting
              </h4>
              <p className="text-xs text-[#596A62] leading-relaxed">
                Healthy, undamaged leaves and inflorescences were carefully snipped in natural midday light at Scheme No 114, Indore.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="w-8 h-8 rounded-full bg-[#3F4E49] text-white flex-shrink-0 flex items-center justify-center font-bold text-xs">
              2
            </span>
            <div>
              <h4 className="font-semibold text-sm text-[#1A2621] mb-1">
                Gradual Pressing & Dehydration
              </h4>
              <p className="text-xs text-[#596A62] leading-relaxed">
                Specimens were placed between absorbent blotting paper sheets under uniform pressure to retain leaf geometry and cellular pigment.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="w-8 h-8 rounded-full bg-[#3F4E49] text-white flex-shrink-0 flex items-center justify-center font-bold text-xs">
              3
            </span>
            <div>
              <h4 className="font-semibold text-sm text-[#1A2621] mb-1">
                Antiqued Parchment Mounting
              </h4>
              <p className="text-xs text-[#596A62] leading-relaxed">
                Secured onto deckle-edged vintage paper sheets with handwritten binomial taxonomy labels and local field selection markers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lightbox Modal for Full Field Photo ───────────────────── */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer animate-fade-rise"
          onClick={() => setActivePhoto(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh] bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
            >
              ✕
            </button>
            <img
              src={activePhoto}
              alt="Geotag fieldwork preview"
              className="max-h-[85vh] w-auto object-contain mx-auto"
            />
          </div>
        </div>
      )}

    </section>
  );
}
