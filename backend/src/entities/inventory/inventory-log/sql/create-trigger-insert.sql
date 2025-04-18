CREATE OR REPLACE FUNCTION log_insert_inventory_record()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO inventory_log (timestamp, "authorId", action, "inventoryRecordId", "nextValue")
    VALUES (
        CURRENT_TIMESTAMP,
        current_setting('var.user_id')::int,
        'CREATE',
        NEW.id, 
        jsonb_build_object(
            'responsibleId', NEW."responsibleId",
            'locationId', NEW."locationId",
            'description', NEW."description"
        )
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_insert_inventory_record
AFTER INSERT ON inventory_record
FOR EACH ROW
EXECUTE FUNCTION log_insert_inventory_record();