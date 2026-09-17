import express from "express"
import cors from "cors"
import helmet from "helmet"
import { createAuthRouter } from "./modules/auth/auth.router.js"
import { createPosRouter } from "./modules/pos/pos.router.js"
import { createKdsRouter } from "./modules/kds/kds.router.js"
import { createMenuRouter } from "./modules/menu/menu.router.js"
import { createCashRegisterRouter } from "./modules/cash-register/cash-register.router.js"
import { createDigitalMenuRouter } from "./modules/digital-menu/digital-menu.router.js"
import { createInventoryRouter } from "./modules/inventory/inventory.router.js"
import { createAutomationsRouter } from "./modules/automations/automations.router.js"
import { createHealthRouter } from "./utils/http.js"
import { env } from "./config/env.js"

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use("/api/v1", createHealthRouter())
app.use("/api/v1/auth", createAuthRouter())
app.use("/api/v1/pos", createPosRouter())
app.use("/api/v1/kds", createKdsRouter())
app.use("/api/v1/menu", createMenuRouter())
app.use("/api/v1/cash-register", createCashRegisterRouter())
app.use("/api/v1/digital-menu", createDigitalMenuRouter())
app.use("/api/v1/inventory", createInventoryRouter())
app.use("/api/v1/automations", createAutomationsRouter())

app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`)
})
