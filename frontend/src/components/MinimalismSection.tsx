import { useState, useEffect } from 'react';

interface Props {
  currentSlide: number;
  totalSlides: number;
  onNextSlide: () => void;
  onPrevSlide: () => void;
}

export default function MinimalismSection({
  currentSlide,
  totalSlides,
  onNextSlide,
  onPrevSlide,
}: Props) {
  const formattedCurrent = String(currentSlide).padStart(2, '0');
  const formattedTotal = String(totalSlides).padStart(2, '0');

  return (
    <section className="relative w-full min-h-screen bg-[#F8F8F8] text-black flex flex-col justify-between px-4 sm:px-16 py-8 sm:py-10 selection:bg-black selection:text-white overflow-hidden">
      
      {/* ── Left Side Decorative Eucalyptus Leaf Branch (left.png) ────────── */}
      <div className="absolute left-0 top-0 bottom-0 z-0 pointer-events-none flex items-center">
        <img
          src="/left.png"
          alt="Eucalyptus Left Branch"
          className="h-[105%] sm:h-[120%] w-auto object-contain max-w-[720px] sm:max-w-[1440px] opacity-95 -ml-2 sm:-ml-4"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/eucalyptus_left.png';
          }}
        />
      </div>

      {/* ── Right Side Decorative Eucalyptus Leaf Branch (rite.png) ───────── */}
      <div className="absolute right-[1%] sm:right-[4%] bottom-0 z-0 pointer-events-none flex items-end">
        <img
          src="/rite.png"
          alt="Eucalyptus Right Branch"
          className="h-[98%] sm:h-[115%] w-auto object-contain max-w-[570px] sm:max-w-[1270px] opacity-95"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/eucalyptus_right.png';
          }}
        />
      </div>

      {/* ── Main Content Area (Shifted slightly to the right) ─────────────── */}
      <div
        className="flex-1 flex flex-col justify-center max-w-4xl pt-16 sm:pt-20 pb-10 sm:pb-12 z-10 pr-12 sm:pr-16 pl-24 xs:pl-32 sm:pl-[min(26vw,360px)]"
      >
        {/* Headline: "Minimalism is freedom" - Big, bold, heavy grotesk font */}
        <h2 className="text-4xl xs:text-5xl sm:text-7xl md:text-[5.5rem] lg:text-[6.2rem] font-black tracking-tight text-[#111111] leading-[1.02] animate-fade-rise">
          Minimalism is <br />
          freedom
        </h2>

        {/* Paragraph description */}
        <p className="mt-4 sm:mt-6 text-xs sm:text-base text-[#666666] max-w-xs sm:max-w-sm leading-relaxed font-normal animate-fade-rise-delay">
          Minimalism is a tool that can help you find freedom. Freedom from fear.
          Freedom from worry. Freedom to overcome. Freedom from guilt. Freedom
          from depression.
        </p>

        {/* Action Link: "Read more ›" */}
        <div className="mt-5 sm:mt-6 animate-fade-rise-delay-2">
          <a
            href="#read-more"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#111111] group transition-opacity hover:opacity-75"
          >
            Read more
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              ›
            </span>
          </a>
        </div>
      </div>

      {/* ── Bottom Bar: Social Links (Indented to match headline alignment) ──────── */}
      <div
        className="flex items-center gap-6 sm:gap-8 text-xs sm:text-base font-bold text-[#111111] z-10 pb-2 sm:pb-4 pl-24 xs:pl-32 sm:pl-[min(26vw,360px)]"
      >
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-70 transition-opacity"
        >
          Instagram
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-70 transition-opacity"
        >
          Facebook
        </a>
      </div>

      {/* ── Right Vertical Slider Control ─────────────────────────────────── */}
      <div className="absolute right-3 sm:right-16 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 sm:gap-4 z-20">
        {/* Up / Prev Arrow */}
        <button
          onClick={onPrevSlide}
          className="p-1 sm:p-2 text-black hover:opacity-60 transition-opacity cursor-pointer"
          aria-label="Previous slide"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>

        {/* Total slides number (small muted top number) */}
        <span className="text-xs sm:text-sm font-semibold text-[#A0A0A0] tracking-widest">
          {formattedTotal}
        </span>

        {/* Vertical Progress Line */}
        <div className="w-[1.5px] h-14 sm:h-20 bg-neutral-300 relative overflow-hidden my-1">
          <div
            className="absolute top-0 left-0 w-full bg-black transition-all duration-500 ease-out"
            style={{
              height: `${(currentSlide / totalSlides) * 100}%`,
            }}
          />
        </div>

        {/* Current slide number (large bold bottom number) */}
        <span className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tighter">
          {formattedCurrent}
        </span>

        {/* Down / Next Arrow */}
        <button
          onClick={onNextSlide}
          className="p-1 sm:p-2 text-black hover:opacity-60 transition-opacity cursor-pointer"
          aria-label="Next slide"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </button>
      </div>

    </section>
  );
}
