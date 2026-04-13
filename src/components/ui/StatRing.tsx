'use client';

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';

interface StatRingProps {
  value: number; // 0-100
  display: string;
  color?: 'cyan' | 'green' | 'red';
  size?: number;
  className?: string;
}

const colorClasses = {
  cyan: 'text-cyan',
  green: 'text-success',
  red: 'text-accent',
};

export function StatRing({ value, display, color = 'cyan', size = 70, className }: StatRingProps) {
  const [offset, setOffset] = useState(0);
  const radius = (size / 2) - 6;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => {
      const clamped = Math.min(value, 100);
      setOffset(circumference - (clamped / 100) * circumference);
    }, 300);
    return () => clearTimeout(timer);
  }, [value, circumference]);

  return (
    <div className={clsx('relative', className)} style={{ width: size, height: size }}>
      <svg
        className="-rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={6}
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className={clsx('ring-fill transition-all duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)]', color)}
          fill="none"
          stroke="currentColor"
          strokeWidth={6}
          strokeLinecap="round"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ color: `var(--${color === 'cyan' ? 'cyan' : color === 'green' ? 'success' : 'accent'})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={clsx('font-mono text-sm font-bold', colorClasses[color])}>{display}</span>
        <span className="text-[0.55rem] uppercase tracking-wider text-dim">of budget</span>
      </div>
    </div>
  );
}
