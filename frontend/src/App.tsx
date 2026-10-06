import { useState, useEffect } from 'react';
import ReactLenis from 'lenis/react';
import GlobalShell from './components/GlobalShell';
import CinematicHero from './components/CinematicHero';
import MinimalismSection from './components/MinimalismSection';
import { Skiper31 } from './components/ui/text-scroll-animation';
import OrbitCarousel from './components/ui/orbiting-carousel-with-animated-icons';
import WorksWheel, { DEFAULT_WORKS } from './components/ui/works-wheel';
import BottomNavBar from './components/ui/bottom-nav-bar';
import { preloadBotanicalImages } from './lib/api';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 4;

  // ── Preload botanical archival imagery into browser memory ────────────────
  useEffect(() => {
    preloadBotanicalImages();
  }, []);

  // ── Slide Handlers ─────────────────────────────────────────────────────────
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev >= totalSlides ? 1 : prev + 1));
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev <= 1 ? totalSlides : prev - 1));
  };

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.0, smoothWheel: true, wheelMultiplier: 1.1, touchMultiplier: 1.2 }}>
      <GlobalShell>
        <div className="w-full min-h-screen bg-white text-black selection:bg-black selection:text-white relative overflow-x-clip flex flex-col">
          {/* ── Figma-style Dynamic Floating Top Navigation Bar ── */}
          <BottomNavBar
            stickyTop
            autoHideOnScroll
            onItemSelect={(item) => {
              const targetId = item.targetId;
              if (targetId) {
                const el = document.getElementById(targetId);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />

          {/* ── Top Hero: Cinematic Hero Section with Looping Video Background ── */}
          <section id="hero-top" className="w-full min-h-screen relative">
        <CinematicHero
          onBeginJourney={() => {
            const el = document.getElementById('minimalism-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onNavigateTab={(tab) => {
            if (tab !== 'Home') {
              const el = document.getElementById('minimalism-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        />
      </section>

      {/* ── Section: Maximalism is a Power ── */}
      <section id="minimalism-section" className="w-full min-h-[80vh] sm:min-h-screen relative flex-1 flex flex-col justify-between">
        <MinimalismSection
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          onNextSlide={handleNextSlide}
          onPrevSlide={handlePrevSlide}
        />
      </section>

      {/* ── Section: 3D Kinetic Text Convergence (Half from left, half from right) ── */}
      <section id="scroll-animation-section" className="w-full relative z-20">
        <Skiper31 />
      </section>

      {/* ── Section: Orbiting Botanical Herbarium Section ── */}
      <section id="orbit-carousel-section" className="w-full relative z-20 py-2 sm:py-12 bg-white overflow-hidden">
        <OrbitCarousel />
      </section>

      {/* ── Section: 3D Works Wheel Portfolio Drum ── */}
      <section id="works-wheel-section" className="w-full relative z-20 bg-white border-t border-black/5">
        <WorksWheel items={DEFAULT_WORKS} label="Flora '26" />
      </section>

      {/* ── Minimalist Closing Footer ── */}
      <footer className="w-full py-16 bg-[#f2f1ee] border-t border-[#e2e0dc] text-center text-xs tracking-[0.25em] uppercase text-[#777777] relative z-20">
        <p className="font-sans font-medium">© {new Date().getFullYear()} Leaf Herbarium • Botanical Fieldwork Archive</p>
      </footer>
      </div>
    </GlobalShell>
    </ReactLenis>
  );
}
