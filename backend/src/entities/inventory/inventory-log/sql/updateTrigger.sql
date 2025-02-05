CREATE OR REPLACE FUNCTION log_inventory_update()
RETURNS TRIGGER AS $$
DECLARE
    col_name TEXT;  
    old_val JSONB;  
    new_val JSONB;  
BEGIN
    -- Проходим по всем атрибутам таблицы
    FOR col_name IN (SELECT column_name FROM information_schema.columns WHERE table_name = TG_TABLE_NAME) LOOP
        -- $1 заменяется на OLD, $2 заменяется на NEW
        EXECUTE format('SELECT to_jsonb($1.%I), to_jsonb($2.%I)', col_name, col_name)
        INTO old_val, new_val
        USING OLD, NEW;

        IF old_val IS DISTINCT FROM new_val THEN
            INSERT INTO inventory_log (timestamp, "authorId", action, "inventoryRecordId", attribute, "prevValue", "nextValue")
            VALUES (CURRENT_TIMESTAMP, current_setting('var.user_id')::int, 'UPDATE', NEW.id, col_name, old_val, new_val);
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_inventory_update
AFTER UPDATE ON inventory_record
FOR EACH ROW
EXECUTE FUNCTION log_inventory_update();