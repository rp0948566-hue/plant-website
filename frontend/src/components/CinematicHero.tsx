import { useEffect, useRef, useState } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

interface Props {
  onReplayIntro?: () => void;
}

export default function CinematicHero() {
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
      {/* ── Scenic video background layer full-screen (z-0) ────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
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
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white pointer-events-none" />
      </div>

      {/* ── Empty Hero Section Spacer ───────────────────────────────────────── */}
      <main className="relative z-10 min-h-screen w-full" />
    </div>
  );
}
