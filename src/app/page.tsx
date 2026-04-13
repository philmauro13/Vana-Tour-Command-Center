'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  computeTourProgress,
  computeFinancials,
  computeCategorySpend,
  getUpcomingShows,
  generateFeedItems,
  ROUTING_DATA,
  DEMO_MERCH,
} from '@/lib/data';
import { FeedItem } from '@/lib/types';
import { GlassCard } from '@/components/cards/GlassCard';
import { BigNum } from '@/components/ui/BigNum';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatRing } from '@/components/ui/StatRing';
import { CategoryBar } from '@/components/cards/CategoryBar';
import { UpcomingShow } from '@/components/cards/UpcomingShow';
import { ActivityFeed } from '@/components/ui/ActivityFeed';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { RefreshButton } from '@/components/ui/RefreshButton';

export default function CommandCenter() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const refreshData = useCallback(() => {
    setFeedItems(generateFeedItems());
  }, []);

  useEffect(() => {
    setMounted(true);
    refreshData();
  }, [refreshData]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(refreshData, 60000);
    return () => clearInterval(interval);
  }, [refreshData]);

  if (!mounted) return null;

  const progress = computeTourProgress();
  const financials = computeFinancials();
  const categories = computeCategorySpend();
  const upcoming = getUpcomingShows(6);

  const startDate = new Date(progress.startDate + 'T12:00:00');
  const endDate = new Date(progress.endDate + 'T12:00:00');
  const startLabel = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endLabel = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const budgetColor = financials.budgetUsedPct > 90 ? 'red' : financials.budgetUsedPct > 70 ? 'yellow' : 'green';

  return (
    <>
      <RefreshButton onRefresh={refreshData} />

      <div className="relative z-10 mx-auto max-w-[960px] px-4 py-4">
        {/* Hero */}
        <div className="relative pb-6 pt-8 text-center after:absolute after:bottom-0 after:left-[10%] after:right-[10%] after:h-px after:bg-gradient-to-r after:from-transparent after:via-cyan after:to-transparent">
          <div className="mb-4 inline-block">
            <div className="animate-logoPulse text-4xl font-black tracking-tight drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              VANA
            </div>
          </div>
          <h1 className="bg-gradient-to-r from-cyan via-pink to-cyan bg-[length:200%_200%] bg-clip-text text-3xl font-black tracking-tight text-transparent animate-gradientShift">
            TOUR COMMAND CENTER
          </h1>
          <div className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-dim">
            VANA Lady in Red Tour 2026
          </div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/[0.08] px-4 py-1.5 text-[0.7rem] font-semibold text-success">
            <div className="h-2 w-2 rounded-full bg-success animate-statusPulse" />
            <span>
              {progress.percentComplete >= 100
                ? 'TOUR COMPLETE'
                : progress.percentComplete > 0
                  ? `ON TOUR — DAY ${progress.daysCompleted} OF ${ROUTING_DATA.length}`
                  : 'ON TOUR'}
            </span>
          </div>
        </div>

        {/* Tour Progress */}
        <SectionLabel icon="⚡" label="Tour Progress" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <GlassCard>
            <BigNum value={progress.daysCompleted} color="cyan" label="Days Done" />
          </GlassCard>
          <GlassCard>
            <BigNum value={progress.daysRemaining} color="pink" label="Days Left" />
          </GlassCard>
          <GlassCard>
            <BigNum value={progress.showsPlayed} color="purple" label="Shows" />
          </GlassCard>
          <GlassCard>
            <BigNum value={progress.milesDriven} color="cyan" label="Miles" />
          </GlassCard>
        </div>
        <GlassCard className="mt-3">
          <div className="mb-2 text-[0.7rem] font-semibold text-dim">TOUR PROGRESS</div>
          <ProgressBar value={progress.percentComplete} color="cyan" height={14} />
          <div className="mt-2 flex justify-between text-[0.65rem] text-dim">
            <span>{startLabel}</span>
            <span className="font-mono font-bold text-cyan">{progress.percentComplete}%</span>
            <span>{endLabel}</span>
          </div>
        </GlassCard>

        {/* Financial Overview */}
        <SectionLabel icon="💰" label="Financial Overview" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <BigNum value={financials.totalRevenue} prefix="$" color="green" label="Total Revenue" sub="settlements + merch" />
              </div>
              <StatRing
                value={financials.budgetTotal > 0 ? (financials.totalRevenue / financials.budgetTotal) * 100 : 0}
                display={financials.totalRevenue > 0 ? `$${Math.round(financials.totalRevenue / 1000)}k` : '$0'}
                color="green"
              />
            </div>
          </GlassCard>
          <GlassCard accent>
            <div className="flex items-start justify-between">
              <div>
                <BigNum value={financials.totalExpenses} prefix="$" color="red" label="Total Spent" sub="fuel, food, lodging, etc" />
              </div>
              <StatRing
                value={financials.budgetUsedPct}
                display={`${financials.budgetUsedPct}%`}
                color="red"
              />
            </div>
          </GlassCard>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <GlassCard>
            <BigNum
              value={Math.abs(financials.netProfit)}
              prefix={financials.netProfit >= 0 ? '$' : '-$'}
              color={financials.netProfit >= 0 ? 'green' : 'red'}
              label="Net Profit/Loss"
              sub="revenue minus expenses"
            />
          </GlassCard>
          <GlassCard>
            <BigNum value={financials.dailyBurnRate} prefix="$" color="cyan" label="Daily Burn Rate" sub="avg spend per day" />
          </GlassCard>
        </div>

        {/* Budget Breakdown */}
        <SectionLabel icon="📊" label="Budget vs Actual" />
        <GlassCard>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-mono text-2xl font-bold text-cyan">
                ${Math.abs(financials.budgetRemaining).toLocaleString()}
              </div>
              <div className="mt-0 text-[0.65rem] font-semibold uppercase tracking-wider text-dim">
                {financials.budgetRemaining >= 0 ? 'remaining of' : 'over budget by'}{' '}
                <span>${financials.budgetTotal.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-mono text-2xl font-bold ${financials.budgetUsedPct > 100 ? 'text-accent' : 'text-success'}`}>
                {financials.budgetUsedPct}%
              </div>
              <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-dim">
                {financials.budgetUsedPct > 100 ? 'over budget' : 'under budget'}
              </div>
            </div>
          </div>
          <ProgressBar value={financials.budgetUsedPct} color={budgetColor} height={12} showLabel />
          <div className="mt-4 space-y-2.5">
            {categories.map((cat) => (
              <CategoryBar
                key={cat.category}
                icon={cat.icon}
                label={cat.label}
                spent={cat.spent}
                budget={cat.budget}
                color={cat.color}
              />
            ))}
          </div>
        </GlassCard>

        {/* Upcoming Route */}
        <SectionLabel icon="🗺️" label="Upcoming Route" />
        <GlassCard>
          {upcoming.length > 0 ? (
            upcoming.map((day) => (
              <UpcomingShow
                key={day.date}
                date={day.date}
                venue={day.venue || ''}
                city={day.city}
                distance={day.next_distance || ''}
                type={day.type as 'SHOW' | 'TRAVEL' | 'OFF'}
              />
            ))
          ) : (
            <div className="py-4 text-center text-dim">Tour complete! 🎉</div>
          )}
        </GlassCard>

        {/* Merch Performance */}
        <SectionLabel icon="👕" label="Merch Performance" />
        <div className="grid grid-cols-3 gap-3">
          <GlassCard>
            <BigNum value={DEMO_MERCH.revenue} prefix="$" color="purple" label="Revenue" />
          </GlassCard>
          <GlassCard>
            <BigNum value={DEMO_MERCH.itemsSold} color="cyan" label="Items Sold" />
          </GlassCard>
          <GlassCard>
            <BigNum value={DEMO_MERCH.netProfit} prefix="$" color="green" label="Net Profit" />
          </GlassCard>
        </div>

        {/* Activity Feed */}
        <SectionLabel icon="📡" label="Activity Feed" />
        <GlassCard>
          <ActivityFeed items={feedItems} />
        </GlassCard>

        {/* Footer */}
        <div className="py-8 text-center text-[0.6rem] uppercase tracking-[0.1em] text-muted">
          VANA TOUR HQ COMMAND CENTER
          <br />
          <span className="text-cyan">●</span> LIVE — DATA REFRESHES EVERY 60S
        </div>
      </div>
    </>
  );
}
