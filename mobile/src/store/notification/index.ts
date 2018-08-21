export interface NotificationState {
  type: string,
  message: string,
}

export enum StatusTypes {
  info = 'info',
  error = 'error',
  success = 'success',
  none = 'none',
}

export * from './action'
export * from './reducer'
