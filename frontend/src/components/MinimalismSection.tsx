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
    <section className="relative w-full min-h-screen bg-[#F8F8F8] text-black flex flex-col justify-between px-8 sm:px-16 py-10 selection:bg-black selection:text-white overflow-hidden">
      
      {/* ── Main Content Area (Indented to the right matching Image 3) ─────────────── */}
      <div
        className="flex-1 flex flex-col justify-center max-w-4xl pt-20 pb-12 z-10"
        style={{
          paddingLeft: 'min(20vw, 280px)',
        }}
      >
        {/* Headline: "Minimalism is freedom" - Big, bold, heavy grotesk font */}
        <h2 className="text-5xl sm:text-7xl md:text-[5.5rem] lg:text-[6.2rem] font-black tracking-tight text-[#111111] leading-[1.02] animate-fade-rise">
          Minimalism is <br />
          freedom
        </h2>

        {/* Paragraph description */}
        <p className="mt-6 text-sm sm:text-base text-[#666666] max-w-sm leading-relaxed font-normal animate-fade-rise-delay">
          Minimalism is a tool that can help you find freedom. Freedom from fear.
          Freedom from worry. Freedom to overcome. Freedom from guilt. Freedom
          from depression.
        </p>

        {/* Action Link: "Read more ›" */}
        <div className="mt-6 animate-fade-rise-delay-2">
          <a
            href="#read-more"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#111111] group transition-opacity hover:opacity-75"
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
        className="flex items-center gap-8 text-sm sm:text-base font-bold text-[#111111] z-10 pb-4"
        style={{
          paddingLeft: 'min(20vw, 280px)',
        }}
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
      <div className="absolute right-8 sm:right-16 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-20">
        {/* Up / Prev Arrow */}
        <button
          onClick={onPrevSlide}
          className="p-2 text-black hover:opacity-60 transition-opacity cursor-pointer"
          aria-label="Previous slide"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>

        {/* Total slides number (small muted top number) */}
        <span className="text-sm font-semibold text-[#A0A0A0] tracking-widest">
          {formattedTotal}
        </span>

        {/* Vertical Progress Line */}
        <div className="w-[1.5px] h-20 bg-neutral-300 relative overflow-hidden my-1">
          <div
            className="absolute top-0 left-0 w-full bg-black transition-all duration-500 ease-out"
            style={{
              height: `${(currentSlide / totalSlides) * 100}%`,
            }}
          />
        </div>

        {/* Current slide number (large bold bottom number) */}
        <span className="text-3xl font-bold text-[#111111] tracking-tighter">
          {formattedCurrent}
        </span>

        {/* Down / Next Arrow */}
        <button
          onClick={onNextSlide}
          className="p-2 text-black hover:opacity-60 transition-opacity cursor-pointer"
          aria-label="Next slide"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </button>
      </div>

    </section>
  );
}
