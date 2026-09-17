# Oton Sistems - Instrucciones para Copilot

## Propósito
Oton Sistems es un sistema integral para cafeterías con módulos de POS, KDS, gestión de menú, caja, carta digital QR, inventario y automatizaciones operativas.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS.
- Supabase (Postgres + Auth + Realtime).
- Package manager: `npm`.
- Calidad de código: ESLint (config de Next.js) + Prettier.

## Estructura principal
- `src/app`: rutas del frontend (App Router).
- `src/lib`: clientes y utilidades compartidas (incluye Supabase SSR).
- `src/types`: tipos TypeScript globales (incluye tipos de base de datos).
- `supabase/migrations`: migraciones SQL versionadas.
- `supabase/seed.sql`: datos de ejemplo para entorno local.

## Convenciones
- UI y documentación en español.
- Código (variables, funciones, tablas, columnas, tipos) en inglés.
- Preferir Server Components por defecto; usar Client Components solo cuando haga falta estado/interacción del navegador (`"use client"`).
- Mantener cambios pequeños y enfocados al alcance del issue.

## Ejecución local
1. Copiar variables de entorno:
   - `cp .env.example .env.local`
2. Instalar dependencias:
   - `npm install`
3. Levantar entorno de desarrollo:
   - `npm run dev`

## Checks obligatorios
- `npm run lint`
- `npm run typecheck`
- `npm run build`

Cada PR debe pasar lint y build (además de typecheck) antes de mergear.
