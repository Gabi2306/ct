"use client"

import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export type ActivityType = "food" | "transport"

export interface ActivityEntry {
  id: string
  type: ActivityType
  name: string
  emissions: number
  timestamp: string
  details?: string
}

export interface User {
  id: string
  name: string
  email: string
}

export interface Profile {
  id: string
  name: string
  email: string
  friendCode: string
  notificationEnabled: boolean
  notificationTime: string
  pushSubscription: unknown | null
}

export interface FriendRequest {
  id: string
  requesterId: string
  addresseeId: string
  status: "pending" | "accepted" | "rejected"
  createdAt: string
  requesterName?: string
  addresseeName?: string
}

export interface Friend {
  id: string
  name: string
  friendCode: string
  weeklyEmissions: number
}

export interface HistoryFilters {
  startDate?: Date
  endDate?: Date
  searchQuery?: string
  type?: ActivityType | "all"
}

interface AppContextType {
  user: User | null
  profile: Profile | null
  isLoggedIn: boolean
  activities: ActivityEntry[]
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  addActivity: (entry: Omit<ActivityEntry, "id" | "timestamp">) => Promise<void>
  deleteActivity: (id: string) => Promise<void>
  getTodayEmissions: () => number
  getYesterdayEmissions: () => number
  getWeeklyData: () => { day: string; emissions: number }[]
  getRecentActivities: () => ActivityEntry[]
  refreshActivities: () => Promise<void>
  // Profile functions
  loadProfile: () => Promise<void>
  updateProfile: (updates: { name?: string; notificationEnabled?: boolean; notificationTime?: string }) => Promise<{ success: boolean; error?: string }>
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>
  // History functions
  getFilteredActivities: (filters: HistoryFilters) => ActivityEntry[]
  loadMoreActivities: (offset: number, limit: number) => Promise<ActivityEntry[]>
  // Friends functions
  searchUserByCode: (code: string) => Promise<{ user: { id: string; name: string; friendCode: string } | null; error?: string }>
  sendFriendRequest: (addresseeId: string) => Promise<{ success: boolean; error?: string }>
  getPendingRequests: () => Promise<FriendRequest[]>
  respondToRequest: (requestId: string, accept: boolean) => Promise<{ success: boolean; error?: string }>
  getFriends: () => Promise<Friend[]>
  removeFriend: (friendshipId: string) => Promise<{ success: boolean; error?: string }>
  getWeeklyRanking: () => Promise<Friend[]>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

function mapSupabaseUser(su: SupabaseUser, profileName?: string): User {
  return {
    id: su.id,
    name: profileName || su.user_metadata?.name || su.email?.split("@")[0] || "Usuario",
    email: su.email || "",
  }
}

function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

const supabase = createClient()

// Cache helper
const CACHE_KEY = "ct_activities_cache"
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

function getCachedActivities(): ActivityEntry[] | null {
  if (typeof window === "undefined") return null
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data
      }
    }
  } catch {
    // Silently fail
  }
  return null
}

function setCachedActivities(activities: ActivityEntry[]) {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: activities, timestamp: Date.now() }))
  } catch {
    // Storage full or unavailable
  }
}

