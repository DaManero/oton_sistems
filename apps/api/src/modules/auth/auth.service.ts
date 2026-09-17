import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { z } from "zod"
import type { AppRole } from "@oton/shared"
import { env } from "../../config/env.js"

type SeedUser = {
  id: string
  email: string
  passwordHash: string
  role: AppRole
  name: string
}

const seedUserSchema = z.object({
  id: z.string().min(3),
  email: z.string().email(),
  passwordHash: z.string().min(20),
  role: z.enum(["ADMIN", "MANAGER", "CASHIER", "BARISTA"]),
  name: z.string().min(2),
})

const seedUsersSchema = z.array(seedUserSchema)

const parseSeedUsersInput = (rawValue: string): SeedUser[] => {
  if (!rawValue.trim()) {
    return []
  }

  const parsed = JSON.parse(rawValue)
  return seedUsersSchema.parse(Array.isArray(parsed) ? parsed : [parsed])
}

const seedUsers = parseSeedUsersInput(env.AUTH_SEED_USERS_JSON)

export const authenticateUser = async (email: string, password: string) => {
  const user = seedUsers.find((candidate) => candidate.email === email)

  if (!user) {
    return null
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash)

  if (!passwordMatches) {
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
