import { createModuleRouter } from "../module-template.js"

export const createCashRegisterRouter = () =>
  createModuleRouter("cash-register", ["ADMIN", "MANAGER", "CASHIER"])
