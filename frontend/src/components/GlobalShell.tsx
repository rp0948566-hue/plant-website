import React from 'react';

interface GlobalShellProps {
  children: React.ReactNode;
}

/**
 * GlobalShell: Highest-level shared application shell.
 * Provides the persistent 8–10px outer inset and 12–14px rounded inner corner treatment
 * with a subtle 1px border around all routes without altering internal page layouts or functionality.
 */
export default function GlobalShell({ children }: GlobalShellProps) {
  return (
    <div className="global-shell-root relative w-full min-h-screen">
      {/* ── Global Inset Frame Bezel (8-10px outer margin, 12-14px rounded inner corners, 1px subtle border) ── */}
      <div
        className="global-inset-frame pointer-events-none fixed inset-[8px] sm:inset-[10px] rounded-[12px] sm:rounded-[14px] border border-white/14 shadow-[0_0_0_100vmax_#0c0c0e] z-[9999]"
        aria-hidden="true"
      />

      {/* ── Main Application Content Shell ── */}
      <div className="global-inset-content relative w-full min-h-screen overflow-x-clip">
        {children}
      </div>
    </div>
  );
}

export { GlobalShell };
