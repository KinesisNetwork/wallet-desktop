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
    eventCategory: category as string,
    eventLabel: label,
    eventValue: value as string,
    hitType: 'event',
  })
}

function sendGA(data: GAEventPayload) {
  return w.ga('send', {
    ...data,
    transport: 'beacon',
  })
}
