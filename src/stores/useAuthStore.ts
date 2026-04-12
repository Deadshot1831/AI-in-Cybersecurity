import { create } from 'zustand'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  error: string | null
  isDemo: boolean

  // Actions
  initialize: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<void>
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>
  signInWithMagicLink: (email: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  clearError: () => void
}

const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,
  isDemo: isDemoMode,

  initialize: async () => {
    if (isDemoMode) {
      set({ isLoading: false, isDemo: true })
      return
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      set({
        session,
        user: session?.user ?? null,
        isLoading: false,
      })

      // Listen for auth state changes (login, logout, token refresh)
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
        })
      })
    } catch (err) {
      const authErr = err as AuthError
      set({ error: authErr.message, isLoading: false })
    }
  },

  signInWithEmail: async (email, password) => {
    set({ isLoading: true, error: null })
    if (get().isDemo) {
      // Demo mode: simulate login
      await new Promise(r => setTimeout(r, 800))
      set({
        user: { id: 'demo-user', email, user_metadata: { full_name: 'Demo User' } } as unknown as User,
        isLoading: false,
      })
      return
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      set({ isLoading: false })
    } catch (err) {
      const authErr = err as AuthError
      set({ error: authErr.message, isLoading: false })
    }
  },

  signUpWithEmail: async (email, password, fullName) => {
    set({ isLoading: true, error: null })
    if (get().isDemo) {
      await new Promise(r => setTimeout(r, 800))
      set({
        user: { id: 'demo-user', email, user_metadata: { full_name: fullName ?? 'Demo User' } } as unknown as User,
        isLoading: false,
      })
      return
    }
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      if (error) throw error
      set({ isLoading: false })
    } catch (err) {
      const authErr = err as AuthError
      set({ error: authErr.message, isLoading: false })
    }
  },

  signInWithOAuth: async (provider) => {
    set({ isLoading: true, error: null })
    if (get().isDemo) {
      await new Promise(r => setTimeout(r, 800))
      set({
        user: {
          id: `demo-${provider}`,
          email: `demo@${provider}.com`,
          user_metadata: { full_name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`, avatar_url: '' },
        } as unknown as User,
        isLoading: false,
      })
      return
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) throw error
    } catch (err) {
      const authErr = err as AuthError
      set({ error: authErr.message, isLoading: false })
    }
  },

  signInWithMagicLink: async (email) => {
    set({ isLoading: true, error: null })
    if (get().isDemo) {
      await new Promise(r => setTimeout(r, 800))
      set({ error: null, isLoading: false })
      return
    }
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) throw error
      set({ isLoading: false })
    } catch (err) {
      const authErr = err as AuthError
      set({ error: authErr.message, isLoading: false })
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null })
    if (get().isDemo) {
      set({ user: null, session: null, isLoading: false })
      return
    }
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, session: null, isLoading: false })
    } catch (err) {
      const authErr = err as AuthError
      set({ error: authErr.message, isLoading: false })
    }
  },

  resetPassword: async (email) => {
    set({ isLoading: true, error: null })
    if (get().isDemo) {
      await new Promise(r => setTimeout(r, 800))
      set({ isLoading: false })
      return
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      })
      if (error) throw error
      set({ isLoading: false })
    } catch (err) {
      const authErr = err as AuthError
      set({ error: authErr.message, isLoading: false })
    }
  },

  clearError: () => set({ error: null }),
}))
