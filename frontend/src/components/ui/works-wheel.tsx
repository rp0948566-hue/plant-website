"use client";

// A portfolio index built as a wheel you turn.
//
// At rest the work sits in a ring around a title, each card tangent to the
// circle. The first notch of scroll blows the ring open into a vertical drum:
// the card at the front lies flat and full size, the ones above and below
// rotate away into hard perspective and run off the top and bottom of the
// frame. Keep turning and the drum carries the next piece round to the front.
//
// The whole thing is one number - `turn` - read by a single rAF pass that writes
// transforms straight to the DOM. 0 is the ring, 1 is the drum with item 0 at
// the front, and every whole number after that is one more item turned past.
import * as React from "react";
import { cn } from "@/lib/utils";
import soundSystem from "@/lib/sound-system";

export interface WorksWheelItem {
  /** Project name. Shown beside the front card and in the index. */
  title: string;
  /** One-line taxonomy info shown under the centred front-card title. */
  detail?: string;
  /** Cover art. Any src an <img> takes. */
  image: string;
  /** Where the card links to. Omit for a wheel that only browses. */
  href?: string;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children"
> {
  items: WorksWheelItem[];
  /** Sits in the middle of the ring. @default undefined */
  label?: string;
  /** Label on the card's hover affordance. Omit to drop it. @default undefined */
  action?: string;
  /** Extra scroll distance the drum rotation plays over. Default 280vh (desktop) / 220vh (mobile). */
  scrollDistance?: string;
}

/* Geometry. The card is measured against the stage; everything else is measured
   against the card, so a narrow stage - where the card is capped by width, not
   height - scales the whole wheel down with it instead of leaving a small card
   swinging on a huge drum. The three that matter are tuned together: STEP
   against DRUM sets how hard the neighbours rotate away, and DRUM against LENS
   decides whether they land inside the frame or run off it. */
const CARD_H = 0.38; // front card height, of the stage
const CARD_MAX_W = 0.34; // ... but never wider than this much of the stage
const CARD_RATIO = 1.45; // card width / height
const STEP = 40; // degrees between cards on the drum
const DRUM = 2.22; // drum radius, in card heights - and everything below likewise
const LENS = 2.7; // perspective distance
const RING_R = 1.14; // ring radius
/* The drum alone hangs the work on a plumb line. It isn't one: the strip curves
   away round an arc whose centre sits off to the LEFT, so the piece at the front
   is at the arc's near point - dead centre - and its neighbours have already
   swung back left as well as up and down. BOW is that arc's radius; nothing else
   makes the difference between a stack of cards and a wheel seen side on. */
const BOW = 1.82;
const TITLE = 0.124; // ring label and front-card title
const INDEX = 0.04; // the index down the right-hand side
/** Items either side of the front still worth drawing. Past this a card is
    edge-on, and further round it would stack up on the vanishing point. */
const CULL = 1.6;

/** Fraction of the remaining distance closed each frame. 1 = no smoothing. */
const EASE = 0.12;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Stage = { w: number; h: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

/** How far left the arc has carried something that has turned `drumDeg` off the
    front. Zero at the front, so the piece being read stays centred. */
const bowAt = (drumDeg: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDeg)));

/** Both states in one chain: the ring terms fall away as `m` reaches the drum,
    and the drum terms are still zero while the ring is up. The bow is applied
    first, in the wheel's own plane, so it slides the card sideways rather than
    turning with it - and perspective still shrinks it with distance. */
function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

