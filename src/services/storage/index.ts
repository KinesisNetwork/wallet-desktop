import storage from 'redux-persist/lib/storage'

export function createStorage(): Storage {
  return process.env.IS_WEB ? storage : require('redux-persist-electron-storage').default()
}
