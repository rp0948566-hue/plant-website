/**
 * Aethera Resilient API & Image Caching Layer
 * Provides high-speed data fetching with zero-latency fallback and intelligent image preloading.
 */

import { type BotanicalSpecimen, botanicalSpecimens } from "@/components/ui/orbiting-carousel-with-animated-icons";
import { type WorksWheelItem, DEFAULT_WORKS } from "@/components/ui/works-wheel";

// Base API URL: relative in production/Vercel or configurable via VITE_API_BASE
const API_BASE = import.meta.env.VITE_API_BASE || "";

/**
 * Fetch botanical specimens with transparent offline / static fallback
 */
export async function fetchSpecimens(query?: string): Promise<BotanicalSpecimen[]> {
  try {
    const url = query ? `${API_BASE}/api/specimens?q=${encodeURIComponent(query)}` : `${API_BASE}/api/specimens`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch {
    // Graceful fallback to static dataset
  }

  // Local fallback
  if (query) {
    const qLower = query.toLowerCase();
    return botanicalSpecimens.filter(
      (s) =>
        s.name.toLowerCase().includes(qLower) ||
        s.scientificName.toLowerCase().includes(qLower) ||
        s.family.toLowerCase().includes(qLower)
    );
  }
  return botanicalSpecimens;
}

/**
 * Fetch botanical works collection with transparent offline / static fallback
 */
export async function fetchWorks(query?: string): Promise<WorksWheelItem[]> {
  try {
    const url = query ? `${API_BASE}/api/works?q=${encodeURIComponent(query)}` : `${API_BASE}/api/works`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch {
    // Graceful fallback
  }

  // Local fallback
  if (query) {
    const qLower = query.toLowerCase();
    return DEFAULT_WORKS.filter((w) => w.title.toLowerCase().includes(qLower));
  }
  return DEFAULT_WORKS;
}

/**
 * Preload all critical botanical images into browser cache for instant rendering
 */
export function preloadBotanicalImages(
  images: string[] = [
    ...botanicalSpecimens.map((s) => s.image),
    ...DEFAULT_WORKS.map((w) => w.image),
  ]
): void {
  if (typeof window === "undefined") return;

  const preload = () => {
    images.forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  };

  if ("requestIdleCallback" in window) {
    (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(preload);
  } else {
    setTimeout(preload, 100);
  }
}
