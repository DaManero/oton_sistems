import { Router } from "express"
import rateLimit from "express-rate-limit"
import { z } from "zod"
import { authenticateUser } from "./auth.service.js"
import { authenticate, type AuthenticatedRequest } from "../../security/auth.middleware.js"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const authRateLimiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiadas solicitudes. Intenta nuevamente en unos segundos." },
})

export const createAuthRouter = (): Router => {
  const router = Router()

  router.post("/login", authRateLimiter, (req, res) => {
    const parsed = loginSchema.safeParse(req.body)

    if (!parsed.success) {
      res.status(400).json({
        message: "Credenciales inválidas",
        errors: parsed.error.issues,
      })
      return
    }

    const authResult = authenticateUser(parsed.data.email, parsed.data.password)

    if (!authResult) {
      res.status(401).json({ message: "Usuario o contraseña incorrectos" })
      return
    }

    res.json(authResult)
  })

  router.get("/me", authRateLimiter, authenticate, (req: AuthenticatedRequest, res) => {
    res.json({
      id: req.user?.sub,
      email: req.user?.email,
      role: req.user?.role,
      name: req.user?.name,
    })
  })

  return router
}
