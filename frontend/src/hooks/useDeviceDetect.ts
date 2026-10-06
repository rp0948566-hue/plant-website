import { useState, useEffect } from 'react';

export interface DeviceInfo {
  width: number;
  height: number;
  isMobile: boolean; // < 640px
  isTablet: boolean; // 640px - 1023px
  isDesktop: boolean; // >= 1024px
  isTouch: boolean;
  orientation: 'portrait' | 'landscape';
}

export function useDeviceDetect(): DeviceInfo {
  const [device, setDevice] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1200,
        height: 800,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouch: false,
        orientation: 'landscape',
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    return {
      width,
      height,
      isMobile: width < 640,
      isTablet: width >= 640 && width < 1024,
      isDesktop: width >= 1024,
      isTouch,
      orientation: height > width ? 'portrait' : 'landscape',
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: number;
    const handleResize = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        setDevice({
          width,
          height,
          isMobile: width < 640,
          isTablet: width >= 640 && width < 1024,
          isDesktop: width >= 1024,
          isTouch,
          orientation: height > width ? 'portrait' : 'landscape',
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return device;
}

export default useDeviceDetect;
