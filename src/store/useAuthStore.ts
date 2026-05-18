import { create } from 'zustand'

export interface User {
  id: string
  phone_number: string
  roleid?: any
  entity_id?: string
  onboarding_completed: boolean
  is_active: boolean
}

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setIsLoading: (isLoading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // true initially while hydrating
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
}))
