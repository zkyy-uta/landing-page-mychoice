-- MyChoice — add the other decision domains to the catalogue
-- Optional. schema.sql only seeds the "laptop" domain, which is why the admin
-- Catalogue page shows laptop alone: the console renders whatever is in
-- public.criteria / public.candidates.
-- These three domains mirror the categories the product already uses in the
-- landing page and dashboard, with weights that sum to 1.00 per domain.
-- Safe to re-run (unique on domain + key).

insert into public.criteria (domain, name, key, description, attribute_type, unit, weight, sort_order)
values
  ('smartphone', 'Camera', 'camera_mp', 'Main sensor quality score', 'benefit', 'MP', 0.35, 1),
  ('smartphone', 'Chipset Score', 'chipset', 'Synthetic performance score', 'benefit', 'Score', 0.35, 2),
  ('smartphone', 'Display', 'display_inch', 'Diagonal AMOLED area', 'benefit', 'Inches', 0.30, 3),

  ('tablet', 'Battery', 'battery_hours', 'Mixed-use runtime', 'benefit', 'Hours', 0.40, 1),
  ('tablet', 'Stylus Latency', 'stylus_ms', 'Pen input delay', 'cost', 'ms', 0.30, 2),
  ('tablet', 'Price', 'price', 'Acquisition cost', 'cost', 'IDR', 0.30, 3),

  ('monitor', 'Refresh Rate', 'refresh_hz', 'Motion smoothness', 'benefit', 'Hz', 0.40, 1),
  ('monitor', 'Resolution', 'resolution_px', 'Horizontal pixels', 'benefit', 'px', 0.35, 2),
  ('monitor', 'Price', 'price', 'Acquisition cost', 'cost', 'IDR', 0.25, 3)
on conflict (domain, key) do nothing;

-- Verification: weights per domain must total 1.00 and each domain needs options.
select domain, count(*) as criteria, round(sum(weight), 2) as total_weight from public.criteria group by domain order by domain;
select domain, count(*) as candidates from public.candidates group by domain order by domain;
