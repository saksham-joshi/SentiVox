'use server'

import { drizzle } from 'drizzle-orm/node-postgres'
import { users } from '@/db/migrations/schema'
import { eq, sql } from 'drizzle-orm'
import { ApiKeyConfig, generateNApiKeys } from '@/lib/apikey'
import { isValidEmail, isValidName } from '@/lib/validator'

const DB_URL = process.env.DATABASE_URL

if (!DB_URL) {
  console.error('Cannot load DB URL from Environment Variables')
  process.exit(1)
}

const DB = drizzle(DB_URL)

if (!DB) {
  console.error('Cannot connect to the PostgreSQL Database')
  process.exit(1)
}

// checks if email exists in the database table
export async function checkIfEmailExists(__email: string): Promise<boolean> {
  const result = await DB.select().from(users).where(eq(users.email, __email))

  return result.length === 1
}

// extracts the API key associated with email
export async function getApiKey(__email: string) {
  const result = await DB.select({ api_key: users.apiKey })
    .from(users)
    .where(eq(users.email, __email))

  return result[0].api_key
}

// extracts the all details of the user
export async function getUserDetails(__email: string) {
  const result = await DB.select().from(users).where(eq(users.email, __email))

  if (result.length === 0) {
    throw 'No user found with the given email'
  }

  return result[0]
}

// registers a new user on the database
export async function registerNewUser(
  __email: string,
  __full_name: string
): Promise<
  | {
      success: true
      email: string
      fullName: string
      apiKey: string
      joinDate: Date
      apiKeyUpdateTime: Date
    }
  | { success: false; message: string }
> {
  try {
    __email = __email.trim().toLowerCase()

    __full_name = __full_name.trim()

    if (!isValidEmail(__email)) throw 'Invalid Email Address Found'

    if (!isValidName(__full_name))
      throw 'Name should be in length between 3 and 18 with only English Alphabets'

    const api_key_list = `{${generateNApiKeys(ApiKeyConfig.tries).join(',')}}`

    const result = await DB.execute(
      sql`select * from register_new_user(${__email}::VARCHAR, ${__full_name}::VARCHAR, ${api_key_list}::VARCHAR[]);`
    )

    if (result.rowCount === 1) {
      const output = result.rows[0] as {
        success: boolean
        message: string
        email: string
        fullName: string
        apiKey: string
        joinDate: Date
        apiKeyUpdateTime: Date
      }

      if (output.success) {
        const { success, message, ...user_info } = output

        return {
          success: true,
          ...user_info,
        }
      } else {
        return {
          success: false,
          message: output.message,
        }
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong with system',
      }
    }
  } catch (err) {
    console.error(err)

    return {
      success: false,
      message: 'Cannot register due to the following error :' + err,
    }
  }
}

// rotates the api key
export async function rotateApiKey(__email: string): Promise<
  | {
      ok: true
      oldApiKey: string
      newApiKey: string
    }
  | {
      ok: false
      msg: string
    }
> {
  try {
    const api_key_list = `{${generateNApiKeys().join(',')}}`

    const result = await DB.execute(
      sql`select * from rotate_api_key(${__email}::VARCHAR, ${api_key_list}::VARCHAR[])`
    )

    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0] as {
        success: boolean
        newApiKey: string | null | undefined
        oldApiKey: string | null | undefined
        errorMessage: string | null | undefined
      }

      if (row.success && row.oldApiKey && row.newApiKey) {
        return {
          ok: true,
          oldApiKey: row.oldApiKey,
          newApiKey: row.newApiKey,
        }
      }

      return {
        ok: false,
        msg: row.errorMessage ?? 'Failed to rotate API Key',
      }
    }
  } catch (err) {
    console.error('Error while rotating API Key: ' + err)
  }

  return {
    ok: false,
    msg: 'Cannot Rotate the API Key',
  }
}
