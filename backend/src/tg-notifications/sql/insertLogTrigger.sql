CREATE OR REPLACE FUNCTION notify_log_insert()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('log_changes', NEW.id::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER log_insert_trigger
AFTER INSERT ON inventory_log
FOR EACH ROW EXECUTE FUNCTION notify_log_insert();