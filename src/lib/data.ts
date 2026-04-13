import { TourProgress, FinancialSummary, CategorySpend, MerchSummary, FeedItem } from './types';

// VANA Lady in Red Tour 2026 — 46-day routing
export const ROUTING_DATA = [
  { date: '2026-04-17', type: 'SHOW', city: 'Atlanta, GA', venue: 'Hell at The Masquerade', next_city: 'Orlando, FL', next_distance: '439 miles', next_drive_time: '7h 59m' },
  { date: '2026-04-18', type: 'SHOW', city: 'Orlando, FL', venue: 'Conduit', next_city: 'Tampa, FL', next_distance: '85 miles', next_drive_time: '1h 24m' },
  { date: '2026-04-19', type: 'SHOW', city: 'Tampa, FL', venue: 'The Orpheum', next_city: 'Greensboro, NC', next_distance: '653 miles', next_drive_time: '11h 52m' },
  { date: '2026-04-20', type: 'TRAVEL', city: 'Tampa, FL', from: 'Tampa, FL', to: 'Greensboro, NC', distance: '653 miles', next_city: 'Greensboro, NC', next_distance: '0 miles' },
  { date: '2026-04-21', type: 'SHOW', city: 'Greensboro, NC', venue: 'Hangar 1819', next_city: 'Philadelphia, PA', next_distance: '468 miles', next_drive_time: '7h 30m' },
  { date: '2026-04-22', type: 'SHOW', city: 'Philadelphia, PA', venue: 'Brooklyn Bowl', next_city: 'New York, NY', next_distance: '97 miles', next_drive_time: '1h 50m' },
  { date: '2026-04-23', type: 'SHOW', city: 'New York, NY', venue: 'Mercury Lounge', next_city: 'Boston, MA', next_distance: '215 miles', next_drive_time: '3h 50m' },
  { date: '2026-04-24', type: 'SHOW', city: 'Boston, MA', venue: 'Brighton Music Hall', next_city: 'Montreal, QC', next_distance: '305 miles', next_drive_time: '5h 10m' },
  { date: '2026-04-25', type: 'TRAVEL', city: 'Boston, MA', from: 'Boston, MA', to: 'Montreal, QC', distance: '305 miles', next_city: 'Montreal, QC', next_distance: '0 miles' },
  { date: '2026-04-26', type: 'SHOW', city: 'Montreal, QC', venue: 'Le Studio TD', next_city: 'Toronto, ON', next_distance: '336 miles', next_drive_time: '5h 30m' },
  { date: '2026-04-27', type: 'SHOW', city: 'Toronto, ON', venue: 'The Velvet Underground', next_city: 'Detroit, MI', next_distance: '240 miles', next_drive_time: '4h 00m' },
  { date: '2026-04-28', type: 'SHOW', city: 'Detroit, MI', venue: 'El Club', next_city: 'Chicago, IL', next_distance: '283 miles', next_drive_time: '4h 20m' },
  { date: '2026-04-29', type: 'SHOW', city: 'Chicago, IL', venue: 'Subterranean', next_city: 'Milwaukee, WI', next_distance: '92 miles', next_drive_time: '1h 35m' },
  { date: '2026-04-30', type: 'SHOW', city: 'Milwaukee, WI', venue: 'Cactus Club', next_city: 'Minneapolis, MN', next_distance: '337 miles', next_drive_time: '5h 20m' },
  { date: '2026-05-01', type: 'SHOW', city: 'Minneapolis, MN', venue: '7th St Entry', next_city: 'Omaha, NE', next_distance: '383 miles', next_drive_time: '5h 50m' },
  { date: '2026-05-02', type: 'TRAVEL', city: 'Minneapolis, MN', from: 'Minneapolis, MN', to: 'Omaha, NE', distance: '383 miles', next_city: 'Omaha, NE', next_distance: '0 miles' },
  { date: '2026-05-03', type: 'SHOW', city: 'Omaha, NE', venue: 'The Waiting Room', next_city: 'Denver, CO', next_distance: '540 miles', next_drive_time: '7h 50m' },
  { date: '2026-05-04', type: 'SHOW', city: 'Denver, CO', venue: 'Globe Hall', next_city: 'Salt Lake City, UT', next_distance: '525 miles', next_drive_time: '7h 40m' },
  { date: '2026-05-05', type: 'TRAVEL', city: 'Denver, CO', from: 'Denver, CO', to: 'Salt Lake City, UT', distance: '525 miles', next_city: 'Salt Lake City, UT', next_distance: '0 miles' },
  { date: '2026-05-06', type: 'SHOW', city: 'Salt Lake City, UT', venue: 'Kilby Court', next_city: 'Boise, ID', next_distance: '341 miles', next_drive_time: '5h 00m' },
  { date: '2026-05-07', type: 'SHOW', city: 'Boise, ID', venue: 'Neurolux', next_city: 'Portland, OR', next_distance: '430 miles', next_drive_time: '6h 30m' },
  { date: '2026-05-08', type: 'SHOW', city: 'Portland, OR', venue: 'Dante\'s', next_city: 'Seattle, WA', next_distance: '174 miles', next_drive_time: '2h 50m' },
  { date: '2026-05-09', type: 'SHOW', city: 'Seattle, WA', venue: 'Neumos', next_city: 'Vancouver, BC', next_distance: '142 miles', next_drive_time: '2h 45m' },
  { date: '2026-05-10', type: 'SHOW', city: 'Vancouver, BC', venue: 'The Biltmore', next_city: 'San Francisco, CA', next_distance: '950 miles', next_drive_time: '14h 00m' },
  { date: '2026-05-11', type: 'TRAVEL', city: 'Vancouver, BC', from: 'Vancouver, BC', to: 'San Francisco, CA', distance: '950 miles', next_city: 'San Francisco, CA', next_distance: '0 miles' },
  { date: '2026-05-12', type: 'SHOW', city: 'San Francisco, CA', venue: 'Bottom of the Hill', next_city: 'Sacramento, CA', next_distance: '87 miles', next_drive_time: '1h 30m' },
  { date: '2026-05-13', type: 'SHOW', city: 'Sacramento, CA', venue: 'Harlow\'s', next_city: 'Los Angeles, CA', next_distance: '385 miles', next_drive_time: '5h 50m' },
  { date: '2026-05-14', type: 'SHOW', city: 'Los Angeles, CA', venue: 'The Echo', next_city: 'San Diego, CA', next_distance: '120 miles', next_drive_time: '2h 00m' },
  { date: '2026-05-15', type: 'SHOW', city: 'San Diego, CA', venue: 'Casbah', next_city: 'Phoenix, AZ', next_distance: '355 miles', next_drive_time: '5h 20m' },
  { date: '2026-05-16', type: 'TRAVEL', city: 'San Diego, CA', from: 'San Diego, CA', to: 'Phoenix, AZ', distance: '355 miles', next_city: 'Phoenix, AZ', next_distance: '0 miles' },
  { date: '2026-05-17', type: 'SHOW', city: 'Phoenix, AZ', venue: 'Crescent Ballroom', next_city: 'Tucson, AZ', next_distance: '116 miles', next_drive_time: '1h 45m' },
  { date: '2026-05-18', type: 'SHOW', city: 'Tucson, AZ', venue: 'Club Congress', next_city: 'El Paso, TX', next_distance: '320 miles', next_drive_time: '4h 40m' },
  { date: '2026-05-19', type: 'SHOW', city: 'El Paso, TX', venue: 'Lowbrow Palace', next_city: 'Austin, TX', next_distance: '580 miles', next_drive_time: '8h 30m' },
  { date: '2026-05-20', type: 'TRAVEL', city: 'El Paso, TX', from: 'El Paso, TX', to: 'Austin, TX', distance: '580 miles', next_city: 'Austin, TX', next_distance: '0 miles' },
  { date: '2026-05-21', type: 'SHOW', city: 'Austin, TX', venue: 'Mohawk', next_city: 'Dallas, TX', next_distance: '195 miles', next_drive_time: '3h 00m' },
  { date: '2026-05-22', type: 'SHOW', city: 'Dallas, TX', venue: 'Trees', next_city: 'Houston, TX', next_distance: '239 miles', next_drive_time: '3h 30m' },
  { date: '2026-05-23', type: 'SHOW', city: 'Houston, TX', venue: 'White Oak Music Hall', next_city: 'New Orleans, LA', next_distance: '350 miles', next_drive_time: '5h 10m' },
  { date: '2026-05-24', type: 'SHOW', city: 'New Orleans, LA', venue: 'Siberia', next_city: 'Nashville, TN', next_distance: '532 miles', next_drive_time: '7h 50m' },
  { date: '2026-05-25', type: 'TRAVEL', city: 'New Orleans, LA', from: 'New Orleans, LA', to: 'Nashville, TN', distance: '532 miles', next_city: 'Nashville, TN', next_distance: '0 miles' },
  { date: '2026-05-26', type: 'SHOW', city: 'Nashville, TN', venue: 'The Basement', next_city: 'Charlotte, NC', next_distance: '410 miles', next_drive_time: '6h 20m' },
  { date: '2026-05-27', type: 'SHOW', city: 'Charlotte, NC', venue: 'The Milestone', next_city: 'Richmond, VA', next_distance: '330 miles', next_drive_time: '5h 00m' },
  { date: '2026-05-28', type: 'SHOW', city: 'Richmond, VA', venue: 'The Camel', next_city: 'Washington, DC', next_distance: '108 miles', next_drive_time: '1h 50m' },
  { date: '2026-05-29', type: 'SHOW', city: 'Washington, DC', venue: 'DC9', next_city: 'Asheville, NC', next_distance: '475 miles', next_drive_time: '7h 10m' },
  { date: '2026-05-30', type: 'SHOW', city: 'Asheville, NC', venue: 'The Orange Peel', next_city: 'Atlanta, GA', next_distance: '202 miles', next_drive_time: '3h 30m' },
  { date: '2026-05-31', type: 'SHOW', city: 'Atlanta, GA', venue: 'Terminal West', next_city: '', next_distance: '', next_drive_time: '' },
];

