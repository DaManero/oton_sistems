import { Router } from "express"
import { authorizeRoles } from "../security/role.middleware.js"
import { authenticate } from "../security/auth.middleware.js"
import { createRateLimiter } from "../security/rate-limit.middleware.js"
import type { AppRole } from "@oton/shared"

const moduleRateLimiter = createRateLimiter({ windowMs: 60_000, maxRequests: 60 })

export const createModuleRouter = (moduleId: string, allowedRoles: AppRole[]) => {
  const router = Router()

  router.get("/status", moduleRateLimiter, authenticate, authorizeRoles(allowedRoles), (_req, res) => {
    res.json({
      module: moduleId,
      ready: false,
      message: "Módulo base preparado para próximas iteraciones",
    })
  })

  return router
}
