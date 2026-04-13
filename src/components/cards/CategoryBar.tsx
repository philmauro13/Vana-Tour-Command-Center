import { clsx } from 'clsx';

interface CategoryBarProps {
  icon: string;
  label: string;
  spent: number;
  budget: number;
  color: string;
}

export function CategoryBar({ icon, label, spent, budget, color }: CategoryBarProps) {
  const pct = budget > 0 ? (spent / budget) * 100 : 0;
  const isPositive = spent >= 0;

  return (
    <div className="flex items-center gap-2">
      <span className="w-6 text-center text-sm">{icon}</span>
      <div className="flex-1">
        <div className="text-[0.7rem] font-medium">{label}</div>
        <div className="mt-0.5 h-1 rounded-sm bg-white/[0.05] overflow-hidden">
          <div
            className="h-full rounded-sm transition-all duration-1000 ease-out"
            style={{
              width: `${Math.min(pct, 100)}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
      <span
        className="w-[55px] shrink-0 text-right font-mono text-[0.7rem] font-semibold"
        style={{ color: isPositive ? color : 'var(--success)' }}
      >
        {isPositive ? '' : '+'}${Math.abs(spent).toLocaleString()}
      </span>
    </div>
  );
}
