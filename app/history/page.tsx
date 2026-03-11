"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useApp, type ActivityEntry, type HistoryFilters } from "@/lib/app-context"
import { BottomNav } from "@/components/bottom-nav"
import { 
  ArrowLeft, 
  Search, 
  Calendar, 
  Utensils, 
  Bus, 
  Trash2, 
  Filter,
  X,
  ChevronDown
} from "lucide-react"

type FilterType = "all" | "food" | "transport"
type DatePreset = "today" | "yesterday" | "week" | "month" | "custom"

function formatDateDisplay(date: Date): string {
  const days = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"]
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`
}

function formatFullDate(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function groupActivitiesByDate(activities: ActivityEntry[]): Map<string, ActivityEntry[]> {
  const groups = new Map<string, ActivityEntry[]>()
  
  for (const activity of activities) {
    const date = new Date(activity.timestamp)
    const key = date.toISOString().split("T")[0]
    const existing = groups.get(key) || []
    groups.set(key, [...existing, activity])
  }
  
  return groups
}

export default function HistoryPage() {
  const router = useRouter()
  const { isLoggedIn, getFilteredActivities, deleteActivity } = useApp()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [datePreset, setDatePreset] = useState<DatePreset>("week")
  const [showFilters, setShowFilters] = useState(false)
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/")
    }
  }, [isLoggedIn, router])

  const getDateRange = useCallback((): { startDate?: Date; endDate?: Date } => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (datePreset) {
      case "today":
        return { startDate: today, endDate: now }
      case "yesterday": {
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        return { startDate: yesterday, endDate: today }
      }
      case "week": {
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        return { startDate: weekAgo, endDate: now }
      }
      case "month": {
        const monthAgo = new Date(today)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        return { startDate: monthAgo, endDate: now }
      }
      case "custom": {
        return {
          startDate: customStartDate ? new Date(customStartDate) : undefined,
          endDate: customEndDate ? new Date(customEndDate) : undefined,
        }
      }
      default:
        return {}
    }
  }, [datePreset, customStartDate, customEndDate])

  const filters: HistoryFilters = useMemo(() => {
    const { startDate, endDate } = getDateRange()
    return {
      searchQuery: searchQuery || undefined,
      type: filterType,
      startDate,
      endDate,
    }
  }, [searchQuery, filterType, getDateRange])

  const filteredActivities = useMemo(() => {
    return getFilteredActivities(filters)
  }, [getFilteredActivities, filters])

  const groupedActivities = useMemo(() => {
    return groupActivitiesByDate(filteredActivities)
  }, [filteredActivities])

  const totalEmissions = useMemo(() => {
    return filteredActivities.reduce((sum, a) => sum + a.emissions, 0)
  }, [filteredActivities])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await deleteActivity(id)
    setDeletingId(null)
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
          <h1 className="text-xl font-bold text-foreground">Historial</h1>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar actividad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-label="Limpiar busqueda"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mb-4 flex w-full items-center justify-between rounded-xl bg-card px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filtros</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>

        {/* Filters panel */}
        {showFilters && (
          <div className="mb-4 rounded-xl bg-card p-4">
            {/* Date presets */}
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Periodo</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "today", label: "Hoy" },
                  { key: "yesterday", label: "Ayer" },
                  { key: "week", label: "7 dias" },
                  { key: "month", label: "30 dias" },
                  { key: "custom", label: "Personalizado" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setDatePreset(key as DatePreset)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      datePreset === key
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom date inputs */}
            {datePreset === "custom" && (
              <div className="mb-4 flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-muted-foreground">Desde</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full rounded-lg bg-secondary py-2 pl-9 pr-3 text-sm text-foreground"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-muted-foreground">Hasta</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full rounded-lg bg-secondary py-2 pl-9 pr-3 text-sm text-foreground"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Type filter */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo</p>
              <div className="flex gap-2">
                {[
                  { key: "all", label: "Todos" },
                  { key: "food", label: "Alimentos" },
                  { key: "transport", label: "Transporte" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilterType(key as FilterType)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      filterType === key
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="mb-4 rounded-xl bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{filteredActivities.length} actividades</p>
              <p className="text-lg font-bold text-foreground">{totalEmissions.toFixed(1)} kg CO2</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Promedio diario</p>
              <p className="text-sm font-semibold text-foreground">
                {groupedActivities.size > 0
                  ? (totalEmissions / groupedActivities.size).toFixed(1)
                  : "0"} kg
              </p>
            </div>
          </div>
        </div>

        {/* Activities list grouped by date */}
        {filteredActivities.length === 0 ? (
          <div className="rounded-2xl bg-card px-4 py-12 text-center">
            <Calendar className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">No hay actividades</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {searchQuery
                ? "No se encontraron resultados para tu busqueda"
                : "Ajusta los filtros o registra nuevas actividades"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from(groupedActivities.entries()).map(([dateKey, dayActivities]) => {
              const date = new Date(dateKey)
              const dayTotal = dayActivities.reduce((sum, a) => sum + a.emissions, 0)

              return (
                <div key={dateKey}>
                  {/* Date header */}
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {formatDateDisplay(date)}
                    </p>
                    <p className="text-xs font-medium text-foreground">{dayTotal.toFixed(1)} kg</p>
                  </div>

                  {/* Day activities */}
                  <div className="flex flex-col gap-2">
                    {dayActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3"
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          activity.type === "food"
                            ? "bg-accent/20 text-accent"
                            : "bg-primary/20 text-primary"
                        }`}>
                          {activity.type === "food" ? (
                            <Utensils className="h-4 w-4" />
                          ) : (
                            <Bus className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{activity.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {formatFullDate(new Date(activity.timestamp))}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">{activity.emissions.toFixed(1)} kg</p>
                        </div>
                        <button
                          onClick={() => handleDelete(activity.id)}
                          disabled={deletingId === activity.id}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                          aria-label="Eliminar actividad"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
