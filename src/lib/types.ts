export interface Tour {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'completed';
  total_days: number;
  created_at: string;
}

export interface DaySheet {
  id: string;
  tour_id: string;
  date: string;
  type: 'SHOW' | 'TRAVEL' | 'OFF';
  city: string;
  venue?: string;
  next_city?: string;
  next_distance?: string;
  next_drive_time?: string;
  from?: string;
  to?: string;
  distance?: string;
  drive_time?: string;
}

export interface Expense {
  id: string;
  tour_id: string;
  date: string;
  category: 'fuel' | 'food' | 'lodging' | 'perdiem' | 'production' | 'misc';
  description: string;
  amount: number;
}

export interface Budget {
  id: string;
  tour_id: string;
  total_budget: number;
  category_budgets: Record<string, number>;
}

export interface MerchSale {
  id: string;
  tour_id: string;
  date: string;
  city: string;
  gross: number;
  net: number;
  qty: number;
  items: Record<string, number>;
}

export interface MerchInventory {
  id: string;
  tour_id: string;
  item_name: string;
  category: string;
  cost: number;
  price: number;
  qty_total: number;
  qty_remaining: number;
}

export interface Settlement {
  id: string;
  tour_id: string;
  date: string;
  city: string;
  venue: string;
  guarantee: number;
  door_split_pct: number;
  door_gross: number;
  merch_cut_pct: number;
  merch_gross: number;
  total_due: number;
}

export interface CrewMember {
  id: string;
  tour_id: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
}

// Dashboard computed types
export interface TourProgress {
  daysCompleted: number;
  daysRemaining: number;
  showsPlayed: number;
  totalShows: number;
  milesDriven: number;
  percentComplete: number;
  startDate: string;
  endDate: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  dailyBurnRate: number;
  budgetTotal: number;
  budgetRemaining: number;
  budgetUsedPct: number;
}

export interface CategorySpend {
  category: string;
  icon: string;
  label: string;
  spent: number;
  budget: number;
  color: string;
}

export interface MerchSummary {
  revenue: number;
  itemsSold: number;
  netProfit: number;
}

export interface FeedItem {
  id: string;
  text: string;
  timestamp: Date;
  color?: string;
}
