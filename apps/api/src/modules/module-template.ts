import { Router } from "express"
import rateLimit from "express-rate-limit"
import { authorizeRoles } from "../security/role.middleware.js"
import { authenticate } from "../security/auth.middleware.js"
import type { AppRole } from "@oton/shared"

const moduleRateLimiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiadas solicitudes. Intenta nuevamente en unos segundos." },
})

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
