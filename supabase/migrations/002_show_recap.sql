-- ============================================================
-- Show Recap Migration (v3 - schema-verified)
-- Run in: https://edxiwaduxwaitxlahkzl.supabase.co > SQL Editor
-- Safe to re-run (IF NOT EXISTS guards)
-- ============================================================

-- 1. Add show metrics to settlements
ALTER TABLE public.settlements
  ADD COLUMN IF NOT EXISTS door_count integer,
  ADD COLUMN IF NOT EXISTS capacity integer,
  ADD COLUMN IF NOT EXISTS ticket_sales integer,
  ADD COLUMN IF NOT EXISTS merch_top_item text;

-- 2. Tour announcements
CREATE TABLE IF NOT EXISTS public.tour_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  show_date date,
  message text NOT NULL,
  category text NOT NULL DEFAULT 'general'
    CHECK (category IN ('general', 'alert', 'celebration', 'logistics', 'safety')),
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_announcements_tour_date
  ON public.tour_announcements (tour_id, show_date);

DROP TRIGGER IF EXISTS tour_announcements_set_updated_at ON public.tour_announcements;
CREATE TRIGGER tour_announcements_set_updated_at
  BEFORE UPDATE ON public.tour_announcements
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

ALTER TABLE public.tour_announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tour members can view announcements" ON public.tour_announcements;
CREATE POLICY "tour members can view announcements" ON public.tour_announcements
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND tour_id = tour_announcements.tour_id));

DROP POLICY IF EXISTS "tour managers can create announcements" ON public.tour_announcements;
CREATE POLICY "tour managers can create announcements" ON public.tour_announcements
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'tour_manager' AND tour_id = tour_announcements.tour_id));

DROP POLICY IF EXISTS "tour managers can update announcements" ON public.tour_announcements;
CREATE POLICY "tour managers can update announcements" ON public.tour_announcements
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'tour_manager' AND tour_id = tour_announcements.tour_id));

DROP POLICY IF EXISTS "tour managers can delete announcements" ON public.tour_announcements;
CREATE POLICY "tour managers can delete announcements" ON public.tour_announcements
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'tour_manager' AND tour_id = tour_announcements.tour_id));

-- 3. View: show_recap
--    Verified actual column names per table:
--    settlements: id, tour_id, show_date, venue_name, guarantee, currency,
--                 notes, door_count, capacity, ticket_sales, merch_top_item, created_at, updated_at
--    merch_sales: id, tour_id, item_id, (unknown), quantity, total, unit_price, (unknown), notes, created_at
--    tour_dates:  id, tour_id, date, city, venue, type, status, notes, from_city, to_city,
--                 distance, drive_time, next_city, next_distance, next_drive_time, stopover, created_at, updated_at
--    routing:     id, tour_id, day_number, city, notes, created_at, updated_at (NO distance/drive columns)
--    day_sheets:  id, tour_id, day_date, city, venue_name, venue_address, promoter_contact,
--                 hotel_info, notes, is_show, entries, created_at, updated_at
CREATE OR REPLACE VIEW public.show_recap AS
SELECT
  s.id AS settlement_id,
  s.tour_id,
  s.show_date,
  s.venue_name,
  s.guarantee,
  s.currency,
  s.door_count,
  s.capacity,
  s.ticket_sales,
  s.merch_top_item,
  -- Computed metrics
  CASE WHEN s.capacity > 0 AND s.door_count IS NOT NULL
    THEN ROUND((s.door_count::numeric / s.capacity) * 100)
    ELSE NULL
  END AS fill_rate,
  CASE WHEN s.door_count > 0
    THEN ROUND((ms.total_merch_gross::numeric / s.door_count), 2)
    ELSE NULL
  END AS merch_per_capita,
  CASE WHEN s.door_count > 0
    THEN ROUND(((COALESCE(s.guarantee, 0) + COALESCE(ms.total_merch_gross, 0))::numeric / s.door_count), 2)
    ELSE NULL
  END AS revenue_per_head,
  COALESCE(s.door_count, 0) - COALESCE(s.ticket_sales, 0) AS comp_walkin_gap,
  ms.total_merch_qty,
  ms.total_merch_gross,
  -- Next show info from tour_dates (routing table has no distance columns)
  nx.next_city,
  nx.next_distance,
  nx.next_drive_time
FROM public.settlements s
LEFT JOIN LATERAL (
  SELECT
    SUM(m.quantity)::integer AS total_merch_qty,
    SUM(m.total)::numeric AS total_merch_gross
  FROM public.merch_sales m
  WHERE m.tour_id = s.tour_id
    AND m.created_at::date = s.show_date
) ms ON true
LEFT JOIN LATERAL (
  SELECT
    td.city AS next_city,
    td.next_distance,
    td.next_drive_time
  FROM public.tour_dates td
  WHERE td.tour_id = s.tour_id
    AND td.type = 'SHOW'
    AND td.date > s.show_date
  ORDER BY td.date
  LIMIT 1
) nx ON true;

GRANT SELECT ON public.show_recap TO authenticated;
