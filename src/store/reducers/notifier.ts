import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

import { clearNotification, showNotification } from '@actions'

import { RootAction } from '@store'
import { NotificationType } from '@types'

export interface NotificationState {
  readonly visible: boolean
  readonly message: string
  readonly type: NotificationType
}

export const notifier = combineReducers<NotificationState, RootAction>({
  visible: (state = false, action) => {
    switch (action.type) {
      case getType(showNotification):
        return true
      case getType(clearNotification):
        return false
      default:
        return state
    }
  },
  message: (state = '', action) => {
    switch (action.type) {
      case getType(showNotification):
        return action.payload.message
      default:
        return state
    }
  },
  type: (state = NotificationType.info, action) => {
    switch (action.type) {
      case getType(showNotification):
        return action.payload.type
      default:
        return state
    }
  },
})
