import { NotificationType } from '@types'
import { buildAction } from 'typesafe-actions'

export const showNotification = buildAction('SHOW_NOTIFICATION').payload<{type: NotificationType, message: string, displayTime?: number}>()
export const clearNotification = buildAction('CLEAR_NOTIFICATION').empty()
