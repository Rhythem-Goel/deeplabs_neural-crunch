import './globals.css'
import type { Metadata } from 'next'
import { Orbitron, Inter } from 'next/font/google'
import BackgroundEffects from '@/components/BackgroundEffects'
const display = Orbitron({ subsets:['latin'], variable:'--font-display' })
const body = Inter({ subsets:['latin'], variable:'--font-body' })
export const viewport = { width:'device-width', initialScale:1, viewportFit:'cover' as const, themeColor:'#040605' }
export const metadata: Metadata = { title:'DeepLabs — Hackathon Coming Soon', description:'Twelve challenges. One arena.' }
export default function RootLayout({ children }:{children:React.ReactNode}) {
  return <html lang="en" className={`${display.variable} ${body.variable}`}><body><BackgroundEffects/>{children}</body></html>
}