// Demo financial data (simulating what Alpha's admin panel would produce)
export const DEMO_EXPENSES = [
  { category: 'fuel', amount: 1847, label: 'Fuel & Transport' },
  { category: 'food', amount: 1320, label: 'Food & Dining' },
  { category: 'lodging', amount: 2100, label: 'Hotels & Lodging' },
  { category: 'perdiem', amount: 680, label: 'Per Diem' },
  { category: 'production', amount: 450, label: 'Production' },
  { category: 'misc', amount: 275, label: 'Miscellaneous' },
];

export const DEMO_BUDGET = {
  total: 15000,
  categories: {
    fuel: 3500,
    food: 2500,
    lodging: 4000,
    perdiem: 2000,
    production: 1500,
    misc: 1500,
  },
};

export const DEMO_MERCH = {
  revenue: 4280,
  itemsSold: 187,
  netProfit: 2650,
  byShow: [
    { city: 'Atlanta', gross: 520, qty: 23 },
    { city: 'Orlando', gross: 680, qty: 31 },
    { city: 'Tampa', gross: 440, qty: 19 },
    { city: 'Greensboro', gross: 380, qty: 17 },
    { city: 'Philadelphia', gross: 610, qty: 28 },
    { city: 'New York', gross: 890, qty: 38 },
    { city: 'Boston', gross: 760, qty: 31 },
  ],
};

