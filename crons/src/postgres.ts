import { Client } from 'pg'
import { configDotenv } from 'dotenv'

configDotenv()

const connectionString = process.env.DATABASE_URL!

if (!connectionString) {
  console.error('[CANNOT LOAD DATABASE URL]')
  process.exit(1)
}

const client = new Client({
  connectionString
})

export async function awakePostgres(): Promise<boolean> {
  try {
    await client.connect()

    console.log('Successfully connected to the client')

    await client.query('SELECT NOW()')

    return true
  } catch (err) {
    console.error('Error Found: ' + err)
  }

  return false
}
