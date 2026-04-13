interface UpcomingShowProps {
  date: string;
  venue: string;
  city: string;
  distance: string;
  type: 'SHOW' | 'TRAVEL' | 'OFF';
}

export function UpcomingShow({ date, venue, city, distance, type }: UpcomingShowProps) {
  const d = new Date(date + 'T12:00:00');
  const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className="flex items-center gap-3 border-b border-white/[0.03] py-2.5 last:border-0">
      <div className="w-10 shrink-0 text-center font-mono text-[0.65rem] text-dim">
        {dateLabel}
      </div>
      <div
        className={`h-2 w-2 shrink-0 rounded-full ${
          type === 'SHOW'
            ? 'bg-accent shadow-[0_0_8px_rgba(217,4,41,0.5)]'
            : 'bg-success shadow-[0_0_8px_rgba(0,255,136,0.3)]'
        }`}
      />
      <div className="flex-1">
        <div className="text-sm font-semibold">{venue || city}</div>
        <div className="text-[0.65rem] text-dim">
          {city} • {dayLabel}
        </div>
      </div>
      {distance && (
        <div className="shrink-0 text-right font-mono text-[0.65rem] text-cyan">
          {distance}
        </div>
      )}
    </div>
  );
}
