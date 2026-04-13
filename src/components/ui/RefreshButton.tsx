'use client';

import { useState } from 'react';

interface RefreshButtonProps {
  onRefresh: () => void;
}

export function RefreshButton({ onRefresh }: RefreshButtonProps) {
  const [spinning, setSpinning] = useState(false);

  const handleClick = () => {
    setSpinning(true);
    onRefresh();
    setTimeout(() => setSpinning(false), 1000);
  };

  return (
    <button
      onClick={handleClick}
      title="Refresh"
      className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-card text-xl text-cyan transition-all hover:border-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
    >
      <span className={spinning ? 'animate-spin' : ''}>⟳</span>
    </button>
  );
}
