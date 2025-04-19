CREATE OR REPLACE FUNCTION log_insert_inventory_record_status()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO inventory_log (timestamp, "authorId", action,  "inventoryRecordId", attribute, "nextValue")
    VALUES (
        CURRENT_TIMESTAMP,
        current_setting('var.user_id')::int,
        'UPDATE',
        NEW."inventoryRecordId", 
        -- Псевдо-атрибут, т.к. связи со статусами находятся в отдельной таблице
        'statusId',
        to_jsonb(NEW."statusId")
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_insert_inventory_record_status
AFTER INSERT ON inventory_record_statuses_status
FOR EACH ROW
EXECUTE FUNCTION log_insert_inventory_record_status();