export function computeTourProgress(): TourProgress {
  const today = new Date().toISOString().split('T')[0];
  const totalDays = ROUTING_DATA.length;
  const pastDays = ROUTING_DATA.filter(d => d.date < today);
  const futureDays = ROUTING_DATA.filter(d => d.date >= today);
  const showsPlayed = pastDays.filter(d => d.type === 'SHOW').length;
  const totalShows = ROUTING_DATA.filter(d => d.type === 'SHOW').length;

  let milesDriven = 0;
  pastDays.forEach(d => {
    const dist = d.next_distance || d.distance || '0';
    milesDriven += parseInt(dist) || 0;
  });

  return {
    daysCompleted: pastDays.length,
    daysRemaining: futureDays.length,
    showsPlayed,
    totalShows,
    milesDriven,
    percentComplete: totalDays > 0 ? Math.round((pastDays.length / totalDays) * 100) : 0,
    startDate: ROUTING_DATA[0]?.date || '',
    endDate: ROUTING_DATA[ROUTING_DATA.length - 1]?.date || '',
  };
}

export function computeFinancials(): FinancialSummary {
  const totalExpenses = DEMO_EXPENSES.reduce((sum, e) => sum + e.amount, 0);
  const totalRevenue = DEMO_MERCH.revenue;
  const budgetTotal = DEMO_BUDGET.total;

  return {
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    dailyBurnRate: Math.round(totalExpenses / Math.max(1, computeTourProgress().daysCompleted || 1)),
    budgetTotal,
    budgetRemaining: budgetTotal - totalExpenses,
    budgetUsedPct: Math.round((totalExpenses / budgetTotal) * 100),
  };
}

