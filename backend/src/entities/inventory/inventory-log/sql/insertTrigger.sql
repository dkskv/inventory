CREATE OR REPLACE FUNCTION log_inventory_insert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO inventory_log (timestamp, "authorId", action, "inventoryRecordId")
    VALUES (CURRENT_TIMESTAMP, current_setting('var.user_id')::int, 'CREATE', NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_inventory_insert
AFTER INSERT ON inventory_record
FOR EACH ROW
EXECUTE FUNCTION log_inventory_insert();