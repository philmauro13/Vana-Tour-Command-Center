import { clsx } from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  accent?: boolean;
  className?: string;
}

export function GlassCard({ children, accent = false, className }: GlassCardProps) {
  return (
    <div
      className={clsx(
        'glass relative overflow-hidden rounded-2xl border border-border bg-bg-card/80 p-5 backdrop-blur-xl',
        accent && 'accent',
        className
      )}
    >
      {children}
    </div>
  );
}
