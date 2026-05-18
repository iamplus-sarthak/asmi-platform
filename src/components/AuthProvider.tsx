'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { fetchFromAPI } from '@/lib/api-client'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setIsLoading } = useAuthStore()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('payload-token');
        const headers: Record<string, string> = token ? { 'Authorization': `JWT ${token}` } : {};

        const data = await fetchFromAPI('/api/users/me', {
          credentials: 'include',
          headers,
        })
        
        if (data?.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Failed to fetch user session:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [setUser, setIsLoading])

  return <>{children}</>
}
