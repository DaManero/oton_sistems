import { createModuleRouter } from "../module-template.js"

export const createPosRouter = () => createModuleRouter("pos", ["ADMIN", "MANAGER", "CASHIER"])
