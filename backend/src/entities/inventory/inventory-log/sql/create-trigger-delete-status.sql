CREATE OR REPLACE FUNCTION log_delete_inventory_record_status()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO inventory_log (timestamp, "authorId", action, "inventoryRecordId", attribute, "prevValue")
    VALUES (
        CURRENT_TIMESTAMP,
        current_setting('var.user_id')::int,
        'UPDATE',
        OLD."inventoryRecordId", 
        -- Псевдо-атрибут, т.к. связи со статусами находятся в отдельной таблице
        'statusId',
        to_jsonb(OLD."statusId")
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_delete_inventory_record_status
AFTER DELETE ON inventory_record_statuses_status
FOR EACH ROW
EXECUTE FUNCTION log_delete_inventory_record_status();