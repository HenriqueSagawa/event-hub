"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  email: string
  name: string
  isVerified: boolean
  avatarUrl?: string | null
  course?: string | null
  semester?: number | null
  academicRecord?: string | null
  phone?: string | null
  githubUrl?: string | null
  linkedinUrl?: string | null
  interests?: string[]
  bio?: string | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  checkingSession: boolean
  register: (name: string, email: string, password: string) => Promise<{ message: string }>
  verifyEmail: (email: string, code: string) => Promise<{ message: string }>
  login: (email: string, password: string) => Promise<User>
  completeProfile: (data: Partial<User> & { period?: string; registration?: string; github?: string; linkedin?: string; photo?: string | null }) => Promise<{ message: string; user: User }>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  // Carrega a sessão ao montar o componente
  useEffect(() => {
    async function loadSession() {
      const storedToken = localStorage.getItem("event-hub:token")
      if (storedToken) {
        setToken(storedToken)
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          })

          if (res.ok) {
            const userData = await res.json()
            setUser(userData)
          } else {
            // Se o token expirou ou é inválido, limpa tudo
            localStorage.removeItem("event-hub:token")
            setToken(null)
            setUser(null)
          }
        } catch (err) {
          console.error("Erro ao carregar sessão:", err)
        }
      }
      setCheckingSession(false)
    }

    loadSession()
  }, [])

  async function refreshUser() {
    const activeToken = token || localStorage.getItem("event-hub:token")
    if (!activeToken) return

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      })
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
      }
    } catch (err) {
      console.error("Erro ao recarregar dados do usuário:", err)
    }
  }

  async function register(name: string, email: string, password: string) {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Erro no registro")
      }

      return data as { message: string }
    } finally {
      setLoading(false)
    }
  }

  async function verifyEmail(email: string, code: string) {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Erro de verificação")
      }

      return data as { message: string }
    } finally {
      setLoading(false)
    }
  }

  async function login(email: string, password: string) {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Erro no login")
      }

      const { token: receivedToken, user: partialUser } = data
      localStorage.setItem("event-hub:token", receivedToken)
      setToken(receivedToken)

      // Busca dados completos do usuário imediatamente após obter o token
      const meRes = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${receivedToken}`,
        },
      })

      if (!meRes.ok) {
        throw new Error("Erro ao buscar dados do perfil do usuário")
      }

      const fullUser = await meRes.json()
      setUser(fullUser)
      return fullUser as User
    } finally {
      setLoading(false)
    }
  }

  async function completeProfile(formData: any) {
    const activeToken = token || localStorage.getItem("event-hub:token")
    if (!activeToken) {
      throw new Error("Sessão expirada. Faça login novamente.")
    }

    setLoading(true)
    try {
      // Mapeamento dos campos do formulário para o backend
      // Converte o período "Xº período" para o semestre inteiro X
      let semesterNumber = 1
      if (formData.period) {
        const match = formData.period.match(/\d+/)
        if (match) {
          semesterNumber = parseInt(match[0], 10)
        }
      }

      // Garante uma URL de avatar válida se tiver preenchido
      // Se tiver carregado foto em base64, geramos uma Dicebear URL por cima ou mantemos vazio
      let finalAvatarUrl = ""
      if (formData.photo) {
        if (formData.photo.startsWith("http")) {
          finalAvatarUrl = formData.photo
        } else {
          // Fallback para gerar avatar a partir do nome se for base64 ou se foto existir
          finalAvatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || "User")}`
        }
      }

      // Tratamento para links de redes sociais (Zod espera URL válida ou string vazia)
      const cleanUrl = (url?: string) => {
        if (!url) return ""
        let cleaned = url.trim()
        if (cleaned && !/^https?:\/\//i.test(cleaned)) {
          cleaned = `https://${cleaned}`
        }
        return cleaned
      }

      const body = {
        avatarUrl: finalAvatarUrl,
        course: formData.course,
        semester: semesterNumber,
        academicRecord: formData.registration,
        phone: formData.phone.replace(/\D/g, ""), // Apenas números
        githubUrl: cleanUrl(formData.github),
        linkedinUrl: cleanUrl(formData.linkedin),
        interests: formData.interests || [],
        bio: formData.bio || "",
      }

      const res = await fetch(`${API_URL}/auth/complete-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Erro ao atualizar perfil")
      }

      setUser(data.user)
      return data as { message: string; user: User }
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem("event-hub:token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        checkingSession,
        register,
        verifyEmail,
        login,
        completeProfile,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider")
  }
  return context
}
