'use client';

import { useEffect, useState } from 'react';

interface RecapRingProps {
  value: number; // 0-100
  label: string;
  color: string;
  glowColor: string;
  icon: string;
  size?: number;
}

export function RecapRing({ value, label, color, glowColor, icon, size = 90 }: RecapRingProps) {
  const [offset, setOffset] = useState(0);
  const strokeWidth = 7;
  const radius = (size / 2) - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => {
      const clamped = Math.min(value, 100);
      setOffset(circumference - (clamped / 100) * circumference);
    }, 600);
    return () => clearTimeout(timer);
  }, [value, circumference]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            animation: 'pulse3d 3s ease-in-out infinite',
          }}
        />
        <svg
          className="-rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Track */}
          <circle
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={strokeWidth}
            cx={size / 2}
            cy={size / 2}
            r={radius}
          />
          {/* Secondary glow track */}
          <circle
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            opacity={0.1}
            style={{
              transition: 'stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          {/* Main fill */}
          <circle
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              filter: `drop-shadow(0 0 8px ${glowColor})`,
              transition: 'stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg">{icon}</span>
          <span
            className="font-mono text-sm font-black"
            style={{ color, textShadow: `0 0 10px ${glowColor}` }}
          >
            {value}%
          </span>
        </div>
      </div>
      <span className="mt-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-dim">{label}</span>
    </div>
  );
}
