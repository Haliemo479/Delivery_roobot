import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Pharoah LORM - Autonomous Delivery Robot",
  description: "Experience the future of autonomous delivery in Cairo with Pharoah LORM",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
