'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ROUTING_DATA } from '@/lib/data';
import { fetchShowRecap, ShowRecapData } from '@/lib/recap';
import { RecapRing } from '@/components/ui/RecapRing';
import { FloatingCard } from '@/components/ui/FloatingCard';

// ═══════════════════════════════════════════════════════════════
// Demo fallback data (used when Supabase isn't configured)
// ═══════════════════════════════════════════════════════════════
const DEMO_SHOWS: Record<string, Partial<ShowRecapData>> = {
  '2026-04-17': {
    city: 'Atlanta, GA', venue: 'Hell at The Masquerade',
    doorCount: 312, capacity: 400, ticketSales: 298,
    merchGross: 1240, merchItems: 54, merchTopItem: 'Lady in Red Tee',
    settlement: 2500, guarantee: 2500,
    merchPerCapita: 3.97, revenuePerHead: 12.95,
    prevMerchGross: 0, prevDoorCount: 0,
    merchTourAvg: 3.50, fillTourAvg: 72,
    records: ['First show of the tour! 🎉', 'Highest attendance for an opening night'],
    announcements: [
      { id: '1', message: '🎉 Tour is officially ON — welcome to Atlanta!', category: 'celebration', createdAt: new Date().toISOString() },
      { id: '2', message: '⏰ Load-in tomorrow at 10am — Orlando', category: 'logistics', createdAt: new Date().toISOString() },
      { id: '3', message: '🎒 Check the bus for your chargers tonight', category: 'general', createdAt: new Date().toISOString() },
    ],
  },
  '2026-04-18': {
    city: 'Orlando, FL', venue: 'Conduit',
    doorCount: 245, capacity: 350, ticketSales: 238,
    merchGross: 890, merchItems: 38, merchTopItem: 'Red Vinyl LP',
    settlement: 2000, guarantee: 2000,
    merchPerCapita: 3.63, revenuePerHead: 12.61,
    prevMerchGross: 1240, prevDoorCount: 312,
    merchTourAvg: 3.50, fillTourAvg: 72,
    records: [],
    announcements: [
      { id: '4', message: '🚐 85 miles to Tampa — easy drive tomorrow', category: 'logistics', createdAt: new Date().toISOString() },
      { id: '5', message: '🍽️ Catering provided at The Orpheum', category: 'general', createdAt: new Date().toISOString() },
    ],
  },
  '2026-04-19': {
    city: 'Tampa, FL', venue: 'The Orpheum',
    doorCount: 289, capacity: 400, ticketSales: 275,
    merchGross: 1480, merchItems: 67, merchTopItem: 'Tour Poster (signed)',
    settlement: 2800, guarantee: 2800,
    merchPerCapita: 5.12, revenuePerHead: 15.85,
    prevMerchGross: 890, prevDoorCount: 245,
    merchTourAvg: 3.50, fillTourAvg: 72,
    records: ['🔥 Best merch night so far!', '📈 Highest merch per capita'],
    announcements: [
      { id: '6', message: '🔥 TAMPA SHOWED UP — best merch night yet!', category: 'celebration', createdAt: new Date().toISOString() },
      { id: '7', message: '💤 Travel day tomorrow — 653 miles to Greensboro', category: 'logistics', createdAt: new Date().toISOString() },
      { id: '8', message: '📦 Merch resupply needed before Philly', category: 'alert', createdAt: new Date().toISOString() },
    ],
  },
};

