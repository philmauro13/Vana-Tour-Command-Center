import { supabase, isSupabaseConfigured } from './supabase';

// ─── Types ──────────────────────────────────────────────────────────

export interface ShowRecapData {
  showDate: string;
  city: string;
  venue: string;
  dayNumber: number;
  totalShows: number;
  doorCount: number | null;
  capacity: number | null;
  ticketSales: number | null;
  merchTopItem: string | null;
  guarantee: number;
  settlement: number; // guarantee (no total_due in current schema)
  merchGross: number;
  merchItems: number;
  fillRate: number | null;
  merchPerCapita: number | null;
  revenuePerHead: number | null;
  compWalkinGap: number | null;
  merchConversion: number | null;
  prevMerchGross: number;
  prevDoorCount: number;
  merchTourAvg: number;
  fillTourAvg: number;
  nextCity: string | null;
  nextDistance: string | null;
  nextDriveTime: string | null;
  nextDate: string | null;
  nextVenue: string | null;
  announcements: Announcement[];
  records: string[];
}

export interface Announcement {
  id: string;
  message: string;
  category: 'general' | 'alert' | 'celebration' | 'logistics' | 'safety';
  createdAt: string;
}

// ─── Main fetch function ────────────────────────────────────────────

export async function fetchShowRecap(
  tourId: string,
  date: string
): Promise<ShowRecapData | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    // 1. Fetch settlement for this date
    //    Real columns: id, tour_id, show_date, venue_name, guarantee, currency,
    //    notes, door_count, capacity, ticket_sales, merch_top_item, created_at, updated_at
    const { data: settlement, error: sErr } = await supabase
      .from('settlements')
      .select('*')
      .eq('tour_id', tourId)
      .eq('show_date', date)
      .maybeSingle();

    if (sErr) console.error('settlements fetch error:', sErr);
    if (!settlement) return null;

    // 2. Get city from day_sheets (settlements has no city column)
    const { data: daySheet } = await supabase
      .from('day_sheets')
      .select('city, venue_name')
      .eq('tour_id', tourId)
      .eq('day_date', date)
      .maybeSingle();

    const city = daySheet?.city || '';
    const venue = settlement.venue_name || daySheet?.venue_name || '';

    // 3. Fetch merch sales for this date
    //    merch_sales columns: id, tour_id, item_id, ?, quantity, total, unit_price, ?, notes, created_at
    const { data: merchRows, error: mErr } = await supabase
      .from('merch_sales')
      .select('quantity, total')
      .eq('tour_id', tourId)
      .gte('created_at', `${date}T00:00:00`)
      .lt('created_at', `${date}T23:59:59`);

    if (mErr) console.error('merch_sales fetch error:', mErr);

    const merchGross = (merchRows || []).reduce((s, r) => s + (r.total || 0), 0);
    const merchItems = (merchRows || []).reduce((s, r) => s + (r.quantity || 0), 0);

    // 4. Fetch previous show's data for comparison
    const { data: prevSettlement } = await supabase
      .from('settlements')
      .select('show_date, door_count, guarantee')
      .eq('tour_id', tourId)
      .lt('show_date', date)
      .order('show_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    let prevMerchGross = 0;
    if (prevSettlement?.show_date) {
      const { data: prevMerch } = await supabase
        .from('merch_sales')
        .select('total')
        .eq('tour_id', tourId)
        .gte('created_at', `${prevSettlement.show_date}T00:00:00`)
        .lt('created_at', `${prevSettlement.show_date}T23:59:59`);
      prevMerchGross = (prevMerch || []).reduce((s, r) => s + (r.total || 0), 0);
    }

    // 5. Fetch tour averages
    const { data: allSettlements } = await supabase
      .from('settlements')
      .select('show_date, door_count, capacity, guarantee')
      .eq('tour_id', tourId)
      .not('door_count', 'is', null);

    let merchTourAvg = 0;
    let fillTourAvg = 0;
    if (allSettlements && allSettlements.length > 0) {
      // For tour avg merch, we need to aggregate merch_sales per settlement date
      const merchTotals: Record<string, number> = {};
      for (const s of allSettlements) {
        const { data: mRows } = await supabase
          .from('merch_sales')
          .select('total')
          .eq('tour_id', tourId)
          .gte('created_at', `${s.show_date}T00:00:00`)
          .lt('created_at', `${s.show_date}T23:59:59`);
        merchTotals[s.show_date] = (mRows || []).reduce((sum, r) => sum + (r.total || 0), 0);
      }

      const perCapitas = allSettlements
        .filter(s => s.door_count > 0)
        .map(s => (merchTotals[s.show_date] || 0) / s.door_count);
      merchTourAvg = perCapitas.length > 0
        ? perCapitas.reduce((a, b) => a + b, 0) / perCapitas.length
        : 0;

      const fillRates = allSettlements
        .filter(s => s.capacity > 0)
        .map(s => (s.door_count / s.capacity) * 100);
      fillTourAvg = fillRates.length > 0
        ? fillRates.reduce((a, b) => a + b, 0) / fillRates.length
        : 0;
    }

    // 6. Fetch next show from tour_dates
    //    tour_dates has: date, city, venue, next_distance, next_drive_time
    const { data: nextDate } = await supabase
      .from('tour_dates')
      .select('date, city, venue, next_distance, next_drive_time')
      .eq('tour_id', tourId)
      .eq('type', 'SHOW')
      .gt('date', date)
      .order('date', { ascending: true })
      .limit(1)
      .maybeSingle();

    // 7. Fetch day number and total shows
    const { data: allShows } = await supabase
      .from('tour_dates')
      .select('date')
      .eq('tour_id', tourId)
      .eq('type', 'SHOW')
      .order('date', { ascending: true });

    const dayNumber = (allShows || []).filter(d => d.date <= date).length;
    const totalShows = (allShows || []).length;

    // 8. Fetch announcements
    const { data: annRows } = await supabase
      .from('tour_announcements')
      .select('id, message, category, created_at')
      .eq('tour_id', tourId)
      .eq('show_date', date)
      .order('created_at', { ascending: true });

    const announcements: Announcement[] = (annRows || []).map(r => ({
      id: r.id,
      message: r.message,
      category: r.category,
      createdAt: r.created_at,
    }));

    // 9. Compute derived metrics
    const doorCount = settlement.door_count;
    const capacity = settlement.capacity;
    const ticketSales = settlement.ticket_sales;
    const guarantee = settlement.guarantee || 0;

    const fillRate = doorCount && capacity ? Math.round((doorCount / capacity) * 100) : null;
    const merchPerCapita = doorCount && merchGross ? +(merchGross / doorCount).toFixed(2) : null;
    const revenuePerHead = doorCount ? +((guarantee + merchGross) / doorCount).toFixed(2) : null;
    const compWalkinGap = doorCount != null && ticketSales != null ? doorCount - ticketSales : null;
    const merchConversion = doorCount && merchItems ? Math.round((merchItems / doorCount) * 100) : null;

    // 10. Compute records
    const records = computeRecords(
      { merchGross, merchPerCapita, fillRate, doorCount },
      allSettlements?.map(s => ({ merch_gross: 0, door_count: s.door_count, capacity: s.capacity })) || [],
      merchTourAvg
    );

    return {
      showDate: date,
      city,
      venue,
      dayNumber,
      totalShows,
      doorCount,
      capacity,
      ticketSales,
      merchTopItem: settlement.merch_top_item,
      guarantee,
      settlement: guarantee, // no total_due in current schema
      merchGross,
      merchItems,
      fillRate,
      merchPerCapita,
      revenuePerHead,
      compWalkinGap,
      merchConversion,
      prevMerchGross,
      prevDoorCount: prevSettlement?.door_count || 0,
      merchTourAvg,
      fillTourAvg,
      nextCity: nextDate?.city || null,
      nextDistance: nextDate?.next_distance || null,
      nextDriveTime: nextDate?.next_drive_time || null,
      nextDate: nextDate?.date || null,
      nextVenue: nextDate?.venue || null,
      announcements,
      records,
    };
  } catch (err) {
    console.error('fetchShowRecap error:', err);
    return null;
  }
}

