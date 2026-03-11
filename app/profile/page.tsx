"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/app-context"
import { BottomNav } from "@/components/bottom-nav"
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Copy, 
  Check, 
  Bell, 
  Clock, 
  ChevronRight,
  LogOut,
  Lock,
  Edit2,
  Save,
  X
} from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { 
    user, 
    profile, 
    isLoggedIn, 
    logout, 
    updateProfile, 
    loadProfile 
  } = useApp()
  
  const [copied, setCopied] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState("")
  const [savingName, setSavingName] = useState(false)
  const [notificationEnabled, setNotificationEnabled] = useState(false)
  const [notificationTime, setNotificationTime] = useState("09:00")
  const [savingNotification, setSavingNotification] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/")
    } else {
      loadProfile()
    }
  }, [isLoggedIn, router, loadProfile])

  useEffect(() => {
    if (profile) {
      setNotificationEnabled(profile.notificationEnabled)
      setNotificationTime(profile.notificationTime?.slice(0, 5) || "09:00")
      setNewName(profile.name)
    }
  }, [profile])

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

  const handleSaveName = async () => {
    if (!newName.trim()) return
    setSavingName(true)
    const result = await updateProfile({ name: newName.trim() })
    setSavingName(false)
    setEditingName(false)
    
    if (result.success) {
      setMessage({ type: "success", text: "Nombre actualizado" })
    } else {
      setMessage({ type: "error", text: result.error || "Error al actualizar" })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleToggleNotifications = async () => {
    const newValue = !notificationEnabled
    setNotificationEnabled(newValue)
    setSavingNotification(true)
    
    // Request notification permission if enabling
    if (newValue && typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        setNotificationEnabled(false)
        setSavingNotification(false)
        setMessage({ type: "error", text: "Debes permitir las notificaciones en tu navegador" })
        setTimeout(() => setMessage(null), 3000)
        return
      }
    }
    
    const result = await updateProfile({ notificationEnabled: newValue })
    setSavingNotification(false)
    
    if (!result.success) {
      setNotificationEnabled(!newValue)
      setMessage({ type: "error", text: result.error || "Error al actualizar" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleTimeChange = async (time: string) => {
    setNotificationTime(time)
    setSavingNotification(true)
    const result = await updateProfile({ notificationTime: time + ":00" })
    setSavingNotification(false)
    
    if (result.success) {
      setMessage({ type: "success", text: "Hora de notificacion actualizada" })
    } else {
      setMessage({ type: "error", text: result.error || "Error al actualizar" })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (!isLoggedIn) return null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 overflow-y-auto px-5 pb-4 pt-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Perfil</h1>
        </div>

        {/* Message toast */}
        {message && (
          <div className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium ${
            message.type === "success" 
              ? "bg-primary/20 text-primary" 
              : "bg-destructive/20 text-destructive"
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile avatar */}
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
            {(profile?.name?.[0] || user?.name?.[0] || "U").toUpperCase()}
          </div>
          
          {/* Name edit */}
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="rounded-lg bg-card px-3 py-2 text-center text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                disabled={savingName || !newName.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
                aria-label="Guardar nombre"
              >
                <Save className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setEditingName(false)
                  setNewName(profile?.name || "")
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground"
                aria-label="Cancelar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="flex items-center gap-2"
            >
              <span className="text-lg font-bold text-foreground">
                {profile?.name || user?.name || "Usuario"}
              </span>
              <Edit2 className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          
          <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
        </div>

        {/* Friend code */}
        <div className="mb-4 rounded-2xl bg-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tu codigo de amigo
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-2xl font-bold tracking-widest text-foreground">
              {profile?.friendCode || "--------"}
            </span>
            <button
              onClick={handleCopyCode}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors"
              aria-label="Copiar codigo"
            >
              {copied ? <Check className="h-5 w-5 text-primary" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Comparte este codigo con tus amigos para competir en el ranking semanal
          </p>
        </div>

        {/* Notifications settings */}
        <div className="mb-4 rounded-2xl bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Notificaciones
            </span>
          </div>
          
          {/* Enable toggle */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Tips ambientales diarios</p>
              <p className="text-xs text-muted-foreground">Recibe consejos para reducir tu huella</p>
            </div>
            <button
              onClick={handleToggleNotifications}
              disabled={savingNotification}
              className={`relative h-7 w-12 rounded-full transition-colors disabled:opacity-50 ${
                notificationEnabled ? "bg-primary" : "bg-secondary"
              }`}
              role="switch"
              aria-checked={notificationEnabled}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  notificationEnabled ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
          
          {/* Time selector */}
          {notificationEnabled && (
            <div className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Hora de envio</span>
              </div>
              <input
                type="time"
                value={notificationTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="rounded-lg bg-card px-3 py-1.5 text-sm font-medium text-foreground"
              />
            </div>
          )}
        </div>

        {/* Account section */}
        <div className="mb-4 rounded-2xl bg-card">
          <button
            onClick={() => router.push("/profile/change-password")}
            className="flex w-full items-center justify-between px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <Lock className="h-5 w-5 text-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">Cambiar contrasena</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive/10 px-4 py-4 text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-semibold">Cerrar sesion</span>
        </button>

        {/* App info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">Carbon Tracker v1.0</p>
          <p className="text-xs text-muted-foreground">Reduce tu huella de carbono</p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