function clearCachedActivities() {
  if (typeof window === "undefined") return
  try {
    sessionStorage.removeItem(CACHE_KEY)
  } catch {
    // Silently fail
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)
  const initRef = useRef(false)

  const loadProfile = useCallback(async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (!error && data) {
        setProfile({
          id: data.id,
          name: data.name || "",
          email: data.email || "",
          friendCode: data.friend_code || "",
          notificationEnabled: data.notification_enabled || false,
          notificationTime: data.notification_time || "09:00:00",
          pushSubscription: data.push_subscription,
        })
      }
    } catch {
      // Error loading profile
    }
  }, [user])

  const loadActivities = useCallback(async (userId: string) => {
    // Check cache first
    const cached = getCachedActivities()
    if (cached) {
      setActivities(cached)
      return
    }

    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100)

      if (!error && data) {
        const mapped = data.map((row) => ({
          id: row.id,
          type: row.type as ActivityType,
          name: row.name,
          emissions: Number(row.emissions),
          timestamp: row.created_at,
          details: row.details || undefined,
        }))
        setActivities(mapped)
        setCachedActivities(mapped)
      }
    } catch {
      // Silent fail
    }
  }, [])

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    async function init() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
          let profileName: string | undefined
          let profileData: Profile | null = null
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", authUser.id)
              .single()
            if (profile) {
              profileName = profile.name
              profileData = {
                id: profile.id,
                name: profile.name || "",
                email: profile.email || "",
                friendCode: profile.friend_code || "",
                notificationEnabled: profile.notification_enabled || false,
                notificationTime: profile.notification_time || "09:00:00",
                pushSubscription: profile.push_subscription,
              }
            }
          } catch {
            // Profile not found
          }
          setUser(mapSupabaseUser(authUser, profileName))
          if (profileData) setProfile(profileData)
          await loadActivities(authUser.id)
        }
      } catch {
        // Connection error
      } finally {
        setLoading(false)
      }
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          let profileName: string | undefined
          let profileData: Profile | null = null
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single()
            if (profile) {
              profileName = profile.name
              profileData = {
                id: profile.id,
                name: profile.name || "",
                email: profile.email || "",
                friendCode: profile.friend_code || "",
                notificationEnabled: profile.notification_enabled || false,
                notificationTime: profile.notification_time || "09:00:00",
                pushSubscription: profile.push_subscription,
              }
            }
          } catch {
            // Use metadata as fallback
          }
          setUser(mapSupabaseUser(session.user, profileName))
          if (profileData) setProfile(profileData)
          await loadActivities(session.user.id)
        } else if (event === "SIGNED_OUT") {
          setUser(null)
          setProfile(null)
          setActivities([])
          clearCachedActivities()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [loadActivities])

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          return { success: false, error: "Email o contrasena incorrectos" }
        }
        if (error.message.includes("Email not confirmed")) {
          return { success: false, error: "Debes confirmar tu email antes de iniciar sesion. Revisa tu bandeja de entrada." }
        }
        return { success: false, error: "No se pudo iniciar sesion. Verifica tus datos e intenta de nuevo." }
      }
      if (data.user) {
        let profileName: string | undefined
        let profileData: Profile | null = null
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single()
          if (profile) {
            profileName = profile.name
            profileData = {
              id: profile.id,
              name: profile.name || "",
              email: profile.email || "",
              friendCode: profile.friend_code || "",
              notificationEnabled: profile.notification_enabled || false,
              notificationTime: profile.notification_time || "09:00:00",
              pushSubscription: profile.push_subscription,
            }
          }
        } catch {
          // Use metadata
        }
        setUser(mapSupabaseUser(data.user, profileName))
        if (profileData) setProfile(profileData)
        await loadActivities(data.user.id)
      }
      return { success: true }
    } catch {
      return { success: false, error: "Error de conexion. Verifica tu internet e intenta de nuevo." }
    }
  }, [loadActivities])

  const register = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${typeof window !== "undefined" ? window.location.origin : ""}/dashboard`,
        },
      })
      if (error) {
        if (error.message.includes("already registered") || error.message.includes("already been registered")) {
          return { success: false, error: "Ya existe una cuenta con este email. Intenta iniciar sesion." }
        }
        if (error.message.includes("password")) {
          return { success: false, error: "La contrasena debe tener al menos 6 caracteres." }
        }
        return { success: false, error: "No se pudo crear la cuenta. Intenta de nuevo." }
      }

      if (data.user && !data.session) {
        return { success: true, error: "confirm_email" }
      }

      if (data.user && data.session) {
        try {
          await supabase
            .from("profiles")
            .update({ name })
            .eq("id", data.user.id)
        } catch {
          // Trigger already created profile
        }
        setUser(mapSupabaseUser(data.user, name))
        setActivities([])
      }
      return { success: true }
    } catch {
      return { success: false, error: "Error de conexion. Verifica tu internet e intenta de nuevo." }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      // Clear local state anyway
    }
    setUser(null)
    setProfile(null)
    setActivities([])
    clearCachedActivities()
  }, [])

  const addActivity = useCallback(async (entry: Omit<ActivityEntry, "id" | "timestamp">) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("activities")
        .insert({
          user_id: user.id,
          type: entry.type,
          name: entry.name,
          emissions: entry.emissions,
          details: entry.details || null,
        })
        .select()
        .single()

      if (!error && data) {
        const newEntry: ActivityEntry = {
          id: data.id,
          type: data.type as ActivityType,
          name: data.name,
          emissions: Number(data.emissions),
          timestamp: data.created_at,
          details: data.details || undefined,
        }
        setActivities((prev) => {
          const updated = [newEntry, ...prev]
          setCachedActivities(updated)
          return updated
        })
      }
    } catch {
      // Silent fail
    }
  }, [user])

  const deleteActivity = useCallback(async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)

      if (!error) {
        setActivities((prev) => {
          const updated = prev.filter((a) => a.id !== id)
          setCachedActivities(updated)
          return updated
        })
      }
    } catch {
      // Silent fail
    }
  }, [user])

  const refreshActivities = useCallback(async () => {
    if (user) {
      clearCachedActivities()
      await loadActivities(user.id)
    }
  }, [user, loadActivities])

  const updateProfile = useCallback(async (updates: { name?: string; notificationEnabled?: boolean; notificationTime?: string }): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "No autenticado" }

    try {
      const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (updates.name !== undefined) dbUpdates.name = updates.name
      if (updates.notificationEnabled !== undefined) dbUpdates.notification_enabled = updates.notificationEnabled
      if (updates.notificationTime !== undefined) dbUpdates.notification_time = updates.notificationTime

      const { error } = await supabase
        .from("profiles")
        .update(dbUpdates)
        .eq("id", user.id)

      if (error) {
        return { success: false, error: "No se pudo actualizar el perfil" }
      }

      setProfile((prev) => prev ? { ...prev, ...updates } : null)
      if (updates.name) {
        setUser((prev) => prev ? { ...prev, name: updates.name! } : null)
      }
      return { success: true }
    } catch {
      return { success: false, error: "Error de conexion" }
    }
  }, [user])

  const updatePassword = useCallback(async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        if (error.message.includes("password")) {
          return { success: false, error: "La contrasena debe tener al menos 6 caracteres" }
        }
        return { success: false, error: "No se pudo actualizar la contrasena" }
      }
      return { success: true }
    } catch {
      return { success: false, error: "Error de conexion" }
    }
  }, [])

  const getFilteredActivities = useCallback((filters: HistoryFilters): ActivityEntry[] => {
    return activities.filter((activity) => {
      const activityDate = new Date(activity.timestamp)
      
      if (filters.startDate) {
        const start = new Date(filters.startDate)
        start.setHours(0, 0, 0, 0)
        if (activityDate < start) return false
      }
      
      if (filters.endDate) {
        const end = new Date(filters.endDate)
        end.setHours(23, 59, 59, 999)
        if (activityDate > end) return false
      }
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        if (!activity.name.toLowerCase().includes(query)) return false
      }
      
      if (filters.type && filters.type !== "all" && activity.type !== filters.type) {
        return false
      }
      
      return true
    })
  }, [activities])

  const loadMoreActivities = useCallback(async (offset: number, limit: number): Promise<ActivityEntry[]> => {
    if (!user) return []

    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)

      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          type: row.type as ActivityType,
          name: row.name,
          emissions: Number(row.emissions),
          timestamp: row.created_at,
          details: row.details || undefined,
        }))
      }
    } catch {
      // Silent fail
    }
    return []
  }, [user])

  // Friends functions
  const searchUserByCode = useCallback(async (code: string): Promise<{ user: { id: string; name: string; friendCode: string } | null; error?: string }> => {
    if (!user) return { user: null, error: "No autenticado" }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, friend_code")
        .eq("friend_code", code.toUpperCase())
        .single()

      if (error || !data) {
        return { user: null, error: "Usuario no encontrado" }
      }

      if (data.id === user.id) {
        return { user: null, error: "No puedes agregarte a ti mismo" }
      }

      return { user: { id: data.id, name: data.name, friendCode: data.friend_code } }
    } catch {
      return { user: null, error: "Error de conexion" }
    }
  }, [user])

  const sendFriendRequest = useCallback(async (addresseeId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "No autenticado" }

    try {
      // Check if friendship already exists
      const { data: existing } = await supabase
        .from("friendships")
        .select("id, status")
        .or(`and(requester_id.eq.${user.id},addressee_id.eq.${addresseeId}),and(requester_id.eq.${addresseeId},addressee_id.eq.${user.id})`)
        .single()

      if (existing) {
        if (existing.status === "accepted") {
          return { success: false, error: "Ya son amigos" }
        }
        if (existing.status === "pending") {
          return { success: false, error: "Ya existe una solicitud pendiente" }
        }
      }

      const { error } = await supabase
        .from("friendships")
        .insert({
          requester_id: user.id,
          addressee_id: addresseeId,
          status: "pending",
        })

      if (error) {
        return { success: false, error: "No se pudo enviar la solicitud" }
      }

      return { success: true }
    } catch {
      return { success: false, error: "Error de conexion" }
    }
  }, [user])

  const getPendingRequests = useCallback(async (): Promise<FriendRequest[]> => {
    if (!user) return []

    try {
      const { data, error } = await supabase
        .from("friendships")
        .select(`
          id,
          requester_id,
          addressee_id,
          status,
          created_at,
          requester:profiles!friendships_requester_id_fkey(name),
          addressee:profiles!friendships_addressee_id_fkey(name)
        `)
        .eq("addressee_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      if (error || !data) return []

      return data.map((row) => ({
        id: row.id,
        requesterId: row.requester_id,
        addresseeId: row.addressee_id,
        status: row.status as "pending",
        createdAt: row.created_at,
        requesterName: (row.requester as { name?: string })?.name || "Usuario",
        addresseeName: (row.addressee as { name?: string })?.name || "Usuario",
      }))
    } catch {
      return []
    }
  }, [user])

  const respondToRequest = useCallback(async (requestId: string, accept: boolean): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "No autenticado" }

    try {
      const { error } = await supabase
        .from("friendships")
        .update({
          status: accept ? "accepted" : "rejected",
          updated_at: new Date().toISOString(),
        })
        .eq("id", requestId)
        .eq("addressee_id", user.id)

      if (error) {
        return { success: false, error: "No se pudo responder a la solicitud" }
      }

      return { success: true }
    } catch {
      return { success: false, error: "Error de conexion" }
    }
  }, [user])

  const getFriends = useCallback(async (): Promise<Friend[]> => {
    if (!user) return []

    try {
      const { data, error } = await supabase
        .from("friendships")
        .select(`
          id,
          requester_id,
          addressee_id,
          requester:profiles!friendships_requester_id_fkey(id, name, friend_code),
          addressee:profiles!friendships_addressee_id_fkey(id, name, friend_code)
        `)
        .eq("status", "accepted")
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)

      if (error || !data) return []

      const friends: Friend[] = data.map((row) => {
        const isRequester = row.requester_id === user.id
        const friendProfile = isRequester 
          ? (row.addressee as { id: string; name: string; friend_code: string })
          : (row.requester as { id: string; name: string; friend_code: string })
        
        return {
          id: friendProfile.id,
          name: friendProfile.name || "Usuario",
          friendCode: friendProfile.friend_code || "",
          weeklyEmissions: 0,
        }
      })

      return friends
    } catch {
      return []
    }
  }, [user])

  const removeFriend = useCallback(async (friendId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "No autenticado" }

    try {
      const { error } = await supabase
        .from("friendships")
        .delete()
        .eq("status", "accepted")
        .or(`and(requester_id.eq.${user.id},addressee_id.eq.${friendId}),and(requester_id.eq.${friendId},addressee_id.eq.${user.id})`)

      if (error) {
        return { success: false, error: "No se pudo eliminar al amigo" }
      }

      return { success: true }
    } catch {
      return { success: false, error: "Error de conexion" }
    }
  }, [user])

  const getWeeklyRanking = useCallback(async (): Promise<Friend[]> => {
    if (!user) return []

    try {
      // Get friends
      const friends = await getFriends()
      const friendIds = friends.map((f) => f.id)
      
      // Include current user in ranking
      const allIds = [user.id, ...friendIds]
      
      // Get weekly emissions for all
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
      weekStart.setHours(0, 0, 0, 0)
      
      const { data: emissionsData } = await supabase
        .from("activities")
        .select("user_id, emissions")
        .in("user_id", allIds)
        .gte("created_at", weekStart.toISOString())

      // Calculate total emissions per user
      const emissionsMap: Record<string, number> = {}
      if (emissionsData) {
        for (const row of emissionsData) {
          emissionsMap[row.user_id] = (emissionsMap[row.user_id] || 0) + Number(row.emissions)
        }
      }

      // Build ranking including current user
      const ranking: Friend[] = [
        {
          id: user.id,
          name: profile?.name || user.name,
          friendCode: profile?.friendCode || "",
          weeklyEmissions: emissionsMap[user.id] || 0,
        },
        ...friends.map((f) => ({
          ...f,
          weeklyEmissions: emissionsMap[f.id] || 0,
        })),
      ]

      // Sort by emissions (ascending - less is better)
      ranking.sort((a, b) => a.weeklyEmissions - b.weeklyEmissions)

      return ranking
    } catch {
      return []
    }
  }, [user, profile, getFriends])

  // Memoized computed values
  const getTodayEmissions = useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return activities
      .filter((a) => new Date(a.timestamp) >= today)
      .reduce((sum, a) => sum + a.emissions, 0)
  }, [activities])

  const getYesterdayEmissions = useCallback(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return activities
      .filter((a) => {
        const d = new Date(a.timestamp)
        return d >= yesterday && d < today
      })
      .reduce((sum, a) => sum + a.emissions, 0)
  }, [activities])

  const getWeeklyData = useCallback(() => {
    const days = ["L", "M", "X", "J", "V", "S", "D"]
    const data = days.map((day, i) => {
      const date = new Date()
      const currentDay = date.getDay()
      const diff = currentDay === 0 ? 6 : currentDay - 1
      date.setDate(date.getDate() - diff + i)
      date.setHours(0, 0, 0, 0)
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)

      const dayEmissions = activities
        .filter((a) => {
          const d = new Date(a.timestamp)
          return d >= date && d < nextDay
        })
        .reduce((sum, a) => sum + a.emissions, 0)

      return { day, emissions: Number(dayEmissions.toFixed(1)) }
    })
    return data
  }, [activities])

  const getRecentActivities = useCallback(() => {
    return activities.slice(0, 5)
  }, [activities])

  const contextValue = useMemo(() => ({
    user,
    profile,
    isLoggedIn: user !== null,
    activities,
    loading,
    login,
    register,
    logout,
    addActivity,
    deleteActivity,
    getTodayEmissions,
    getYesterdayEmissions,
    getWeeklyData,
    getRecentActivities,
    refreshActivities,
    loadProfile,
    updateProfile,
    updatePassword,
    getFilteredActivities,
    loadMoreActivities,
    searchUserByCode,
    sendFriendRequest,
    getPendingRequests,
    respondToRequest,
    getFriends,
    removeFriend,
    getWeeklyRanking,
  }), [
    user, profile, activities, loading, login, register, logout,
    addActivity, deleteActivity, getTodayEmissions, getYesterdayEmissions,
    getWeeklyData, getRecentActivities, refreshActivities, loadProfile,
    updateProfile, updatePassword, getFilteredActivities, loadMoreActivities,
    searchUserByCode, sendFriendRequest, getPendingRequests, respondToRequest,
    getFriends, removeFriend, getWeeklyRanking
  ])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
