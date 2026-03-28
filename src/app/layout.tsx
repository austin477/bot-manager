import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bot Manager',
  description: 'Dispatch and monitor AI bot runs',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-40 border-b border-slate-800 bg-surface-950/80 backdrop-blur">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-slate-100 tracking-tight">
                  Bot Manager
                </span>
                <span className="text-xs text-slate-500 font-mono bg-slate-800 px-2 py-0.5 rounded">
                  v0.1
                </span>
              </div>
              <span className="text-xs text-slate-500">USA Wholesale Suppliers</span>
            </div>
          </header>
          <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
