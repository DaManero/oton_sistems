# Oton Sistems

Oton Sistems es un sistema de gestión integral para cafeterías. Este repositorio contiene el scaffold base para construir los módulos operativos principales sobre Next.js + Supabase.

## Objetivo del sistema
Centralizar en una única plataforma:
- Punto de venta (POS)
- Pantalla de cocina/barra (KDS)
- Gestión de menú
- Caja y turnos
- Carta digital con QR
- Inventario y automatizaciones (reportes por Telegram, alertas, etc.)

## Roadmap de módulos
- [x] Scaffold base (Next.js + TypeScript + Tailwind + Supabase)
- [ ] POS: creación y cobro de pedidos
- [ ] KDS en tiempo real para barra/cocina
- [ ] ABM de categorías, productos, variantes y modificadores
- [ ] Caja: apertura/cierre y arqueo
- [ ] Carta pública QR
- [ ] Inventario por recetas e insumos
- [ ] Automatizaciones (reportes diarios, alertas operativas)

## Stack técnico
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Backend/DB**: Supabase (Postgres, Auth, Realtime)
- **Calidad**: ESLint + Prettier
- **Package manager**: npm

## Requisitos
- Node.js 20+
- npm 10+
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Docker (requerido por Supabase CLI local)

## Levantar el proyecto en local
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Configurar variables de entorno:
   ```bash
   cp .env.example .env.local
   ```
3. Iniciar Supabase local:
   ```bash
   supabase start
   supabase db reset
   ```
4. Ejecutar la app:
   ```bash
   npm run dev
   ```
5. Abrir [http://localhost:3000](http://localhost:3000)

## Checks de calidad
Ejecutar antes de abrir PR:
```bash
npm run lint
npm run typecheck
npm run build
```

## Estructura de carpetas
```text
.
├── .github/
│   ├── copilot-instructions.md
│   └── workflows/ci.yml
├── src/
│   ├── app/
│   ├── lib/supabase/
│   └── types/
├── supabase/
│   ├── migrations/0001_initial_schema.sql
│   └── seed.sql
├── .env.example
└── README.md
```

## Contribución (flujo recomendado)
1. Crear un issue claro y acotado.
2. Asignar el issue al cloud agent (`@copilot`).
3. Revisar el PR generado, pedir ajustes y validar checks.
4. Mergear cuando lint, typecheck y build estén en verde.
