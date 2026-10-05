import { useState, useEffect, useRef } from 'react';
import IntroAnimation from './components/IntroAnimation';
import HeaderNav from './components/HeaderNav';
import CinematicHero from './components/CinematicHero';
import MinimalismSection from './components/MinimalismSection';

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 4;

  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);

  // ── Intro Animation completion handler ────────────────────────────────────
  const handleIntroComplete = () => {
    setIntroFinished(true);
    setTimeout(() => {
      setOverlayVisible(false);
    }, 600);
  };

  // ── Smooth Scroll Navigation Handlers ──────────────────────────────────────
  const scrollToSection = (sectionIndex: number) => {
    if (sectionIndex === 1 && section1Ref.current) {
      section1Ref.current.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionIndex >= 2 && section2Ref.current) {
      section2Ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNextSlide = () => {
    const next = currentSlide >= totalSlides ? 1 : currentSlide + 1;
    scrollToSection(next);
  };

  const handlePrevSlide = () => {
    const prev = currentSlide <= 1 ? totalSlides : currentSlide - 1;
    scrollToSection(prev);
  };

  // ── Intersection Observer to update active tab & slide counter on scroll ──
  useEffect(() => {
    if (!introFinished) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const vh = window.innerHeight;

      if (scrollPos < vh * 0.5) {
        setCurrentSlide(1);
        setActiveTab('Home');
      } else {
        setCurrentSlide(2);
        setActiveTab('Studio');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [introFinished]);

  return (
    <div className="w-full min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* ── Fixed Top Header Navigation (Aethera® | Home Studio About Journal Reach Us | Begin Journey) ── */}
      {introFinished && (
        <HeaderNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === 'Home') scrollToSection(1);
            else scrollToSection(2);
          }}
        />
      )}

      {/* ── Section 1: Cinematic Video Hero Section ────────────────────────── */}
      <div ref={section1Ref} className="w-full relative">
        <CinematicHero />
      </div>

      {/* ── Section 2: Minimalism is Freedom Section ──────────────────────── */}
      <div ref={section2Ref} className="w-full relative">
        <MinimalismSection
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          onNextSlide={handleNextSlide}
          onPrevSlide={handlePrevSlide}
        />
      </div>

      {/* ── Opening Loading Animation Overlay (Plays ONCE on enter, then vanishes) ── */}
      {overlayVisible && (
        <div
          className="fixed inset-0 z-50 transition-opacity duration-600 ease-out"
          style={{
            opacity: introFinished ? 0 : 1,
            pointerEvents: introFinished ? 'none' : 'auto',
          }}
        >
          <IntroAnimation onComplete={handleIntroComplete} />
        </div>
      )}
    </div>
  );
}