export function computeCategorySpend(): CategorySpend[] {
  const colors: Record<string, string> = {
    fuel: '#ffaa00',
    food: '#00ff88',
    lodging: '#00f0ff',
    perdiem: '#a855f7',
    production: '#ff2d78',
    misc: '#6a6a8a',
  };
  const icons: Record<string, string> = {
    fuel: '⛽',
    food: '🍔',
    lodging: '🏨',
    perdiem: '💵',
    production: '🎛️',
    misc: '📦',
  };

  return DEMO_EXPENSES.map(e => ({
    category: e.category,
    icon: icons[e.category] || '📦',
    label: e.label,
    spent: e.amount,
    budget: DEMO_BUDGET.categories[e.category as keyof typeof DEMO_BUDGET.categories] || 0,
    color: colors[e.category] || '#6a6a8a',
  }));
}

export function getUpcomingShows(count = 6) {
  const today = new Date().toISOString().split('T')[0];
  return ROUTING_DATA.filter(d => d.date >= today && d.type === 'SHOW').slice(0, count);
}

export function generateFeedItems(): FeedItem[] {
  const items: FeedItem[] = [];
  const progress = computeTourProgress();
  const financials = computeFinancials();

  items.push({
    id: '1',
    text: `Tour data loaded — ${ROUTING_DATA.length} days, ${progress.totalShows} shows`,
    timestamp: new Date(),
  });

  if (DEMO_EXPENSES.length > 0) {
    items.push({
      id: '2',
      text: `${DEMO_EXPENSES.length} expense categories tracked — $${financials.totalExpenses.toLocaleString()} spent`,
      timestamp: new Date(Date.now() - 60000),
    });
  }

  items.push({
    id: '3',
    text: `${DEMO_MERCH.itemsSold} merch items sold — $${DEMO_MERCH.revenue.toLocaleString()} revenue`,
    timestamp: new Date(Date.now() - 120000),
  });

  items.push({
    id: '4',
    text: `Budget set at $${DEMO_BUDGET.total.toLocaleString()} — ${100 - financials.budgetUsedPct}% remaining`,
    timestamp: new Date(Date.now() - 180000),
  });

  items.push({
    id: '5',
    text: `Day ${progress.daysCompleted} of ${ROUTING_DATA.length} — ${progress.percentComplete}% complete`,
    timestamp: new Date(Date.now() - 240000),
  });

  return items;
}
