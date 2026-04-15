import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import pb from '@/lib/pocketbase/client'

interface AuthContextType {
  user: any
  signUp: (data: any) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(pb.authStore.record)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_token, record) => {
      setUser(record)
    })
    setLoading(false)
    return () => {
      unsubscribe()
    }
  }, [])

  const signUp = async (data: any) => {
    try {
      const payload = { ...data, passwordConfirm: data.password }
      if (data.masp && !data.username) {
        payload.username = data.masp
      }
      if (!payload.email && data.masp) {
        payload.email = `${data.masp.toLowerCase().replace(/[^a-z0-9]/g, '')}@hjk.local`
      }

      await pb.collection('users').create(payload)
      const identifier = payload.username || payload.email
      await pb.collection('users').authWithPassword(identifier, data.password)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signIn = async (identifier: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(identifier, password)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = () => {
    pb.authStore.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
