"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/app-context"
import { ArrowLeft, Search, UserPlus, Check, Copy, User } from "lucide-react"

export default function AddFriendPage() {
  const router = useRouter()
  const { user, profile, isLoggedIn, searchUserByCode, sendFriendRequest, loadProfile } = useApp()
  
  const [code, setCode] = useState("")
  const [searching, setSearching] = useState(false)
  const [foundUser, setFoundUser] = useState<{ id: string; name: string; friendCode: string } | null>(null)
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/")
    } else {
      loadProfile()
    }
  }, [isLoggedIn, router, loadProfile])

  const handleSearch = async () => {
    if (code.length !== 8) {
      setError("El codigo debe tener 8 caracteres")
      return
    }

    setSearching(true)
    setError("")
    setFoundUser(null)

    const result = await searchUserByCode(code.toUpperCase())
    setSearching(false)

    if (result.error) {
      setError(result.error)
    } else if (result.user) {
      setFoundUser(result.user)
    }
  }

  const handleSendRequest = async () => {
    if (!foundUser) return

    setSending(true)
    const result = await sendFriendRequest(foundUser.id)
    setSending(false)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/ranking")
      }, 2000)
    } else {
      setError(result.error || "Error al enviar solicitud")
    }
  }

  const handleCopyCode = async () => {
    if (!profile?.friendCode) return
    try {
      await navigator.clipboard.writeText(profile.friendCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard not available
    }
  }

  if (!isLoggedIn) return null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 px-5 pb-4 pt-6">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <button
            onClick={() => router.push("/ranking")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Agregar amigo</h1>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-2 text-lg font-bold text-foreground">Solicitud enviada</h2>
            <p className="text-center text-sm text-muted-foreground">
              {foundUser?.name} recibira tu solicitud de amistad
            </p>
          </div>
        ) : (
          <>
            {/* Your code section */}
            <div className="mb-6 rounded-2xl bg-card p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tu codigo de amigo
              </p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold tracking-widest text-foreground">
                  {profile?.friendCode || "--------"}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
                  aria-label="Copiar codigo"
                >
                  {copied ? <Check className="h-5 w-5 text-primary" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Comparte este codigo con tus amigos
              </p>
            </div>

            {/* Search section */}
            <div className="mb-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Buscar por codigo
              </p>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase().slice(0, 8))
                      setError("")
                      setFoundUser(null)
                    }}
                    placeholder="Ingresa codigo de 8 caracteres"
                    className="w-full rounded-xl bg-card py-4 pl-4 pr-4 font-mono text-center text-lg uppercase tracking-widest text-foreground placeholder:text-muted-foreground placeholder:text-sm placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-primary"
                    maxLength={8}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={code.length !== 8 || searching}
                  className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
                  aria-label="Buscar"
                >
                  {searching ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </button>
              </div>
              {code.length > 0 && code.length < 8 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {8 - code.length} caracteres restantes
                </p>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Found user */}
            {foundUser && (
              <div className="rounded-2xl bg-card p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Usuario encontrado
                </p>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    {foundUser.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{foundUser.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{foundUser.friendCode}</p>
                  </div>
                </div>
                <button
                  onClick={handleSendRequest}
                  disabled={sending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {sending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Enviar solicitud de amistad
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Instructions */}
            {!foundUser && !error && (
              <div className="rounded-2xl bg-card p-4">
                <h3 className="mb-2 text-sm font-semibold text-foreground">Como funciona</h3>
                <ol className="space-y-2 text-xs text-muted-foreground">
                  <li>1. Pide a tu amigo su codigo unico de 8 caracteres</li>
                  <li>2. Ingresa el codigo en el campo de arriba</li>
                  <li>3. Envia la solicitud de amistad</li>
                  <li>4. Cuando tu amigo acepte, apareceran en el ranking juntos</li>
                </ol>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
