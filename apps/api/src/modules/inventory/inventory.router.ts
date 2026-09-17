import { createModuleRouter } from "../module-template.js"

export const createInventoryRouter = () =>
  createModuleRouter("inventory", ["ADMIN", "MANAGER", "BARISTA"])
