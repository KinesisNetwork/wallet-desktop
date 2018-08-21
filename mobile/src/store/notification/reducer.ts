import { Action, Actions } from './action'
import { NotificationState } from './index'

const initialState: NotificationState = {
  type: 'info',
  message: '',
}

export function notification (state: NotificationState = initialState, action: Action): NotificationState {
  switch (action.type) {
    case Actions.showNotification:
      return { ...state, message: action.payload.message, type: action.payload.type }
    case Actions.clearNotification:
      return { ...initialState }
    default:
      return state
  }
}
