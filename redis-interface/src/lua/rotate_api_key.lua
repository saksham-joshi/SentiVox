local old_api_key_token_count = KEYS[1]
local old_api_key_last_updated_time = KEYS[2]

local new_api_key_token_count = ARGV[1]
local new_api_key_last_updated_time = ARGV[2]

if pcall(redis.call, 'RENAME', old_api_key_token_count, new_api_key_token_count) and pcall(redis.call, 'RENAME', old_api_key_last_updated_time, new_api_key_last_updated_time) then
    return 0
end

return -2
