import { useEffect, useRef, useState } from 'react';
import { PearlButton } from './ui/pearl-button';
import soundSystem from '@/lib/sound-system';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

interface Props {
  onBeginJourney?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export default function CinematicHero({ onBeginJourney }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Safely attempt autoplay (handles mobile low-power policies gracefully)
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setVideoLoaded(true))
        .catch(() => {
          // If browser policy delays autoplay, activate on first canplay
        });
    }
  }, []);

  const handleAction = () => {
    soundSystem.playButtonClick();
    if (onBeginJourney) {
      onBeginJourney();
    } else {
      const el = document.getElementById('minimalism-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white text-black selection:bg-black selection:text-white flex flex-col items-center justify-center">
      {/* ── Background Video Layer (z-0) ────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          onPlaying={() => setVideoLoaded(true)}
          onLoadedData={() => setVideoLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Gradient overlay positioned over the video: pure white at top and bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/40 to-white pointer-events-none" />
      </div>

      {/* ── Centered Hero Section (z-10 - perfectly centered with top nav clearance) ── */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-24 sm:pt-28 md:pt-16 pb-10 sm:pb-14 max-w-5xl mx-auto w-full my-auto">
        {/* Headline with fluid responsive typography and balanced 2-line poetic structure on all devices */}
        <h1
          className="text-[2.65rem] xs:text-[3.2rem] sm:text-6xl md:text-7xl lg:text-[5.4rem] xl:text-[6.4rem] font-normal leading-[1.08] sm:leading-[1.04] tracking-[-1.2px] sm:tracking-[-2.4px] animate-fade-rise select-none"
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            color: '#000000',
          }}
        >
          <span className="block">
            Beyond <span className="italic text-[#6F6F6F]">silence,</span>
          </span>
          <span className="block mt-0.5 sm:mt-1 md:mt-1.5">
            we build <span className="italic text-[#6F6F6F]">the eternal.</span>
          </span>
        </h1>

        {/* Pearl Hero CTA Button with optimal touch target and spacing */}
        <div className="mt-8 sm:mt-10 md:mt-12 animate-fade-rise-delay flex items-center justify-center">
          <PearlButton
            label="Begin Journey"
            size="sm"
            onClick={handleAction}
            onPointerEnter={() => soundSystem.playButtonHover()}
          />
        </div>
      </main>
    </div>
  );
}
