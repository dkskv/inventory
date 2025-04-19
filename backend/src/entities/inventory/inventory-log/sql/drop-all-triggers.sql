DROP TRIGGER IF EXISTS trigger_insert_inventory_record ON inventory_record;
DROP FUNCTION IF EXISTS log_insert_inventory_record;

DROP TRIGGER IF EXISTS trigger_update_inventory_record ON inventory_record;
DROP FUNCTION IF EXISTS log_update_inventory_record;

DROP TRIGGER IF EXISTS trigger_insert_inventory_record_status ON inventory_record_statuses_status;
DROP FUNCTION IF EXISTS log_insert_inventory_record_status; 

DROP TRIGGER IF EXISTS trigger_delete_inventory_record_status ON inventory_record_statuses_status;
DROP FUNCTION IF EXISTS log_delete_inventory_record_status; 