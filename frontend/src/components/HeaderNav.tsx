import { useState } from 'react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function HeaderNav({ activeTab, onTabChange }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = ['Home', 'Studio', 'About', 'Journal', 'Reach Us'];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between">
        {/* ── Brand Logo: "Aethera®" (Instrument Serif) ────────────────────────── */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onTabChange('Home');
          }}
          className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-[#000000] hover:opacity-80 transition-opacity flex items-start"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Aethera<sup className="text-xs sm:text-sm font-sans font-normal relative -top-1 ml-0.5">®</sup>
        </a>

        {/* ── Center Navigation Links ────────────────────────────────────────── */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-sm">
          {menuItems.map((item) => {
            const isActive = activeTab === item || (activeTab === 'Portfolio' && item === 'Studio');
            return (
              <button
                key={item}
                onClick={() => onTabChange(item)}
                className={`transition-colors cursor-pointer font-sans ${
                  isActive ? 'text-[#000000] font-medium' : 'text-[#6F6F6F] hover:text-[#000000] font-normal'
                }`}
              >
                {item}
              </button>
            );
          })}
        </nav>

        {/* ── Right Side CTA Button: "Begin Journey" ────────────────────────── */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => onTabChange('Reach Us')}
            className="nav-cta-btn"
          >
            Begin Journey
          </button>
        </div>

        {/* ── Mobile Hamburger Menu Button ────────────────────────────────────── */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-[#000000] hover:opacity-70 transition-opacity cursor-pointer flex flex-col justify-center gap-[5px] z-50"
          aria-label="Toggle Menu"
        >
          <span className={`w-5 h-[2px] bg-[#000000] transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
          <span className={`w-5 h-[2px] bg-[#000000] transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
        </button>
      </div>

      {/* ── Mobile Menu Overlay ───────────────────────────────────────────── */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white/98 backdrop-blur-md z-40 flex flex-col items-center justify-center gap-6 text-xl font-medium animate-fade-rise min-h-screen">
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                onTabChange(item);
                setMenuOpen(false);
              }}
              className={`transition-colors font-sans ${
                activeTab === item ? 'text-[#000000] font-semibold underline underline-offset-8' : 'text-[#6F6F6F] hover:text-[#000000]'
              }`}
            >
              {item}
            </button>
          ))}
          <button
            onClick={() => {
              onTabChange('Reach Us');
              setMenuOpen(false);
            }}
            className="nav-cta-btn mt-4 text-base px-8 py-3"
          >
            Begin Journey
          </button>
        </div>
      )}
    </header>
  );
}
