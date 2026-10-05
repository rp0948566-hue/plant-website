import { useEffect, useRef } from 'react';

// ─── Easing ───────────────────────────────────────────────────────────────────
function easeInOutQuint(t: number): number {
  return t < 0.5
    ? 16 * t * t * t * t * t
    : 1 - Math.pow(-2 * t + 2, 5) / 2;
}
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}
function progress(t: number, start: number, end: number) {
  return clamp((t - start) / (end - start), 0, 1);
}

// ─── Config ───────────────────────────────────────────────────────────────────
const COLS        = 10;
const COL_STAGGER = 0.055;
const COL_DUR     = 0.92;
const CREAM_START = 0.5;
const DARK_DELAY  = 0.48;

const CREAM    = '#f0ece4';
const DARK_BG  = '#111113';
const GLOW     = 'rgba(110,52,155,0.13)';

// Computed timing constants
const CREAM_END   = CREAM_START + (COLS - 1) * COL_STAGGER + COL_DUR; // ≈1.915s
const DARK_START  = CREAM_END + DARK_DELAY;                             // ≈2.395s
const DARK_END    = DARK_START + (COLS - 1) * COL_STAGGER + COL_DUR;  // ≈3.810s
const SETTLE_HOLD = 0.35;

interface Props {
  onComplete?: () => void;
}

export default function IntroAnimation({ onComplete }: Props) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const rafRef       = useRef<number>(0);
  const t0Ref        = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (ts: number) => {
      if (!t0Ref.current) t0Ref.current = ts;
      const t = (ts - t0Ref.current) / 1000;

      // When animation finishes both waves and settles:
      if (onComplete && t >= DARK_END + SETTLE_HOLD && !completedRef.current) {
        completedRef.current = true;
        onComplete();
        return; // stop RAF
      }

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // ── Background ────────────────────────────────────────────────────────
      ctx.fillStyle = DARK_BG;
      ctx.fillRect(0, 0, W, H);

      // Purple glow — softens as cream wave arrives
      const glowFade = easeInOutQuint(progress(t, CREAM_START + 0.25, CREAM_END - 0.1));
      ctx.save();
      ctx.globalAlpha = clamp(1 - glowFade * 0.9, 0, 1);
      drawGlow(ctx, W, H);
      ctx.restore();

      const colW = W / COLS;

      // ── Phase 1: Cream panels (Bottom → Top) ──────────────────────────────
      for (let i = 0; i < COLS; i++) {
        const panelStart = CREAM_START + i * COL_STAGGER;
        const raw = progress(t, panelStart, panelStart + COL_DUR);
        if (raw <= 0) continue;
        const p     = easeInOutQuint(raw);
        const x     = i * colW;
        const y     = H * (1 - p);
        const alpha = easeOutQuart(Math.min(raw * 5.5, 1));

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = CREAM;
        ctx.fillRect(x, y, colW + 0.75, H);
        ctx.restore();

        if (raw < 0.96) {
          ctx.save();
          ctx.globalAlpha = alpha * Math.sin(raw * Math.PI) * 0.22;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, y, colW + 0.75, 2);
          ctx.restore();
        }
      }

      // ── Phase 2: Dark panels (Bottom → Top) ───────────────────────────────
      for (let i = 0; i < COLS; i++) {
        const panelStart = DARK_START + i * COL_STAGGER;
        const raw = progress(t, panelStart, panelStart + COL_DUR);
        if (raw <= 0) continue;
        const p     = easeInOutQuint(raw);
        const x     = i * colW;
        const y     = H * (1 - p);
        const alpha = easeOutQuart(Math.min(raw * 5.5, 1));

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = DARK_BG;
        ctx.fillRect(x, y, colW + 0.75, H);
        ctx.restore();

        if (raw < 0.96) {
          ctx.save();
          ctx.globalAlpha = alpha * Math.sin(raw * Math.PI) * 0.14;
          ctx.fillStyle = '#9966dd';
          ctx.fillRect(x, y, colW + 0.75, 2);
          ctx.restore();
        }
      }

      // Purple glow re-emerges as dark wave completes
      const glowReturn = easeOutCubic(
        progress(t, DARK_START + (COLS - 1) * COL_STAGGER, DARK_END)
      );
      if (glowReturn > 0) {
        ctx.save();
        ctx.globalAlpha = glowReturn * 0.92;
        drawGlow(ctx, W, H);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100vw', height: '100vh' }}
    />
  );
}

function drawGlow(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const r = Math.min(W, H) * 0.62;
  const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, r);
  g.addColorStop(0, GLOW);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}
