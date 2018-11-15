interface GAPayload {
  action: string
  category?: string
  label: string
  value?: string
}

interface GAEventPayload {
  eventAction: string
  eventCategory: string
  eventLabel: string
  eventValue: string
  hitType: string
}

export function sendAnalyticsEvent({ action, category = '', label, value = '' }: GAPayload) {
  return sendGA({
    eventAction: action,
    eventCategory: category,
    eventLabel: label,
    eventValue: value,
    hitType: 'event',
  })
}

function sendGA(data: GAEventPayload) {
  const w: any = window

  return w.ga('send', {
    ...data,
    transport: 'beacon',
  })
}
