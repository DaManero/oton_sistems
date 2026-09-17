import { createModuleRouter } from "../module-template.js"

export const createKdsRouter = () => createModuleRouter("kds", ["ADMIN", "MANAGER", "BARISTA"])
