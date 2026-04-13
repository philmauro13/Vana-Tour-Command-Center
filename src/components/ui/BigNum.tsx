'use client';

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';

interface BigNumProps {
  value: number;
  prefix?: string;
  suffix?: string;
  color?: 'cyan' | 'green' | 'red' | 'yellow' | 'purple' | 'pink';
  label: string;
  sub?: string;
  className?: string;
}

const colorMap = {
  cyan: 'text-cyan',
  green: 'text-success',
  red: 'text-accent',
  yellow: 'text-warning',
  purple: 'text-purple',
  pink: 'text-pink',
};

export function BigNum({ value, prefix = '', suffix = '', color = 'cyan', label, sub, className }: BigNumProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = 0;
    const duration = 1200;
    let startTime: number | null = null;

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (value - start) * eased));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [value]);

  return (
    <div className={className}>
      <div className={clsx('font-mono text-3xl font-bold leading-none', colorMap[color])}>
        {prefix}{display.toLocaleString()}{suffix}
      </div>
      <div className="mt-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-dim">
        {label}
      </div>
      {sub && (
        <div className="mt-0.5 font-mono text-[0.7rem] text-muted">{sub}</div>
      )}
    </div>
  );
}
