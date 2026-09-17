import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { env } from "../config/env.js"

export type AuthenticatedRequest = Request & {
  user?: JwtPayload & { role?: string; email?: string; sub?: string; name?: string }
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization?.replace("Bearer ", "")

  if (!token) {
    res.status(401).json({ message: "Token no proporcionado" })
    return
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)

    if (typeof decoded === "string") {
      res.status(401).json({ message: "Token inválido" })
      return
    }

    req.user = decoded
    next()
  } catch {
    res.status(401).json({ message: "Token inválido" })
  }
}
