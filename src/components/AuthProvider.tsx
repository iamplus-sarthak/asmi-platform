'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
// Fetch from API removed

export function AuthProvider({ children, initialUser }: { children: React.ReactNode, initialUser?: any }) {
  const { setUser, setIsLoading } = useAuthStore()

  useEffect(() => {
    setUser(initialUser || null);
    setIsLoading(false);
  }, [initialUser, setUser, setIsLoading]);

  return <>{children}</>
}
