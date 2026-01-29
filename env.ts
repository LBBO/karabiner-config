import { createEnv } from '@t3-oss/env-core'
import z from '@zod/zod'
import dotenv from 'dotenv'

dotenv.config()

export const env = createEnv({
  server: {
    RULESET: z.enum(['private', 'work']),
  },
  runtimeEnv: process.env,
})
