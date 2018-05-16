import * as storage from 'electron-json-storage'

export function setElectronStorage<T>(key: string, items: T[], callback: (err: any) => void) {
  storage.set(key, items, callback)
}

export function getElectronStorage(key: string, callback: (err: any, data: {}) => void) {
  storage.get(key, callback)
}
