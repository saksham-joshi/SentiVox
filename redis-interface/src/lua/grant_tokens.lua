local lastUpdateKey = KEYS[1]
local lastUpdatedValue = KEYS[2]

local tokenCountKey = KEYS[3]
local tokenCountValue = KEYS[4]

redis.call("SET", lastUpdateKey, lastUpdatedValue)
redis.call("SET", tokenCountKey, tonumber(tokenCountValue))