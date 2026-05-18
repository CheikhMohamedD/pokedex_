import './globals.css'
import type { Metadata } from 'next'

import QueryProvider from '@/providers/QueryProvider'

export const metadata: Metadata = {
  title: 'Pokédex',
  description: 'Un Pokédex moderne avec Next.js, Tailwind CSS et TanStack Query',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="bg-gray-100 min-h-screen">
        <QueryProvider>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  )
}