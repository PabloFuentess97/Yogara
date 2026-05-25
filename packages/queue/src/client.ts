import IORedis from 'ioredis'
import { Queue } from 'bullmq'

const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379'

export const redisConnection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
})

export const emailQueue = new Queue('yogara:emails', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
  },
})
