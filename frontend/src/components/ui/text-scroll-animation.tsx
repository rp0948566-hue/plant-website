"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import soundSystem from "@/lib/sound-system";

// Character coming from the LEFT side with smooth 3D tilt and elevation
const LeftSlideCharacter = ({
  char,
  index,
  total,
  scrollYProgress,
  className = "",
  style = {},
}: {
  char: string;
  index: number;
  total: number;
  scrollYProgress: any;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const isSpace = char === " ";
  // Negative x offset so it glides in smoothly from the left
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [-240 - (total - index) * 20, 0]
  );
  const rotateY = useTransform(scrollYProgress, [0, 1], [-35, 0]);
  const rotateZ = useTransform(
    scrollYProgress,
    [0, 1],
    [-(total - index) * 1.2, 0]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);

  return (
    <motion.span
      className={cn("inline-block will-change-transform", isSpace && "w-2 xs:w-3 sm:w-5 md:w-8", className)}
      style={{ x, rotateY, rotateZ, opacity, scale, ...style }}
    >
      {char}
    </motion.span>
  );
};

// Character coming from the RIGHT side with smooth 3D tilt and elevation
const RightSlideCharacter = ({
  char,
  index,
  scrollYProgress,
  className = "",
  style = {},
}: {
  char: string;
  index: number;
  scrollYProgress: any;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const isSpace = char === " ";
  // Positive x offset so it glides in smoothly from the right
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [240 + index * 20, 0]
  );
  const rotateY = useTransform(scrollYProgress, [0, 1], [35, 0]);
  const rotateZ = useTransform(
    scrollYProgress,
    [0, 1],
    [index * 1.2, 0]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);

  return (
    <motion.span
      className={cn("inline-block will-change-transform", isSpace && "w-2 xs:w-3 sm:w-5 md:w-8", className)}
      style={{ x, rotateY, rotateZ, opacity, scale, ...style }}
    >
      {char}
    </motion.span>
  );
};

// Subtitle characters descending smoothly from top
const TopFadeCharacter = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
  className = "",
}: {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: any;
  className?: string;
}) => {
  const isSpace = char === " ";
  const dist = index - centerIndex;
  const y = useTransform(scrollYProgress, [0, 0.8], [-25, 0]);
  const x = useTransform(scrollYProgress, [0, 0.8], [dist * 5, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <motion.span
      className={cn("inline-block will-change-transform", isSpace && "w-2 sm:w-3", className)}
      style={{ y, x, opacity }}
    >
      {char}
    </motion.span>
  );
};

const subtitle = "Presented by:";
const subtitleChars = subtitle.split("");
const subtitleCenter = Math.floor(subtitleChars.length / 2);

const name1 = "Team";
const name1Chars = name1.split("");

const name2 = "Avengers";
const name2Chars = name2.split("");

const Skiper31 = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 85%", "center 45%"],
  });

  useEffect(() => {
    let triggered = false;
    const unsub = scrollYProgress.on("change", (v) => {
      if (v > 0.45 && v < 0.85 && !triggered) {
        triggered = true;
        soundSystem.playKineticWhoosh();
      } else if (v < 0.15 || v > 0.95) {
        triggered = false;
      }
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <main className="w-full bg-white relative">
      {/* 3D Kinetic Text Section: Pure white background, snug balanced height */}
      <div
        ref={targetRef}
        className="relative box-border flex min-h-[54vh] sm:min-h-[75vh] flex-col items-center justify-center gap-3 sm:gap-6 overflow-hidden bg-white pt-12 sm:pt-28 pb-8 sm:pb-12 px-4"
      >
        {/* Subtitle: "Presented by:" in clean modern sans-serif */}
        <div
          className="flex items-center justify-center tracking-[0.25em] text-xs sm:text-base md:text-lg font-semibold uppercase text-[#6F6F6F] font-sans"
          style={{ perspective: "600px" }}
        >
          {subtitleChars.map((char, index) => (
            <TopFadeCharacter
              key={`sub-${index}`}
              char={char}
              index={index}
              centerIndex={subtitleCenter}
              scrollYProgress={scrollYProgress}
              className="text-[#6F6F6F] font-sans"
            />
          ))}
        </div>

        {/* Names in the massive ultra-bold condensed font with auto-scaling */}
        <div
          className="w-full max-w-7xl text-center text-[2.1rem] xs:text-[2.8rem] sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[8.5rem] tracking-tight text-black leading-[0.92] uppercase font-condensed"
          style={{
            perspective: "800px",
            fontFamily: "var(--font-condensed)",
          }}
        >
          {/* Half 1: TEAM (Slides in smoothly from LEFT side) */}
          <div className="flex items-center justify-center flex-nowrap whitespace-nowrap">
            {name1Chars.map((char, index) => (
              <LeftSlideCharacter
                key={`n1-${index}`}
                char={char}
                index={index}
                total={name1Chars.length}
                scrollYProgress={scrollYProgress}
                className="text-black font-condensed"
                style={{ fontFamily: "var(--font-condensed)" }}
              />
            ))}
          </div>

          {/* Half 2: AVENGERS (Slides in smoothly from RIGHT side) */}
          <div className="flex items-center justify-center flex-nowrap whitespace-nowrap mt-1 xs:mt-2 sm:mt-3">
            {name2Chars.map((char, index) => (
              <RightSlideCharacter
                key={`n2-${index}`}
                char={char}
                index={index}
                scrollYProgress={scrollYProgress}
                className="text-black font-condensed"
                style={{ fontFamily: "var(--font-condensed)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export { LeftSlideCharacter, RightSlideCharacter, TopFadeCharacter, Skiper31 };