// ─── Record detection ───────────────────────────────────────────────

function computeRecords(
  current: { merchGross: number; merchPerCapita: number | null; fillRate: number | null; doorCount: number | null },
  allSettlements: { merch_gross: number; door_count: number; capacity: number }[],
  merchTourAvg: number
): string[] {
  const records: string[] = [];
  if (allSettlements.length < 2) {
    records.push('First show of the tour! 🎉');
    return records;
  }
  const maxMerch = Math.max(...allSettlements.map(s => s.merch_gross || 0));
  if (current.merchGross >= maxMerch && current.merchGross > 0) {
    records.push('🔥 Best merch night so far!');
  }
  if (current.merchPerCapita && current.merchPerCapita > merchTourAvg * 1.3) {
    records.push('📈 Highest merch per capita');
  }
  if (current.fillRate && current.fillRate >= 100) {
    records.push('🎫 SOLD OUT!');
  } else if (current.fillRate && current.fillRate >= 95) {
    records.push('🔥 Near sellout (95%+)!');
  }
  const maxDoor = Math.max(...allSettlements.map(s => s.door_count || 0));
  if (current.doorCount && current.doorCount >= maxDoor && current.doorCount > 0) {
    records.push('👥 Biggest crowd of the tour!');
  }
  return records;
}

// ─── Fetch tour ID by name ──────────────────────────────────────────

export async function findTourIdByName(name: string): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const { data } = await supabase
    .from('tours')
    .select('id')
    .ilike('name', `%${name}%`)
    .limit(1)
    .maybeSingle();
  return data?.id || null;
}
