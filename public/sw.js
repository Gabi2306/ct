// Carbon Tracker Service Worker
const CACHE_NAME = 'carbon-tracker-v1'

// Install event
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return

  try {
    const data = event.data.json()
    const options = {
      body: data.body || 'Tip ambiental del dia',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      tag: 'environmental-tip',
      renotify: true,
      data: {
        url: data.url || '/dashboard'
      }
    }

    event.waitUntil(
      self.registration.showNotification(data.title || 'Carbon Tracker', options)
    )
  } catch (error) {
    // Fallback for plain text
    const text = event.data.text()
    event.waitUntil(
      self.registration.showNotification('Carbon Tracker', {
        body: text,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'environmental-tip'
      })
    )
  }
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const urlToOpen = event.notification.data?.url || '/dashboard'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there's already a window open
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(urlToOpen)
          return client.focus()
        }
      }
      // Open new window if none found
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})

// Background sync for scheduled notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'check-notification-schedule') {
    event.waitUntil(checkAndSendScheduledNotification())
  }
})

// Periodic background sync for daily tips
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-tip') {
    event.waitUntil(sendDailyTip())
  }
})

async function checkAndSendScheduledNotification() {
  // This will be triggered by the app when needed
  try {
    const response = await fetch('/api/get-daily-tip')
    const data = await response.json()
    
    if (data.tip) {
      await self.registration.showNotification('Tip Ambiental', {
        body: data.tip,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'daily-tip',
        vibrate: [100, 50, 100]
      })
    }
  } catch (error) {
    console.error('Error sending scheduled notification:', error)
  }
}

async function sendDailyTip() {
  // Periodic sync handler
  await checkAndSendScheduledNotification()
}

// Message handler for triggering notifications from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title || 'Carbon Tracker', {
      body: event.data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: event.data.tag || 'app-notification',
      vibrate: [100, 50, 100],
      data: {
        url: event.data.url || '/dashboard'
      }
    })
  }
})
