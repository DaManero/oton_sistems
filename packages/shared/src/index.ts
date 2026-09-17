export const APP_ROLES = ["ADMIN", "MANAGER", "CASHIER", "BARISTA"] as const

export type AppRole = (typeof APP_ROLES)[number]

export const APP_MODULES = [
  "pos",
  "kds",
  "menu-management",
  "cash-register",
  "digital-menu-qr",
  "inventory",
  "automations",
] as const

export type AppModule = (typeof APP_MODULES)[number]
