import { useState } from "react"
import type { FormEvent } from "react"
import "./App.css"

type ModuleCard = {
  id: string
  name: string
  description: string
}

type LoginResponse = {
  user?: {
    name?: string
    role?: string
  }
}

const moduleCards: ModuleCard[] = [
  { id: "pos", name: "POS", description: "Punto de venta para pedidos y cobro." },
  { id: "kds", name: "KDS", description: "Pantalla de cocina/barra para preparación." },
  {
    id: "menu-management",
    name: "Gestión de menú",
    description: "Catálogo y precios de productos.",
  },
  { id: "cash-register", name: "Caja", description: "Apertura, cierres y movimientos de caja." },
  {
    id: "digital-menu-qr",
    name: "Menú digital QR",
    description: "Consulta de menú público para clientes.",
  },
  { id: "inventory", name: "Inventario", description: "Control de stock e insumos." },
  {
    id: "automations",
    name: "Automatizaciones",
    description: "Reglas y tareas automáticas del negocio.",
  },
]

function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        setMessage("No se pudo iniciar sesión. Revisa credenciales y API.")
        return
      }

      const payload = (await response.json()) as LoginResponse
      const name = payload.user?.name
      const role = payload.user?.role

      if (!name || !role) {
        setMessage("La API respondió sin el formato esperado de usuario autenticado.")
        return
      }

      setMessage(`Sesión iniciada como ${name} (${role}).`)
    } catch {
      setMessage("No hay conexión con la API. Verifica que el backend esté en ejecución.")
    }
  }

  return (
    <main className="layout">
      <header>
        <p className="eyebrow">Oton Sistems</p>
        <h1>Base inicial de gestión para cafeterías</h1>
        <p className="subtitle">
          Proyecto preparado para crecer de forma modular: frontend, backend y base de datos.
        </p>
      </header>

      <section className="panel">
        <h2>Acceso inicial</h2>
        <form onSubmit={onSubmit} className="login-form">
          <label>
            Correo
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <button type="submit">Iniciar sesión</button>
          {message && <p className="message">{message}</p>}
        </form>
      </section>

      <section className="panel">
        <h2>Módulos preparados</h2>
        <div className="module-grid">
          {moduleCards.map((moduleCard) => (
            <article key={moduleCard.id} className="module-card">
              <h3>{moduleCard.name}</h3>
              <p>{moduleCard.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