function getDemoData(date: string): ShowRecapData | null {
  const routeDay = ROUTING_DATA.find(d => d.date === date);
  if (!routeDay || routeDay.type !== 'SHOW') return null;

  const demo = DEMO_SHOWS[date];
  if (demo) {
    const fillRate = demo.doorCount && demo.capacity ? Math.round((demo.doorCount / demo.capacity) * 100) : null;
    const merchConversion = demo.doorCount && demo.merchItems ? Math.round((demo.merchItems / demo.doorCount) * 100) : null;
    const compWalkinGap = demo.doorCount != null && demo.ticketSales != null ? demo.doorCount - demo.ticketSales : null;
    return {
      showDate: date, city: demo.city!, venue: demo.venue!,
      dayNumber: ROUTING_DATA.filter(d => d.type === 'SHOW' && d.date <= date).length,
      totalShows: ROUTING_DATA.filter(d => d.type === 'SHOW').length,
      doorCount: demo.doorCount!, capacity: demo.capacity!, ticketSales: demo.ticketSales!,
      merchTopItem: demo.merchTopItem!, guarantee: demo.guarantee!,
      settlement: demo.settlement!,
      merchGross: demo.merchGross!, merchItems: demo.merchItems!,
      fillRate, merchPerCapita: demo.merchPerCapita!, revenuePerHead: demo.revenuePerHead!,
      compWalkinGap, merchConversion,
      prevMerchGross: demo.prevMerchGross!, prevDoorCount: demo.prevDoorCount!,
      merchTourAvg: demo.merchTourAvg!, fillTourAvg: demo.fillTourAvg!,
      nextCity: null, nextDistance: null, nextDriveTime: null, nextDate: null, nextVenue: null,
      announcements: demo.announcements || [], records: demo.records || [],
    };
  }

  // Seed-based plausible data for any other show date
  const seed = date.split('-').reduce((a, b) => a + parseInt(b), 0);
  const rand = (min: number, max: number) => min + ((seed * 9301 + 49297) % 233280) / 233280 * (max - min);
  const doorCount = Math.round(rand(150, 450));
  const capacity = Math.round(doorCount / rand(0.55, 0.95));
  const ticketSales = Math.round(doorCount * rand(0.85, 0.98));
  const merchGross = Math.round(rand(400, 1800));
  const merchItems = Math.round(merchGross / rand(18, 30));
  const settlement = Math.round(rand(1500, 4500));
  const fillRate = Math.round((doorCount / capacity) * 100);
  const merchConversion = Math.round((merchItems / doorCount) * 100);

  const nextShow = ROUTING_DATA.find(d => d.date > date && d.type === 'SHOW');
  return {
    showDate: date, city: routeDay.city, venue: routeDay.venue || '',
    dayNumber: ROUTING_DATA.filter(d => d.type === 'SHOW' && d.date <= date).length,
    totalShows: ROUTING_DATA.filter(d => d.type === 'SHOW').length,
    doorCount, capacity, ticketSales, merchTopItem: 'Lady in Red Tee',
    settlement, guarantee: Math.round(settlement * 0.7),
    merchGross, merchItems,
    fillRate, merchPerCapita: +(merchGross / doorCount).toFixed(2),
    revenuePerHead: +((settlement + merchGross) / doorCount).toFixed(2),
    compWalkinGap: doorCount - ticketSales, merchConversion,
    prevMerchGross: Math.round(rand(400, 1200)), prevDoorCount: Math.round(rand(150, 400)),
    merchTourAvg: 3.50, fillTourAvg: 72,
    nextCity: nextShow?.city || null, nextDistance: nextShow?.next_distance || null,
    nextDriveTime: nextShow?.next_drive_time || null, nextDate: nextShow?.date || null,
    nextVenue: nextShow?.venue || null,
    announcements: [{ id: '0', message: '🚐 Drive safe to the next city', category: 'logistics', createdAt: new Date().toISOString() }],
    records: [],
  };
}

