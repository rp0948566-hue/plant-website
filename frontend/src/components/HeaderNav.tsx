import { useState } from 'react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function HeaderNav({ activeTab, onTabChange }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
    <header className="fixed top-[6px] sm:top-[10px] left-[6px] sm:left-[10px] right-[6px] sm:right-[10px] z-40 rounded-t-[12px] sm:rounded-t-[18px] px-5 sm:px-12 py-5 sm:py-6 flex items-center justify-between bg-[#FAF7F2]/85 backdrop-blur-md border-b border-[#E7DDCF]/70 transition-all duration-300">
      {/* ── Brand Logo: "Leaf Herbarium." ─────────────────────────────────── */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onTabChange('Home');
        }}
        className="flex items-center gap-2 group cursor-pointer"
      >
        <span className="w-8 h-8 rounded-full bg-[#3F4E49] text-[#FAF7F2] flex items-center justify-center text-sm font-serif italic shadow-xs group-hover:bg-[#2B3833] transition-colors">
          🌿
        </span>
        <div className="flex flex-col">
          <span className="text-lg sm:text-xl font-serif tracking-tight font-medium text-[#1A2621]">
            Leaf Herbarium
          </span>
          <span className="text-[9px] tracking-widest uppercase font-semibold text-[#667770]">
            Botanical Archive • 2026
          </span>
        </div>
      </a>

      {/* ── Center Navigation Links ────────────────────────────────────────── */}
      <nav className="hidden md:flex items-center gap-10 text-sm">
        {/* Home */}
        <button
          onClick={() => onTabChange('Home')}
          className={`relative py-1 font-medium transition-colors cursor-pointer ${
            activeTab === 'Home' ? 'text-[#1A2621] font-semibold' : 'text-[#62736C] hover:text-[#1A2621]'
          }`}
        >
          Overview
          {activeTab === 'Home' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3F4E49] rounded-full animate-fade-rise" />
          )}
        </button>

        {/* Collection */}
        <button
          onClick={() => onTabChange('Collection')}
          className={`relative py-1 font-medium transition-colors cursor-pointer ${
            activeTab === 'Collection' ? 'text-[#1A2621] font-semibold' : 'text-[#62736C] hover:text-[#1A2621]'
          }`}
        >
          The 8 Specimens
          {activeTab === 'Collection' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3F4E49] rounded-full animate-fade-rise" />
          )}
        </button>

        {/* Field Proof */}
        <button
          onClick={() => onTabChange('FieldProof')}
          className={`relative py-1 font-medium transition-colors cursor-pointer ${
            activeTab === 'FieldProof' ? 'text-[#1A2621] font-semibold' : 'text-[#62736C] hover:text-[#1A2621]'
          }`}
        >
          Field Evidence & Geotag
          {activeTab === 'FieldProof' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3F4E49] rounded-full animate-fade-rise" />
          )}
        </button>

        {/* Project Details */}
        <button
          onClick={() => onTabChange('About')}
          className={`relative py-1 font-medium transition-colors cursor-pointer ${
            activeTab === 'About' ? 'text-[#1A2621] font-semibold' : 'text-[#62736C] hover:text-[#1A2621]'
          }`}
        >
          Study Notes
          {activeTab === 'About' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3F4E49] rounded-full animate-fade-rise" />
          )}
        </button>
      </nav>

      {/* ── Right side Specimen Badge / Quick Action ── */}
      <div className="hidden md:flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE2D5] text-xs font-semibold text-[#3F4E49] border border-[#DBD0C0]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          8 Sheets Pressed
        </span>
      </div>

      {/* ── Mobile Hamburger Icon (stays above overlay) ───────────────────────── */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden relative z-50 p-2 text-[#1A2621] hover:opacity-70 transition-opacity cursor-pointer flex flex-col justify-center gap-[5px] rounded-lg bg-[#EFE8DC]/80"
        aria-label="Toggle Menu"
        aria-expanded={menuOpen}
      >
        <span className={`w-5 h-[2px] bg-[#1A2621] transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
        <span className={`w-5 h-[2px] bg-[#1A2621] transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
      </button>
    </header>

      {/* ── Mobile Menu Overlay (sibling of header so fixed inset-0 covers viewport;
          kept outside header because header's backdrop-blur would trap fixed children) ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-lg flex flex-col items-center justify-center gap-6 text-xl font-medium animate-fade-rise">
          <button
            onClick={() => {
              onTabChange('Home');
              setMenuOpen(false);
            }}
            className={`transition-colors ${activeTab === 'Home' ? 'text-[#3F4E49] font-bold underline underline-offset-8' : 'text-[#62736C] hover:text-[#1A2621]'}`}
          >
            Overview
          </button>
          <button
            onClick={() => {
              onTabChange('Collection');
              setMenuOpen(false);
            }}
            className={`transition-colors ${activeTab === 'Collection' ? 'text-[#3F4E49] font-bold underline underline-offset-8' : 'text-[#62736C] hover:text-[#1A2621]'}`}
          >
            The 8 Specimens
          </button>
          <button
            onClick={() => {
              onTabChange('FieldProof');
              setMenuOpen(false);
            }}
            className={`transition-colors ${activeTab === 'FieldProof' ? 'text-[#3F4E49] font-bold underline underline-offset-8' : 'text-[#62736C] hover:text-[#1A2621]'}`}
          >
            Field Evidence & Geotag
          </button>
          <button
            onClick={() => {
              onTabChange('About');
              setMenuOpen(false);
            }}
            className={`transition-colors ${activeTab === 'About' ? 'text-[#3F4E49] font-bold underline underline-offset-8' : 'text-[#62736C] hover:text-[#1A2621]'}`}
          >
            Study Notes & Submission
          </button>

          <div className="mt-6 pt-6 border-t border-[#E7DDCF] text-center">
            <span className="text-xs uppercase tracking-widest text-[#7C8B84] font-semibold">
              Indore Herbarium Project • 2026
            </span>
          </div>
        </div>
      )}
    </>
  );
}
