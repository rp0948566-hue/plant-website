import { useState, useEffect } from 'react';
import type { LeafSpecimen } from '../data/leaves';

interface Props {
  specimens: LeafSpecimen[];
}

export default function LeafCollection({ specimens }: Props) {
  const [selectedLeaf, setSelectedLeaf] = useState<LeafSpecimen | null>(null);
  const [activeImageTab, setActiveImageTab] = useState<'sheet' | 'field'>('sheet');

  // Keyboard navigation & ESC handler for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedLeaf) return;
      if (e.key === 'Escape') {
        setSelectedLeaf(null);
      } else if (e.key === 'ArrowRight') {
        const currentIndex = specimens.findIndex((l) => l.id === selectedLeaf.id);
        const nextIndex = (currentIndex + 1) % specimens.length;
        setSelectedLeaf(specimens[nextIndex]);
        setActiveImageTab('sheet');
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = specimens.findIndex((l) => l.id === selectedLeaf.id);
        const prevIndex = (currentIndex - 1 + specimens.length) % specimens.length;
        setSelectedLeaf(specimens[prevIndex]);
        setActiveImageTab('sheet');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLeaf, specimens]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedLeaf) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedLeaf]);

  const openSpecimen = (leaf: LeafSpecimen) => {
    setSelectedLeaf(leaf);
    setActiveImageTab('sheet');
  };

  return (
    <section id="collection-section" className="relative w-full py-20 sm:py-28 px-4 sm:px-10 lg:px-16 bg-[#F8F5EE] border-t border-[#E7DDCF]">
      
      {/* ── Section Header ────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto text-center mb-14 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAE2D4] border border-[#DDD3C2] text-xs font-semibold uppercase tracking-wider text-[#3F4E49] mb-4">
          <span>ARCHIVAL CATALOGUE</span> • <span>8 SPECIMENS</span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#1A2621] tracking-tight">
          The Preserved Collection
        </h2>
        <p className="mt-4 text-sm sm:text-base md:text-lg text-[#5B6A63] max-w-2xl mx-auto leading-relaxed font-sans">
          Specimens harvested and hand-pressed onto antiqued parchment sheets with handwritten field taxonomical annotations. Click any card to inspect high-resolution sheet details and geotagged field photos.
        </p>
      </div>

      {/* ── 8 Specimen Cards Grid ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        {specimens.map((leaf, index) => {
          const specimenNumber = String(index + 1).padStart(2, '0');
          return (
            <div
              key={leaf.id}
              role="button"
              tabIndex={0}
              aria-label={`Inspect ${leaf.commonName} specimen`}
              onClick={() => openSpecimen(leaf)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openSpecimen(leaf);
                }
              }}
              className="specimen-card group bg-white rounded-2xl border border-[#E7DDCF] overflow-hidden cursor-pointer flex flex-col justify-between shadow-xs hover:border-[#3F4E49]/40 bg-gradient-to-b from-white to-[#FBF9F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F4E49]"
            >
              {/* Image Container with Paper Aspect Ratio */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EFE9DF] p-3">
                {/* Paper framing inside */}
                <div className="w-full h-full rounded-xl overflow-hidden shadow-inner relative border border-[#E4DAC9]">
                  <img
                    src={leaf.sheetImage}
                    alt={`${leaf.commonName} herbarium sheet`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <span className="text-white text-xs font-medium bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full">
                      Click to inspect sheet & field data ↗
                    </span>
                  </div>
                </div>

                {/* Specimen Index Badge */}
                <div className="absolute top-5 left-5 px-2.5 py-1 rounded-md bg-[#1A2621]/80 backdrop-blur-md text-[#FAF7F2] text-[11px] font-mono font-semibold tracking-wider shadow-sm">
                  #{specimenNumber}
                </div>

                {/* Family Pill on Image */}
                <div className="absolute top-5 right-5 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-[#3F4E49] text-[11px] font-semibold tracking-wide border border-[#E7DDCF] shadow-sm">
                  {leaf.family}
                </div>
              </div>

              {/* Card Meta Description */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h3 className="text-xl font-serif font-bold text-[#1A2621] group-hover:text-[#3F4E49] transition-colors">
                      {leaf.commonName}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm font-serif italic text-[#61746B] mb-2.5">
                    {leaf.scientificName}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-[#EFE9DF] text-[#475C51]">
                      {leaf.type.split('/')[0].trim()}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-[#E7E2D6] text-[#55695E]">
                      {leaf.margin.split('/')[0].trim()}
                    </span>
                  </div>

                  <p className="text-xs text-[#5C6B64] line-clamp-2 leading-relaxed">
                    {leaf.oneLiner}
                  </p>
                </div>

                {/* Inspect Link */}
                <div className="mt-4 pt-3 border-t border-[#EFE8DC] flex items-center justify-between text-xs font-semibold text-[#3F4E49] group-hover:text-[#1A2621] transition-colors">
                  <span>Inspect Specimen</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Interactive Modal for Full Specimen Sheet & Geotag ─────── */}
      {selectedLeaf && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-rise">
          {/* Backdrop Click */}
          <div
            className="fixed inset-0 cursor-pointer"
            onClick={() => setSelectedLeaf(null)}
          />

          {/* Modal Container (page scrolls on phones; right column scrolls on desktop) */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedLeaf.commonName} specimen details`}
            className="relative z-10 m-auto w-full max-w-5xl max-h-none md:max-h-[92vh] bg-[#FAF7F2] rounded-3xl border border-[#E7DDCF] shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedLeaf(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-[#1A2621] hover:text-white text-[#1A2621] flex items-center justify-center shadow-md transition-all cursor-pointer border border-[#E7DDCF]"
              aria-label="Close dialog"
            >
              ✕
            </button>

            {/* Left Column: Image Viewer with Tab Switcher */}
            <div className="md:w-1/2 bg-[#ECE5D8] p-4 sm:p-6 flex flex-col justify-between items-center relative overflow-hidden">
              {/* Tab Selector: Herbarium Sheet vs Geotag Field Photo */}
              <div className="inline-flex rounded-full bg-white/90 p-1 border border-[#DDD3C3] shadow-xs mb-4 z-10">
                <button
                  onClick={() => setActiveImageTab('sheet')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeImageTab === 'sheet'
                      ? 'bg-[#3F4E49] text-white shadow-xs'
                      : 'text-[#5F6E66] hover:text-[#1A2621]'
                  }`}
                >
                  📜 Pressed Sheet
                </button>
                <button
                  onClick={() => setActiveImageTab('field')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeImageTab === 'field'
                      ? 'bg-[#3F4E49] text-white shadow-xs'
                      : 'text-[#5F6E66] hover:text-[#1A2621]'
                  }`}
                >
                  📍 Geotag Field Photo
                </button>
              </div>

              {/* Image Frame */}
              <div className="relative w-full min-h-[240px] sm:min-h-[400px] md:flex-1 md:min-h-0 md:max-h-full flex items-center justify-center rounded-2xl overflow-hidden bg-white/60 p-2 border border-[#DFD6C7]">
                <img
                  src={activeImageTab === 'sheet' ? selectedLeaf.sheetImage : selectedLeaf.fieldImage}
                  alt={
                    activeImageTab === 'sheet'
                      ? `${selectedLeaf.commonName} herbarium sheet`
                      : `${selectedLeaf.commonName} in-situ field photo`
                  }
                  decoding="async"
                  className="max-h-full max-w-full object-contain rounded-xl shadow-md transition-all duration-300"
                />

                {/* Overlay Badge on Field Photo */}
                {activeImageTab === 'field' && (
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white text-[11px] px-3 py-1 rounded-full font-mono">
                    📍 Indore • 03 Oct 2026
                  </div>
                )}
              </div>

              {/* Prev / Next specimen switcher at modal bottom */}
              <div className="w-full flex items-center justify-between mt-4 px-2 text-xs text-[#52635B]">
                <button
                  onClick={() => {
                    const currentIndex = specimens.findIndex((l) => l.id === selectedLeaf.id);
                    const prevIndex = (currentIndex - 1 + specimens.length) % specimens.length;
                    setSelectedLeaf(specimens[prevIndex]);
                    setActiveImageTab('sheet');
                  }}
                  className="hover:text-[#1A2621] font-semibold flex items-center gap-1 cursor-pointer py-1 px-2.5 rounded-lg bg-white/70 hover:bg-white"
                >
                  ← Previous Specimen
                </button>
                <span className="font-mono text-[11px]">
                  {specimens.findIndex((l) => l.id === selectedLeaf.id) + 1} of {specimens.length}
                </span>
                <button
                  onClick={() => {
                    const currentIndex = specimens.findIndex((l) => l.id === selectedLeaf.id);
                    const nextIndex = (currentIndex + 1) % specimens.length;
                    setSelectedLeaf(specimens[nextIndex]);
                    setActiveImageTab('sheet');
                  }}
                  className="hover:text-[#1A2621] font-semibold flex items-center gap-1 cursor-pointer py-1 px-2.5 rounded-lg bg-white/70 hover:bg-white"
                >
                  Next Specimen →
                </button>
              </div>
            </div>

            {/* Right Column: Exhaustive Botanical Specs & Data */}
            <div className="md:w-1/2 p-6 sm:p-8 md:overflow-y-auto md:max-h-[92vh] flex flex-col justify-between">
              <div>
                {/* Header Tag */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#3F4E49] text-white text-[11px] font-semibold tracking-wider">
                    SPECIMEN #{String(specimens.findIndex((l) => l.id === selectedLeaf.id) + 1).padStart(2, '0')}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#EFE9DF] text-[#42574C] text-[11px] font-semibold">
                    {selectedLeaf.family}
                  </span>
                </div>

                {/* Specimen Names */}
                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A2621] mb-1">
                  {selectedLeaf.commonName}
                </h3>
                <p className="text-base sm:text-lg font-serif italic text-[#475C51] mb-4">
                  {selectedLeaf.scientificName}
                </p>

                {/* One Liner Highlight Banner */}
                <div className="p-3.5 rounded-xl bg-[#EFE8DC] border border-[#DDD3C2] text-xs sm:text-sm text-[#384840] font-medium leading-relaxed mb-6">
                  “{selectedLeaf.oneLiner}”
                </div>

                {/* Botanical Specs Table */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-xs font-bold tracking-wider uppercase text-[#73827B]">
                    Morphological & Taxonomical Details
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-lg bg-white border border-[#E7DDCF]">
                      <span className="text-[#7F8E87] block text-[10px] uppercase font-bold">Local / Vernacular</span>
                      <span className="font-semibold text-[#1A2621]">{selectedLeaf.vernacularName || selectedLeaf.commonName}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-[#E7DDCF]">
                      <span className="text-[#7F8E87] block text-[10px] uppercase font-bold">Plant Habit / Type</span>
                      <span className="font-semibold text-[#1A2621]">{selectedLeaf.type}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-[#E7DDCF]">
                      <span className="text-[#7F8E87] block text-[10px] uppercase font-bold">Leaf Architecture</span>
                      <span className="font-semibold text-[#1A2621]">{selectedLeaf.leafType}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-[#E7DDCF]">
                      <span className="text-[#7F8E87] block text-[10px] uppercase font-bold">Venation Pattern</span>
                      <span className="font-semibold text-[#1A2621]">{selectedLeaf.venation}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-[#E7DDCF] col-span-2">
                      <span className="text-[#7F8E87] block text-[10px] uppercase font-bold">Margin & Texture</span>
                      <span className="font-semibold text-[#1A2621]">{selectedLeaf.margin}</span>
                    </div>
                  </div>
                </div>

                {/* Botanical Notes */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold tracking-wider uppercase text-[#73827B] mb-2">
                    Botanical Analysis & Observations
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4E5C56] leading-relaxed bg-white p-3.5 rounded-xl border border-[#E7DDCF]">
                    {selectedLeaf.botanicalNotes}
                  </p>
                </div>
              </div>

              {/* Field Verification Strip at bottom */}
              <div className="pt-4 border-t border-[#E7DDCF] bg-[#F3EDE2] -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-4 sm:p-5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#73827B] font-bold block">
                    Field Survey Record
                  </span>
                  <span className="font-medium text-[#1A2621]">
                    {selectedLeaf.location}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-[#73827B] font-bold block">
                    Collected
                  </span>
                  <span className="font-medium text-[#1A2621]">
                    {selectedLeaf.collectionDate} • {selectedLeaf.temperature}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
