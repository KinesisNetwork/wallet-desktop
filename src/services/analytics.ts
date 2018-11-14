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

const w: any = window

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
  return w.ga('send', {
    ...data,
    transport: 'beacon',
  })
}
