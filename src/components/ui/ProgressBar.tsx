'use client';

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number; // 0-100
  color?: 'cyan' | 'green' | 'red' | 'yellow' | 'purple';
  height?: number;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const colorClasses = {
  cyan: 'from-cyan to-[#00d4ff] shadow-[0_0_12px_rgba(0,240,255,0.4)]',
  green: 'from-success to-[#00cc6a] shadow-[0_0_12px_rgba(0,255,136,0.4)]',
  red: 'from-accent to-[#ff3366] shadow-[0_0_12px_rgba(217,4,41,0.4)]',
  yellow: 'from-warning to-[#ff8800] shadow-[0_0_12px_rgba(255,170,0,0.4)]',
  purple: 'from-purple to-[#c084fc] shadow-[0_0_12px_rgba(168,85,247,0.4)]',
};

export function ProgressBar({ value, color = 'cyan', height = 10, showLabel = false, label, className }: ProgressBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(Math.min(value, 100)), 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={className}>
      <div
        className="overflow-hidden rounded-full bg-white/[0.03]"
        style={{ height }}
      >
        <div
          className={clsx(
            'progress-fill relative h-full rounded-full bg-gradient-to-r transition-all duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
            colorClasses[color]
          )}
          style={{ width: `${width}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1.5 flex justify-between text-[0.65rem] text-dim">
          <span>{label || ''}</span>
          <span className="font-mono font-bold text-cyan">{Math.round(value)}%</span>
        </div>
      )}
    </div>
  );
}
