CREATE OR REPLACE FUNCTION register_new_user (
    __email VARCHAR,
    __full_name VARCHAR,
    __api_key_list VARCHAR[]
) RETURNS TABLE(
    success BOOLEAN,
    message VARCHAR,
    email VARCHAR,
    "fullName" VARCHAR,
    "apiKey" VARCHAR,
    "joinDate" TIMESTAMPTZ,
    "apiKeyUpdateTime" TIMESTAMPTZ) as $$
DECLARE
    current_api_key VARCHAR;
    registered_email VARCHAR;
    registered_full_name VARCHAR;
    registered_api_key VARCHAR;
    registered_join_date TIMESTAMPTZ;
    registered_api_key_update_time TIMESTAMPTZ;
BEGIN
    FOREACH current_api_key IN ARRAY __api_key_list
    LOOP
        IF is_apikey_unique(current_api_key) THEN
            INSERT INTO users VALUES(
                __email,
                __full_name,
                current_api_key
            );
            SELECT
                users.email,
                users.full_name,
                users.api_key,
                users.join_date,
                users.api_key_update_time
                INTO
                registered_email,
                registered_full_name,
                registered_api_key,
                registered_join_date,
                registered_api_key_update_time
            FROM users 
            WHERE users.email = __email;

            RETURN QUERY SELECT TRUE, 'Registered'::VARCHAR, registered_email, registered_full_name, registered_api_key, registered_join_date, registered_api_key_update_time;
            RETURN;
        END IF;
    END LOOP;
    RETURN QUERY SELECT FALSE, 'Cannot Register because a unique API Key cannot be generated'::VARCHAR, NULL::VARCHAR, NULL::VARCHAR, NULL::VARCHAR, NULL::TIMESTAMPTZ, NULL::TIMESTAMPTZ;
EXCEPTION WHEN OTHERS THEN 
    RETURN QUERY SELECT FALSE, SQLERRM::VARCHAR, NULL::VARCHAR, NULL::VARCHAR, NULL::VARCHAR, NULL::TIMESTAMPTZ, NULL::TIMESTAMPTZ;
END;
$$ LANGUAGE plpgsql;