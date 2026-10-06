"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Leaf,
  Sparkles,
} from "lucide-react";
import soundSystem from "@/lib/sound-system";
import { useLenis } from "lenis/react";

// --- Botanical Herbarium Specimen Dataset (All 9 Images from public/images/IMAGE) ---
export interface BotanicalSpecimen {
  id: number;
  name: string;
  scientificName: string;
  family: string;
  category: string;
  sheetNumber: string;
  description: string;
  image: string;
}

export const botanicalSpecimens: BotanicalSpecimen[] = [
  {
    id: 1,
    name: "Gardenia (Gandharaj)",
    scientificName: "Gardenia jasminoides",
    family: "Rubiaceae",
    category: "Fragrant Ornamental Shrub",
    sheetNumber: "HERB-01",
    description:
      "Distinguished by intensely fragrant porcelain-white blooms and lustrous, dark-green coriaceous leaves. Celebrated across classical botany and ceremonial perfumery for its calming, meditative essence.",
    image: "/images/IMAGE/0e755a6a-649e-4c15-a5cf-011359c928fb.jpg",
  },
  {
    id: 2,
    name: "Neem Tree",
    scientificName: "Azadirachta indica",
    family: "Meliaceae",
    category: "Sacred Medicinal Flora",
    sheetNumber: "HERB-02",
    description:
      "Revered across ancient botanical pharmacopeias featuring serrated pinnate leaflets. Highly prized for natural antibacterial, purifying, and cellular regenerative botanical compounds.",
    image: "/images/IMAGE/1528e485-40dd-4482-a081-cc24ca87f081.jpg",
  },
  {
    id: 3,
    name: "Crown of Thorns",
    scientificName: "Euphorbia milii",
    family: "Euphorbiaceae",
    category: "Succulent Flowering Shrub",
    sheetNumber: "HERB-03",
    description:
      "A resilient spinescent succulent displaying stout ribbed stems with protective thorns, crowned by bright emerald foliage and vivid scarlet petaloid cyathia.",
    image: "/images/IMAGE/2446ea63-3b36-4f8b-b00c-fa218e1fec3d.jpg",
  },
  {
    id: 4,
    name: "Madagascar Periwinkle",
    scientificName: "Catharanthus roseus",
    family: "Apocynaceae",
    category: "Enduring Medicinal Perennial",
    sheetNumber: "HERB-04",
    description:
      "Evergreen herbaceous subshrub with glossy oval leaves and symmetrical salverform petals. Renowned in modern medicine as the primary source of life-saving vinca alkaloids.",
    image: "/images/IMAGE/27cdd2d7-6403-4ff7-999e-8e32466d461a.jpg",
  },
  {
    id: 5,
    name: "Hibiscus (China Rose)",
    scientificName: "Hibiscus rosa-sinensis",
    family: "Malvaceae",
    category: "Tropical Flowering Shrub",
    sheetNumber: "HERB-05",
    description:
      "A magnificent tropical botanical specimen boasting flared crimson corollas and an iconic elongated staminal column. Cherished as a sacred offering of devotion and vitality.",
    image: "/images/IMAGE/280d8781-19fb-4dbd-a1e4-a3598018638a.jpg",
  },
  {
    id: 6,
    name: "Chinese Banyan",
    scientificName: "Ficus microcarpa",
    family: "Moraceae",
    category: "Canopy Fig / Living Bonsai",
    sheetNumber: "HERB-06",
    description:
      "An enduring specimen featuring thick coriaceous leaves and sculptural aerial prop roots that anchor ancient canopies. An eternal symbol of rootedness and perseverance.",
    image: "/images/IMAGE/432f6c47-bcd3-404e-905e-3f87d97aa987.jpg",
  },
  {
    id: 7,
    name: "Bougainvillea (Paper Flower)",
    scientificName: "Bougainvillea spectabilis",
    family: "Nyctaginaceae",
    category: "Architectural Woody Climber",
    sheetNumber: "HERB-07",
    description:
      "Thorny vigorous climber adorned with vivid paper-thin chartaceous bracts surrounding tiny cream tubular florets. A sun-drenched architectural drapery of timeless beauty.",
    image: "/images/IMAGE/94713c19-0267-4f93-bb37-e96a1d1f3335.jpg",
  },
  {
    id: 8,
    name: "Marigold (Genda)",
    scientificName: "Tagetes erecta",
    family: "Asteraceae",
    category: "Aromatic Solar Bloom",
    sheetNumber: "HERB-08",
    description:
      "Intensely aromatic composite bloom featuring ruffled golden-orange floral globes. Ancient ritual flora rich in natural carotenoid pigments, radiating warmth and celebration.",
    image: "/images/IMAGE/ea3b6b18-374b-400c-9762-58214325b0bc.jpg",
  },
  {
    id: 9,
    name: "Classic Rose",
    scientificName: "Rosa damascena",
    family: "Rosaceae",
    category: "Aromatic Perennial Flora",
    sheetNumber: "HERB-09",
    description:
      "The quintessential archival rose specimen with serrate leaflets and delicate multi-layered petals harvested for essential attar oils, celebrated in botanical poetry for centuries.",
    image: "/images/IMAGE/f5dae4b8-cb5c-424a-bb7f-f334581df158.jpg",
  },
];