export function WorksWheel({
  items,
  label = "Works '26",
  action = "View",
  scrollDistance = "280vh",
  className,
  ...props
}: WorksWheelProps) {
  const rootRef = React.useRef<HTMLElement | null>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);

  // The wheel's position, and where it is heading. Only `active` is state -
  // everything else is written to the DOM, so turning the wheel is not a render.
  const turn = React.useRef(0);
  const target = React.useRef(0);
  const lastActiveRef = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });
  const [viewer, setViewer] = React.useState<number | null>(null);

  // Photo-only viewer: ESC closes it (drum arrows keep working underneath)
  React.useEffect(() => {
    if (viewer === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewer(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewer]);

  const count = items.length;
  const last = Math.max(count - 1, 0);

  // Read after mount, not during render: the server has no matchMedia, and
  // branching on it inline is a hydration mismatch. Reduced motion drops the
  // easing, so the wheel lands where it is put instead of gliding there.
  const [reduced, setReduced] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const activeScrollDistance = isMobile ? "180vh" : scrollDistance;

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const isMobile = w < 640;
    const maxWFactor = isMobile ? 0.65 : w < 1024 ? 0.46 : CARD_MAX_W;
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * maxWFactor);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    // Shrink the ring's cards until the circle reads as a closed loop rather
    // than beads on a wire, however many pieces the wheel is given.
    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
      : 1;
    return {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      title: cardH * (isMobile ? 0.16 : TITLE),
      index: cardH * INDEX,
    };
  }, [stage, count]);

  const requestDrawRef = React.useRef<(() => void) | null>(null);

  // One pass per frame: ease toward the target, then write every transform.
  // Rests completely when idle or when scrolled off-screen to save 100% CPU on mobile.
  React.useEffect(() => {
    if (!stage.h) return;
    let frame = 0;
    let isVisible = true;
    const { ringR, ringScale, drumR, bow } = metrics;

    const el = stageRef.current;
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !frame) {
        requestDraw();
      }
    });
    if (el) io.observe(el);

    const draw = () => {
      frame = 0;
      if (!isVisible) return;

      const gap = target.current - turn.current;
      const isMoving = Math.abs(gap) > 0.0004;
      if (!isMoving) {
        turn.current = target.current;
      } else {
        turn.current += gap * (reduced ? 1 : EASE);
      }

      const t = turn.current;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);

      // The drum is pulled back so its front face lands on the picture plane.
      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;
      }

      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(
            d * (360 / count),
            drumDeg,
            ringR,
            drumR,
            bow,
            m,
          );
          card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
          card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
        }
        const face = card?.firstElementChild as HTMLElement | null;
        if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
      }

      if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
      if (titleRef.current) titleRef.current.style.opacity = String(m);
      const near = clamp(Math.round(pos), 0, last);
      if (near !== lastActiveRef.current) {
        lastActiveRef.current = near;
        soundSystem.playWheelTick(1);
      }
      setActive((prev) => (prev === near ? prev : near));

      if (isMoving && isVisible) {
        frame = requestAnimationFrame(draw);
      }
    };

    const requestDraw = () => {
      if (!frame && isVisible) {
        frame = requestAnimationFrame(draw);
      }
    };

    requestDrawRef.current = requestDraw;
    requestDraw();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      io.disconnect();
      requestDrawRef.current = null;
    };
  }, [metrics, stage.h, count, last, reduced]);

  const to = React.useCallback(
    (next: number) => {
      target.current = clamp(next, 0, last + 1);
      if (requestDrawRef.current) {
        requestDrawRef.current();
      }
    },
    [last],
  );

  // Synchronize drum rotation smoothly with page scroll through the pinned section
  React.useEffect(() => {
    const root = rootRef.current;
    const stageEl = stageRef.current;
    if (!root || !stageEl) return;

    const onScrollOrResize = () => {
      const top = root.getBoundingClientRect().top;
      const range = root.offsetHeight - stageEl.offsetHeight;
      if (range <= 0) return;
      const progress = clamp(-top / range, 0, 1);
      const scrollTarget = progress * (last + 1);
      to(scrollTarget);
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    onScrollOrResize();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [last, to]);

  // Smoothly scroll window to align with a specific project card
  const scrollToIndex = React.useCallback(
    (idx: number) => {
      const root = rootRef.current;
      const stageEl = stageRef.current;
      if (!root || !stageEl) return;
      const range = root.offsetHeight - stageEl.offsetHeight;
      if (range <= 0) return;
      const targetProgress = clamp(idx / (last + 1), 0, 1);
      const rootTop = root.getBoundingClientRect().top;
      const targetY = window.scrollY + rootTop + targetProgress * range;
      window.scrollTo({ top: targetY, behavior: "smooth" });
      soundSystem.playButtonClick();
    },
    [last],
  );

  const drag = React.useRef<number | null>(null);
  const tapPos = React.useRef<{ x: number; y: number } | null>(null);

  return (
    <section
      ref={rootRef}
      aria-label={label}
      className={cn(
        "relative w-full bg-white select-none",
        className,
      )}
      style={{ height: `calc(100vh + ${activeScrollDistance})` }}
      {...props}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`works-wheel-${active}`}
        className="sticky top-0 h-screen w-full overflow-hidden bg-white text-black cursor-grab outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 active:cursor-grabbing flex items-center justify-center"
        style={{ perspective: `${metrics.depth}px`, touchAction: "pan-y" }}
        onPointerDown={(event) => {
          drag.current = event.clientY;
          tapPos.current = { x: event.clientX, y: event.clientY };
          try {
            event.currentTarget.setPointerCapture(event.pointerId);
          } catch {}
        }}
        onPointerMove={(event) => {
          if (drag.current === null) return;
          const deltaY = drag.current - event.clientY;
          drag.current = event.clientY;
          window.scrollBy({ top: deltaY * 1.4, behavior: "auto" });
        }}
        onPointerUp={(event) => {
          drag.current = null;
          try {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          } catch {}
        }}
        onPointerCancel={(event) => {
          drag.current = null;
          tapPos.current = null;
          try {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          } catch {}
        }}
        onClick={(event) => {
          // Pointer capture retargets card taps to the stage: a near-stationary
          // press is a tap on the front card — open the photo-only viewer.
          // Real buttons (index list, mobile pill) keep their own behaviour.
          if ((event.target as HTMLElement).closest("button")) {
            tapPos.current = null;
            return;
          }
          if (tapPos.current) {
            const dx = event.clientX - tapPos.current.x;
            const dy = event.clientY - tapPos.current.y;
            if (dx * dx + dy * dy < 100) setViewer(active);
          }
          tapPos.current = null;
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") scrollToIndex(Math.min(last + 1, active + 2));
          else if (event.key === "ArrowUp") scrollToIndex(Math.max(0, active));
          else return;
          event.preventDefault();
        }}
      >
        <div
          ref={wheelRef}
          className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
        >
          {items.map((item, i) => {
            const Tag = (item.href ? "a" : "div") as "a";
            return (
              <React.Fragment key={item.title}>
                <Tag
                  id={`works-wheel-${i}`}
                  role="option"
                  aria-selected={i === active}
                  href={item.href}
                  ref={(node: HTMLElement | null) => {
                    cardRefs.current[i] = node;
                  }}
                  onClick={() => soundSystem.playButtonClick()}
                  onMouseEnter={() => soundSystem.playButtonHover()}
                  className="group absolute [backface-visibility:hidden]"
                  style={{
                    width: metrics.cardW,
                    height: metrics.cardH,
                    marginLeft: -metrics.cardW / 2,
                    marginTop: -metrics.cardH / 2,
                  }}
                >
                  <span className="bg-zinc-100 shadow-black/15 relative block size-full overflow-hidden rounded-xl shadow-[0_18px_40px_-18px_rgba(0,0,0,0.25)] border border-black/5">
                    <img
                      src={item.image}
                      alt={item.title}
                      draggable={false}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {action && item.href ? (
                      <span className="bg-white/90 text-black pointer-events-none absolute right-3 bottom-3 flex translate-y-1 items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-medium opacity-0 backdrop-blur-sm shadow-sm transition group-hover:translate-y-0 group-hover:opacity-100">
                        <svg
                          viewBox="0 0 12 12"
                          className="size-2.5"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 9 9 3M4 3h5v5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {action}
                      </span>
                    ) : null}
                  </span>
                </Tag>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Ring title and front-card title trade places across the transition.
          Type is sized off the measured stage, not vh, so the wheel keeps its
          proportions inside a card as well as at full bleed. */}
      <div
        ref={labelRef}
        className="pointer-events-none absolute inset-0 grid place-items-center font-bold tracking-tight text-black font-sans"
        style={{ fontSize: metrics.title }}
      >
        {label}
      </div>
      <div
        ref={titleRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-0 px-4 hidden"
      >
        <div
          className="font-bold tracking-tight text-black font-sans leading-none"
          style={{ fontSize: metrics.title * 0.52 }}
        >
          {items[active]?.title}
        </div>
        {items[active]?.detail && (
          <div
            className="font-serif italic text-neutral-600 mt-2"
            style={{ fontSize: Math.max(metrics.title * 0.22, 12) }}
          >
            {items[active]?.detail}
          </div>
        )}
      </div>

      <ol
        className="hidden sm:block text-zinc-500 absolute top-[7.5%] right-[3%] sm:right-[4%] text-right leading-[1.75] font-sans z-[120]"
        style={{ fontSize: metrics.index }}
      >
        {items.map((item, i) => (
          <li key={item.title}>
            <button
              type="button"
              onClick={() => scrollToIndex(i + 1)}
              className={cn(
                "focus-visible:outline-foreground cursor-pointer transition-colors outline-none focus-visible:outline-1 hover:text-black",
                i === active && "text-black font-semibold",
              )}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ol>

      {/* Fixed corner details card: active specimen name + taxonomy stay put while the drum turns */}
      <div className="absolute z-[120] pointer-events-none left-4 bottom-20 sm:left-8 sm:bottom-8 max-w-[210px] sm:max-w-xs rounded-2xl border border-black/10 bg-white/92 backdrop-blur-md px-3.5 py-3 sm:px-4 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.25)] text-left">
        <div className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-neutral-500">
          {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </div>
        <div className="font-sans font-bold text-sm sm:text-base text-black tracking-tight leading-tight mt-1">
          {items[active]?.title}
        </div>
        {items[active]?.detail && (
          <div className="font-serif italic text-xs sm:text-sm text-neutral-600 mt-0.5 leading-snug">
            {items[active]?.detail}
          </div>
        )}
      </div>

      {/* Mobile Active Project Pill Indicator & Touch Controls */}
      <div className="sm:hidden absolute bottom-5 inset-x-0 flex items-center justify-center pointer-events-none z-[120] px-4">
        <div className="bg-white/95 backdrop-blur-md border border-black/10 px-3 py-1.5 rounded-full shadow-md text-xs font-medium text-black flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => scrollToIndex(Math.max(0, active))}
            className="p-1 hover:bg-black/5 active:scale-95 transition-all text-black"
            aria-label="Previous work"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="text-zinc-400 font-mono text-[11px] min-w-[36px] text-center">{active + 1} / {count}</span>
          <span className="font-semibold truncate max-w-[130px]">{items[active]?.title}</span>
          <button
            type="button"
            onClick={() => scrollToIndex(Math.min(last + 1, active + 2))}
            className="p-1 hover:bg-black/5 active:scale-95 transition-all text-black"
            aria-label="Next work"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
      {/* Photo-only viewer: full photograph, zero details */}
      {viewer !== null && items[viewer] && (
        <div
          className="fixed inset-0 z-[200] bg-black/92 backdrop-blur-md flex items-center justify-center p-4 select-none"
          onClick={() => setViewer(null)}
          role="dialog"
          aria-label="Specimen photograph viewer"
        >
          <button
            type="button"
            onClick={() => setViewer(null)}
            aria-label="Close photograph viewer"
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 text-lg leading-none"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewer((v) => (v === null ? v : (v - 1 + count) % count));
            }}
            aria-label="Previous photograph"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 text-xl leading-none"
          >
            ‹
          </button>
          <img
            src={items[viewer].image}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-[86vh] max-w-full object-contain rounded-lg shadow-2xl"
            draggable={false}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewer((v) => (v === null ? v : (v + 1) % count));
            }}
            aria-label="Next photograph"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 text-xl leading-none"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}

// Curated pressed-sheet portfolio items from public/images/IMAGE
export const DEFAULT_WORKS: WorksWheelItem[] = [
  {
    title: "Gardenia (Gandharaj)",
    detail: "Gardenia jasminoides • Rubiaceae",
    image: "/images/IMAGE/0e755a6a-649e-4c15-a5cf-011359c928fb.jpg",
    href: "#gardenia",
  },
  {
    title: "Neem Tree",
    detail: "Azadirachta indica • Meliaceae",
    image: "/images/IMAGE/1528e485-40dd-4482-a081-cc24ca87f081.jpg",
    href: "#neem",
  },
  {
    title: "Crown of Thorns",
    detail: "Euphorbia milii • Euphorbiaceae",
    image: "/images/IMAGE/2446ea63-3b36-4f8b-b00c-fa218e1fec3d.jpg",
    href: "#crown-of-thorns",
  },
  {
    title: "Madagascar Periwinkle",
    detail: "Catharanthus roseus • Apocynaceae",
    image: "/images/IMAGE/27cdd2d7-6403-4ff7-999e-8e32466d461a.jpg",
    href: "#periwinkle",
  },
  {
    title: "Hibiscus (China Rose)",
    detail: "Hibiscus rosa-sinensis • Malvaceae",
    image: "/images/IMAGE/280d8781-19fb-4dbd-a1e4-a3598018638a.jpg",
    href: "#hibiscus",
  },
  {
    title: "Chinese Banyan",
    detail: "Ficus microcarpa • Moraceae",
    image: "/images/IMAGE/432f6c47-bcd3-404e-905e-3f87d97aa987.jpg",
    href: "#banyan",
  },
  {
    title: "Bougainvillea (Paper Flower)",
    detail: "Bougainvillea spectabilis • Nyctaginaceae",
    image: "/images/IMAGE/94713c19-0267-4f93-bb37-e96a1d1f3335.jpg",
    href: "#bougainvillea",
  },
  {
    title: "Marigold (Genda)",
    detail: "Tagetes erecta • Asteraceae",
    image: "/images/IMAGE/ea3b6b18-374b-400c-9762-58214325b0bc.jpg",
    href: "#marigold",
  },
  {
    title: "Classic Rose",
    detail: "Rosa damascena • Rosaceae",
    image: "/images/IMAGE/f5dae4b8-cb5c-424a-bb7f-f334581df158.jpg",
    href: "#rose",
  },
];

export default WorksWheel;
