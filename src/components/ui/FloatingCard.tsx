'use client';

import { useEffect, useState, useRef } from 'react';
import { clsx } from 'clsx';

interface FloatingCardProps {
  children: React.ReactNode;
  depth?: number; // translateZ depth in px
  delay?: number; // stagger delay in ms
  glowColor?: string;
  className?: string;
}

export function FloatingCard({ children, depth = 20, delay = 0, glowColor, className }: FloatingCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100 + delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={clsx(
        'relative rounded-2xl border transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        isHovered ? 'border-accent/30 scale-[1.01]' : 'border-white/[0.06]',
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
        transform: `translateZ(${isHovered ? depth + 10 : depth}px)`,
        transition: 'transform 0.3s ease-out, opacity 0.7s ease-out, border-color 0.3s, scale 0.3s',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: glowColor
          ? `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 40px ${glowColor}`
          : '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top edge shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColor || 'rgba(217,4,41,0.3)'}, transparent)`,
        }}
      />
      {/* Content */}
      <div className="relative z-10 p-4">
        {children}
      </div>
    </div>
  );
}
