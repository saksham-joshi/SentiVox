local email = ARGV[1]
local otp = ARGV[2]

-- check if email is banned
local email_banned = redis.call('EXISTS', "ban:" .. email)

if email_banned == 1 then
    return 4
end

-- check if email with otp already exists
local email_exists = redis.call('EXISTS', email)

if email_exists == 1 then
    return 1
end

-- register email and otp
redis.call('SET', email, otp, "EX", 300)
redis.call('SET', "try:" .. email, 3, "EX", 300)

return 0