// ═══════════════════════════════════════════════════════════════
// Page Component
// ═══════════════════════════════════════════════════════════════
export default function ShowRecap() {
  const params = useParams();
  const searchParams = useSearchParams();
  const date = params.date as string;
  const tourId = searchParams.get('tour');

  const [data, setData] = useState<ShowRecapData | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Load data: Supabase → localStorage (generate form) → demo fallback
  useEffect(() => {
    let cancelled = false;
    async function load() {
      // 1. Try Supabase first if tour ID provided
      if (tourId) {
        const live = await fetchShowRecap(tourId, date);
        if (!cancelled && live) {
          setData(live);
          setIsLive(true);
          setTimeout(() => setAnimateIn(true), 100);
          return;
        }
      }
      // 2. Check localStorage for data entered via Generate Recap form
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(`tourhq_recap_${date}`);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const routeDay = ROUTING_DATA.find(d => d.date === date);
            const dc = parsed.doorCount || 0;
            const cap = parsed.capacity || 0;
            const ts = parsed.ticketSales || 0;
            const mg = parsed.merchGross || 0; // might not exist in form data
            const mi = parsed.merchItems || 0;
            const set = parsed.settlement || 0;
            const fillRate = cap > 0 ? Math.round((dc / cap) * 100) : null;
            const merchConversion = dc > 0 && mi > 0 ? Math.round((mi / dc) * 100) : null;
            if (!cancelled) {
              setData({
                showDate: date,
                city: routeDay?.city || parsed.city || '',
                venue: routeDay?.venue || parsed.venue || '',
                dayNumber: ROUTING_DATA.filter(d => d.type === 'SHOW' && d.date <= date).length,
                totalShows: ROUTING_DATA.filter(d => d.type === 'SHOW').length,
                doorCount: dc, capacity: cap, ticketSales: ts,
                merchTopItem: parsed.merchTopItem || null,
                guarantee: parsed.guarantee || 0,
                settlement: set, merchGross: mg, merchItems: mi,
                fillRate, merchPerCapita: dc > 0 ? +(mg / dc).toFixed(2) : null,
                revenuePerHead: dc > 0 ? +((set + mg) / dc).toFixed(2) : null,
                compWalkinGap: dc - ts, merchConversion,
                prevMerchGross: 0, prevDoorCount: 0,
                merchTourAvg: 3.50, fillTourAvg: 72,
                nextCity: null, nextDistance: null, nextDriveTime: null,
                nextDate: null, nextVenue: null,
                announcements: (parsed.announcements || []).map((a: any, i: number) => ({
                  id: String(i), message: a.message, category: a.category, createdAt: new Date().toISOString(),
                })),
                records: [],
              });
              setTimeout(() => setAnimateIn(true), 100);
              return;
            }
          } catch { /* fall through to demo */ }
        }
      }
      // 3. Fall back to demo
      if (!cancelled) {
        setData(getDemoData(date));
        setTimeout(() => setAnimateIn(true), 100);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [date, tourId]);

  // 3D tilt on mouse move
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setTilt({ x: y * -3, y: x * 3 });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  // No show on this date
  const routeDay = ROUTING_DATA.find(d => d.date === date);
  if (!routeDay || routeDay.type !== 'SHOW' || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="text-center">
          <div className="mb-4 text-6xl">🎤</div>
          <h1 className="text-2xl font-bold text-text">No show on this date</h1>
          <p className="mt-2 text-dim">{date}</p>
          <a href="/" className="mt-6 inline-block rounded-lg bg-accent/20 px-6 py-2 text-sm text-accent hover:bg-accent/30">
            ← Back to Command Center
          </a>
        </div>
      </div>
    );
  }

  const d = data;
  const merchDelta = d.prevMerchGross > 0
    ? Math.round(((d.merchGross - d.prevMerchGross) / d.prevMerchGross) * 100) : 0;
  const doorDelta = d.prevDoorCount > 0
    ? Math.round(((d.doorCount! - d.prevDoorCount) / d.prevDoorCount) * 100) : 0;
  const merchVsAvg = d.merchTourAvg > 0 && d.merchPerCapita
    ? Math.round(((d.merchPerCapita - d.merchTourAvg) / d.merchTourAvg) * 100) : 0;

  const showDate = new Date(date + 'T12:00:00');
  const dateLabel = showDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[#080406]"
      style={{ perspective: '1200px' }}
    >
      {/* ═══ Ambient background ═══ */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(217,4,41,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(255,45,120,0.08),transparent_60%)]" />
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + (i % 4), height: 2 + (i % 4),
              left: `${(i * 37 + 13) % 100}%`, top: `${(i * 53 + 7) % 100}%`,
              background: i % 3 === 0 ? 'rgba(217,4,41,0.6)' : i % 3 === 1 ? 'rgba(255,45,120,0.4)' : 'rgba(255,200,100,0.3)',
              animation: `float ${4 + (i % 5)}s ease-in-out ${(i * 0.3) % 3}s infinite alternate`,
              boxShadow: i % 3 === 0 ? '0 0 6px rgba(217,4,41,0.4)' : 'none',
            }}
          />
        ))}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }} />
      </div>

      {/* ═══ Content ═══ */}
      <div
        className="relative z-10 mx-auto max-w-[520px] px-5 py-8"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Live indicator */}
        {isLive && (
          <div className="mb-4 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-3 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-success animate-statusPulse" />
              <span className="font-mono text-[0.55rem] font-bold uppercase tracking-widest text-success">Live Data</span>
            </span>
          </div>
        )}

        {/* ── Hero ── */}
        <div className={`mb-8 text-center transition-all duration-1000 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-accent animate-statusPulse" />
            <span className="font-mono text-[0.65rem] font-bold uppercase tracking-widest text-accent">Show Recap</span>
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-[#ff1744] via-[#ff6b6b] to-[#ffab40] bg-clip-text text-4xl font-black tracking-tight text-transparent"
            style={{ textShadow: '0 0 40px rgba(217,4,41,0.3)', animation: 'heroGlow 3s ease-in-out infinite alternate' }}>
            {d.city.split(',')[0]}
          </h1>
          <div className="text-sm font-semibold text-text/80">{d.venue}</div>
          <div className="mt-1 text-xs text-dim">{dateLabel} • Day {d.dayNumber} of {d.totalShows}</div>
          <div className="mx-auto mt-4 h-px w-48 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        </div>

        {/* ── The Big Three ── */}
        <div className={`mb-8 grid grid-cols-3 gap-3 transition-all duration-1000 delay-200 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <FloatingCard depth={40} delay={0}>
            <RecapRing value={d.fillRate || 0} label="Fill" color="#ff1744" glowColor="rgba(255,23,68,0.5)" icon="🎟️" />
            <div className="mt-1 text-center font-mono text-[0.6rem] text-dim">
              {d.doorCount ?? '—'} / {d.capacity ?? '—'}
            </div>
          </FloatingCard>
          <FloatingCard depth={50} delay={100}>
            <RecapRing value={d.merchConversion || 0} label="Merch" color="#ffab40" glowColor="rgba(255,171,64,0.5)" icon="🛍️" />
            <div className="mt-1 text-center font-mono text-[0.6rem] text-dim">{d.merchItems} items</div>
          </FloatingCard>
          <FloatingCard depth={40} delay={200}>
            <div className="flex flex-col items-center justify-center">
              <span className="mb-1 text-2xl">💰</span>
              <span className="font-mono text-2xl font-black text-[#00ff88]">
                ${d.settlement.toLocaleString()}
              </span>
              <span className="mt-0.5 text-[0.55rem] font-semibold uppercase tracking-wider text-dim">Settlement</span>
            </div>
          </FloatingCard>
        </div>

        {/* ── Money Stats ── */}
        <div className={`mb-6 transition-all duration-1000 delay-300 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionHeader icon="💰" label="Tonight's Numbers" />
          <FloatingCard depth={25}>
            <div className="grid grid-cols-2 gap-4">
              <StatLine label="Merch Gross" value={`$${d.merchGross.toLocaleString()}`}
                delta={merchDelta} deltaLabel="vs last night" color="#ffab40" />
              <StatLine label="Merch Per Head"
                value={d.merchPerCapita != null ? `$${d.merchPerCapita.toFixed(2)}` : '—'}
                delta={merchVsAvg} deltaLabel="vs tour avg"
                color={merchVsAvg >= 0 ? '#00ff88' : '#ff1744'} />
              <StatLine label="Revenue Per Fan"
                value={d.revenuePerHead != null ? `$${d.revenuePerHead.toFixed(2)}` : '—'} color="#00f0ff" />
              <StatLine label="Door vs Tickets"
                value={d.compWalkinGap != null ? `${d.compWalkinGap}` : '—'}
                sub="gap (comps/walk-ins)" color="#a855f7" />
            </div>
            {d.merchTopItem && (
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/[0.02] p-3">
                <div className="text-lg">🏆</div>
                <div className="flex-1">
                  <div className="text-[0.7rem] font-semibold">Top Seller</div>
                  <div className="font-mono text-sm text-[#ffab40]">{d.merchTopItem}</div>
                </div>
              </div>
            )}
          </FloatingCard>
        </div>

        {/* ── Comparison Card ── */}
        {d.prevDoorCount > 0 && (
          <div className={`mb-6 transition-all duration-1000 delay-400 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <SectionHeader icon="📊" label="vs Last Night" />
            <FloatingCard depth={25}>
              <div className="grid grid-cols-2 gap-6">
                <CompareBar label="Door Count" today={d.doorCount || 0} prev={d.prevDoorCount} />
                <CompareBar label="Merch $" today={d.merchGross} prev={d.prevMerchGross} prefix="$" />
              </div>
            </FloatingCard>
          </div>
        )}

        {/* ── Records ── */}
        {d.records.length > 0 && (
          <div className={`mb-6 transition-all duration-1000 delay-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <SectionHeader icon="🏆" label="Records" />
            <FloatingCard depth={20} glowColor="rgba(255,171,64,0.1)">
              <div className="space-y-2">
                {d.records.map((record, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#ffab40] shadow-[0_0_6px_rgba(255,171,64,0.5)]" />
                    <span className="text-sm font-medium text-[#ffab40]">{record}</span>
                  </div>
                ))}
              </div>
            </FloatingCard>
          </div>
        )}

        {/* ── Announcements ── */}
        {d.announcements.length > 0 && (
          <div className={`mb-6 transition-all duration-1000 delay-600 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <SectionHeader icon="📢" label="From Tour Mgmt" />
            <FloatingCard depth={20}>
              <div className="space-y-3">
                {d.announcements.map((a) => (
                  <div key={a.id} className="flex items-start gap-2.5 border-b border-white/[0.03] pb-2.5 last:border-0 last:pb-0">
                    <div className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      a.category === 'celebration' ? 'bg-[#ffab40] shadow-[0_0_6px_rgba(255,171,64,0.4)]'
                        : a.category === 'alert' ? 'bg-[#ff1744] shadow-[0_0_6px_rgba(255,23,68,0.4)]'
                        : a.category === 'safety' ? 'bg-[#ff1744] shadow-[0_0_6px_rgba(255,23,68,0.4)]'
                        : a.category === 'logistics' ? 'bg-[#00f0ff] shadow-[0_0_6px_rgba(0,240,255,0.4)]'
                        : 'bg-accent shadow-[0_0_6px_rgba(217,4,41,0.4)]'
                    }`} />
                    <span className="text-[0.8rem] text-text/80">{a.message}</span>
                  </div>
                ))}
              </div>
            </FloatingCard>
          </div>
        )}

        {/* ── Next Up ── */}
        {d.nextCity && (
          <div className={`mb-6 transition-all duration-1000 delay-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <SectionHeader icon="🗺️" label="Next Up" />
            <FloatingCard depth={25}>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-2xl shadow-[0_0_20px_rgba(217,4,41,0.2)]">🎤</div>
                <div className="flex-1">
                  <div className="text-lg font-bold">{d.nextCity.split(',')[0]}</div>
                  <div className="text-xs text-dim">
                    {d.nextVenue && `${d.nextVenue} • `}{d.nextDistance} • {d.nextDriveTime}
                  </div>
                </div>
                {d.nextDate && (
                  <div className="font-mono text-xs text-accent">
                    {new Date(d.nextDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                )}
              </div>
            </FloatingCard>
          </div>
        )}

        {/* ── Footer ── */}
        <div className={`mt-10 text-center transition-all duration-1000 delay-800 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-3 inline-block">
            <div className="bg-gradient-to-r from-[#ff1744] via-[#ff6b6b] to-[#ffab40] bg-clip-text text-xl font-black tracking-tight text-transparent"
              style={{ animation: 'heroGlow 3s ease-in-out infinite alternate' }}>
              VANA
            </div>
          </div>
          <div className="text-[0.55rem] uppercase tracking-[0.15em] text-muted">Lady in Red Tour 2026</div>
          <div className="mt-2 text-[0.5rem] text-muted/50">Powered by VANA Tour HQ</div>
        </div>
        <div className="h-12" />
      </div>

      {/* ═══ Global CSS ═══ */}
      <style jsx global>{`
        @keyframes float { 0% { transform: translateY(0px) translateX(0px); } 100% { transform: translateY(-20px) translateX(8px); } }
        @keyframes heroGlow { 0% { filter: drop-shadow(0 0 10px rgba(217,4,41,0.2)); } 100% { filter: drop-shadow(0 0 25px rgba(255,45,120,0.4)); } }
        @keyframes pulse3d { 0%, 100% { transform: translateZ(0px) scale(1); } 50% { transform: translateZ(10px) scale(1.02); } }
      `}</style>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────

function SectionHeader({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <span className="text-sm">{icon}</span>
      <span className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-dim">{label}</span>
      <div className="h-px flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
    </div>
  );
}

function StatLine({ label, value, delta, deltaLabel, sub, color }: {
  label: string; value: string; color: string;
  delta?: number; deltaLabel?: string; sub?: string;
}) {
  return (
    <div>
      <div className="text-[0.6rem] font-semibold uppercase tracking-wider text-dim">{label}</div>
      <div className="font-mono text-lg font-bold" style={{ color }}>{value}</div>
      {delta !== undefined && delta !== 0 && (
        <div className={`font-mono text-[0.6rem] font-semibold ${delta >= 0 ? 'text-[#00ff88]' : 'text-[#ff1744]'}`}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}% {deltaLabel && <span className="text-muted">({deltaLabel})</span>}
        </div>
      )}
      {sub && <div className="font-mono text-[0.6rem] text-muted">{sub}</div>}
    </div>
  );
}

function CompareBar({ label, today, prev, prefix = '' }: {
  label: string; today: number; prev: number; prefix?: string;
}) {
  const maxVal = Math.max(today, prev);
  const todayW = maxVal > 0 ? (today / maxVal) * 100 : 0;
  const prevW = maxVal > 0 ? (prev / maxVal) * 100 : 0;
  const delta = prev > 0 ? Math.round(((today - prev) / prev) * 100) : 0;

  return (
    <div>
      <div className="mb-1.5 text-[0.6rem] font-semibold uppercase tracking-wider text-dim">{label}</div>
      <div className="space-y-1.5">
        <div>
          <div className="mb-0.5 flex justify-between">
            <span className="text-[0.55rem] text-muted">Tonight</span>
            <span className="font-mono text-[0.65rem] font-bold text-text">{prefix}{today.toLocaleString()}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.03]">
            <div className="h-full rounded-full bg-gradient-to-r from-[#ff1744] to-[#ff6b6b] transition-all duration-[1200ms] ease-out"
              style={{ width: `${todayW}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-0.5 flex justify-between">
            <span className="text-[0.55rem] text-muted">Last Night</span>
            <span className="font-mono text-[0.65rem] text-dim">{prefix}{prev.toLocaleString()}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.03]">
            <div className="h-full rounded-full bg-gradient-to-r from-white/10 to-white/20 transition-all duration-[1200ms] ease-out delay-200"
              style={{ width: `${prevW}%` }} />
          </div>
        </div>
      </div>
      {delta !== 0 && (
        <div className={`mt-1 text-right font-mono text-[0.55rem] font-semibold ${delta >= 0 ? 'text-[#00ff88]' : 'text-[#ff1744]'}`}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}%
        </div>
      )}
    </div>
  );
}
