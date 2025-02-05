DROP TRIGGER IF EXISTS trigger_inventory_insert ON inventory_record;
DROP FUNCTION IF EXISTS log_inventory_insert;

DROP TRIGGER IF EXISTS trigger_inventory_update ON inventory_record;
DROP FUNCTION IF EXISTS log_inventory_update; 