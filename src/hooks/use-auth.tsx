import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import pb from '@/lib/pocketbase/client'

interface AuthContextType {
  user: any
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signInWithMasp: (name: string, masp: string) => Promise<{ error: any }>
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

  const signIn = async (identifier: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(identifier, password)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signInWithMasp = async (name: string, masp: string) => {
    try {
      const response = await pb.send('/backend/v1/masp-login', {
        method: 'POST',
        body: JSON.stringify({ name, masp }),
        headers: { 'Content-Type': 'application/json' },
      })
      pb.authStore.save(response.token, response.record)
      setUser(response.record)
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
    <AuthContext.Provider value={{ user, signIn, signInWithMasp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
