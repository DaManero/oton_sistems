import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { env } from "../config/env.js"

export type AuthenticatedRequest = Request & {
  user?: JwtPayload & { role?: string; email?: string; sub?: string }
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
    req.user = jwt.verify(token, env.JWT_SECRET) as JwtPayload
    next()
  } catch {
    res.status(401).json({ message: "Token inválido" })
  }
}
