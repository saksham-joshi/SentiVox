local lastUpdatedKey = KEYS[1]
local tokenCountKey = KEYS[2]
local currentDate = ARGV[1]
local dailyFreeTokens = tonumber(ARGV[2])

local last_updated = redis.call('GET', lastUpdatedKey)

-- Check if the keys actually exist in Redis.
-- If either is missing, it means the API key is invalid/uninitialized.
if not last_updated then
    return -2 -- Custom error code for "Key not found"
end

-- Logic for Daily Reset
if last_updated < currentDate then
    redis.call('SET', lastUpdatedKey, currentDate)
    redis.call('SET', tokenCountKey, dailyFreeTokens)
end