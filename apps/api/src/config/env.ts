import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  JWT_SECRET: z.string().min(16),
  DATABASE_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
