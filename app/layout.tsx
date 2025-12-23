import './global.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Patient form',
  description: 'Patient form with real-time synchronization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-row bg-white">
          <div className="flex flex-col xl:flex-row gap-4 p-12 grow">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}