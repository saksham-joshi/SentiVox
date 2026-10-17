import express, { type Express, type Request, type Response } from 'express'
import { awakePostgres } from './postgres.ts'
import { awakeRedis } from './redis.ts'

const app: Express = express()

app.use(express.json())

const PORT_NUM = 3000

const AWAKE_PASSWORD = process.env.AWAKE_PASSWORD!

const responseStatus = {
  successWithNoResponseBody: 204,
  internalServerError: 500,
  unauthorizedAccess: 401,
  badRequest: 400
}

async function handle(req: Request, res: Response) {
  // if no json is received
  if (!req.body) {
    res.status(responseStatus.badRequest)
  } else {
    try {
      if (req.body.password === AWAKE_PASSWORD) {
        const result_postgres = await awakePostgres()
        const result_redis = await awakeRedis()
        res.status(
          result_postgres && result_redis
            ? responseStatus.successWithNoResponseBody
            : responseStatus.internalServerError
        )
      } else {
        res.status(responseStatus.unauthorizedAccess)
      }
    } catch (err) {
      console.error('Error Found: ' + err)

      res.status(responseStatus.internalServerError)
    }
  }
  res.send()
}

app.post('/', handle)

app.listen(PORT_NUM, () => {
  console.log(`Server is Running at localhost:${PORT_NUM}`)
})
