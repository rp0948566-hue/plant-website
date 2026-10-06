interface Props {
  currentSlide?: number;
  totalSlides?: number;
  onNextSlide?: () => void;
  onPrevSlide?: () => void;
}

export default function MinimalismSection(_props: Props) {
  return (
    <section className="relative w-full min-h-[80vh] sm:min-h-screen bg-transparent text-black flex flex-col justify-between selection:bg-black selection:text-white overflow-hidden">
      
      {/* ── Left Side Decorative Eucalyptus Leaf Branch (100% Fully Visible, No Cutoff) ── */}
      <div className="absolute left-0 top-0 bottom-0 z-0 pointer-events-none flex items-center">
        <img
          src="/left.png"
          alt="Eucalyptus Left Branch"
          className="h-[42%] sm:h-[84%] md:h-[90%] w-auto object-contain object-left opacity-100 select-none"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/eucalyptus_left.png';
          }}
        />
      </div>

      {/* ── Right Side Decorative Eucalyptus Leaf Branch (Hidden on Phone & Tablet, only on Desktop) ── */}
      <div className="hidden lg:flex absolute right-0 lg:right-[1%] xl:right-[2%] bottom-0 z-0 pointer-events-none items-end justify-end opacity-95 xl:opacity-100 transition-all">
        <img
          src="/rite.png"
          alt="Eucalyptus Right Branch"
          className="h-[110vh] lg:h-[114vh] xl:h-[118vh] w-auto object-contain object-bottom max-w-[960px] lg:max-w-[1100px] xl:max-w-[1150px] select-none translate-y-2 lg:translate-y-4"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/eucalyptus_right.png';
          }}
        />
      </div>

      {/* ── Main Content Area (in-flow centered so short screens never clip) ──── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-12 py-14 sm:py-28">
          {/* Interlude headline: eucalyptus-branch showcase with herbarium wording */}
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#3F4E49] mb-4">
            From Field to Sheet
          </p>
          <h1
            className="text-[2.3rem] xs:text-[2.8rem] sm:text-6xl md:text-7xl lg:text-[6.2rem] xl:text-[7.2rem] tracking-tight text-[#111111] leading-[0.94] text-center uppercase font-condensed"
            style={{ fontFamily: 'var(--font-condensed)' }}
          >
            <span className="block">Pressed with</span>
            <span className="block">patience</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm sm:text-base text-[#5F6B65] leading-relaxed">
            Eight leaves gathered under midday sun, dried under steady pressure,
            and mounted for study — no shortcuts, only craft.
          </p>
      </div>

    </section>
  );
}
