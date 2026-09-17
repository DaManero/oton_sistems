import { Router } from "express"
import { authorizeRoles } from "../security/role.middleware.js"
import { authenticate } from "../security/auth.middleware.js"
import type { AppRole } from "../types/app-role.js"

export const createModuleRouter = (moduleId: string, allowedRoles: AppRole[]) => {
  const router = Router()

  router.get("/status", authenticate, authorizeRoles(allowedRoles), (_req, res) => {
    res.json({
      module: moduleId,
      ready: false,
      message: "Módulo base preparado para próximas iteraciones",
    })
  })

  return router
}
