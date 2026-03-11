"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useApp, type Friend, type FriendRequest } from "@/lib/app-context"
import { BottomNav } from "@/components/bottom-nav"
import { 
  ArrowLeft, 
  Info, 
  User, 
  UserPlus, 
  Users, 
  Bell,
  Trophy,
  Medal,
  Crown,
  Leaf
} from "lucide-react"

export default function RankingPage() {
  const router = useRouter()
  const { 
    user, 
    profile,
    isLoggedIn, 
    getWeeklyRanking, 
    getPendingRequests,
    loadProfile 
  } = useApp()
  
  const [ranking, setRanking] = useState<Friend[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showInfo, setShowInfo] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [rankingData, requests] = await Promise.all([
        getWeeklyRanking(),
        getPendingRequests(),
      ])
      setRanking(rankingData)
      setPendingCount(requests.length)
    } catch {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }, [getWeeklyRanking, getPendingRequests])

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/")
    } else {
      loadProfile()
      loadData()
    }
  }, [isLoggedIn, router, loadProfile, loadData])

  if (!isLoggedIn) return null

  const userRank = ranking.findIndex((r) => r.id === user?.id) + 1
  const userStats = ranking.find((r) => r.id === user?.id)
  const topThree = ranking.slice(0, 3)
  const rest = ranking.slice(3)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 overflow-y-auto px-5 pb-4 pt-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
              aria-label="Volver"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Ranking Semanal</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
              aria-label="Informacion"
            >
              <Info className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Info panel */}
        {showInfo && (
          <div className="mb-4 rounded-2xl bg-card p-4">
            <p className="text-sm text-muted-foreground">
              El ranking se calcula semanalmente (lunes a domingo) basado en quien 
              produce <span className="font-semibold text-primary">menos emisiones de CO2</span>. 
              Compite con tus amigos para ser el mas ecologico.
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => router.push("/ranking/add-friend")}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
          >
            <UserPlus className="h-4 w-4" />
            Agregar amigo
          </button>
          <button
            onClick={() => router.push("/ranking/requests")}
            className="relative flex flex-1 items-center justify-center gap-2 rounded-2xl bg-card py-3 text-sm font-semibold text-foreground"
          >
            <Bell className="h-4 w-4" />
            Solicitudes
            {pendingCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-3 text-sm text-muted-foreground">Cargando ranking...</p>
          </div>
        ) : ranking.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-card px-6 py-12 text-center">
            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-lg font-bold text-foreground">Sin amigos aun</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Agrega amigos usando su codigo unico para competir en el ranking semanal
            </p>
            <button
              onClick={() => router.push("/ranking/add-friend")}
              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              Agregar primer amigo
            </button>
          </div>
        ) : (
          <>
            {/* Podium */}
            {topThree.length > 0 && (
              <div className="mb-6 flex items-end justify-center gap-3 pt-8">
                {/* Second place */}
                {topThree[1] && (
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-card">
                        <span className="text-xl font-bold text-foreground">
                          {topThree[1].name[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
                        <Medal className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="mt-2 max-w-[80px] truncate text-xs font-semibold text-foreground">
                      {topThree[1].id === user?.id ? "Tu" : topThree[1].name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {topThree[1].weeklyEmissions.toFixed(1)} kg
                    </p>
                    <div className="mt-2 h-16 w-16 rounded-t-lg bg-secondary" />
                  </div>
                )}

                {/* First place */}
                {topThree[0] && (
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-primary/10 shadow-lg shadow-primary/20">
                        <span className="text-2xl font-bold text-primary">
                          {topThree[0].name[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Crown className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <p className="mt-2 max-w-[90px] truncate text-sm font-bold text-foreground">
                      {topThree[0].id === user?.id ? "Tu" : topThree[0].name}
                    </p>
                    <p className="text-xs text-primary">
                      {topThree[0].weeklyEmissions.toFixed(1)} kg
                    </p>
                    <div className="mt-2 h-24 w-20 rounded-t-lg bg-primary/20" />
                  </div>
                )}

                {/* Third place */}
                {topThree[2] && (
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-border bg-card">
                        <span className="text-lg font-bold text-foreground">
                          {topThree[2].name[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary">
                        <span className="text-[10px] font-bold text-muted-foreground">3</span>
                      </div>
                    </div>
                    <p className="mt-2 max-w-[70px] truncate text-xs font-semibold text-foreground">
                      {topThree[2].id === user?.id ? "Tu" : topThree[2].name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {topThree[2].weeklyEmissions.toFixed(1)} kg
                    </p>
                    <div className="mt-2 h-12 w-14 rounded-t-lg bg-secondary" />
                  </div>
                )}
              </div>
            )}

            {/* Rest of ranking */}
            {rest.length > 0 && (
              <>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Clasificacion completa
                </h2>
                <div className="mb-4 flex flex-col gap-2">
                  {rest.map((friend, index) => {
                    const position = index + 4
                    const isUser = friend.id === user?.id

                    return (
                      <div
                        key={friend.id}
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                          isUser ? "bg-primary/10 ring-1 ring-primary" : "bg-card"
                        }`}
                      >
                        <span className="w-6 text-center text-sm font-bold text-muted-foreground">
                          {position}
                        </span>
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          isUser ? "bg-primary text-primary-foreground" : "bg-secondary"
                        }`}>
                          <span className="text-sm font-bold">
                            {friend.name[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${isUser ? "text-primary" : "text-foreground"}`}>
                            {isUser ? "Tu" : friend.name}
                          </p>
                          {isUser && (
                            <p className="text-[10px] uppercase tracking-wider text-primary/70">
                              Tu posicion actual
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">
                            {friend.weeklyEmissions.toFixed(1)} kg
                          </p>
                          <p className="text-[10px] uppercase text-muted-foreground">CO2</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* User stats banner if not in top 3 */}
            {userRank > 3 && userStats && (
              <div className="mt-2 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-4">
                <span className="text-lg font-bold text-white/70">#{userRank}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <span className="text-sm font-bold text-white">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Tu posicion</p>
                  <p className="text-[10px] uppercase text-white/70">
                    Reduce emisiones para subir
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">
                    {userStats.weeklyEmissions.toFixed(1)} kg
                  </p>
                  <p className="text-[9px] uppercase text-white/70">Esta semana</p>
                </div>
              </div>
            )}

            {/* Eco tip */}
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-card p-4">
              <Leaf className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-semibold text-foreground">Consejo ecologico</p>
                <p className="text-xs text-muted-foreground">
                  Menos emisiones = mejor posicion. Usa transporte publico, reduce el consumo 
                  de carne y optimiza tus viajes para mejorar tu ranking.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
