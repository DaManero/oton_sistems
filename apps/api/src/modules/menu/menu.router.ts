import { createModuleRouter } from "../module-template.js"

export const createMenuRouter = () =>
  createModuleRouter("menu-management", ["ADMIN", "MANAGER", "BARISTA"])
