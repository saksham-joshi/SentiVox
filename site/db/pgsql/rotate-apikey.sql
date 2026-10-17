CREATE OR REPLACE FUNCTION rotate_api_key (
    __email VARCHAR,
    __api_key_array VARCHAR[]
) RETURNS TABLE(success BOOLEAN, "newApiKey" VARCHAR, "oldApiKey" VARCHAR, "errorMessage" VARCHAR) AS $$
DECLARE
    current_api_key VARCHAR;
    api_key_exists BOOLEAN;
    api_key_last_updated_time TIMESTAMP WITH TIME ZONE;
    old_api_key VARCHAR;
    current_utc_timestamp TIMESTAMPTZ;
BEGIN
    -- storing old api key
    SELECT 
        api_key INTO old_api_key 
    FROM users
    WHERE users.email = __email;

    -- getting the last updated time of API Key
    SELECT 
        api_key_update_time INTO api_key_last_updated_time 
    FROM users
    WHERE users.email = __email;

    -- getting the current time in UTC
    SELECT 
        CURRENT_TIMESTAMP 
        AT TIME ZONE 'UTC' 
    INTO current_utc_timestamp;

    -- check if api key is being rotated within 24 hours
    IF api_key_last_updated_time IS NULL OR current_utc_timestamp >= api_key_last_updated_time + INTERVAL '24 hours' THEN 

        FOREACH current_api_key IN ARRAY __api_key_array
        LOOP
            IF is_apikey_unique(current_api_key) THEN
                UPDATE users
                    SET
                    api_key = current_api_key,
                    api_key_update_time = current_utc_timestamp
                WHERE email = __email;

                RETURN QUERY SELECT TRUE, current_api_key, old_api_key, NULL::VARCHAR;
                RETURN;
            END IF;
        END LOOP;

        RETURN QUERY SELECT FALSE, NULL::VARCHAR, old_api_key, 'Unable to set a unique API Key. Try again!'::VARCHAR;

    ELSE

        RETURN QUERY SELECT FALSE, NULL::VARCHAR, old_api_key, 'You rotated the API Key within the previous 24 hours'::VARCHAR;

    END IF;
EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT FALSE, NULL::VARCHAR, NULL::VARCHAR, SQLERRM::VARCHAR;
END;
$$ LANGUAGE plpgsql;