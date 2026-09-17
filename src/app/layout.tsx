import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const navigationItems = [
  { href: "/", label: "Inicio" },
  { href: "/pos", label: "POS" },
  { href: "/kds", label: "KDS" },
  { href: "/menu", label: "Menú" },
  { href: "/caja", label: "Caja" },
  { href: "/carta", label: "Carta QR" },
];

export const metadata: Metadata = {
  title: "Oton Sistems",
  description: "Sistema de gestión integral para cafeterías.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full bg-stone-50 text-stone-900">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6">
          <header className="mb-6 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold">Oton Sistems</p>
                <p className="text-sm text-stone-600">
                  Plataforma para operar cafeterías en tiempo real.
                </p>
              </div>
              <nav>
                <ul className="flex flex-wrap gap-2 text-sm">
                  {navigationItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="inline-flex rounded-full border border-stone-200 px-3 py-1.5 transition hover:bg-stone-100"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
