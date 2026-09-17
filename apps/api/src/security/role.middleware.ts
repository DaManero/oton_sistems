import type { NextFunction, Response } from "express"
import type { AppRole } from "@oton/shared"
import type { AuthenticatedRequest } from "./auth.middleware.js"

export const authorizeRoles = (allowedRoles: AppRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const role = req.user?.role as AppRole | undefined

    if (!role || !allowedRoles.includes(role)) {
      res.status(403).json({ message: "No tienes permisos para este recurso" })
      return
    }

    next()
  }
}
