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

  const activeScrollDistance = isMobile ? "220vh" : scrollDistance;

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
          try {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          } catch {}
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
        className="pointer-events-none absolute top-1/2 left-[6%] sm:left-[8%] -translate-y-1/2 font-bold tracking-tight text-black font-sans opacity-0"
        style={{ fontSize: metrics.title }}
      >
        {items[active]?.title}
      </div>

      <ol
        className="hidden sm:block text-zinc-500 absolute top-[7.5%] right-[3%] sm:right-[4%] text-right leading-[1.75] font-sans"
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

      {/* Mobile Active Project Pill Indicator & Touch Controls */}
      <div className="sm:hidden absolute bottom-5 inset-x-0 flex items-center justify-center pointer-events-none z-20 px-4">
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
    </section>
  );
}

// Curated botanical portfolio items from public/images/END
export const DEFAULT_WORKS: WorksWheelItem[] = [
  {
    title: "Sadabahar (Periwinkle)",
    image: "/images/END/569dbf58-cbb8-4ecd-b27c-c980345f9d55.jpg",
    href: "#periwinkle",
  },
  {
    title: "Crown of Thorns",
    image: "/images/END/5c64518f-6b46-4ee8-9cd3-3dde2be6c904.jpg",
    href: "#crown-of-thorns",
  },
  {
    title: "China Rose (Hibiscus)",
    image: "/images/END/665811c0-3bca-4d39-9ec6-c27bfb8ca0d9.jpg",
    href: "#hibiscus",
  },
  {
    title: "Marigold (Genda)",
    image: "/images/END/6975852e-1209-49ff-a0c1-71c4a0184106.jpg",
    href: "#marigold",
  },
  {
    title: "Bougainvillea",
    image: "/images/END/7e10ff4b-c94f-45c8-aa84-9724c221a934.jpg",
    href: "#bougainvillea",
  },
  {
    title: "Gandharaj (Gardenia)",
    image: "/images/END/825e0a0e-15e2-485a-90f9-30202500c621.jpg",
    href: "#gardenia",
  },
  {
    title: "Yellow Elder (Tecoma)",
    image: "/images/END/c039281d-b13a-40fb-8861-0762db9d0fc9.jpg",
    href: "#tecoma",
  },
  {
    title: "Chinese Banyan (Ficus)",
    image: "/images/END/d16f7345-6979-4eff-ba85-3f6c14223fa7.jpg",
    href: "#ficus",
  },
  {
    title: "Classic Rose (Gulab)",
    image: "/images/END/dec0e244-7d8e-4480-9350-a4ea73b63886.jpg",
    href: "#rose",
  },
];

export default WorksWheel;
