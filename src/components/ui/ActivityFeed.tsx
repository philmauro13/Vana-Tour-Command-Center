'use client';

import { FeedItem } from '@/lib/types';

interface ActivityFeedProps {
  items: FeedItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-2 border-b border-white/[0.03] py-2 last:border-0">
          <div
            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: item.color || 'var(--cyan)' }}
          />
          <div className="flex-1 text-[0.75rem] text-dim">
            {item.text}
          </div>
          <div className="w-[35px] shrink-0 text-right font-mono text-[0.6rem] text-muted">
            {formatTime(item.timestamp)}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}
