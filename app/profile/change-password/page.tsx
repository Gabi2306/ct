"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/app-context"
import { ArrowLeft, Eye, EyeOff, Lock, Check } from "lucide-react"

export default function ChangePasswordPage() {
  const router = useRouter()
  const { isLoggedIn, updatePassword } = useApp()
  
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/")
    }
  }, [isLoggedIn, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newPassword.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Las contrasenas no coinciden")
      return
    }

    setLoading(true)
    const result = await updatePassword(newPassword)
    setLoading(false)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/profile")
      }, 2000)
    } else {
      setError(result.error || "Error al cambiar la contrasena")
    }
  }

  if (!isLoggedIn) return null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 px-5 pb-4 pt-6">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <button
            onClick={() => router.push("/profile")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Cambiar contrasena</h1>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-2 text-lg font-bold text-foreground">Contrasena actualizada</h2>
            <p className="text-sm text-muted-foreground">Redirigiendo al perfil...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Nueva contrasena
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimo 6 caracteres"
                  className="w-full rounded-xl bg-card py-4 pl-12 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Confirmar contrasena
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contrasena"
                  className="w-full rounded-xl bg-card py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full rounded-xl bg-primary py-4 text-sm font-semibold text-primary-foreground transition-colors disabled:opacity-50"
            >
              {loading ? "Actualizando..." : "Cambiar contrasena"}
            </button>

            {/* Password requirements */}
            <div className="rounded-xl bg-card p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Requisitos de contrasena
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className={newPassword.length >= 6 ? "text-primary" : ""}>
                  - Minimo 6 caracteres {newPassword.length >= 6 && <Check className="inline h-3 w-3" />}
                </li>
                <li className={newPassword === confirmPassword && newPassword.length > 0 ? "text-primary" : ""}>
                  - Las contrasenas coinciden {newPassword === confirmPassword && newPassword.length > 0 && <Check className="inline h-3 w-3" />}
                </li>
              </ul>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
