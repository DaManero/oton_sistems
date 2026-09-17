import { createModuleRouter } from "../module-template.js"

export const createAutomationsRouter = () => createModuleRouter("automations", ["ADMIN", "MANAGER"])
