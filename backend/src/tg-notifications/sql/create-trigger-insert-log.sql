CREATE OR REPLACE FUNCTION notify_insert_inventory_log()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('event_insert_inventory_log', NEW.id::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_insert_inventory_log
AFTER INSERT ON inventory_log
FOR EACH ROW EXECUTE FUNCTION notify_insert_inventory_log();