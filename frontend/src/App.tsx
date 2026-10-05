import { useState, useEffect, useRef } from 'react';
import HeaderNav from './components/HeaderNav';
import CinematicHero from './components/CinematicHero';
import LeafCollection from './components/LeafCollection';
import FieldProof from './components/FieldProof';
import HerbariumFooter from './components/HerbariumFooter';
import { LEAF_COLLECTION } from './data/leaves';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');

  const heroRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const fieldProofRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // ── Smooth Scroll Navigation Handlers ──────────────────────────────────────
  const scrollTo = (target: 'Home' | 'Collection' | 'FieldProof' | 'About') => {
    setActiveTab(target);
    if (target === 'Home' && heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'Collection' && collectionRef.current) {
      collectionRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'FieldProof' && fieldProofRef.current) {
      fieldProofRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'About' && footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ── Intersection Observer to update active tab on scroll ──
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      const collTop = collectionRef.current?.offsetTop || vh;
      const fieldTop = fieldProofRef.current?.offsetTop || vh * 2;
      const footerTop = footerRef.current?.offsetTop || vh * 3;

      if (scrollY < collTop - 200) {
        setActiveTab('Home');
      } else if (scrollY < fieldTop - 200) {
        setActiveTab('Collection');
      } else if (scrollY < footerTop - 300) {
        setActiveTab('FieldProof');
      } else {
        setActiveTab('About');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    /* Global Botanical Inset Shell Application Wrapper */
    <div className="global-inset-shell paper-texture">
      {/* ── Fixed Top Header Navigation ─────────────────────────────────────── */}
      <HeaderNav
        activeTab={activeTab}
        onTabChange={(tab) => scrollTo(tab as 'Home' | 'Collection' | 'FieldProof' | 'About')}
      />

      {/* ── Section 1: Hero Section ────────────────────────────────────────── */}
      <div ref={heroRef} className="w-full relative">
        <CinematicHero
          onExploreCollection={() => scrollTo('Collection')}
          onViewFieldProof={() => scrollTo('FieldProof')}
        />
      </div>

      {/* ── Section 2: 8 Preserved Leaf Specimens Collection ───────────────── */}
      <div ref={collectionRef} className="w-full relative scroll-mt-20 sm:scroll-mt-24">
        <LeafCollection specimens={LEAF_COLLECTION} />
      </div>

      {/* ── Section 3: In-Situ Fieldwork & Geotag Verification ──────────────── */}
      <div ref={fieldProofRef} className="w-full relative scroll-mt-20 sm:scroll-mt-24">
        <FieldProof />
      </div>

      {/* ── Section 4: Academic Project Submission Footer ───────────────────── */}
      <div ref={footerRef} className="w-full relative scroll-mt-20 sm:scroll-mt-24">
        <HerbariumFooter onScrollToTop={() => scrollTo('Home')} />
      </div>
    </div>
  );
}
