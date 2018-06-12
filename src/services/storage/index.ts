import { createWebStorage } from 'redux-persist'

export function createStorage(): Storage {
  return process.env.IS_WEB
    ? createWebStorage('local')
    : require('redux-persist-electron-storage').default()
}
