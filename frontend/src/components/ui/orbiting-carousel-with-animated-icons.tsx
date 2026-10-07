"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
  Leaf,
  Sparkles,
} from "lucide-react";
import soundSystem from "@/lib/sound-system";
import { useLenis } from "lenis/react";

// --- In-Situ Field Specimen Dataset (All 9 Geotagged Photos from public/images/END) ---
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
    name: "Sadabahar (Periwinkle)",
    scientificName: "Catharanthus roseus",
    family: "Apocynaceae",
    category: "Everlasting Medicinal Bloom",
    sheetNumber: "HERB-01",
    description:
      "Sunlit hostel-bed specimen with glossy oval leaves and white salverform blooms, photographed live in the field.",
    image: "/images/END/569dbf58-cbb8-4ecd-b27c-c980345f9d55.jpg",
  },
  {
    id: 2,
    name: "Crown of Thorns",
    scientificName: "Euphorbia milii",
    family: "Euphorbiaceae",
    category: "Succulent Flowering Shrub",
    sheetNumber: "HERB-02",
    description:
      "Spinescent succulent documented in-situ, stout ribbed stems crowned with vivid petaloid cyathia.",
    image: "/images/END/5c64518f-6b46-4ee8-9cd3-3dde2be6c904.jpg",
  },
  {
    id: 3,
    name: "China Rose (Hibiscus)",
    scientificName: "Hibiscus rosa-sinensis",
    family: "Malvaceae",
    category: "Tropical Flowering Shrub",
    sheetNumber: "HERB-03",
    description:
      "Broad serrated foliage photographed on the shrub before pressing, showing the living leaf architecture.",
    image: "/images/END/665811c0-3bca-4d39-9ec6-c27bfb8ca0d9.jpg",
  },
  {
    id: 4,
    name: "Marigold (Genda)",
    scientificName: "Tagetes erecta",
    family: "Asteraceae",
    category: "Aromatic Solar Bloom",
    sheetNumber: "HERB-04",
    description:
      "Feathery pinnate foliage captured in the nursery bed, rich with glandular aromatic oils.",
    image: "/images/END/6975852e-1209-49ff-a0c1-71c4a0184106.jpg",
  },
  {
    id: 5,
    name: "Bougainvillea",
    scientificName: "Bougainvillea spectabilis",
    family: "Nyctaginaceae",
    category: "Architectural Woody Climber",
    sheetNumber: "HERB-05",
    description:
      "Paper-thin bracts and ovate leaves recorded on the climber during the midday collection walk.",
    image: "/images/END/7e10ff4b-c94f-45c8-aa84-9724c221a934.jpg",
  },
  {
    id: 6,
    name: "Gandharaj (Gardenia)",
    scientificName: "Gardenia jasminoides",
    family: "Rubiaceae",
    category: "Fragrant Ornamental Shrub",
    sheetNumber: "HERB-06",
    description:
      "Lustrous dark-green foliage verified on the shrub, thriving in the humid hostel garden bed.",
    image: "/images/END/825e0a0e-15e2-485a-90f9-30202500c621.jpg",
  },
  {
    id: 7,
    name: "Yellow Elder (Tecoma)",
    scientificName: "Tecoma stans",
    family: "Bignoniaceae",
    category: "Upright Flowering Shrub",
    sheetNumber: "HERB-07",
    description:
      "Pinnate compound leaves observed in the courtyard collection during peak sunlight hours.",
    image: "/images/END/c039281d-b13a-40fb-8861-0762db9d0fc9.jpg",
  },
  {
    id: 8,
    name: "Chinese Banyan (Ficus)",
    scientificName: "Ficus microcarpa",
    family: "Moraceae",
    category: "Canopy Fig / Living Bonsai",
    sheetNumber: "HERB-08",
    description:
      "Leathery oval canopy leaves documented on the terrace pots before specimen harvest.",
    image: "/images/END/d16f7345-6979-4eff-ba85-3f6c14223fa7.jpg",
  },
  {
    id: 9,
    name: "Classic Rose (Gulab)",
    scientificName: "Rosa damascena",
    family: "Rosaceae",
    category: "Aromatic Perennial Flora",
    sheetNumber: "HERB-09",
    description:
      "Serrated five-leaflet sprays photographed on the thorny stems in natural daylight.",
    image: "/images/END/dec0e244-7d8e-4480-9350-a4ea73b63886.jpg",
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
      className="flex flex-col items-center justify-center pt-2 pb-8 sm:pt-8 sm:pb-16 px-2 sm:px-6 relative min-h-[540px] xs:min-h-[660px] sm:min-h-[740px] md:min-h-[840px] lg:min-h-[960px] xl:min-h-[1020px] bg-white transition-colors duration-300 w-full overflow-hidden"
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
            FIELD EVIDENCE • 9 GEOTAGS
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-medium tracking-tight text-neutral-900 leading-tight">
          Geotag Photos
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 sm:mt-2.5 max-w-md mx-auto">
          Live geotagged captures from the hostel survey — every frame stamped with location, date and sky. Tap any bubble or inspect for the full photograph.
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
                 <div className="absolute inset-0 rounded-full bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                   <Maximize2 size={14} />
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
                onClick={next}
                onMouseEnter={() => soundSystem.playNavHover()}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-black flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs shrink-0"
                aria-label="Next specimen"
              >
                <ChevronRight size={16} className="sm:w-5 sm:h-5" />
              </button>
            </motion.div>

            {/* Case Study CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="flex justify-center mt-3 sm:mt-4"
            >
              <Link
                to={`/case-study/orbit/${currentSpecimen.id}`}
                onMouseEnter={() => soundSystem.playNavHover()}
                className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-black transition-all hover:scale-[1.03] active:scale-95 shadow-md"
              >
                <BookOpen size={14} className="shrink-0" />
                Read Case Study
              </Link>
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
                className="relative bg-neutral-950 border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.95)] max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-white"
              >
                {/* Photo-only stage: full photograph, zero details */}
                <div className="relative flex items-center justify-center bg-black/75 p-3 sm:p-6 min-h-[70vh] max-h-[80vh] lg:min-h-[78vh] lg:max-h-[80vh] overflow-hidden">
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
                    className={`object-contain max-h-[64vh] sm:max-h-[66vh] lg:max-h-[74vh] w-auto max-w-full rounded-lg shadow-2xl transition-transform duration-300 ring-1 ring-white/10 ${
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
