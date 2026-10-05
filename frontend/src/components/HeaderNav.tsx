import { useState } from 'react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function HeaderNav({ activeTab, onTabChange }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-8 sm:px-16 py-8 flex items-center justify-between bg-transparent backdrop-blur-[2px] transition-all duration-300">
      {/* ── Brand Logo: "Minimalism." ─────────────────────────────────────── */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onTabChange('Home');
        }}
        className="text-2xl font-bold tracking-tight text-[#111111] hover:opacity-80 transition-opacity"
      >
        Minimalism.
      </a>

      {/* ── Center Navigation Links ────────────────────────────────────────── */}
      <nav className="hidden md:flex items-center gap-12 text-base">
        {/* Home Link */}
        <button
          onClick={() => onTabChange('Home')}
          className={`relative pb-1 font-semibold transition-colors cursor-pointer ${
            activeTab === 'Home' ? 'text-[#111111]' : 'text-[#8E8E8E] hover:text-[#111111]'
          }`}
        >
          Home
          {activeTab === 'Home' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111111] rounded-full animate-fade-rise" />
          )}
        </button>

        {/* Portfolio Link */}
        <button
          onClick={() => onTabChange('Portfolio')}
          className={`relative pb-1 font-medium transition-colors cursor-pointer ${
            activeTab === 'Portfolio' ? 'text-[#111111]' : 'text-[#8E8E8E] hover:text-[#111111]'
          }`}
        >
          Portfolio
          {activeTab === 'Portfolio' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111111] rounded-full animate-fade-rise" />
          )}
        </button>

        {/* Blog Link */}
        <button
          onClick={() => onTabChange('Blog')}
          className={`relative pb-1 font-medium transition-colors cursor-pointer ${
            activeTab === 'Blog' ? 'text-[#111111]' : 'text-[#8E8E8E] hover:text-[#111111]'
          }`}
        >
          Blog
          {activeTab === 'Blog' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111111] rounded-full animate-fade-rise" />
          )}
        </button>
      </nav>

      {/* ── Right Side: Minimalist Hamburger Icon (═) ───────────────────────── */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-2 text-[#111111] hover:opacity-70 transition-opacity cursor-pointer flex flex-col justify-center gap-[6px]"
        aria-label="Toggle Menu"
      >
        <span className={`w-6 h-[2px] bg-[#111111] transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
        <span className={`w-6 h-[2px] bg-[#111111] transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
      </button>

      {/* ── Mobile Menu Overlay ───────────────────────────────────────────── */}
      {menuOpen && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-40 flex flex-col items-center justify-center gap-8 text-2xl font-bold animate-fade-rise min-h-screen">
          <button
            onClick={() => {
              onTabChange('Home');
              setMenuOpen(false);
            }}
            className="hover:opacity-60"
          >
            Home
          </button>
          <button
            onClick={() => {
              onTabChange('Portfolio');
              setMenuOpen(false);
            }}
            className="hover:opacity-60"
          >
            Portfolio
          </button>
          <button
            onClick={() => {
              onTabChange('Blog');
              setMenuOpen(false);
            }}
            className="hover:opacity-60"
          >
            Blog
          </button>
        </div>
      )}
    </header>
  );
}
