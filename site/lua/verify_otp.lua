local email = KEYS[1] -- email to check otp with
local otp = ARGV[1] -- otp to verify



-- check if email is banned
local email_banned = redis.call('EXISTS', "ban:" .. email)

if email_banned == 1 then
    return 4
end



-- check if email has enough retries
local email_retries_left = tonumber(redis.call('GET', "try:" .. email))

if email_retries_left == nil then

    return 5 -- OTP expired or never saved

elseif email_retries_left <= 0 then

    -- ban for 10 minutes (600 seconds)
    redis.call('SET', "ban:" .. email, 0, "EX", 600)

    return 4

end



-- check if otp is equal
local actual_otp = redis.call('GET', email)

if actual_otp == nil then

    return 5 -- otp expired

elseif(actual_otp == otp) then

    --[[
        If otp is correct, then instead of deleting the OTP and retry count from
        redis, ban the email for 10 minutes and let the user know that for the
        next 10 minutes they won't be able to login again with the same email
    ]]--
    redis.call('SET', "ban:" .. email, 0, "EX", 600)

    return 2 -- correct otp

else

    redis.call('DECR', "try:" .. email)

    return 3 -- incorrect otp

end