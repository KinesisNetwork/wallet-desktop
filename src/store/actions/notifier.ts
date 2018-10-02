import { NotificationType } from '@types'
import { createAction, createStandardAction } from 'typesafe-actions'

export const showNotification = createStandardAction('SHOW_NOTIFICATION')<{
  type: NotificationType
  message: string
  displayTime?: number
}>()
export const clearNotification = createAction('CLEAR_NOTIFICATION')
