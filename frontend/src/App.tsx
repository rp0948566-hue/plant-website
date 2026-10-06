import { useState } from 'react';
import ReactLenis from 'lenis/react';
import { Home, Leaf, MapPin, BookOpen } from 'lucide-react';
import GlobalShell from './components/GlobalShell';
import IntroAnimation from './components/IntroAnimation';
import CinematicHero from './components/CinematicHero';
import MinimalismSection from './components/MinimalismSection';
import LeafCollection from './components/LeafCollection';
import FieldProof from './components/FieldProof';
import HerbariumFooter from './components/HerbariumFooter';
import { BottomNavBar, type NavItem } from './components/ui/bottom-nav-bar';
import { LEAF_COLLECTION } from './data/leaves';

// ── Floating pill nav mapped to herbarium sections ──────────────────────────
const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', icon: Home, targetId: 'hero-top' },
  { label: 'Specimens', icon: Leaf, targetId: 'collection-section' },
  { label: 'Field Proof', icon: MapPin, targetId: 'field-proof-section' },
  { label: 'About', icon: BookOpen, targetId: 'about-section' },
];

function scrollToId(targetId: string | undefined) {
  if (!targetId) return;
  if (targetId === 'hero-top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.getElementById(targetId);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);

  // ── Intro Animation completion handler (plays once, then reveals) ─────────
  const handleIntroComplete = () => {
    setIntroFinished(true);
    setTimeout(() => {
      setOverlayVisible(false);
    }, 600);
  };

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.0, smoothWheel: true }}>
      <GlobalShell>
        <div className="w-full min-h-screen bg-[#FAF7F2] text-[#1A2621] selection:bg-[#3F4E49] selection:text-[#FAF7F2] relative overflow-x-clip flex flex-col">
          {/* ── Floating Top Navigation Pill ───────────────────────────────── */}
          <BottomNavBar
            stickyTop
            autoHideOnScroll
            items={NAV_ITEMS}
            onItemSelect={(item) => scrollToId(item.targetId)}
          />

          {/* ── Section 1: Herbarium Hero ──────────────────────────────────── */}
          <section id="hero-top" className="w-full min-h-screen relative">
            <CinematicHero
              onExploreCollection={() => scrollToId('collection-section')}
              onViewFieldProof={() => scrollToId('field-proof-section')}
            />
          </section>

          {/* ── Section 2: Eucalyptus Interlude ────────────────────────────── */}
          <section id="interlude-section" className="w-full min-h-screen relative flex-1 flex flex-col justify-between bg-[#F8F5EE]">
            <MinimalismSection />
          </section>

          {/* ── Section 3: 8 Preserved Leaf Specimens ───────────────────────── */}
          <div className="w-full relative">
            <LeafCollection specimens={LEAF_COLLECTION} />
          </div>

          {/* ── Section 4: In-Situ Fieldwork & Geotag Verification ─────────── */}
          <div className="w-full relative">
            <FieldProof />
          </div>

          {/* ── Section 5: Academic Project Submission Footer ──────────────── */}
          <div className="w-full relative">
            <HerbariumFooter onScrollToTop={() => scrollToId('hero-top')} />
          </div>

          {/* ── Opening Loading Animation Overlay (plays once on enter) ───── */}
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
      </GlobalShell>
    </ReactLenis>
  );
}
