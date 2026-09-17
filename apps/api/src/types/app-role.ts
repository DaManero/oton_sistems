export const APP_ROLES = ["ADMIN", "MANAGER", "CASHIER", "BARISTA"] as const

export type AppRole = (typeof APP_ROLES)[number]
