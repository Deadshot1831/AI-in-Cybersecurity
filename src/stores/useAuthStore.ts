import { create } from 'zustand'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

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

const NOT_CONFIGURED_MSG =
  'Authentication is not configured on this deployment. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the hosting provider and redeploy.'

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,
  isDemo: !isSupabaseConfigured,

  initialize: async () => {
    if (!isSupabaseConfigured) {
      set({ isLoading: false, isDemo: true, user: null, session: null })
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
    if (get().isDemo) {
      set({ error: NOT_CONFIGURED_MSG, isLoading: false, user: null, session: null })
      return
    }
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      set({ isLoading: false })
    } catch (err) {
      const authErr = err as AuthError
      set({ error: authErr.message, isLoading: false, user: null, session: null })
    }
  },

  signUpWithEmail: async (email, password, fullName) => {
    if (get().isDemo) {
      set({ error: NOT_CONFIGURED_MSG, isLoading: false, user: null, session: null })
      return
    }
    set({ isLoading: true, error: null })
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
      set({ error: authErr.message, isLoading: false, user: null, session: null })
    }
  },

  signInWithOAuth: async (provider) => {
    if (get().isDemo) {
      set({ error: NOT_CONFIGURED_MSG, isLoading: false, user: null, session: null })
      return
    }
    set({ isLoading: true, error: null })
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) throw error
    } catch (err) {
      const authErr = err as AuthError
      set({ error: authErr.message, isLoading: false, user: null, session: null })
    }
  },

  signInWithMagicLink: async (email) => {
    if (get().isDemo) {
      set({ error: NOT_CONFIGURED_MSG, isLoading: false })
      return
    }
    set({ isLoading: true, error: null })
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
    if (get().isDemo) {
      set({ error: NOT_CONFIGURED_MSG, isLoading: false })
      return
    }
    set({ isLoading: true, error: null })
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
