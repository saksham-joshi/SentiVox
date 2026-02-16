local lastUpdatedKey = KEYS[1]
local tokenCountKey = KEYS[2]

-- Check if the keys actually exist in Redis.
-- If either is missing, it means the API key is invalid/uninitialized.
if not lastUpdatedKey or not tokenCountKey then
    return -2  -- Custom error code for "Key not found"
end

redis.call('DEL', lastUpdatedKey)
redis.call('DEL', tokenCountKey)

return 0