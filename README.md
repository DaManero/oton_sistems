# Oton Sistems

Scaffold inicial de **Oton Sistems**, una plataforma de gestión integral para cafeterías.

## Objetivo de esta base

Este repositorio deja preparada una base simple, ordenada y extensible para construir estos módulos:

- POS
- KDS
- gestión de menú
- caja
- menú digital QR
- inventario
- automatizaciones

## Arquitectura base elegida

### Frontend (`apps/web`)

- **React + Vite + TypeScript**
- UI en español
- Pantalla inicial con:
  - vista de módulos
  - formulario de login básico conectado al backend

### Backend (`apps/api`)

- **Node.js + Express + TypeScript**
- API REST bajo prefijo `/api/v1`
- Autenticación JWT básica
- Roles iniciales (`ADMIN`, `MANAGER`, `CASHIER`, `BARISTA`)
- Módulos base con endpoints `status` listos para extender lógica

### Base de datos (`apps/api/prisma`)

- **PostgreSQL + Prisma**
- Esquema inicial con entidades núcleo:
  - `User`
  - `MenuCategory`
  - `Product`
  - `InventoryItem`
  - `StockMovement`

## Estructura del repositorio

```text
.
├── apps
│   ├── api
│   │   ├── prisma/schema.prisma
│   │   └── src
│   │       ├── config
│   │       ├── modules
│   │       │   ├── auth
│   │       │   ├── pos
│   │       │   ├── kds
│   │       │   ├── menu
│   │       │   ├── cash-register
│   │       │   ├── digital-menu
│   │       │   ├── inventory
│   │       │   └── automations
│   │       ├── security
│   │       └── types
│   └── web
└── packages
    └── shared
```

## Instalación

> Requisito: Node.js 20+

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno del backend:

```bash
cp apps/api/.env.example apps/api/.env
```

3. Ajustar en `apps/api/.env`:

- `JWT_SECRET`
- `DATABASE_URL`

## Ejecución en desarrollo

Backend:

```bash
npm run dev:api
```

Frontend:

```bash
npm run dev:web
```

También puedes correr ambos con:

```bash
npm run dev
```

## Comandos útiles

```bash
npm run build
npm run lint
npm run db:generate
npm run db:migrate
```

## Decisiones de arquitectura (resumen)

1. **Monorepo con workspaces** para crecer por módulos sin fragmentar repositorios.
2. **Separación clara web/api/db** para permitir escalado independiente.
3. **RBAC desde el inicio** para evitar re-trabajo al integrar caja, POS y operaciones internas.
4. **Prisma + PostgreSQL** para mantener velocidad de desarrollo en MVP y camino claro a producción.
5. **Módulos con routers base** para habilitar desarrollo incremental sin bloquear el avance del sistema.

## Convención de idioma

- UI y documentación: **español**
- Identificadores de código y base de datos: **inglés**
