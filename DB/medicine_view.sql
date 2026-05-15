-- medicines_view.sql  (optional)
CREATE VIEW IF NOT EXISTS medicines_all AS
SELECT
  'vedic' AS source,
  id,
  sku,
  name,
  form AS form_or_preparation,
  unit,
  unit_price,
  quantity_in_stock,
  description,
  indications,
  NULL AS composition,
  created_at
FROM medicines_vedic
UNION ALL
SELECT
  'custom' AS source,
  id,
  sku,
  name,
  preparation AS form_or_preparation,
  unit,
  unit_price,
  quantity_in_stock,
  notes AS description,
  NULL AS indications,
  composition,
  created_at
FROM medicines_custom;
