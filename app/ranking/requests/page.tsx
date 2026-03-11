"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useApp, type FriendRequest } from "@/lib/app-context"
import { ArrowLeft, Check, X, Users, UserPlus } from "lucide-react"

export default function FriendRequestsPage() {
  const router = useRouter()
  const { isLoggedIn, getPendingRequests, respondToRequest } = useApp()
  
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [responding, setResponding] = useState<string | null>(null)

  const loadRequests = useCallback(async () => {
    setLoading(true)
    const data = await getPendingRequests()
    setRequests(data)
    setLoading(false)
  }, [getPendingRequests])

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/")
    } else {
      loadRequests()
    }
  }, [isLoggedIn, router, loadRequests])

  const handleRespond = async (requestId: string, accept: boolean) => {
    setResponding(requestId)
    const result = await respondToRequest(requestId, accept)
    setResponding(null)
    
    if (result.success) {
      setRequests((prev) => prev.filter((r) => r.id !== requestId))
    }
  }

  if (!isLoggedIn) return null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 px-5 pb-4 pt-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => router.push("/ranking")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Solicitudes</h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-3 text-sm text-muted-foreground">Cargando solicitudes...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-card px-6 py-12 text-center">
            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-lg font-bold text-foreground">Sin solicitudes</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              No tienes solicitudes de amistad pendientes
            </p>
            <button
              onClick={() => router.push("/ranking/add-friend")}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              <UserPlus className="h-4 w-4" />
              Agregar amigo
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {requests.length} solicitud{requests.length !== 1 ? "es" : ""} pendiente{requests.length !== 1 ? "s" : ""}
            </p>
            
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center gap-3 rounded-2xl bg-card p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {(request.requesterName?.[0] || "U").toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {request.requesterName || "Usuario"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Quiere ser tu amigo
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRespond(request.id, false)}
                    disabled={responding === request.id}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                    aria-label="Rechazar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleRespond(request.id, true)}
                    disabled={responding === request.id}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
                    aria-label="Aceptar"
                  >
                    {responding === request.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    ) : (
                      <Check className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}

            {/* Info */}
            <div className="mt-4 rounded-xl bg-card p-4">
              <p className="text-xs text-muted-foreground">
                Al aceptar una solicitud, ambos apareceran en el ranking semanal 
                del otro y podran competir por quien produce menos emisiones de CO2.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
