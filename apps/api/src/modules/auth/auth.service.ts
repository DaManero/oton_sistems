import jwt from "jsonwebtoken"
import type { AppRole } from "../../types/app-role.js"
import { env } from "../../config/env.js"

type SeedUser = {
  id: string
  email: string
  password: string
  role: AppRole
  name: string
}

const seedUsers: SeedUser[] = [
  {
    id: "usr_admin_001",
    email: "admin@oton.local",
    password: "admin1234",
    role: "ADMIN",
    name: "Administrador Oton",
  },
  {
    id: "usr_cashier_001",
    email: "caja@oton.local",
    password: "cashier1234",
    role: "CASHIER",
    name: "Caja Principal",
  },
]

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
