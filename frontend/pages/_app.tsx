import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

const publicPages = ['/auth/login', '/auth/register']

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { initAuth, isAuthenticated, isLoading } = useAuthStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    initAuth().then(() => setIsInitialized(true))
  }, [])

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const isPublicPage = publicPages.includes(router.pathname)

  if (!isAuthenticated && !isPublicPage) {
    router.replace('/auth/login')
    return null
  }

  if (isAuthenticated && isPublicPage) {
    router.replace('/')
    return null
  }

  return (
    <main className={inter.className}>
      <Component {...pageProps} />
    </main>
  )
}