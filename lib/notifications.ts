import { getRandomTip } from './environmental-tips'

export interface NotificationPermissionResult {
  granted: boolean
  error?: string
}

// Check if notifications are supported
export function isNotificationsSupported(): boolean {
  return typeof window !== 'undefined' && 
    'Notification' in window && 
    'serviceWorker' in navigator
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermissionResult> {
  if (!isNotificationsSupported()) {
    return { granted: false, error: 'Las notificaciones no estan soportadas en este navegador' }
  }

  try {
    const permission = await Notification.requestPermission()
    return { granted: permission === 'granted' }
  } catch (error) {
    return { granted: false, error: 'Error al solicitar permisos de notificacion' }
  }
}

// Check current permission status
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationsSupported()) {
    return 'unsupported'
  }
  return Notification.permission
}

// Register the service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })
    console.log('Service Worker registered:', registration.scope)
    return registration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    return null
  }
}

// Get the current service worker registration
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    return null
  }

  try {
    return await navigator.serviceWorker.ready
  } catch {
    return null
  }
}

// Send a local notification through the service worker
export async function sendLocalNotification(title: string, body: string, tag?: string): Promise<boolean> {
  const registration = await getServiceWorkerRegistration()
  
  if (!registration) {
    // Fallback to direct notification
    if (isNotificationsSupported() && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/icon-192.png' })
      return true
    }
    return false
  }

  try {
    // Send message to service worker
    if (registration.active) {
      registration.active.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        body,
        tag: tag || 'app-notification',
        url: '/dashboard'
      })
      return true
    }
    return false
  } catch (error) {
    console.error('Error sending notification:', error)
    return false
  }
}

// Send a random environmental tip notification
export async function sendTipNotification(): Promise<boolean> {
  const tip = getRandomTip()
  return sendLocalNotification('Tip Ambiental', tip, 'daily-tip')
}

// Schedule notification check using localStorage and setTimeout
const NOTIFICATION_CHECK_KEY = 'ct_notification_schedule'
const LAST_TIP_KEY = 'ct_last_tip_date'

interface NotificationSchedule {
  enabled: boolean
  time: string // HH:MM format
}

export function getNotificationSchedule(): NotificationSchedule | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(NOTIFICATION_CHECK_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function setNotificationSchedule(schedule: NotificationSchedule): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(NOTIFICATION_CHECK_KEY, JSON.stringify(schedule))
    scheduleNextNotification(schedule)
  } catch {
    // Storage error
  }
}

export function clearNotificationSchedule(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(NOTIFICATION_CHECK_KEY)
  } catch {
    // Storage error
  }
}

// Calculate milliseconds until next scheduled time
function getMillisecondsUntilTime(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number)
  const now = new Date()
  const scheduled = new Date()
  
  scheduled.setHours(hours, minutes, 0, 0)
  
  // If the time has passed today, schedule for tomorrow
  if (scheduled <= now) {
    scheduled.setDate(scheduled.getDate() + 1)
  }
  
  return scheduled.getTime() - now.getTime()
}

// Check if tip was already sent today
function wasTipSentToday(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const lastDate = localStorage.getItem(LAST_TIP_KEY)
    if (!lastDate) return false
    
    const today = new Date().toDateString()
    return lastDate === today
  } catch {
    return false
  }
}

// Mark tip as sent today
function markTipSentToday(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(LAST_TIP_KEY, new Date().toDateString())
  } catch {
    // Storage error
  }
}

let notificationTimeoutId: NodeJS.Timeout | null = null

// Schedule the next notification
export function scheduleNextNotification(schedule?: NotificationSchedule): void {
  // Clear existing timeout
  if (notificationTimeoutId) {
    clearTimeout(notificationTimeoutId)
    notificationTimeoutId = null
  }

  const currentSchedule = schedule || getNotificationSchedule()
  
  if (!currentSchedule?.enabled || !currentSchedule.time) {
    return
  }

  // Don't schedule if permission not granted
  if (getNotificationPermission() !== 'granted') {
    return
  }

  const msUntilNotification = getMillisecondsUntilTime(currentSchedule.time)
  
  // Schedule the notification
  notificationTimeoutId = setTimeout(async () => {
    if (!wasTipSentToday()) {
      const sent = await sendTipNotification()
      if (sent) {
        markTipSentToday()
      }
    }
    // Schedule next day's notification
    scheduleNextNotification(currentSchedule)
  }, msUntilNotification)
  
  console.log(`Notification scheduled in ${Math.round(msUntilNotification / 1000 / 60)} minutes`)
}

// Initialize notifications on app start
export function initializeNotifications(): void {
  if (typeof window === 'undefined') return
  
  // Register service worker
  registerServiceWorker()
  
  // Check and schedule notifications
  const schedule = getNotificationSchedule()
  if (schedule?.enabled) {
    scheduleNextNotification(schedule)
  }
}
