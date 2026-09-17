import type { NextFunction, Request, Response } from "express"

type RateLimitOptions = {
  windowMs: number
  maxRequests: number
}

type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

const getClientIp = (request: Request): string => {
  const forwarded = request.headers["x-forwarded-for"]

  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim() ?? "unknown"
  }

  return request.ip || "unknown"
}

export const createRateLimiter = ({ windowMs, maxRequests }: RateLimitOptions) => {
  return (request: Request, response: Response, next: NextFunction): void => {
    const key = `${request.method}:${request.path}:${getClientIp(request)}`
    const now = Date.now()
    const current = buckets.get(key)

    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs })
      next()
      return
    }

    if (current.count >= maxRequests) {
      response.status(429).json({ message: "Demasiadas solicitudes. Intenta nuevamente en unos segundos." })
      return
    }

    current.count += 1
    buckets.set(key, current)
    next()
  }
}
