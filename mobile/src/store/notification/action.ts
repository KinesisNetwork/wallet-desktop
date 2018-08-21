import { ActionCreator } from 'react-redux-typescript'
import { NotificationState } from './index'

export enum Actions {
  showNotification = 'SHOW_NOTIFICATION',
  clearNotification = 'CLEAR_NOTIFICATION'
}

export const ActionCreators = {
  showNotification: new ActionCreator<Actions.showNotification, NotificationState>(Actions.showNotification),
  clearNotification: new ActionCreator<Actions.clearNotification, any>(Actions.clearNotification),
}

export type Action = typeof ActionCreators[keyof typeof ActionCreators]
