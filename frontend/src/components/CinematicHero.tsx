import { useEffect, useRef, useState } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

interface Props {
  onExploreCollection?: () => void;
  onViewFieldProof?: () => void;
}

export default function CinematicHero({
  onExploreCollection,
  onViewFieldProof,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const [videoOpacity, setVideoOpacity] = useState(0);

  // ── Custom fade-in / fade-out loop logic ──────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const FADE_DURATION = 0.6;

    const checkTime = () => {
      if (video.duration && !video.paused) {
        const cur = video.currentTime;
        const dur = video.duration;

        if (cur < FADE_DURATION) {
          const inProgress = Math.max(0, Math.min(1, cur / FADE_DURATION));
          setVideoOpacity(inProgress * 0.75);
        } else if (cur > dur - FADE_DURATION) {
          const outProgress = Math.max(0, Math.min(1, (dur - cur) / FADE_DURATION));
          setVideoOpacity(outProgress * 0.75);
        } else {
          setVideoOpacity(0.75);
        }
      }

      rafRef.current = requestAnimationFrame(checkTime);
    };

    rafRef.current = requestAnimationFrame(checkTime);

    const handleEnded = () => {
      setVideoOpacity(0);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      cancelAnimationFrame(rafRef.current);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FAF7F2] text-[#1A2621] font-sans selection:bg-[#3F4E49] selection:text-[#FAF7F2] flex flex-col justify-between">
      
      {/* ── Background living video layer (z-0) with botanical dual-tint overlay ── */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-0 overflow-hidden pointer-events-none"
        style={{
          top: 'clamp(120px, 22vh, 260px)',
        }}
      >
        <video
          ref={videoRef}
          src={VIDEO_URL}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover transition-opacity duration-500 scale-105 filter brightness-[1.03] saturate-[0.88]"
          style={{ opacity: videoOpacity }}
        />

        {/* Botanical parchment gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2] via-[#FAF7F2]/60 to-[#FAF7F2] pointer-events-none" />
        <div className="absolute inset-0 bg-[#3F4E49]/10 mix-blend-multiply pointer-events-none" />
      </div>

      {/* Decorative botanical watermark (desktop only — overlaps badge on phones) */}
      <div aria-hidden="true" className="hidden sm:block absolute top-16 right-8 text-[180px] font-serif font-thin text-[#3F4E49]/[0.04] select-none pointer-events-none leading-none">
        Herbarium
      </div>

      {/* ── Hero Center Content (z-10) ─────────────────────────────────── */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-32 sm:pt-36 pb-16 sm:pb-24 max-w-5xl mx-auto my-auto">
        
        {/* Curated Botanical Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#EFE9DF] border border-[#E2D9CB] text-xs font-semibold tracking-wider uppercase text-[#3F4E49] mb-8 animate-fade-rise shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#3F4E49] animate-pulse" />
          <span>Botanical Taxonomical Study • Indore (M.P.)</span>
        </div>

        {/* Main Headline: "Leaf Herbarium" */}
        <h1
          className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal font-serif tracking-tight animate-fade-rise text-[#1A2621]"
          style={{ lineHeight: 0.95 }}
        >
          Leaf <span className="italic font-serif text-[#3F4E49]">Herbarium</span>
        </h1>

        {/* Sub-headline */}
        <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#53655D] mt-4 sm:mt-5 animate-fade-rise">
          8 leaves, pressed & preserved
        </p>

        {/* Botanical Description */}
        <p className="text-sm sm:text-base md:text-lg max-w-2xl mt-5 sm:mt-6 leading-relaxed text-[#5F6B65] animate-fade-rise-delay font-sans px-2 sm:px-0">
          A physical herbarium study preserving the morphological beauty, venation architecture, and medicinal wisdom of angiosperm leaves. Verified through in-situ geotagged field survey at Scheme No 114, Indore.
        </p>

        {/* Botanical Key Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6 mt-8 sm:mt-10 py-3 px-4 sm:px-8 bg-white/70 backdrop-blur-md rounded-2xl border border-[#E7DDCF] shadow-xs text-center animate-fade-rise-delay">
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold text-[#1A2621]">08</span>
            <span className="text-[11px] sm:text-xs text-[#6F7A74] tracking-wide uppercase font-medium">Pressed Sheets</span>
          </div>
          <div className="flex flex-col items-center border-x border-[#E7DDCF] px-2 sm:px-6">
            <span className="text-xl sm:text-2xl font-bold text-[#1A2621]">100%</span>
            <span className="text-[11px] sm:text-xs text-[#6F7A74] tracking-wide uppercase font-medium">In-Situ Geotagged</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold text-[#1A2621]">Indore</span>
            <span className="text-[11px] sm:text-xs text-[#6F7A74] tracking-wide uppercase font-medium">Field Survey</span>
          </div>
        </div>

        {/* Hero Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 sm:mt-10 animate-fade-rise-delay-2 w-full sm:w-auto">
          <button
            onClick={onExploreCollection}
            className="group w-full sm:w-auto px-8 sm:px-10 py-4 bg-[#3F4E49] hover:bg-[#2A3732] text-[#FAF7F2] font-semibold text-sm sm:text-base rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>View Collection</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          <button
            onClick={onViewFieldProof}
            className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-white/80 hover:bg-white text-[#3F4E49] border border-[#D5C9B7] font-semibold text-sm sm:text-base rounded-full shadow-xs hover:border-[#3F4E49] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Field Evidence & Geotag</span>
            <svg className="w-4 h-4 text-[#3F4E49]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </main>

      {/* ── Bottom Sub-strip: Quick Plant Names ticker (left-aligned scroll on phones) ── */}
      <div className="relative z-10 w-full border-t border-[#E7DDCF] bg-[#FAF7F2]/80 backdrop-blur-xs py-3 px-4 overflow-x-auto text-xs text-[#5D6B64] flex items-center justify-start sm:justify-center gap-4 sm:gap-8 whitespace-nowrap">
        <span className="font-semibold text-[#1A2621] uppercase tracking-wider text-[11px]">Featured Specimens:</span>
        <span className="hover:text-[#1A2621]">Neem</span> •
        <span className="hover:text-[#1A2621]">Hibiscus</span> •
        <span className="hover:text-[#1A2621]">Rose</span> •
        <span className="hover:text-[#1A2621]">Chinese Banyan</span> •
        <span className="hover:text-[#1A2621]">Marigold</span> •
        <span className="hover:text-[#1A2621]">Bougainvillea</span> •
        <span className="hover:text-[#1A2621]">Periwinkle</span> •
        <span className="hover:text-[#1A2621]">Gardenia</span>
      </div>
    </div>
  );
}
