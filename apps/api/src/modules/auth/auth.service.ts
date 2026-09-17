import jwt from "jsonwebtoken"
import { z } from "zod"
import type { AppRole } from "@oton/shared"
import { env } from "../../config/env.js"

type SeedUser = {
  id: string
  email: string
  password: string
  role: AppRole
  name: string
}

const seedUserSchema = z.object({
  id: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "MANAGER", "CASHIER", "BARISTA"]),
  name: z.string().min(2),
})

const seedUsersSchema = z.array(seedUserSchema)

const seedUsers: SeedUser[] = seedUsersSchema.parse(JSON.parse(env.AUTH_SEED_USERS_JSON))

export const authenticateUser = (email: string, password: string) => {
  const user = seedUsers.find((candidate) => candidate.email === email)

  if (!user || user.password !== password) {
    return null
  }

  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    env.JWT_SECRET,
    {
      expiresIn: "8h",
    },
  )

  return {
    accessToken: token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  }
}