// Fallback image helper
const safeImage = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  target.src =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
};

// --- Main Component ---
export default function OrbitCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  // Lightbox Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Responsive auto-detected orbit geometry
  const getResponsiveValues = () => {
    // 1. Ultra-wide & Large Desktop (>= 1380px)
    if (windowWidth >= 1380) {
      return {
        containerRadius: 360,
        profileSize: 110,
        cardWidth: "w-[360px]",
        cardPadding: "p-7 md:p-8",
        avatarSize: "w-28 h-28",
        avatarMargin: "-mt-16",
        fontSize: {
          name: "text-2xl sm:text-3xl",
          role: "text-xs sm:text-sm",
          latin: "text-xs sm:text-sm",
        },
      };
    }
    // 2. Standard Desktop / Laptop (1180px - 1379px)
    if (windowWidth >= 1180) {
      return {
        containerRadius: 320,
        profileSize: 98,
        cardWidth: "w-[330px]",
        cardPadding: "p-6 sm:p-7",
        avatarSize: "w-24 h-24",
        avatarMargin: "-mt-14",
        fontSize: {
          name: "text-2xl",
          role: "text-xs sm:text-sm",
          latin: "text-xs sm:text-sm",
        },
      };
    }
    // 3. Small Laptop / Large Tablet Landscape (960px - 1179px)
    if (windowWidth >= 960) {
      return {
        containerRadius: 280,
        profileSize: 88,
        cardWidth: "w-[300px]",
        cardPadding: "p-5 sm:p-6",
        avatarSize: "w-22 h-22",
        avatarMargin: "-mt-13",
        fontSize: {
          name: "text-xl sm:text-2xl",
          role: "text-xs",
          latin: "text-xs",
        },
      };
    }
    // 4. Tablet Portrait (680px - 959px)
    if (windowWidth >= 680) {
      return {
        containerRadius: 240,
        profileSize: 76,
        cardWidth: "w-[275px]",
        cardPadding: "p-5",
        avatarSize: "w-20 h-20",
        avatarMargin: "-mt-12",
        fontSize: {
          name: "text-xl",
          role: "text-[11px] sm:text-xs",
          latin: "text-[11px] sm:text-xs",
        },
      };
    }
    // 5. Phablet / Large Mobile (480px - 679px)
    if (windowWidth >= 480) {
      const pSize = 60;
      const maxRadius = Math.floor((windowWidth - pSize - 32) / 2);
      const cRadius = Math.max(150, Math.min(maxRadius, 205));
      return {
        containerRadius: cRadius,
        profileSize: pSize,
        cardWidth: "w-[245px]",
        cardPadding: "p-4 sm:p-5",
        avatarSize: "w-18 h-18",
        avatarMargin: "-mt-10",
        fontSize: {
          name: "text-lg sm:text-xl",
          role: "text-[11px]",
          latin: "text-[11px]",
        },
      };
    }
    // 6. Mobile Phone (< 480px)
    const pSize = windowWidth < 380 ? 46 : 50;
    const maxRadius = Math.floor((windowWidth - pSize - 28) / 2);
    const cRadius = Math.max(110, Math.min(maxRadius, 146));
    return {
      containerRadius: cRadius,
      profileSize: pSize,
      cardWidth: windowWidth < 380 ? "w-[200px]" : "w-[225px]",
      cardPadding: "p-3.5 sm:p-4",
      avatarSize: windowWidth < 380 ? "w-14 h-14" : "w-16 h-16",
      avatarMargin: windowWidth < 380 ? "-mt-8" : "-mt-9",
      fontSize: {
        name: "text-base sm:text-lg",
        role: "text-[10px] sm:text-[11px]",
        latin: "text-[10px] sm:text-[11px]",
      },
    };
  };

  const {
    containerRadius,
    profileSize,
    cardWidth,
    cardPadding,
    avatarSize,
    avatarMargin,
    fontSize,
  } = getResponsiveValues();
  const containerSize = containerRadius * 2 + profileSize + 32;

  // Calculate rotation for each specimen on the orbit circle (360 / 9 = 40 deg)
  const getRotation = useCallback(
    (index: number): number =>
      (index - activeIndex) * (360 / botanicalSpecimens.length),
    [activeIndex]
  );

  // Navigation
  const next = () => {
    soundSystem.playOrbitSelect();
    setActiveIndex((i) => (i + 1) % botanicalSpecimens.length);
  };
  const prev = () => {
    soundSystem.playOrbitSelect();
    setActiveIndex(
      (i) => (i - 1 + botanicalSpecimens.length) % botanicalSpecimens.length
    );
  };

  // Lightbox Modal Controls
  const openLightbox = (index: number) => {
    soundSystem.playModalOpen();
    setLightboxIndex(index);
    setIsZoomed(false);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    soundSystem.playModalClose();
    setLightboxOpen(false);
    setIsZoomed(false);
  };

  const nextLightbox = () => {
    soundSystem.playOrbitSelect();
    setLightboxIndex((i) => (i + 1) % botanicalSpecimens.length);
    setActiveIndex((i) => (i + 1) % botanicalSpecimens.length);
    setIsZoomed(false);
  };

  const prevLightbox = () => {
    soundSystem.playOrbitSelect();
    setLightboxIndex(
      (i) => (i - 1 + botanicalSpecimens.length) % botanicalSpecimens.length
    );
    setActiveIndex(
      (i) => (i - 1 + botanicalSpecimens.length) % botanicalSpecimens.length
    );
    setIsZoomed(false);
  };

  // Handle clicking an orbiting profile bubble
  const handleProfileClick = useCallback(
    (index: number) => {
      soundSystem.playOrbitSelect();
      if (index === activeIndex) {
        // If clicking the currently active specimen, open lightbox!
        openLightbox(index);
      } else {
        setActiveIndex(index);
      }
    },
    [activeIndex]
  );

  // Prevent background scroll, pause Lenis, and lock wheel/touch while lightbox is active
  useEffect(() => {
    if (!lightboxOpen) {
      lenis?.start();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.touchAction = "";
      return;
    }

    // 1. Pause Lenis smooth-scrolling engine immediately
    lenis?.stop();

    // 2. Lock body and HTML overflow
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyTouch = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    // 3. Prevent any wheel event from propagating or scrolling the page
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest(".modal-scrollable-content")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 4. Prevent touch drag scrolling on mobile
    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest(".modal-scrollable-content")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      lenis?.start();
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.touchAction = prevBodyTouch;
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [lightboxOpen, lenis]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (lightboxOpen) {
        if (event.key === "Escape") {
          closeLightbox();
        } else if (event.key === "ArrowLeft") {
          prevLightbox();
        } else if (event.key === "ArrowRight") {
          nextLightbox();
        }
      } else {
        if (event.key === "ArrowLeft") prev();
        else if (event.key === "ArrowRight") next();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, activeIndex]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-rotation: only advance when visible, not hovered, tab is active, and lightbox is closed
  useEffect(() => {
    if (isHovering || !isInView || lightboxOpen) return;

    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      next();
    }, 5200);

    return () => clearInterval(interval);
  }, [isHovering, isInView, lightboxOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null && e.changedTouches[0]) {
      const diffX = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) next();
        else prev();
      }
    }
    touchStartX.current = null;
  };

  const currentSpecimen = botanicalSpecimens[activeIndex];
  const activeLightboxSpecimen = botanicalSpecimens[lightboxIndex];

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center pt-4 pb-12 sm:pt-8 sm:pb-16 px-2 sm:px-6 relative min-h-[580px] xs:min-h-[660px] sm:min-h-[740px] md:min-h-[840px] lg:min-h-[960px] xl:min-h-[1020px] bg-white transition-colors duration-300 w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-10 md:mb-12 max-w-2xl px-4 z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 mb-2 sm:mb-3">
          <Leaf size={12} className="text-emerald-700" />
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-neutral-600">
            HERBARIUM ARCHIVE • 9 SPECIMENS
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-medium tracking-tight text-neutral-900 leading-tight">
          Botanical Specimen Orbit
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 sm:mt-2.5 max-w-md mx-auto">
          Archival hand-pressed botanical sheets. Tap any specimen bubble or click inspect to view high-resolution taxonomy records.
        </p>
      </div>

      <div
        className="relative flex items-center justify-center"
        style={{ width: containerSize, height: containerSize }}
      >
        {/* Subtle Dashed Orbit Guideline Ring */}
        <div
          className="absolute rounded-full border border-dashed border-neutral-300/80 pointer-events-none transition-all duration-500"
          style={{ width: containerRadius * 2, height: containerRadius * 2 }}
        />

        {/* Active Specimen Center Card */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSpecimen.id}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -12 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 28,
            }}
            className={`z-10 bg-white/95 backdrop-blur-md shadow-[0_25px_60px_-15px_rgba(0,0,0,0.14),0_10px_25px_-5px_rgba(0,0,0,0.06)] rounded-2xl sm:rounded-3xl ${cardPadding} ${cardWidth} text-center border border-neutral-200/90 transition-all duration-300`}
          >
            {/* Center Avatar with Status Indicator and Click-to-Enlarge Action */}
            <div className="flex justify-center w-full">
              <div
                onClick={() => openLightbox(activeIndex)}
                className={`relative ${avatarMargin} ${avatarSize} cursor-pointer group`}
                title="Click to view full high-resolution herbarium sheet"
              >
                <motion.img
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  src={currentSpecimen.image}
                  alt={currentSpecimen.name}
                  onError={safeImage}
                  className="w-full h-full rounded-full border-4 border-white object-cover shadow-xl ring-2 ring-neutral-900/10 group-hover:scale-105 group-hover:ring-neutral-900 transition-all duration-200"
                />

                {/* Status Indicator */}
                <span className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-emerald-500 border-2 border-white shadow-xs"></span>
                </span>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Maximize2 size={18} className="drop-shadow-md" />
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="mt-2.5 sm:mt-3"
            >
              <h2
                className={`font-serif font-bold text-neutral-900 tracking-tight leading-snug ${fontSize.name}`}
              >
                {currentSpecimen.name}
              </h2>

              <div className="flex justify-center mt-1.5 mb-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 font-medium ${fontSize.role} border border-neutral-200/60 shadow-xs max-w-full`}
                >
                  <Sparkles size={12} className="text-amber-600 shrink-0" />
                  <span className="truncate">{currentSpecimen.family} • {currentSpecimen.category}</span>
                </span>
              </div>

              <div className="flex justify-center">
                <span
                  className={`inline-flex items-center gap-1.5 text-neutral-500 font-serif italic tracking-tight ${fontSize.latin}`}
                >
                  <Leaf size={12} className="text-emerald-600 shrink-0" />
                  <span className="truncate">{currentSpecimen.scientificName}</span>
                </span>
              </div>
            </motion.div>

            {/* Navigation & Inspection CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex justify-center items-center mt-4 sm:mt-5 gap-2 sm:gap-2.5"
            >
              <button
                type="button"
                onClick={prev}
                onMouseEnter={() => soundSystem.playNavHover()}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-black flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs shrink-0"
                aria-label="Previous specimen"
              >
                <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={() => openLightbox(activeIndex)}
                onMouseEnter={() => soundSystem.playButtonHover()}
                className="px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-full bg-neutral-900 text-white hover:bg-black hover:shadow-lg hover:shadow-neutral-900/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Maximize2 size={13} className="shrink-0" />
                <span>Inspect Specimen</span>
              </button>

              <button
                type="button"
                onClick={next}
                onMouseEnter={() => soundSystem.playNavHover()}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-black flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs shrink-0"
                aria-label="Next specimen"
              >
                <ChevronRight size={16} className="sm:w-5 sm:h-5" />
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Orbiting Specimen Profiles with Counter-Rotation */}
        {botanicalSpecimens.map((specimen, i) => {
          const rotation = getRotation(i);
          const isActive = i === activeIndex;

          return (
            <motion.div
              key={specimen.id}
              animate={{
                transform: `rotate(${rotation}deg) translateY(-${containerRadius}px)`,
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 20,
                delay: isActive ? 0 : Math.abs(i - activeIndex) * 0.04,
              }}
              style={{
                width: profileSize,
                height: profileSize,
                position: "absolute",
                top: `calc(50% - ${profileSize / 2}px)`,
                left: `calc(50% - ${profileSize / 2}px)`,
                zIndex: isActive ? 25 : 10,
              }}
            >
              {/* Counter-rotation to keep leaf specimen upright */}
              <motion.div
                animate={{ rotate: -rotation }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                }}
                className="w-full h-full"
              >
                <motion.div
                  onClick={() => handleProfileClick(i)}
                  whileHover={{
                    scale: 1.15,
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-full h-full rounded-full cursor-pointer transition-all duration-300 group ${
                    isActive
                      ? "ring-4 ring-neutral-900 shadow-2xl scale-105"
                      : "ring-2 ring-neutral-200 hover:ring-neutral-800 shadow-md hover:shadow-xl"
                  }`}
                  title={`${specimen.name} - Tap to select / open`}
                >
                  <img
                    src={specimen.image}
                    alt={specimen.name}
                    onError={safeImage}
                    className="w-full h-full object-cover rounded-full"
                  />

                  {/* Magnifying Glass Indicator on hover */}
                  <div className="absolute inset-0 rounded-full bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Maximize2 size={14} />
                  </div>

                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-neutral-900 ring-2 ring-white" />
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* ── High-Fidelity Lightbox Modal mounted directly to document.body via Portal ── */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              data-lenis-prevent="true"
              className="fixed inset-0 z-[999999] bg-black/92 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-5 md:p-8 select-none"
              onClick={closeLightbox}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* Vibrant Red Close Button with Radiant Glow and ESC Badge */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
                onMouseEnter={() => soundSystem.playNavHover()}
                aria-label="Close Lightbox (ESC)"
                title="Close Specimen Sheet (ESC)"
                className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[1000000] group flex items-center gap-2 pl-3.5 pr-2.5 py-2 sm:pl-4 sm:pr-3 sm:py-2.5 rounded-full bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-[0_0_25px_rgba(239,68,68,0.85)] hover:shadow-[0_0_35px_rgba(239,68,68,1)] border-2 border-red-300/80 hover:border-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-red-500/25 select-none"
              >
                <span className="font-mono text-xs sm:text-sm font-bold tracking-wider uppercase text-white drop-shadow">
                  Close
                </span>
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:rotate-90">
                  <X size={15} className="sm:w-4 sm:h-4 stroke-[3.5] text-white" />
                </span>
                <kbd className="hidden md:inline-block ml-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-black/35 text-white/90 rounded border border-white/20 font-semibold">
                  ESC
                </kbd>
              </button>

              {/* Modal Dialog Card */}
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
                data-lenis-prevent="true"
                onClick={(e) => e.stopPropagation()}
                className="relative bg-neutral-950 border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.95)] max-w-6xl w-full max-h-[92vh] flex flex-col lg:flex-row overflow-hidden text-white"
              >
                {/* Left/Top: Specimen High-Resolution Sheet View */}
                <div className="flex-1 relative flex items-center justify-center bg-black/75 p-3 sm:p-6 min-h-[46vh] sm:min-h-[54vh] lg:min-h-[78vh] overflow-hidden">
                  <motion.img
                    key={activeLightboxSpecimen.id + (isZoomed ? "-zoomed" : "-normal")}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      scale: isZoomed ? 1.32 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    src={activeLightboxSpecimen.image}
                    alt={activeLightboxSpecimen.name}
                    onError={safeImage}
                    className={`object-contain max-h-[44vh] sm:max-h-[52vh] lg:max-h-[74vh] w-auto max-w-full rounded-lg shadow-2xl transition-transform duration-300 ring-1 ring-white/10 ${
                      isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                    }`}
                    onClick={() => setIsZoomed((prev) => !prev)}
                  />

                  {/* Floating Image Zoom Control */}
                  <button
                    type="button"
                    onClick={() => setIsZoomed((prev) => !prev)}
                    onMouseEnter={() => soundSystem.playNavHover()}
                    className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white/90 hover:text-white backdrop-blur-md border border-white/15 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    {isZoomed ? (
                      <>
                        <ZoomOut size={14} />
                        <span>Fit View</span>
                      </>
                    ) : (
                      <>
                        <ZoomIn size={14} />
                        <span>Zoom Sheet</span>
                      </>
                    )}
                  </button>

                  {/* Floating Chevron Navigation On Image (Desktop & Tablet) */}
                  <button
                    type="button"
                    onClick={prevLightbox}
                    onMouseEnter={() => soundSystem.playNavHover()}
                    aria-label="Previous specimen in modal"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/15 transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
                  >
                    <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={nextLightbox}
                    onMouseEnter={() => soundSystem.playNavHover()}
                    aria-label="Next specimen in modal"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/15 transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
                  >
                    <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* Right/Bottom: Archival Specimen Data Panel */}
                <div
                  data-lenis-prevent="true"
                  className="modal-scrollable-content w-full lg:w-96 p-4 sm:p-6 lg:p-7 flex flex-col justify-between bg-neutral-900 border-t lg:border-t-0 lg:border-l border-white/10 overflow-y-auto max-h-[46vh] sm:max-h-[38vh] lg:max-h-[78vh] overscroll-contain"
                >
                  <div>
                    {/* Archival Record Header */}
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3 sm:mb-4">
                      <span className="font-mono text-[11px] sm:text-xs tracking-[0.2em] uppercase text-emerald-400 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {activeLightboxSpecimen.sheetNumber}
                      </span>
                      <span className="font-mono text-xs text-neutral-400">
                        {lightboxIndex + 1} / {botanicalSpecimens.length}
                      </span>
                    </div>

                    {/* Title & Taxonomy */}
                    <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
                      {activeLightboxSpecimen.name}
                    </h3>
                    <p className="font-serif italic text-emerald-300 text-xs sm:text-sm lg:text-base mt-1 flex items-center gap-1.5">
                      <Leaf size={14} className="text-emerald-400 shrink-0" />
                      <span>{activeLightboxSpecimen.scientificName}</span>
                    </p>

                    {/* Metadata Grid */}
                    <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 sm:p-2.5 rounded-lg bg-white/5 border border-white/10">
                        <span className="block text-neutral-400 text-[9px] sm:text-[10px] uppercase font-mono tracking-wider">
                          Family
                        </span>
                        <span className="font-semibold text-white mt-0.5 block truncate">
                          {activeLightboxSpecimen.family}
                        </span>
                      </div>
                      <div className="p-2 sm:p-2.5 rounded-lg bg-white/5 border border-white/10">
                        <span className="block text-neutral-400 text-[9px] sm:text-[10px] uppercase font-mono tracking-wider">
                          Classification
                        </span>
                        <span className="font-semibold text-white mt-0.5 block truncate">
                          {activeLightboxSpecimen.category}
                        </span>
                      </div>
                    </div>

                    {/* Curatorial Description */}
                    <div className="mt-3 sm:mt-4 p-3 sm:p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                        Archival Record Notes
                      </span>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                        {activeLightboxSpecimen.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Actions & Shortcuts */}
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10 flex flex-col gap-2">
                    <a
                      href={activeLightboxSpecimen.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundSystem.playLinkClick()}
                      className="w-full py-2 sm:py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer hover:shadow-lg border border-white/10"
                    >
                      <ExternalLink size={14} />
                      <span>Open Raw Full Resolution JPG</span>
                    </a>

                    {/* Mobile Navigation Buttons */}
                    <div className="flex items-center justify-between gap-2 lg:hidden pt-1">
                      <button
                        type="button"
                        onClick={prevLightbox}
                        className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft size={14} /> Prev
                      </button>
                      <button
                        type="button"
                        onClick={nextLightbox}
                        className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Next <ChevronRight size={14} />
                      </button>
                    </div>

                    <span className="hidden lg:block text-center text-[10px] font-mono text-neutral-500 tracking-wider">
                      Use ← → arrows to browse • ESC to close
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

export { OrbitCarousel };
