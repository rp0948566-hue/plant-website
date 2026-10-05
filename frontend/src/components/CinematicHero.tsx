import { useEffect, useRef, useState } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

interface Props {
  onReplayIntro?: () => void;
}

export default function CinematicHero({ onReplayIntro }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const [videoOpacity, setVideoOpacity] = useState(0);

  // ── Custom fade-in / fade-out loop logic ──────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const FADE_DURATION = 0.5; // seconds

    const checkTime = () => {
      if (video.duration && !video.paused) {
        const cur = video.currentTime;
        const dur = video.duration;

        // Fade in over 0.5s at the start (opacity 0 to 1)
        if (cur < FADE_DURATION) {
          const inProgress = Math.max(0, Math.min(1, cur / FADE_DURATION));
          setVideoOpacity(inProgress);
        }
        // Fade out over 0.5s before the end (opacity 1 to 0)
        else if (cur > dur - FADE_DURATION) {
          const outProgress = Math.max(0, Math.min(1, (dur - cur) / FADE_DURATION));
          setVideoOpacity(outProgress);
        } else {
          setVideoOpacity(1);
        }
      }

      rafRef.current = requestAnimationFrame(checkTime);
    };

    rafRef.current = requestAnimationFrame(checkTime);

    // On ended event: set opacity to 0, wait 100ms, reset currentTime = 0, then play()
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
    <div className="relative min-h-screen w-full overflow-hidden bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* ── Background video layer (z-0) ────────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 z-0 overflow-hidden pointer-events-none"
        style={{
          top: 'clamp(200px, 30vh, 300px)',
        }}
      >
        <video
          ref={videoRef}
          src={VIDEO_URL}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: videoOpacity }}
        />

        {/* Gradient overlay positioned over the video: from white via transparent to white */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />
      </div>

      {/* ── Hero Section (z-10) ─────────────────────────────────────────── */}
      <main
        className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-24 sm:pt-32 pb-24 sm:pb-32"
      >
        {/* Headline: "Beyond silence, we build the eternal." */}
        <h1
          className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal font-serif animate-fade-rise"
          style={{
            lineHeight: 0.98,
            letterSpacing: '-0.04em',
            color: '#000000',
          }}
        >
          Beyond{' '}
          <span className="italic text-[#6F6F6F]">silence,</span>{' '}
          we build{' '}
          <span className="italic text-[#6F6F6F]">the</span>
          <br className="hidden xs:inline" />{' '}
          <span className="italic text-[#6F6F6F]">eternal.</span>
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg max-w-2xl mt-6 sm:mt-8 leading-relaxed text-[#6F6F6F] animate-fade-rise-delay font-sans px-2 sm:px-0">
          Building platforms for brilliant minds, fearless makers, and thoughtful
          souls. Through the noise, we craft digital havens for deep work and
          pure flows.
        </p>

        {/* Hero CTA Button */}
        <button className="hero-cta-btn animate-fade-rise-delay-2 !mt-8 sm:!mt-12 !px-10 sm:!px-14 !py-4 sm:!py-5 !text-sm sm:!text-base">
          Begin Journey
        </button>
      </main>

      {/* Subtle replay intro trigger fixed at bottom right */}
      {onReplayIntro && (
        <button
          onClick={onReplayIntro}
          className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs text-[#6F6F6F] hover:text-black bg-white/80 backdrop-blur-md rounded-full border border-neutral-200 hover:border-black transition-all shadow-sm"
          title="Replay opening animation"
        >
          ↺ Replay Intro
        </button>
      )}
    </div>
  );
}
