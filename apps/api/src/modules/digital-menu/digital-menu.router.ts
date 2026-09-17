import { Router } from "express"

export const createDigitalMenuRouter = () => {
  const router = Router()

  router.get("/public/menu", (_req, res) => {
    res.json({
      module: "digital-menu-qr",
      ready: false,
      message: "Endpoint público base para menú QR",
      categories: [],
    })
  })

  return router
}
