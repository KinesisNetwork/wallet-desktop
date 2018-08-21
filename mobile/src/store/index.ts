import { createStore, combineReducers } from 'redux'
import { AppState as OptionState, options } from './options'
import { NotificationState, notification } from './notification'

export interface AppState {
  options: OptionState,
  notification: NotificationState,
}

const s = combineReducers<AppState>({
  options,
  notification,
})

const w: any = window
export default createStore(s, w.__REDUX_DEVTOOLS_EXTENSION__ && w.__REDUX_DEVTOOLS_EXTENSION__())
