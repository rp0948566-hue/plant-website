"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Leaf,
  Eye,
  Flower2,
  Flame,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import soundSystem from "@/lib/sound-system";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  targetId?: string;
  href?: string;
}

export const defaultNavItems: NavItem[] = [
  { label: "Home", icon: Home, targetId: "hero-top" },
  { label: "Story", icon: Leaf, targetId: "minimalism-section" },
  { label: "Gallery", icon: Eye, targetId: "scroll-animation-section" },
  { label: "Flora", icon: Flower2, targetId: "orbit-carousel-section" },
  { label: "Spirit", icon: Flame, targetId: "tiger-tear-section" },
  { label: "Works", icon: LayoutGrid, targetId: "works-wheel-section" },
];

export type BottomNavBarProps = {
  className?: string;
  defaultIndex?: number;
  stickyBottom?: boolean;
  stickyTop?: boolean;
  autoHideOnScroll?: boolean;
  items?: NavItem[];
  onItemSelect?: (item: NavItem, index: number) => void;
};

export function BottomNavBar({
  className,
  defaultIndex = 0,
  stickyBottom = false,
  stickyTop = true,
  autoHideOnScroll = true,
  items = defaultNavItems,
  onItemSelect,
}: BottomNavBarProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [isMobile, setIsMobile] = useState(false);
  const [isWatch, setIsWatch] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => {
      setIsWatch(window.innerWidth < 380);
      setIsMobile(window.innerWidth < 640);
    };
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // Smart scroll animation: hide towards top when scrolling down, reveal smoothly from top when scrolling up
  useEffect(() => {
    if (!autoHideOnScroll || typeof window === "undefined") return;

    const onScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show when near top of page
      if (currentScrollY <= 80) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const diff = currentScrollY - lastScrollY.current;

      // Scrolling down by more than 10px -> slide up away
      if (diff > 10) {
        setIsVisible(false);
        lastScrollY.current = currentScrollY;
      }
      // Scrolling up by more than 10px -> slide back down from top
      else if (diff < -10) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [autoHideOnScroll]);

  // Synchronize active tab highlight with the current section in view
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateActiveOnScroll = () => {
      const scrollPos = window.scrollY + 250;
      for (let i = items.length - 1; i >= 0; i--) {
        const targetId = items[i].targetId;
        if (!targetId) continue;
        const el = document.getElementById(targetId);
        if (el && el.offsetTop <= scrollPos) {
          setActiveIndex(i);
          break;
        }
      }
    };

    window.addEventListener("scroll", updateActiveOnScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveOnScroll);
  }, [items]);

  const handleItemClick = (item: NavItem, idx: number) => {
    soundSystem.playNavClick();
    setActiveIndex(idx);
    if (item.targetId) {
      const el = document.getElementById(item.targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    if (onItemSelect) {
      onItemSelect(item, idx);
    }
  };

  const isFixed = stickyTop || stickyBottom;
  const activeLabelWidth = isWatch ? 56 : isMobile ? 68 : 100;

  return (
    <motion.nav
      initial={{
        scale: 0.94,
        opacity: 0,
        x: isFixed ? "-50%" : 0,
        y: stickyTop ? -100 : stickyBottom ? 100 : 0,
      }}
      animate={{
        scale: isVisible ? 1 : 0.96,
        opacity: isVisible ? 1 : 0,
        x: isFixed ? "-50%" : 0,
        y: isVisible ? 0 : stickyTop ? -110 : stickyBottom ? 110 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 340,
        damping: 30,
        mass: 0.75,
      }}
      style={{
        pointerEvents: isVisible ? "auto" : "none",
      }}
      role="navigation"
      aria-label="Navigation"
      className={cn(
        "bg-white/94 dark:bg-card/95 backdrop-blur-2xl border border-black/12 dark:border-border rounded-full flex items-center px-1.5 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2.5 shadow-[0_18px_50px_-8px_rgba(0,0,0,0.18)] max-w-[96vw] h-[52px] sm:h-[62px] md:h-[68px] lg:h-[72px] select-none transition-shadow duration-300 z-50",
        stickyBottom && "fixed left-1/2 bottom-4 sm:bottom-6 z-50 w-fit",
        stickyTop && "fixed left-1/2 top-3 sm:top-5 md:top-6 z-50 w-fit",
        className,
      )}
    >
      <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2 lg:space-x-2.5 overflow-x-auto no-scrollbar py-0.5 px-0.5 sm:px-1">
        {/* Brand Logo Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 420, damping: 25 }}
          onClick={() => {
            soundSystem.playNavClick();
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActiveIndex(0);
          }}
          onMouseEnter={() => soundSystem.playNavHover()}
          aria-label="Aethera Home"
          className="flex items-center gap-1.5 sm:gap-2 pl-0.5 pr-1.5 sm:pr-2.5 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0 focus:outline-none"
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full overflow-hidden bg-black border border-black/15 shadow-sm flex items-center justify-center p-0.5 transition-transform duration-200">
            <img
              src="/images/LOGO.png"
              alt="Aethera Emblem"
              className="w-full h-full object-contain filter drop-shadow"
            />
          </div>
          <span className="hidden md:inline font-serif font-bold text-xs sm:text-sm tracking-wider text-black dark:text-white uppercase select-none">
            Aethera
          </span>
        </motion.button>

        {/* Elegant Separator */}
        <div className="h-4 sm:h-5 md:h-6 w-[1px] bg-black/10 dark:bg-white/15 mx-0.5 shrink-0" />

        {items.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeIndex === idx;

          return (
            <motion.button
              key={item.label}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.93 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              onMouseEnter={() => soundSystem.playNavHover()}
              className={cn(
                "flex items-center gap-0 px-2 sm:px-3.5 md:px-4.5 lg:px-5 py-2 rounded-full transition-colors duration-200 relative h-9 sm:h-11 md:h-11 min-w-[38px] sm:min-w-[48px] md:min-w-[58px] lg:min-w-[66px] cursor-pointer shrink-0",
                isActive
                  ? "text-black dark:text-primary font-semibold"
                  : "bg-transparent text-neutral-500 hover:text-black dark:text-muted-foreground hover:bg-black/5 dark:hover:bg-muted font-normal",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/25",
              )}
              onClick={() => handleItemClick(item, idx)}
              aria-label={item.label}
              aria-selected={isActive}
              type="button"
            >
              {/* Shared Morphing Active Pill Background */}
              {isActive && (
                <motion.div
                  layoutId="activeNavPill"
                  className="absolute inset-0 rounded-full bg-black/10 dark:bg-primary/20 shadow-xs"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <Icon
                size={isWatch ? 19 : isMobile ? 21 : 23}
                strokeWidth={isActive ? 2.3 : 1.9}
                aria-hidden
                className="transition-transform duration-200 shrink-0 relative z-10"
              />

              <motion.div
                initial={false}
                animate={{
                  width: isActive ? `${activeLabelWidth}px` : "0px",
                  opacity: isActive ? 1 : 0,
                  marginLeft: isActive ? (isWatch ? "5px" : isMobile ? "6px" : "8px") : "0px",
                }}
                transition={{
                  width: { type: "spring", stiffness: 380, damping: 32 },
                  opacity: { duration: 0.18 },
                  marginLeft: { duration: 0.18 },
                }}
                className={cn("overflow-hidden flex items-center max-w-[110px] relative z-10")}
              >
                <span
                  className={cn(
                    "font-semibold text-xs sm:text-sm md:text-[14px] whitespace-nowrap select-none transition-opacity duration-200 overflow-hidden text-ellipsis leading-tight tracking-normal",
                    isActive ? "text-black dark:text-primary opacity-100" : "opacity-0",
                  )}
                  title={item.label}
                >
                  {item.label}
                </span>
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}

export default BottomNavBar;
